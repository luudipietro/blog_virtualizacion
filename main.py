from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from endpoints import entrada_ep

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog Lcuiano Di Pietro")

# Montar carpeta estática
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir las rutas separadas
app.include_router(entrada_ep.router)

# Ruta del frontend
@app.get("/")
def leer_index():
    return FileResponse("index.html")