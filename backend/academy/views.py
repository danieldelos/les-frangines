from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from academy.models import Lesson, Material, StudentProfile
from academy.permissions import IsAdmin, IsAluno, IsProfessor
from academy.serializers import (
    AdminUserSerializer,
    AssignStudentsSerializer,
    LessonSerializer,
    MaterialSerializer,
    ProfessorStudentSerializer,
    StudentProfileSerializer,
    UserCreateSerializer,
)


User = get_user_model()


class AdminUserListCreateView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        role = request.query_params.get("role")
        status_param = request.query_params.get("status")
        search = request.query_params.get("search", "").strip()
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 10))

        qs = User.objects.all().order_by("-date_joined")
        if role in {User.Role.ADMIN, User.Role.PROFESSOR, User.Role.ALUNO}:
            qs = qs.filter(role=role)
        if status_param in {"ativo", "inativo"}:
            qs = qs.filter(is_active=status_param == "ativo")
        if search:
            qs = qs.filter(
                Q(email__icontains=search)
                | Q(username__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        page = max(page, 1)
        page_size = max(min(page_size, 50), 1)
        total = qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        results = AdminUserSerializer(qs[start:end], many=True).data

        return Response(
            {"count": total, "page": page, "page_size": page_size, "results": results}
        )

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        email = data["email"].strip().lower()
        if User.objects.filter(Q(username=email) | Q(email=email)).exists():
            return Response(
                {"detail": "Email já cadastrado."}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=email,
            email=email,
            password=data["password"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            role=data["role"],
        )

        return Response(AdminUserSerializer(user).data, status=status.HTTP_201_CREATED)


class AssignStudentsView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = AssignStudentsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        professor_id = data["professor_id"]
        student_ids = data["student_ids"]

        professor = User.objects.filter(id=professor_id, role=User.Role.PROFESSOR).first()
        if not professor:
            return Response(
                {"detail": "Professor inválido."}, status=status.HTTP_400_BAD_REQUEST
            )

        students = User.objects.filter(id__in=student_ids, role=User.Role.ALUNO)
        if students.count() != len(student_ids):
            return Response(
                {"detail": "Um ou mais alunos inválidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for student in students:
            profile, _ = StudentProfile.objects.get_or_create(user=student)
            profile.professor = professor
            profile.save(update_fields=["professor"])

        return Response({"assigned": students.count()})


class ProfessorStudentsView(APIView):
    permission_classes = [IsProfessor]

    def get(self, request):
        profiles = (
            StudentProfile.objects.select_related("user")
            .filter(professor=request.user)
            .order_by("user__first_name", "user__last_name")
        )

        results = []
        for profile in profiles:
            student = profile.user
            last_lesson = (
                Lesson.objects.filter(
                    student=student, professor=request.user, status=Lesson.Status.CONCLUIDA
                )
                .order_by("-end")
                .values_list("end", flat=True)
                .first()
            )
            next_lesson = (
                Lesson.objects.filter(
                    student=student, professor=request.user, status=Lesson.Status.AGENDADA
                )
                .filter(start__gte=timezone.now())
                .order_by("start")
                .values_list("start", flat=True)
                .first()
            )
            payload = ProfessorStudentSerializer(student).data
            payload["last_lesson"] = last_lesson
            payload["next_lesson"] = next_lesson
            results.append(payload)

        return Response(results)


class StudentRepositoryView(APIView):
    permission_classes = [IsAluno]

    def get(self, request):
        qs = Material.objects.filter(student=request.user).order_by("-uploaded_at")
        return Response(MaterialSerializer(qs, many=True).data)


class StudentLessonsView(APIView):
    permission_classes = [IsAluno]

    def get(self, request):
        qs = Lesson.objects.filter(student=request.user).order_by("-start")
        return Response(LessonSerializer(qs, many=True).data)


class StudentProfileView(APIView):
    permission_classes = [IsAluno]

    def get(self, request):
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        last_lesson = (
            Lesson.objects.filter(student=request.user, status=Lesson.Status.CONCLUIDA)
            .order_by("-end")
            .values_list("end", flat=True)
            .first()
        )
        next_lesson = (
            Lesson.objects.filter(student=request.user, status=Lesson.Status.AGENDADA)
            .filter(start__gte=timezone.now())
            .order_by("start")
            .values_list("start", flat=True)
            .first()
        )
        name = f"{request.user.first_name} {request.user.last_name}".strip() or request.user.email
        professor_name = ""
        if profile.professor_id:
            professor = profile.professor
            professor_name = (
                f"{professor.first_name} {professor.last_name}".strip() or professor.email
            )
        payload = StudentProfileSerializer(
            {
                "id": request.user.id,
                "name": name,
                "email": request.user.email,
                "role": request.user.role,
                "progress": profile.progress,
                "last_lesson": last_lesson,
                "next_lesson": next_lesson,
                "professor": professor_name,
            }
        ).data
        return Response(payload)


class MaterialCompleteView(APIView):
    permission_classes = [IsAluno]

    def put(self, request, material_id: int):
        material = Material.objects.filter(id=material_id, student=request.user).first()
        if not material:
            return Response({"detail": "Material não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        material.status = Material.Status.CONCLUIDO
        material.save(update_fields=["status"])
        return Response(MaterialSerializer(material).data)
