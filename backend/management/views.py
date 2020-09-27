from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializers import *


class StoreInfoModelViewSet(ModelViewSet):
    serializer_class = StoreInfoModelSerializer
    queryset = StoreInfo.objects.all()


class LoginView(APIView):
    serializer_class = AdminInfoSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        admin_serializer = AdminInfoSerializer(data=data)
        if admin_serializer.is_valid(raise_exception=True):
            print(admin_serializer.data)
            token = {'token': admin_serializer.data.get('token'), 'admin_name': admin_serializer.data.get('admin_name')}
            if admin_serializer.data.get('is_super_admin'):
                return Response(token, status=status.HTTP_200_OK)
            credential_data = {'admin': admin_serializer.data.get('id'), 'store': data['store']}
            print(credential_data)
            credential_serializer = CredentialInfoSerializer(data=credential_data)
            if credential_serializer.is_valid(raise_exception=True):
                return Response(token, status=status.HTTP_200_OK)
            else:
                return Response(credential_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(admin_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MemberInfoModelViewSet(ModelViewSet):
    serializer_class = MemberInfoModelSerializer
    queryset = MemberInfo.objects.all()


class ServiceInfoModelViewSet(ModelViewSet):
    serializer_class = ServiceInfoModelSerializer
    queryset = ServiceInfo.objects.all()


class CrewInfoModelViewSet(ModelViewSet):
    serializer_class = CrewInfoModelSerializer
    queryset = CrewInfo.objects.all()


class SpendingInfoModelViewSet(ModelViewSet):
    serializer_class = SpendingInfoModelSerializer
    queryset = SpendingInfo.objects.all()


class RoomInfoModelViewSet(ModelViewSet):
    serializer_class = RoomInfoModelSerializer
    queryset = RoomInfo.objects.all()