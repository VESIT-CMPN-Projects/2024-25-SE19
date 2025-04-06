# Generated by Django 5.1.2 on 2025-03-01 04:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('age', models.PositiveIntegerField(default=0)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('contact_number', models.CharField(max_length=17)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('address', models.TextField(blank=True)),
                ('blood_group', models.CharField(blank=True, max_length=5)),
                ('allergies', models.TextField(blank=True)),
                ('existing_conditions', models.TextField(blank=True, verbose_name='Existing Medical Conditions')),
                ('status', models.CharField(choices=[('NEW', 'New Patient'), ('ONGOING', 'Ongoing Treatment'), ('COMPLETED', 'Treatment Completed'), ('FOLLOW_UP', 'Follow-up Required')], default='NEW', max_length=20)),
                ('last_visit', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Medication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('dosage', models.CharField(max_length=100)),
                ('frequency', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('CURRENT', 'Current'), ('PAST', 'Past')], max_length=10)),
                ('prescribed_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('notes', models.TextField(blank=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medications', to='Patient.patient')),
            ],
            options={
                'ordering': ['-prescribed_date'],
            },
        ),
        migrations.CreateModel(
            name='MedicalHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('condition', models.CharField(max_length=200)),
                ('diagnosis_date', models.DateField()),
                ('treatment', models.TextField()),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medical_histories', to='Patient.patient')),
            ],
            options={
                'verbose_name_plural': 'Medical histories',
                'ordering': ['-diagnosis_date'],
            },
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('file', models.FileField(upload_to='patient_documents/')),
                ('document_type', models.CharField(max_length=50)),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='Patient.patient')),
            ],
        ),
    ]
