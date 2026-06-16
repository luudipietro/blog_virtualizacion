from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
from database import engine, Base,SessionLocal
from endpoints import entrada_ep, login_ep
from domain import usuario
import auth

load_dotenv()
# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

db = SessionLocal()
admin_username = os.getenv("ADMIN_USER", "admin")
admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

usuario_existe = db.query(usuario.Usuario).filter(usuario.Usuario.username == admin_username).first()
if not usuario_existe:
    admin_root = usuario.Usuario(
        username=admin_username,
        hashed_password=auth.funcion_hash(admin_password)
    )
    db.add(admin_root)
    db.commit()
db.close()

app = FastAPI(title="Blog Lcuiano Di Pietro")

# Montar carpeta estática
os.makedirs("static", exist_ok=True)
#app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/44189406/static", StaticFiles(directory="44189406/static"), name="static")
# Incluir las rutas separadas
app.include_router(entrada_ep.router)
app.include_router(login_ep.router)

# Ruta del frontend
@app.get("/")
def leer_index():
    return FileResponse("index.html")

# Configuramos la ruta para que responda con o sin barra final
@app.get("/44189406")
@app.get("/44189406/")
def leer_index_dni():
    # FastAPI va a buscar el HTML adentro de la nueva carpeta
    return FileResponse("44189406/index.html")