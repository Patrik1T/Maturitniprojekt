from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import re
from .models import QuestionPair, CustomUser
from django import forms
from .models import Test


class TestForm(forms.ModelForm):
    class Meta:
        model = Test
        fields = ['name', 'description', 'image']


class QuestionPairForm(forms.ModelForm):
    class Meta:
        model = QuestionPair
        fields = ['question_text', 'answer_text']


class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=100, required=True, label="Uživatelské jméno")
    email = forms.EmailField(required=True, label="Email")
    password = forms.CharField(widget=forms.PasswordInput, min_length=8, required=True, label="Heslo")
    confirm_password = forms.CharField(widget=forms.PasswordInput, required=True, label="Potvrďte heslo")

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise ValidationError("Tento e-mail je již zaregistrován.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password != confirm_password:
            self.add_error('confirm_password', "Hesla se neshodují.")
        return cleaned_data


class MessageForm(forms.Form):
    recipient = forms.ModelChoiceField(queryset=User.objects.all(), required=False, label="Komu")  # Null = veřejné zprávy
    text = forms.CharField(widget=forms.Textarea, required=True, label="Zpráva")



class UserProfileForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(), required=False)
    confirm_password = forms.CharField(widget=forms.PasswordInput(), required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and password != confirm_password:
            raise forms.ValidationError("Hesla se neshodují.")
        return cleaned_data


