from pydantic import BaseModel, Field, EmailStr, ValidationInfo, field_validator


class Login(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class Register(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    confirm_password: str = Field(..., min_length=6, max_length=128)

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info: ValidationInfo):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class AuthUser(BaseModel):
    id: int
    name: str
    email: str