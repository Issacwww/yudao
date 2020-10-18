from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from .serializers import *
from django.db.models import Count, Sum
from datetime import date


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
        is_member_order = data['order_type'] == 2
        del data['order_type']
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

    def list(self, request, *args, **kwargs):
        member_orders = self.queryset.filter(member_info__isnull=False, order_source__startswith="线下")
        non_member_orders = self.queryset.filter(member_info__isnull=True, order_source__startswith="线下")
        online_orders = self.queryset.filter(member_info__isnull=True, order_source__startswith="线上")
        member_orders = self.get_serializer(member_orders, many=True)
        non_member_orders = self.get_serializer(non_member_orders, many=True)
        online_orders = self.get_serializer(online_orders, many=True)
        return Response({'member_orders': member_orders.data,
                         'non_member_orders': non_member_orders.data,
                         'online_orders': online_orders.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def statistic_all(request):
    """
    :param request:
    :return: income(customer / member) & spending
    """
    data = request.data
    start = data['start'] if 'start' in data else date.today().replace(day=1)
    end = data['end'] if 'end' in data else date.today()

    member_orders = CustomerOrder.objects.filter(order_date__range=(start, end),
                                                 member_info__isnull=False,
                                                 order_source__startswith="线下")
    member_orders_total = member_orders.aggregate(member_orders_total=Sum('consumption'))['member_orders_total']
    member_orders = CustomerOrderSerializer(member_orders, many=True)

    non_member_orders = CustomerOrder.objects.filter(order_date__range=(start, end),
                                                     member_info__isnull=True,
                                                     order_source__startswith="线下")
    non_member_orders_total = non_member_orders.aggregate(
        non_member_orders_total=Sum('consumption'))['non_member_orders_total']
    non_member_orders = CustomerOrderSerializer(non_member_orders, many=True)

    online_orders = CustomerOrder.objects.filter(order_date__range=(start, end),
                                                 member_info__isnull=True,
                                                 order_source__startswith="线上")
    online_orders_total = online_orders.aggregate(online_orders_total=Sum('consumption'))['online_orders_total']
    online_orders = CustomerOrderSerializer(online_orders, many=True)

    expense = SpendingInfo.objects.filter(spend_date__range=(start, end))
    expense_total = expense.aggregate(expense_total=Sum('amount'))['expense_total']
    expense = SpendingInfoModelSerializer(expense, many=True)

    return Response({
        'member_orders': {
            'orders': member_orders.data,
            'counts': len(member_orders.data),
            'total': member_orders_total,
            'label': '会员消费'
        },
        'non_member_orders': {
            'orders': non_member_orders.data,
            'counts': len(non_member_orders.data),
            'total': non_member_orders_total,
            'label': '非会员消费'
        },
        'online_orders': {
            'orders': online_orders.data,
            'counts': len(online_orders.data),
            'total': online_orders_total,
            'label': '线上消费'
        },
        'expense': {
            'spending': expense.data,
            'counts': len(expense.data),
            'total': expense_total,
            'label': '日常开支'
        },
        'turnover': {
            'total': member_orders_total + non_member_orders_total + online_orders_total,
            'label': '营业总额'
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def statistic_crew(request):
    pass


@api_view(['GET'])
def statistic_crew_detail(request, pk):
    pass
