from django.contrib.auth import get_user_model
from rest_framework import serializers

from academy.models import Lesson, Material, StudentProfile


User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source="date_joined")
    professor_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "status", "created_at", "professor_id"]

    def get_name(self, obj):
        raw = f"{obj.first_name} {obj.last_name}".strip()
        return raw or obj.email

    def get_status(self, obj):
        return "ativo" if obj.is_active else "inativo"

    def get_professor_id(self, obj):
        profile = getattr(obj, "student_profile", None)
        return getattr(profile, "professor_id", None)


class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=["admin", "professor", "aluno"])


class AssignStudentsSerializer(serializers.Serializer):
    professor_id = serializers.IntegerField()
    student_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)


class ProfessorStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    progress = serializers.IntegerField(source="student_profile.progress")

    class Meta:
        model = User
        fields = ["id", "name", "email", "progress"]

    def get_name(self, obj):
        raw = f"{obj.first_name} {obj.last_name}".strip()
        return raw or obj.email


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ["id", "title", "type", "uploaded_at", "status"]


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "start", "end", "status", "professor_id"]


class StudentProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    progress = serializers.IntegerField()
    last_lesson = serializers.DateTimeField(allow_null=True)
    next_lesson = serializers.DateTimeField(allow_null=True)
    professor = serializers.CharField(allow_blank=True)
