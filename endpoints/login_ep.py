from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from database import get_db
from domain import usuario
import schemas
import auth

router = APIRouter()

# Endpoint de Login profesional utilizando el estándar OAuth2
@router.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(usuario.Usuario).filter(usuario.Usuario.username == form_data.username).first()
    if not user or user.hashed_password != auth.funcion_hash(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_acceso = auth.crear_token_acceso(data={"sub": user.username})
    return {"access_token": token_acceso, "token_type": "bearer"}