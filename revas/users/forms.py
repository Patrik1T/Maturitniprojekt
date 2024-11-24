from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
import re
from .models import UserProfile


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    # Validace e-mailu
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if '@' not in email:
            raise ValidationError("Email musí obsahovat jeden zavináč '@'.")
        return email

    # Validace hesla
    def clean_password1(self):
        password = self.cleaned_data.get('password1')
        if len(password) < 8:
            raise ValidationError("Heslo musí mít alespoň 8 znaků.")
        if not re.search(r'[A-Z]', password):
            raise ValidationError("Heslo musí obsahovat alespoň jedno velké písmeno.")
        if not re.search(r'\d', password):
            raise ValidationError("Heslo musí obsahovat alespoň jednu číslici.")
        return password

    # Ověření shody hesel
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError("Hesla se neshodují.")


class RegisterForm(forms.Form):
    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length=100)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    repeat_password = forms.CharField(widget=forms.PasswordInput)
    age = forms.IntegerField()
    gender = forms.CharField(max_length=10)

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        repeat_password = cleaned_data.get('repeat_password')

        if password != repeat_password:
            raise forms.ValidationError("Passwords do not match.")

        return cleaned_data


class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    repeat_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        repeat_password = cleaned_data.get("repeat_password")

        if password != repeat_password:
            raise forms.ValidationError("Hesla se neshodují.")

        return cleaned_data