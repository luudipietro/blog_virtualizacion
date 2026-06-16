from pydantic import BaseModel
from datetime import datetime

class EntradaCreate(BaseModel):
    titulo: str
    contenido: str

class EntradaResponse(BaseModel):
    id: int
    titulo: str
    contenido: str
    fecha: datetime | None = None

    class Config:
        from_attributes = True