from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from typing import Annotated
from .helper import decodeAccessToken
from jwt.exceptions import InvalidTokenError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def authenicate_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decodeAccessToken(token)
        print(f"The payload is: {payload}")
        return payload
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"Authorization": "Bearer"},
        )