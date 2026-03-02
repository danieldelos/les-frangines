from django.urls import path

from accounts.views import GoogleLoginView, LoginView, MeView, RefreshView, RegisterView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("google/", GoogleLoginView.as_view(), name="google"),
    path("me/", MeView.as_view(), name="me"),
]

