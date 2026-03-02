from __future__ import annotations

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import (
    GoogleAuthSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


User = get_user_model()


def _tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        email = data["email"].strip().lower()

        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            return Response({"detail": "Email já cadastrado."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=data["password"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            role=getattr(User, "Role", None).ALUNO if hasattr(User, "Role") else "aluno",
        )

        payload = {"tokens": _tokens_for_user(user), "user": UserSerializer(user).data}
        return Response(payload, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        email = data["email"].strip().lower()
        user = authenticate(request, username=email, password=data["password"])

        if user is None:
            return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

        payload = {"tokens": _tokens_for_user(user), "user": UserSerializer(user).data}
        return Response(payload)


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw = request.data.get("refresh")
        if not raw or not isinstance(raw, str):
            return Response({"detail": "Refresh token é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(raw)
            access = str(refresh.access_token)
        except Exception:
            return Response({"detail": "Refresh token inválido."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"access": access})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["id_token"]

        client_ids = list(getattr(settings, "GOOGLE_CLIENT_IDS", []) or [])
        if not client_ids:
            return Response(
                {"detail": "Login Google desabilitado: GOOGLE_CLIENT_ID(S) não configurado no backend."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            from google.auth.transport import requests as google_requests
            from google.oauth2 import id_token as google_id_token
        except Exception:
            return Response(
                {
                    "detail": "Dependência google-auth não instalada no backend. Instale requirements.txt ou desabilite login Google em dev."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            payload = None
            last_error = None
            for client_id in client_ids:
                try:
                    payload = google_id_token.verify_oauth2_token(
                        token, google_requests.Request(), audience=client_id
                    )
                    break
                except Exception as e:
                    last_error = e
                    continue
            if payload is None:
                raise last_error or Exception("Token inválido")
        except Exception:
            return Response({"detail": "Token do Google inválido."}, status=status.HTTP_401_UNAUTHORIZED)

        issuer = payload.get("iss")
        if issuer not in {"accounts.google.com", "https://accounts.google.com"}:
            return Response({"detail": "Token do Google inválido."}, status=status.HTTP_401_UNAUTHORIZED)

        if payload.get("email_verified") is False:
            return Response({"detail": "Email do Google não verificado."}, status=status.HTTP_401_UNAUTHORIZED)

        email = (payload.get("email") or "").strip().lower()
        if not email:
            return Response({"detail": "Email ausente no token do Google."}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": payload.get("given_name") or "",
                "last_name": payload.get("family_name") or "",
                "role": getattr(User, "Role", None).ALUNO if hasattr(User, "Role") else "aluno",
            },
        )

        aluno_role = getattr(User, "Role", None).ALUNO if hasattr(User, "Role") else "aluno"
        if not created and getattr(user, "role", None) != aluno_role:
            return Response(
                {"detail": "Login com Google disponível apenas para alunos."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])
        else:
            changed = False
            if not user.email:
                user.email = email
                changed = True
            if changed:
                user.save(update_fields=["email"])

        result = {"tokens": _tokens_for_user(user), "user": UserSerializer(user).data}
        return Response(result)

