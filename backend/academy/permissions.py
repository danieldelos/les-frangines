from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission


User = get_user_model()


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        return request.user and request.user.is_authenticated and role == User.Role.ADMIN


class IsProfessor(BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        return request.user and request.user.is_authenticated and role == User.Role.PROFESSOR


class IsAluno(BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        return request.user and request.user.is_authenticated and role == User.Role.ALUNO
