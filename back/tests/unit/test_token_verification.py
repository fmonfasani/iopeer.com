import pytest
from jose import JWTError

from agenthub.auth.utils import create_access_token, verify_access_token


class TestVerifyAccessToken:
    def test_valid_token(self):
        token = create_access_token({"sub": "user@example.com"})
        payload = verify_access_token(token)
        assert payload["sub"] == "user@example.com"

    def test_invalid_token(self):
        with pytest.raises(JWTError):
            verify_access_token("this.is.invalid")

