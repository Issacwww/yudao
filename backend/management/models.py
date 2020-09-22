from django.db import models


# Create your models here.

class StoreInfo(models.Model):
    store_name = models.CharField(max_length=20, verbose_name='店名')
    address = models.TextField(verbose_name='门店地址')
    phone = models.CharField(max_length=16, verbose_name='联系方式')
    open_date = models.DateField(verbose_name='开张日期')

    class Meta:
        db_table = 'store'
        verbose_name = '门店'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"{self._get_pk_val}. {self.store_name}"


class AdminInfo(models.Model):
    admin_name = models.CharField(max_length=20, verbose_name='管理员')
    password = models.CharField(max_length=20, verbose_name='密码')
    is_super_admin = models.BooleanField(verbose_name='超级管理员')

    class Meta:
        db_table = 'admin'
        verbose_name = '管理员'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.admin_name

    def check_password(self, password):
        return password == self.password

    def get_id(self):
        return self._get_pk_val


class CredentialInfo(models.Model):
    admin = models.ForeignKey(AdminInfo, on_delete=models.CASCADE)
    store = models.ForeignKey(StoreInfo, on_delete=models.CASCADE)

    class Meta:
        db_table = 'credential'
        verbose_name = '凭证'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.store
