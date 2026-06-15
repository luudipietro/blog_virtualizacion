from pydantic import BaseModel

class EntradaCreate(BaseModel):
    titulo: str
    contenido: str

class EntradaResponse(BaseModel):
    id: int
    titulo: str
    contenido: str

    class Config:
        from_attributes = True