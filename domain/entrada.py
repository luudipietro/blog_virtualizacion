from sqlalchemy import Column, Integer, String, Text
from database import Base

class Entrada(Base):
    __tablename__ = "entradas"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    contenido = Column(Text)