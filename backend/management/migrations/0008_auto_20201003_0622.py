# Generated by Django 2.2.2 on 2020-10-03 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0007_auto_20201003_0606'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spendinginfo',
            name='spending_type',
            field=models.CharField(default='无', max_length=10, verbose_name='支出类型'),
        ),
    ]
