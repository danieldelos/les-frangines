from django.urls import path

from academy.views import (
    AdminTurmaDetailView,
    AdminTurmaListCreateView,
    AdminUserDetailView,
    AdminUserListCreateView,
    AssignStudentsView,
    MaterialCompleteView,
    ProfessorStudentsView,
    StudentLessonsView,
    StudentProfileView,
    StudentRepositoryView,
)


urlpatterns = [
    path("users/", AdminUserListCreateView.as_view(), name="admin-users"),
    path("users/assign/", AssignStudentsView.as_view(), name="assign-students"),
    path("users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("turmas/", AdminTurmaListCreateView.as_view(), name="admin-turmas"),
    path("turmas/<int:turma_id>/", AdminTurmaDetailView.as_view(), name="admin-turma-detail"),
    path("professor/students/", ProfessorStudentsView.as_view(), name="professor-students"),
    path("student/repository/", StudentRepositoryView.as_view(), name="student-repository"),
    path("student/profile/", StudentProfileView.as_view(), name="student-profile"),
    path("student/lessons/", StudentLessonsView.as_view(), name="student-lessons"),
    path("materials/<int:material_id>/complete", MaterialCompleteView.as_view(), name="material-complete"),
]
