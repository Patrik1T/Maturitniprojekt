"""
Django settings for revas project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path

import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SOCIAL_AUTH_URL_NAMESPACE = 'social'
LOGIN_REDIRECT_URL = '/'

# příprava na platby
#STRIPE_TEST_PUBLIC_KEY = 'your-public-key-here'
#STRIPE_TEST_SECRET_KEY = 'your-secret-key-here'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ejd=zm54%04x($enu48r5y%&&7a4d70*752x^cnqd#ov6+56be'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'users',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
    'social_django',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
]

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


ROOT_URLCONF = 'revas.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'users/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'revas.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Nastavení pro odesílání e-mailů
#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#EMAIL_HOST = 'smtp.gmail.com'  # Například pro Gmail
#EMAIL_PORT = 587  # SMTP port
#EMAIL_USE_TLS = True  # Používání TLS
#EMAIL_HOST_USER = 'tvuj_email@gmail.com'  # Tvá emailová adresa
#EMAIL_HOST_PASSWORD = 'tvé_emailové_heslo'  # Tvé heslo nebo app password
#DEFAULT_FROM_EMAIL = EMAIL_HOST_USER



# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = '/static/'  # URL pro přístup ke statickým souborům
STATICFILES_DIRS = [
    BASE_DIR / "static",
]




# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',  # Tento backend pro Allauth
    'social_core.backends.google.GoogleOAuth2',  # Google OAuth2
    'social_core.backends.github.GithubOAuth2',  # GitHub OAuth2
    'django.contrib.auth.backends.ModelBackend',  # Základní přihlášení přes Django
)



LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = '/'


SITE_ID = 1

# Vlastnosti pro přihlašování a registraci
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATED_REMEMBER = True
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = False

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '<tvůj google client id>'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '<tvůj google client secret>'
SOCIAL_AUTH_GOOGLE_CALLBACK_URL = 'http://127.0.0.1:8000/hlavni_stranka/'

SOCIAL_AUTH_GITHUB_KEY = 'Ov23li2whfTy60o4FriD'
SOCIAL_AUTH_GITHUB_SECRET = '137d70f0e9d8b455d039780c52dd5aa5298c8358'
SOCIAL_AUTH_GITHUB_CALLBACK_URL = 'http://127.0.0.1:8000/hlavni_stranka/'


LOGIN_REDIRECT_URL = 'main_page'
LOGOUT_REDIRECT_URL = 'login'

ALLOWED_HOSTS = []

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'example.com']



MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')