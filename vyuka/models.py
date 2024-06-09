from django.db import models
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator

def attachment_path(instance, filename):
    return 'material/' + str(instance.material.id) + '/priloha/' + filename

class Predmet(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Název předmětu',
                            help_text='Zapiš o jaký předmět se jedná (PVY OS...)')

    class Meta:
        verbose_name = 'Předmět'
        verbose_name_plural = 'Předměty'
        ordering = ['name']

    def __str__(self):
        return self.name

class Material(models.Model):
    title = models.CharField(max_length=200, verbose_name='Název')
    obsah = models.TextField(blank=True, null=True, verbose_name='Obsah')
    release_date = models.DateField(blank=True, null=True,
                                    help_text='Zadej datum vydání textu: <em>YYYY-MM-DD</em>.',
                                    verbose_name='Vydání textu')
    runtime = models.IntegerField(blank=True, null=True,
                                  help_text='Prosím zadej v hodinách',
                                  verbose_name='Jak dlouho bude trvat se naučit:')
    logo = models.ImageField(upload_to='material/obsah/%Y/%m/%d/', blank=True, null=True,
                             verbose_name="Logo")
    rate = models.FloatField(default=5.0,
                             validators=[MinValueValidator(1.0), MaxValueValidator(10.0)],
                             null=True, help_text='Ohodnoť svůj výukový materiál (1 - 10)',
                             verbose_name='Ohodnoť')
    predmet = models.ManyToManyField(Predmet, help_text='Vyber předmět pro tvůj výukový materiál.')

    class Meta:
        verbose_name = 'Výukový materiál'
        verbose_name_plural = 'Výukové materiály'
        ordering = ['-release_date', 'title']

    def __str__(self):
        return f'{self.title}, year: {str(self.release_date.year)}, rate:{str(self.rate)}'

    def get_absolute_url(self):
        return reverse('material-detail', args=[str(self.id)])

class Priloha(models.Model):
    title = models.CharField(max_length=200, verbose_name='Nazev')
    last_update = models.DateTimeField(auto_now=True)
    file = models.FileField(upload_to=attachment_path, null=True, verbose_name='Soubor')
    TYPE_OF_ATTACHMENT = (
        ('audio', 'Audio'),
        ('image', 'Image'),
        ('text', 'Text'),
        ('video', 'Video'),
        ('other', 'Other'),
    )
    type = models.CharField(max_length=10, choices=TYPE_OF_ATTACHMENT, blank=True,
                            default='image', help_text='Zadej danou Přílohu.',
                            verbose_name='Attachment type')
    material = models.ForeignKey(Material, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Příloha'
        verbose_name_plural = 'Přílohy'
        ordering = ['-last_update', 'type']

    def __str__(self):
        return f'{self.title}, ({self.type})'

class Comment(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='comments')
    author = models.CharField(max_length=100, verbose_name='Autor')
    text = models.TextField(verbose_name='Text')
    created_date = models.DateTimeField(auto_now_add=True, verbose_name='Datum vytvoření')
    approved = models.BooleanField(default=False, verbose_name='Schváleno')
    rating = models.IntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name='Hodnocení'
    )

    class Meta:
        verbose_name = 'Komentář'
        verbose_name_plural = 'Komentáře'
        ordering = ['-created_date']

    def __str__(self):
        return f'Komentář od {self.author} k {self.material.title}'

