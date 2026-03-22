import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def create_user():
    def _create_user(**kwargs):
        data = {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpass123",
        }
        data.update(kwargs)
        return User.objects.create_user(**data)

    return _create_user


@pytest.fixture
def create_superuser():
    def _create_superuser(**kwargs):
        data = {
            "email": "admin@example.com",
            "full_name": "Admin User",
            "password": "adminpass123",
        }
        data.update(kwargs)
        return User.objects.create_superuser(**data)

    return _create_superuser