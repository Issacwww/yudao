# Generated by Django 2.2.2 on 2020-10-03 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0009_auto_20201003_0658'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spendinginfo',
            name='detail',
            field=models.TextField(default='', verbose_name='支出明细'),
        ),
    ]
