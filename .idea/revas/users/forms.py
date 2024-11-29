from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
import re



class RegistrationForm(forms.Form):
    # Přidání pole pro uživatelské jméno
    username = forms.CharField(max_length=100, required=True, label="Uživatelské jméno")
    first_name = forms.CharField(max_length=100, required=True, label="Jméno")
    last_name = forms.CharField(max_length=100, required=True, label="Příjmení")
    email = forms.EmailField(required=True, label="Email")
    password = forms.CharField(
        widget=forms.PasswordInput,
        min_length=8,
        required=True,
        label="Heslo"
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput,
        required=True,
        label="Potvrďte heslo"
    )
    age = forms.IntegerField(min_value=18, required=True, label="Věk")
    gender_choices = [('M', 'Muži'), ('F', 'Ženy')]
    gender = forms.ChoiceField(choices=gender_choices, required=True, label="Pohlaví")
    profile_picture = forms.ImageField(required=False, label="Profilový obrázek")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValidationError("Zadejte platný email.")
        return email

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if not re.match(r"^(?=.*[A-Z])(?=.*\d).{8,}$", password):
            raise ValidationError("Heslo musí mít alespoň 8 znaků, jedno velké písmeno a jednu číslici.")
        return password

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password != confirm_password:
            raise ValidationError("Hesla se neshodují.")

        return cleaned_data