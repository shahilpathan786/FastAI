from sqlalchemy import Column, String, Integer, Boolean, DateTime , VARCHAR
from ..db import Base
from datetime import datetime, timezone


class UserSchema(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(VARCHAR(100), nullable=False, index=True)
    email = Column( VARCHAR(191), unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(timezone.utc))


