from django.conf.urls import url
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    url(r'auth/$', views.LoginView.as_view()),
    url(r'statistics/$', views.statistic_all)
]

router = DefaultRouter()
router.register(r'stores', views.StoreInfoModelViewSet, basename="stores")
router.register(r'members', views.MemberInfoModelViewSet, basename="members")
router.register(r'services', views.ServiceInfoModelViewSet, basename="services")
router.register(r'crew', views.CrewInfoModelViewSet, basename="crew")
router.register(r'rooms', views.RoomInfoModelViewSet, basename="rooms")
router.register(r'spending', views.SpendingInfoModelViewSet, basename="spending")
router.register(r'topUp', views.TopUpInfoModelViewSet, basename="topUp")
router.register(r'orders', views.CustomerOrderModelViewSet, basename="order")
urlpatterns += router.urls
