from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
import re

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
