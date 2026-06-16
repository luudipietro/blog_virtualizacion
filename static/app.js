// ==========================================
// COMPONENTE 1: MODAL DE LOGIN AISLADO
// ==========================================
function ModalLogin({ isOpen, onClose, onLogin, user, setUser, pass, setPass }) {
    if (!isOpen) return null; // Si no está abierto, no renderiza nada

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#4ec9b0' }}>🔒 Acceso Sistema</h3>
                    <button onClick={onClose} style={{ background: 'none', padding: 0, color: '#888' }}>✖</button>
                </div>
                <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input placeholder="Usuario..." value={user} onChange={e => setUser(e.target.value)} autoFocus />
                    <input type="password" placeholder="Contraseña..." value={pass} onChange={e => setPass(e.target.value)} />
                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </div>
    );
}

// ==========================================
// COMPONENTE 2: PERFIL DE USUARIO
// ==========================================
function PerfilUsuario() {
    return (
        <div className="header-profile">
            <img src="/static/perfil.jpeg" alt="Luciano" className="profile-img" />
            <div className="profile-info">
                <h1 style={{ margin: '0 0 5px 0', color: '#ce9178' }}>Luciano Di Pietro</h1>
                <p style={{ fontWeight: '500', margin: '5px 0' }}>Estudiante de Ingeniería en Sistemas de Información | UTN FRT</p>
                <p style={{ color: '#9cdcfe', fontSize: '0.95rem' }}>Intereses: Desarrollo Backend (Python/FastAPI), Tecnologías AgTech, Análisis y Ciencia de Datos.</p>
                
                {/* Nuevos Flotantes de Contacto */}
                <div className="badges-container">
                    <a href="mailto:tu-correo@gmail.com" className="badge">
                        <span>📧</span> Email
                    </a>
                    <a href="https://linkedin.com/in/tu-perfil" target="_blank" className="badge">
                        <span>💼</span> LinkedIn
                    </a>
                    {/* <a href="https://github.com/tu-usuario" target="_blank" className="badge">
                        <span>💻</span> GitHub
                    </a> */}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// COMPONENTE PRINCIPAL: BLOG (DIRECTOR)
// ==========================================
function Blog() {
    const [posts, setPosts] = React.useState([]);
    const [titulo, setTitulo] = React.useState("");
    const [contenido, setContenido] = React.useState("");
    
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [token, setToken] = React.useState(sessionStorage.getItem("token_tpf") || "");
    const [showLogin, setShowLogin] = React.useState(false); 

    React.useEffect(() => {
        fetch("/api/entradas")
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []);

    const hacerLogin = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            setToken(data.access_token);
            sessionStorage.setItem("token_tpf", data.access_token);
            setPassword("");
            setShowLogin(false);
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    };

    const cerrarSesion = () => {
        setToken("");
        sessionStorage.removeItem("token_tpf");
    };

    const publicar = async (e) => {
        e.preventDefault();
        if(!titulo || !contenido) return;

        const res = await fetch("/api/entradas", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ titulo, contenido })
        });
        
        if (res.ok) {
            const nuevaEntrada = await res.json();
            setPosts([nuevaEntrada, ...posts]);
            setTitulo("");
            setContenido("");
        } else {
            alert("Sesión inválida. Loguéate de nuevo.");
            cerrarSesion();
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            {/* NUEVA BARRA SUPERIOR ABSOLUTA */}
            <div className="top-bar">
                <a href="/static/informe-tpf.pdf" className="btn-top btn-pdf" target="_blank">📄 PDF Informe TPF</a>
                
                {token ? (
                    <button onClick={cerrarSesion} className="btn-top btn-logout">Cerrar Sesión</button>
                ) : (
                    <button onClick={() => setShowLogin(true)} className="btn-top btn-login">🔑 Administrador</button>
                )}
            </div>

            {/* MODAL INYECTADO COMO COMPONENTE */}
            <ModalLogin 
                isOpen={showLogin} 
                onClose={() => setShowLogin(false)} 
                onLogin={hacerLogin} 
                user={username} setUser={setUsername} 
                pass={password} setPass={setPassword} 
            />

            {/* CONTENIDO PRINCIPAL */}
            <div className="container">
                <PerfilUsuario />

                {token && (
                    <div className="form-box">
                        <h3 style={{ marginTop: 0, color: '#4ec9b0' }}>➕ Publicar nueva actualización</h3>
                        <form onSubmit={publicar}>
                            <input placeholder="Título..." value={titulo} onChange={e => setTitulo(e.target.value)} />
                            <textarea placeholder="Contenido..." rows="3" value={contenido} onChange={e => setContenido(e.target.value)}></textarea>
                            <button type="submit">Publicar en el servidor</button>
                        </form>
                    </div>
                )}

                <h2>Actualizaciones del Proyecto</h2>
                {posts.length === 0 ? <p style={{ color: '#888' }}>Sin actualizaciones registradas.</p> : null}
                
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h3>{post.titulo}</h3>
                        <span className="fecha-post">🕒 {formatearFecha(post.fecha)}</span>
                        <p>{post.contenido}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog />);