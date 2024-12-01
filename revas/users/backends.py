# backends.py

from social_core.backends.oauth import BaseOAuth2
from django.conf import settings


class MoodleOAuth2(BaseOAuth2):
    """Custom OAuth2 backend for Moodle authentication."""
    name = 'moodle'
    AUTHORIZATION_URL = 'https://your-moodle-site.com/oauth2/authorize'
    ACCESS_TOKEN_URL = 'https://your-moodle-site.com/oauth2/token'
    REFRESH_TOKEN_URL = 'https://your-moodle-site.com/oauth2/token'
    SCOPE = ['openid', 'profile', 'email']

    def get_user_details(self, response):
        """Fetch the user details after successful OAuth authentication."""
        return {
            'username': response.get('username'),
            'email': response.get('email'),
            'first_name': response.get('first_name'),
            'last_name': response.get('last_name'),
        }

    def user_data(self, access_token):
        """Fetch user data from Moodle."""
        response = self.get_json(
            'https://your-moodle-site.com/webservice/rest/server.php',
            params={
                'wstoken': access_token,
                'wsfunction': 'core_user_get_users',
                'moodlewsrestformat': 'json',
            }
        )
        return response

    # myproject/social/backends/moodle.py
    from social_core.backends.oauth import BaseOAuth2
    from django.conf import settings

    class MoodleOAuth2(BaseOAuth2):
        """Vlastní backend pro Moodle"""
        name = 'moodle'
        AUTHORIZATION_URL = 'https://yourmoodlesite.com/oauth2/authorize'
        ACCESS_TOKEN_URL = 'https://yourmoodlesite.com/oauth2/token'
        REFRESH_TOKEN_URL = 'https://yourmoodlesite.com/oauth2/refresh'
        API_URL = 'https://yourmoodlesite.com/api/userinfo'
        client_id = settings.SOCIAL_AUTH_MOODLE_KEY
        client_secret = settings.SOCIAL_AUTH_MOODLE_SECRET

