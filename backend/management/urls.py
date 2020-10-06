from django.conf.urls import url
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    url(r'auth/$', views.LoginView.as_view())
]

router = DefaultRouter()
router.register(r'stores', views.StoreInfoModelViewSet, basename="stores")
router.register(r'members', views.MemberInfoModelViewSet, basename="members")
router.register(r'services', views.ServiceInfoModelViewSet, basename="services")
router.register(r'crew', views.CrewInfoModelViewSet, basename="crew")
router.register(r'rooms', views.RoomInfoModelViewSet, basename="rooms")
router.register(r'spending', views.SpendingInfoModelViewSet, basename="spending")
router.register(r'topUp', views.TopUpInfoModelGetViewSet, basename="topUp")
router.register(r'postTopUp', views.TopUpInfoModelPostViewSet, basename="postTopUp")
urlpatterns += router.urls
