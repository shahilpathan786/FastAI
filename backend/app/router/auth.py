from fastapi import APIRouter, Depends
from app.model.auth import Login , Register
from sqlalchemy.orm import Session
from app.database.db import get_db
from typing import Annotated
from app.database.schema.user_schema import UserSchema
from fastapi.responses import JSONResponse
from app.helper import hashPassword, verifyPassword, createAccessToken



router = APIRouter(prefix="/auth")





@router.post("/login")
def login(data: Login, db: Annotated[Session, Depends(get_db)]):
    user = db.query(UserSchema).filter(UserSchema.email == data.email).first()
    if not user or not verifyPassword(data.password, user.password):
        return JSONResponse({"message": "Invalid email or password"}, status_code=401)

    payload = {"id": user.id, "name": user.name, "email": user.email}

    token = createAccessToken(payload)
    payload["access_token"] = "Bearer " + token

    return {"message": "Login successful", "data": payload}


@router.post("/register")
def register(data: Register, db: Annotated[Session, Depends(get_db)]):
    # Check if user with the same email already exists
    existing_user = db.query(UserSchema).filter(UserSchema.email == data.email).first()
    if existing_user:
        return JSONResponse(
            {"message": "User with this email already exists"}, status_code=400
        )

    # Create a new user
    new_user = UserSchema(
        name=data.name,
        email=data.email,
        password=hashPassword(
            data.password
        ),  # In a real application, make sure to hash the password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user": new_user}