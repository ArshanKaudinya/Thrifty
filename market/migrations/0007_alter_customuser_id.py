# Generated by Django 5.1.1 on 2024-12-27 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0006_alter_customuser_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.CharField(max_length=36, primary_key=True, serialize=False, unique=True),
        ),
    ]
