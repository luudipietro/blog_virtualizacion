function Blog() {
    const [posts, setPosts] = React.useState([]);
    const [titulo, setTitulo] = React.useState("");
    const [contenido, setContenido] = React.useState("");

    // Hook para recuperar las entradas existentes al cargar el frontend
    React.useEffect(() => {
        fetch("/api/entradas")
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []);

    // Manejador del formulario para enviar datos via POST asincrónico
    const publicar = async (e) => {
        e.preventDefault();
        if(!titulo || !contenido) return;

        const res = await fetch("/api/entradas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, contenido })
        });
        
        const nuevaEntrada = await res.json();
        setPosts([nuevaEntrada, ...posts]);
        setTitulo("");
        setContenido("");
    };

    return (
        <div className="container">
            {/* Sección de presentación con imagen lateral */}
            <div className="header-profile">
                <img 
                    src="/static/perfil.jpeg" 
                    alt="Foto de Perfil de Luciano" 
                    className="profile-img" 
                />
                <div className="profile-info">
                    <h1>Blog Personal de Luciano</h1>
                    <p style={{ fontWeight: '500' }}>Estudiante de Ingeniería en Sistemas de Información | UTN FRT</p>
                    <p style={{ color: '#9cdcfe', fontSize: '0.95rem' }}>Intereses: Desarrollo Backend, Análisis de Datos, Ciencia de Datos.</p>
                    <a href="/static/informe-tpf.pdf" className="btn" target="_blank">📄 Descargar Informe TPF</a>
                </div>
            </div>

            {/* Formulario de actualización dinámica */}
            <div className="form-box">
                <h3 style={{ marginTop: 0, color: '#4ec9b0' }}>➕ Publicar nueva actualización</h3>
                <form onSubmit={publicar}>
                    <input 
                        placeholder="Título de la actualización..." 
                        value={titulo} 
                        onChange={e => setTitulo(e.target.value)} 
                    />
                    <textarea 
                        placeholder="Escribe el contenido aquí..." 
                        rows="3" 
                        value={contenido} 
                        onChange={e => setContenido(e.target.value)}
                    ></textarea>
                    <button type="submit">Guardar en Base de Datos</button>
                </form>
            </div>

            <h2>Registro de Entradas</h2>
            {posts.length === 0 ? <p style={{ color: '#888' }}>No hay actualizaciones registradas aún.</p> : null}
            
            {posts.map(post => (
                <div key={post.id} className="post">
                    <h3>{post.titulo}</h3>
                    <p>{post.contenido}</p>
                </div>
            ))}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog />);