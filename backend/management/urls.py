from django.conf.urls import url
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    url(r'auth/$', views.LoginView.as_view()),
]

router = DefaultRouter()
router.register(r'stores', views.StoreInfoModelViewSet, basename="stores")
urlpatterns += router.urls
