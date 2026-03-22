import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


def test_user_creation(db, create_user):
    user = create_user()

    assert user.email == "test@example.com"
    assert user.role == "STAFF"
    assert user.is_staff is False
    assert user.is_superuser is False
    assert user.check_password("testpass123")


def test_superuser_creation(db, create_superuser):
    admin = create_superuser()

    assert admin.role == "ADMIN"
    assert admin.is_staff is True
    assert admin.is_superuser is True


def test_email_is_required(db, create_user):
    with pytest.raises(ValueError):
        create_user(email="")


def test_email_normalization(db, create_user):
    user = create_user(email="Test@Example.COM")
    assert user.email == "Test@example.com"


def test_string_representation(db, create_user):
    user = create_user()
    assert str(user) == user.email


def test_duplicate_email_not_allowed(db, create_user):
    create_user(email="duplicate@example.com")

    with pytest.raises(Exception):
        create_user(email="duplicate@example.com")