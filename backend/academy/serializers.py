from django.contrib.auth import get_user_model
from rest_framework import serializers

from academy.models import Lesson, Material, StudentProfile, Turma


User = get_user_model()


class TurmaSerializer(serializers.ModelSerializer):
    professor_name = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Turma
        fields = ["id", "name", "description", "professor", "professor_name", "student_count", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_professor_name(self, obj):
        if obj.professor_id:
            p = obj.professor
            return f"{p.first_name} {p.last_name}".strip() or p.email
        return ""

    def get_student_count(self, obj):
        return obj.students.count()


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source="date_joined")
    professor_id = serializers.SerializerMethodField()
    turma_id = serializers.SerializerMethodField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = User
        fields = ["id", "name", "first_name", "last_name", "email", "role", "status", "created_at", "professor_id", "turma_id"]

    def get_name(self, obj):
        raw = f"{obj.first_name} {obj.last_name}".strip()
        return raw or obj.email

    def get_status(self, obj):
        return "ativo" if obj.is_active else "inativo"

    def get_professor_id(self, obj):
        profile = getattr(obj, "student_profile", None)
        return getattr(profile, "professor_id", None)

    def get_turma_id(self, obj):
        profile = getattr(obj, "student_profile", None)
        return getattr(profile, "turma_id", None)


class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=["admin", "professor", "aluno"])
    professor_id = serializers.IntegerField(required=False, allow_null=True)
    turma_id = serializers.IntegerField(required=False, allow_null=True)


class AdminUserUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    role = serializers.ChoiceField(choices=["admin", "professor", "aluno"], required=False)
    status = serializers.ChoiceField(choices=["ativo", "inativo"], required=False)
    professor_id = serializers.IntegerField(required=False, allow_null=True)
    turma_id = serializers.IntegerField(required=False, allow_null=True)


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
