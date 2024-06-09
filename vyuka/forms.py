from django import forms
from .models import Material, Comment

class MaterialForm(forms.ModelForm):
    class Meta:
        model = Material
        fields = ['title', 'release_date', 'runtime', 'rate', 'predmet']
