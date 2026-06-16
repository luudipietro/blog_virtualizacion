import os
from dotenv import load_dotenv
import hashlib
from datetime import datetime, timedelta
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from domain import usuario

load_dotenv()
# Leer variables de entorno con respaldos por seguridad
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secreto_desarrollo")
ALGORITHM = "HS256"
SALT = "luudipietro_salt_virtualizacion"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def funcion_hash(password: str) -> str:
    # Hashing SHA-256 nativo con Salt para evitar ataques de diccionario
    # Costo de memoria: 0 MB
    hash_object = hashlib.sha256((password + SALT).encode())
    return hash_object.hexdigest()

def crear_token_acceso(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credenciales_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credenciales_exception
    except jwt.PyJWTError:
        raise credenciales_exception
        
    user = db.query(usuario.Usuario).filter(usuario.Usuario.username == username).first()
    if user is None:
        raise credenciales_exception
    return user