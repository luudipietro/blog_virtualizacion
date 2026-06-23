from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/44189406/api/foto")
def obtener_foto():
    return FileResponse("44189406/perfil2.jpg", media_type="image/jpeg")

@router.get("/44189406/api/tpf")
def obtener_foto():
    return FileResponse("44189406/tpf.pdf", media_type="application/pdf")