from django.db import models


class StoreInfo(models.Model):
    store_name = models.CharField(max_length=20, verbose_name='店名', unique=True)
    address = models.TextField(verbose_name='门店地址', unique=True)
    phone = models.CharField(max_length=16, verbose_name='联系方式')
    open_date = models.DateField(verbose_name='开张日期')

    class Meta:
        db_table = 'store'
        verbose_name = '门店'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"{self._get_pk_val}. {self.store_name}"


class AdminInfo(models.Model):
    # set admin_name to unique and change login from post to get
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


class MemberInfo(models.Model):
    name = models.CharField(max_length=8, verbose_name='姓名')
    gender = models.BooleanField(default=True, verbose_name='性别')
    phone = models.CharField(max_length=16, verbose_name='联系方式')
    card_number = models.CharField(db_index=True, max_length=6, verbose_name='会员卡号', unique=True)
    open_date = models.DateField(verbose_name='办理日期')
    balance = models.FloatField(verbose_name='余额')

    class Meta:
        db_table = 'member'
        verbose_name = '会员'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"No.{self.card_number} {self.name}"


class CrewInfo(models.Model):
    name = models.CharField(max_length=8, verbose_name='姓名')
    gender = models.BooleanField(default=True, verbose_name='性别')
    national_id = models.CharField(max_length=20, verbose_name='身份证号', unique=True)
    phone = models.CharField(max_length=16, verbose_name='联系方式')
    crew_number = models.CharField(db_index=True, max_length=6, verbose_name='技师工号', unique=True)
    hire_date = models.DateField(verbose_name='入职日期')

    class Meta:
        db_table = 'crew'
        verbose_name = '技师'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"No.{self.crew_number} {self.name}"


class ServiceInfo(models.Model):
    name = models.CharField(max_length=10, verbose_name='服务名称', unique=True)
    duration = models.IntegerField(default=0, verbose_name="项目时常")
    price = models.IntegerField(default=0, verbose_name="项目费用")

    class Meta:
        db_table = 'service'
        verbose_name = '服务项目'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class RoomInfo(models.Model):
    name = models.CharField(max_length=6, verbose_name='房间名称', unique=True)
    bed_count = models.IntegerField(default=0, verbose_name="床位总数")

    class Meta:
        db_table = 'room'
        verbose_name = '客房'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class SpendingInfo(models.Model):
    amount = models.IntegerField(default=0, verbose_name="支出费用")
    spending_type = models.CharField(max_length=10, verbose_name="支出类型")
    spend_date = models.DateField(verbose_name="流水时间")
    detail = models.TextField(verbose_name='支出明细', default="")

    class Meta:
        db_table = 'spending'
        verbose_name = '日常开支'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f'{self.spending_type}'


class TopUpInfo(models.Model):
    member = models.ForeignKey(MemberInfo, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0, verbose_name="充值金额")
    topup_date = models.DateField(verbose_name="充值时间")

    class Meta:
        db_table = 'topup'
        verbose_name = '充值记录'
        verbose_name_plural = verbose_name


class CustomerOrder(models.Model):
    staff = models.ForeignKey(CrewInfo, on_delete=models.CASCADE)
    room = models.ForeignKey(RoomInfo, on_delete=models.CASCADE)
    service = models.ForeignKey(ServiceInfo, on_delete=models.CASCADE)
    member_info = models.CharField(max_length=20, verbose_name="会员信息", null=True)
    bedNo = models.IntegerField(default=0, verbose_name="床位号")
    consumption = models.IntegerField(default=0, verbose_name="消费金额")

    class Meta:
        db_table = 'customerOrder'
        verbose_name = '普通顾客消费'
        verbose_name_plural = verbose_name
