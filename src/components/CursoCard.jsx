function CursoCard({
    curso,
    onEditar,
    onExcluir
}) {

    return (
        <article className="curso-card">

            <div className="curso-card-content">

                <div className="curso-card-info">

                    <span className="curso-card-label">
                        CURSO
                    </span>

                    <h3>
                        {curso.nome}
                    </h3>

                    <span className="curso-card-plataforma">
                        {curso.plataforma}
                    </span>

                </div>

                <div className="curso-card-actions">

                    <a
                        href={curso.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="curso-card-link"
                    >
                        Acessar curso →
                    </a>

                    {onEditar && (
                        <button
                            type="button"
                            className="curso-edit-button"
                            onClick={() => onEditar(curso)}
                        >
                            ✏️ Editar
                        </button>
                    )}

                    {onExcluir && (
                        <button
                            type="button"
                            className="curso-delete-button"
                            onClick={() => onExcluir(curso)}
                        >
                            🗑️ Excluir
                        </button>
                    )}

                </div>

            </div>

        </article>
    )
}

export default CursoCard