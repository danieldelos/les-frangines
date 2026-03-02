from django.conf import settings
from django.db import models


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile"
    )
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students",
    )
    progress = models.PositiveSmallIntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.user_id}"


class Material(models.Model):
    class MaterialType(models.TextChoices):
        PDF = "pdf", "PDF"
        VIDEO = "video", "Vídeo"
        AUDIO = "audio", "Áudio"
        LINK = "link", "Link"

    class Status(models.TextChoices):
        PENDENTE = "pendente", "Pendente"
        CONCLUIDO = "concluido", "Concluído"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="materials"
    )
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="materials_created",
    )
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=MaterialType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDENTE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"


class Lesson(models.Model):
    class Status(models.TextChoices):
        AGENDADA = "agendada", "Agendada"
        CONCLUIDA = "concluida", "Concluída"
        CANCELADA = "cancelada", "Cancelada"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lessons"
    )
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lessons_given"
    )
    start = models.DateTimeField()
    end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AGENDADA)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"
