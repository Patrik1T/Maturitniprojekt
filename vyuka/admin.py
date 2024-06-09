from django.contrib import admin
from .models import Predmet, Material, Priloha, Comment

@admin.register(Predmet)
class PredmetAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'rate')
    search_fields = ('title', 'obsah')
    list_filter = ('release_date', 'rate', 'predmet')
    ordering = ('-release_date', 'title')
    filter_horizontal = ('predmet',)
    fieldsets = (
        (None, {
            'fields': ('title', 'obsah', 'release_date', 'runtime', 'logo', 'rate', 'predmet')
        }),
    )

@admin.register(Priloha)
class PrilohaAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'last_update', 'material')
    search_fields = ('title',)
    list_filter = ('type', 'last_update')
    ordering = ('-last_update', 'type')
    fieldsets = (
        (None, {
            'fields': ('title', 'type', 'file', 'material')
        }),
    )

    @admin.register(Comment)
    class CommentAdmin(admin.ModelAdmin):
            list_display = ('author', 'material', 'text', 'created_date', 'approved', 'rating')
            search_fields = ('author', 'material__title', 'text')
            list_filter = ('created_date', 'approved', 'author')

