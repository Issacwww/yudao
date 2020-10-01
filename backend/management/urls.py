from django.conf.urls import url
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    url(r'auth/$', views.LoginView.as_view()),
    # url(r'members/topup/(?P<pk>\d+)/$', views.MemberInfoModelViewSet.as_view({"put": "top_up"}))
]

router = DefaultRouter()
router.register(r'stores', views.StoreInfoModelViewSet, basename="stores")
router.register(r'members', views.MemberInfoModelViewSet, basename="members")
router.register(r'services', views.ServiceInfoModelViewSet, basename="services")
router.register(r'crew', views.CrewInfoModelViewSet, basename="crew")
router.register(r'rooms', views.MemberInfoModelViewSet, basename="rooms")
router.register(r'spending', views.SpendingInfoModelViewSet, basename="spending")
router.register(r'topup', views.TopUpInfoModelViewSet, basename="topup")
urlpatterns += router.urls
