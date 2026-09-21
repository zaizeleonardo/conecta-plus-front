function VagaCard({
    vaga,
    inscrito,
    diagnostico,
    carregandoCandidatura,
    onCompatibilidade,
    onCandidatar,
    onEditar,
    onExcluir
}) {

    return (
        <article className="vaga-card">

            {/* INFORMAÇÕES DA VAGA */}

            <div className="vaga-card-top">

                <div>

                    <span className="vaga-company">
                        {vaga.empresa}
                    </span>

                    <h2>
                        {vaga.titulo}
                    </h2>

                </div>

                {inscrito && (
                    <span className="vaga-status">
                        ✓ Candidatura enviada
                    </span>
                )}

            </div>

            <p className="vaga-description">
                {vaga.descricao}
            </p>

            <div className="vaga-info">

                <span>
                    📍 {vaga.cidade}
                </span>

                <span>
                    💼 {vaga.modalidade}
                </span>

                {vaga.salario && (
                    <span>
                        💰 R$ {Number(vaga.salario).toLocaleString(
                            'pt-BR',
                            {
                                minimumFractionDigits: 2
                            }
                        )}
                    </span>
                )}

            </div>

            {/* AÇÕES */}

            <div className="vaga-actions">

                <button
                    className="vaga-compatibilidade-button"
                    onClick={() => onCompatibilidade(vaga.id)}
                >
                    Ver compatibilidade →
                </button>

                <button
                    className={
                        inscrito
                            ? 'vaga-candidatura-button inscrito'
                            : 'vaga-candidatura-button'
                    }
                    onClick={() => onCandidatar(vaga.id)}
                    disabled={
                        inscrito ||
                        carregandoCandidatura === vaga.id
                    }
                >
                    {carregandoCandidatura === vaga.id
                        ? 'Enviando...'
                        : inscrito
                            ? '✓ Candidatura enviada'
                            : 'Candidatar-se'}
                </button>

                {/* GERENCIAMENTO */}

                {onEditar && (
                    <button
                        className="vaga-edit-button"
                        onClick={() => onEditar(vaga)}
                    >
                        ✏️ Editar
                    </button>
                )}

                {onExcluir && (
                    <button
                        className="vaga-delete-button"
                        onClick={() => onExcluir(vaga)}
                    >
                        🗑️ Excluir
                    </button>
                )}

            </div>

            {/* DIAGNÓSTICO */}

            {diagnostico && (

                <div className="diagnostico-box">

                    <div className="diagnostico-header">

                        <div>

                            <span>
                                DIAGNÓSTICO
                            </span>

                            <h3>
                                Compatibilidade com a vaga
                            </h3>

                        </div>

                    </div>

                    {/* PORCENTAGEM */}

                    <div className="diagnostico-score">

                        <strong>
                            {diagnostico.percentualCompatibilidade?.toFixed(2)}%
                        </strong>

                        <span>
                            de compatibilidade
                        </span>

                    </div>

                    {/* BARRA */}

                    <div className="diagnostico-progress">

                        <div
                            className="diagnostico-progress-bar"
                            style={{
                                width: `${diagnostico.percentualCompatibilidade}%`
                            }}
                        />

                    </div>

                    {/* COMPETÊNCIAS */}

                    <div className="diagnostico-grid">

                        <div>

                            <h4>
                                ✓ Competências encontradas
                            </h4>

                            {diagnostico.competenciasAtendidas?.length > 0 ? (

                                <ul>

                                    {diagnostico.competenciasAtendidas.map(
                                        (competencia, index) => (

                                            <li key={index}>
                                                {competencia.nome}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p>
                                    Nenhuma competência encontrada.
                                </p>

                            )}

                        </div>

                        <div>

                            <h4>
                                ⚠ Competências que faltam
                            </h4>

                            {diagnostico.competenciasFaltantes?.length > 0 ? (

                                <ul>

                                    {diagnostico.competenciasFaltantes.map(
                                        (competencia, index) => (

                                            <li key={index}>
                                                {competencia.nome}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p>
                                    Você possui todas as competências necessárias!
                                </p>

                            )}

                        </div>

                    </div>

                    {/* CURSOS */}

                    {diagnostico.cursosRecomendados?.length > 0 && (

                        <div className="diagnostico-cursos">

                            <h4>
                                📚 Cursos recomendados
                            </h4>

                            <div className="curso-list">

                                {diagnostico.cursosRecomendados.map(
                                    (curso) => (

                                        <div
                                            className="curso-card"
                                            key={curso.id}
                                        >

                                            <strong>
                                                {curso.nome}
                                            </strong>

                                            <span>
                                                {curso.plataforma}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            )}

        </article>
    )
}

export default VagaCard