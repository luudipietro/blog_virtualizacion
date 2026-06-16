from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from domain import entrada
from schemas import entrada_schema

router = APIRouter()

@router.get("/44189406/api/entradas", response_model=list[entrada_schema.EntradaResponse])
def obtener_entradas(db: Session = Depends(get_db)):
    return db.query(entrada.Entrada).order_by(entrada.Entrada.id.desc()).all()

@router.post("/44189406/api/entradas", response_model=entrada_schema.EntradaResponse)
def crear_entrada(nueva_entrada: entrada_schema.EntradaCreate, db: Session = Depends(get_db)):
    nueva_entrada = entrada.Entrada(titulo=nueva_entrada.titulo, contenido=nueva_entrada.contenido)
    db.add(nueva_entrada)
    db.commit()
    db.refresh(nueva_entrada)
    return nueva_entrada