# myapp/templatetags/custom_filters.py
from django import template

register = template.Library()

@register.filter(name='get_item')
def get_item(dictionary, key):
    """Filtr pro získání hodnoty z dictionary (například z JSONField)."""
    return dictionary.get(key)
