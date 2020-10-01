from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import *


class StoreInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreInfo
        fields = "__all__"


class AdminInfoSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=64, label='令牌', read_only=True, allow_null=True)

    class Meta:
        model = AdminInfo
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True},
            "is_super_admin": {"read_only": True}
        }

    def validate(self, attrs):
        username, password = attrs['admin_name'], attrs['password']
        if not username or not password:
            raise ValidationError('请输入用户名及密码')
        user = AdminInfo.objects.filter(admin_name=username).distinct()
        if user.exists() and user.count() == 1:
            user = user.first()
        else:
            raise ValidationError('该用户不存在')
        if user:
            if not user.check_password(password):
                raise ValidationError('输入密码不正确')
        attrs['token'] = 'new token'
        attrs['id'] = user.get_id()
        attrs['is_super_admin'] = user.is_super_admin
        return attrs


class CredentialInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CredentialInfo
        fields = "__all__"

    def validate(self, attrs):
        input_store, input_admin = attrs['store'], attrs['admin']
        if not input_admin or not input_store:
            raise ValidationError('输入信息错误')
        credential = CredentialInfo.objects.filter(admin=input_admin, store=input_store).distinct()
        if credential.exists() and credential.count() == 1:
            credential = credential.first()
        else:
            raise ValidationError('该用户缺少该门店权限')
        if not credential:
            raise ValidationError('该用户缺少该门店权限')
        return attrs


class MemberInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberInfo
        fields = "__all__"


class CrewInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrewInfo
        fields = "__all__"


class ServiceInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceInfo
        fields = "__all__"


class RoomInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomInfo
        fields = "__all__"


class SpendingInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpendingInfo
        fields = "__all__"


class TopUpInfoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopUpInfo
        fields = "__all__"
