from django.urls import path

from academy.views import (
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
    path("professor/students/", ProfessorStudentsView.as_view(), name="professor-students"),
    path("student/repository/", StudentRepositoryView.as_view(), name="student-repository"),
    path("student/profile/", StudentProfileView.as_view(), name="student-profile"),
    path("student/lessons/", StudentLessonsView.as_view(), name="student-lessons"),
    path("materials/<int:material_id>/complete", MaterialCompleteView.as_view(), name="material-complete"),
]
