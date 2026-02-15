from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        PROFESSOR = "professor", "Professor"
        ALUNO = "aluno", "Aluno"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ALUNO)

