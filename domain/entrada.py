from sqlalchemy import Column, Integer, String, Text,DateTime
from database import Base
from datetime import datetime
class Entrada(Base):
    __tablename__ = "entradas"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255))
    contenido = Column(Text)
    fecha = Column(DateTime, default=datetime.now())
