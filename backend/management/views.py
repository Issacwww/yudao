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
                print("invalid login 1")
                return Response(credential_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        print("invalid login 2")
        return Response(admin_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MemberInfoModelViewSet(ModelViewSet):
    serializer_class = MemberInfoModelSerializer
    queryset = MemberInfo.objects.order_by('card_number')


class ServiceInfoModelViewSet(ModelViewSet):
    serializer_class = ServiceInfoModelSerializer
    queryset = ServiceInfo.objects.all()


class CrewInfoModelViewSet(ModelViewSet):
    serializer_class = CrewInfoModelSerializer
    queryset = CrewInfo.objects.order_by('crew_number')


class SpendingInfoModelViewSet(ModelViewSet):
    serializer_class = SpendingInfoModelSerializer
    queryset = SpendingInfo.objects.all()


class RoomInfoModelViewSet(ModelViewSet):
    serializer_class = RoomInfoModelSerializer
    queryset = RoomInfo.objects.all()


class TopUpInfoModelViewSet(ModelViewSet):
    serializer_class = TopUpInfoSerializer
    queryset = TopUpInfo.objects.all()


class CustomerOrderModelViewSet(ModelViewSet):
    serializer_class = CustomerOrderSerializer
    queryset = CustomerOrder.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data
        is_member_order = data['isMemberOrder']
        del data['isMemberOrder']
        if is_member_order:
            member = MemberInfo.objects.filter(card_number=data['member_info'])[0]
            if member.balance < data['consumption']:
                return Response({"message": "余额不足, 请充值"}, status=status.HTTP_400_BAD_REQUEST)
            member.balance -= data['consumption']
            member.save()
            data['member_info'] = f'{member}'
        instance = self.get_serializer(data=data)
        instance.is_valid(raise_exception=True)
        instance.save()
        return Response(instance.data, status=status.HTTP_201_CREATED)
