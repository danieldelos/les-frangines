from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from academy.models import StudentProfile


class Command(BaseCommand):
    help = "Cria usuários de teste para admin, professor e aluno."

    def handle(self, *args, **options):
        User = get_user_model()
        creds = [
            ("admin@lesfrangines.dev", "Admin", "Root", "admin"),
            ("prof@lesfrangines.dev", "Claire", "Prof", "professor"),
            ("aluno@lesfrangines.dev", "Ana", "Aluno", "aluno"),
        ]
        for email, first, last, role in creds:
            user, created = User.objects.get_or_create(
                username=email,
                defaults={"email": email, "first_name": first, "last_name": last, "role": role},
            )
            if created:
                user.set_password("Testes@123")
            user.role = role
            if role == "admin":
                user.is_staff = True
            user.save()

        prof = User.objects.filter(username="prof@lesfrangines.dev").first()
        aluno = User.objects.filter(username="aluno@lesfrangines.dev").first()
        if aluno:
            profile, _ = StudentProfile.objects.get_or_create(user=aluno)
            profile.professor = prof
            profile.save()

        self.stdout.write(self.style.SUCCESS("Usuários de teste criados/atualizados."))
