import { useEffect, useState } from 'react'

import VagaForm from '../components/VagaForm'

import { fetchAPI } from '../config/api'

import './Vagas.css'


function GerenciarVagas({ usuario, onVoltar, onSair }) {

    const [vagas, setVagas] = useState([])

    const [vagaEditando, setVagaEditando] = useState(null)

    const [carregando, setCarregando] = useState(true)


    const [vagaSelecionada, setVagaSelecionada] = useState(null)

    const [candidatos, setCandidatos] = useState([])

    const [competenciasCandidatos, setCompetenciasCandidatos] =
        useState({})

    const [carregandoCandidatos, setCarregandoCandidatos] =
        useState(false)


    // ==================================================
    // CARREGAR VAGAS
    // ==================================================

    async function carregarVagas() {

        try {

            setCarregando(true)

            const endpoint =
                usuario?.perfil === 'EMPRESA'
                    ? '/vagas/minhas'
                    : '/vagas'

            const resposta = await fetchAPI(endpoint)

            if (!resposta.ok) {

                alert(
                    'Não foi possível carregar as vagas.'
                )

                return
            }

            const dados = await resposta.json()

            setVagas(dados)

        } catch (erro) {

            console.error(
                'Erro ao carregar vagas:',
                erro
            )

            alert(
                'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
            )

        } finally {

            setCarregando(false)
        }
    }


    useEffect(() => {

        carregarVagas()

    }, [usuario])


    // ==================================================
    // EDITAR VAGA
    // ==================================================

    function iniciarEdicao(vaga) {

        setVagaEditando(vaga)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }


    function cancelarEdicao() {

        setVagaEditando(null)
    }


    // ==================================================
    // EXCLUIR VAGA
    // ==================================================

    async function excluirVaga(vaga) {

        const confirmar =
            window.confirm(
                `Deseja realmente excluir a vaga "${vaga.titulo}"?`
            )

        if (!confirmar) return


        try {

            const resposta =
                await fetchAPI(
                    `/vagas/${vaga.id}`,
                    {
                        method: 'DELETE'
                    }
                )


            if (!resposta.ok) {

                const mensagem =
                    await resposta.text()

                alert(
                    mensagem ||
                    'Não foi possível excluir a vaga.'
                )

                return
            }


            alert(
                'Vaga excluída com sucesso!'
            )


            if (
                vagaEditando?.id === vaga.id
            ) {

                setVagaEditando(null)
            }


            if (
                vagaSelecionada?.id === vaga.id
            ) {

                setVagaSelecionada(null)

                setCandidatos([])

                setCompetenciasCandidatos({})
            }


            await carregarVagas()

        } catch (erro) {

            console.error(
                'Erro ao excluir vaga:',
                erro
            )

            alert(
                'Não foi possível conectar ao servidor.'
            )
        }
    }


    // ==================================================
    // APÓS SALVAR
    // ==================================================

    async function aposSalvar() {

        setVagaEditando(null)

        await carregarVagas()
    }


    // ==================================================
    // CARREGAR COMPETÊNCIAS DO CANDIDATO
    // ==================================================

    async function carregarCompetenciasCandidato(
        candidato
    ) {

        try {

            const resposta =
                await fetchAPI(
                    `/usuarios/${candidato.usuarioId}/competencias`
                )


            if (!resposta.ok) {

                console.error(
                    `Não foi possível carregar competências do candidato ${candidato.usuarioId}.`
                )

                return {
                    candidatoId: candidato.usuarioId,
                    competencias: []
                }
            }


            const dados =
                await resposta.json()


            return {
                candidatoId: candidato.usuarioId,
                competencias: dados
            }

        } catch (erro) {

            console.error(
                'Erro ao carregar competências do candidato:',
                erro
            )

            return {
                candidatoId: candidato.usuarioId,
                competencias: []
            }
        }
    }


    // ==================================================
    // VISUALIZAR CANDIDATOS
    // ==================================================

    async function visualizarCandidatos(vaga) {

        // Se clicar novamente na mesma vaga,
        // fecha a lista de candidatos.

        if (
            vagaSelecionada?.id === vaga.id
        ) {

            setVagaSelecionada(null)

            setCandidatos([])

            setCompetenciasCandidatos({})

            return
        }


        try {

            setVagaSelecionada(vaga)

            setCandidatos([])

            setCompetenciasCandidatos({})

            setCarregandoCandidatos(true)


            const resposta =
                await fetchAPI(
                    `/candidaturas/vaga/${vaga.id}`
                )


            if (!resposta.ok) {

                const mensagem =
                    await resposta.text()

                alert(
                    mensagem ||
                    'Não foi possível carregar os candidatos.'
                )

                setVagaSelecionada(null)

                return
            }


            const dados =
                await resposta.json()


            setCandidatos(dados)


            // ==========================================
            // BUSCAR COMPETÊNCIAS DOS CANDIDATOS
            // ==========================================

            const resultadosCompetencias =
                await Promise.all(
                    dados.map(
                        candidato =>
                            carregarCompetenciasCandidato(
                                candidato
                            )
                    )
                )


            const mapaCompetencias = {}


            resultadosCompetencias.forEach(
                resultado => {

                    mapaCompetencias[
                        resultado.candidatoId
                    ] = resultado.competencias

                }
            )


            setCompetenciasCandidatos(
                mapaCompetencias
            )

        } catch (erro) {

            console.error(
                'Erro ao carregar candidatos:',
                erro
            )

            alert(
                'Não foi possível conectar ao servidor.'
            )

            setVagaSelecionada(null)

        } finally {

            setCarregandoCandidatos(false)
        }
    }


    const isEmpresa =
        usuario?.perfil === 'EMPRESA'


    return (

        <div className="vagas-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <header className="vagas-navbar">

                <div className="vagas-logo">

                    Conecta<span>+</span>

                </div>


                <div className="vagas-navbar-actions">

                    <button
                        onClick={onVoltar}
                        className="vagas-back-button"
                    >
                        ← Dashboard
                    </button>


                    <button
                        onClick={onSair}
                        className="vagas-logout-button"
                    >
                        Sair
                    </button>

                </div>

            </header>


            {/* ==========================================
                CONTEÚDO
            ========================================== */}

            <main className="vagas-container">


                {/* ======================================
                    CABEÇALHO
                ====================================== */}

                <div className="vagas-header">

                    <div>

                        <span className="vagas-label">

                            {isEmpresa
                                ? 'MINHAS VAGAS'
                                : 'ADMINISTRAÇÃO'}

                        </span>


                        <h1>

                            {isEmpresa
                                ? 'Gerenciar minhas vagas'
                                : 'Gerenciar vagas'}

                        </h1>


                        <p>

                            {isEmpresa
                                ? 'Cadastre, edite e remova suas oportunidades no Conecta+.'
                                : 'Cadastre, edite e remova oportunidades disponíveis no Conecta+.'}

                        </p>

                    </div>

                </div>


                {/* ======================================
                    FORMULÁRIO
                ====================================== */}

                <VagaForm
                    vagaEditando={vagaEditando}
                    onSalvo={aposSalvar}
                    onCancelar={cancelarEdicao}
                />


                {/* ======================================
                    LISTA DE VAGAS
                ====================================== */}

                <section className="vagas-list">


                    <div className="vagas-header">

                        <div>

                            <span className="vagas-label">

                                {isEmpresa
                                    ? 'SUAS VAGAS'
                                    : 'VAGAS CADASTRADAS'}

                            </span>


                            <h2>
                                Oportunidades
                            </h2>

                        </div>


                        <span>
                            {vagas.length} vaga(s)
                        </span>

                    </div>


                    {carregando ? (

                        <div className="vagas-loading">
                            Carregando vagas...
                        </div>


                    ) : vagas.length === 0 ? (

                        <div className="vaga-empty">

                            <h3>
                                Nenhuma vaga cadastrada
                            </h3>

                            <p>
                                Cadastre a primeira oportunidade utilizando o formulário acima.
                            </p>

                        </div>


                    ) : (

                        vagas.map((vaga) => (

                            <div
                                key={vaga.id}
                                className="vaga-item"
                            >


                                {/* ==================================
                                    CARD DA VAGA
                                ================================== */}

                                <article className="vaga-card">


                                    <div className="vaga-card-top">

                                        <div>

                                            <span className="vaga-company">
                                                {vaga.empresa}
                                            </span>


                                            <h2>
                                                {vaga.titulo}
                                            </h2>

                                        </div>

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

                                                💰 R${' '}
                                                {Number(
                                                    vaga.salario
                                                ).toLocaleString(
                                                    'pt-BR',
                                                    {
                                                        minimumFractionDigits: 2
                                                    }
                                                )}

                                            </span>

                                        )}

                                    </div>


                                    {/* ==================================
                                        AÇÕES
                                    ================================== */}

                                    <div className="vaga-actions">


                                        <button
                                            type="button"
                                            className="vaga-compatibilidade-button"
                                            onClick={() => { }}
                                        >
                                            Ver compatibilidade →
                                        </button>


                                        {/* CANDIDATAR-SE:
                                            SOMENTE PARA USUÁRIO NORMAL */}

                                        {!isEmpresa && (

                                            <button
                                                type="button"
                                                className="vaga-candidatura-button"
                                                onClick={() => { }}
                                            >
                                                Candidatar-se
                                            </button>

                                        )}


                                        <button
                                            type="button"
                                            className="vaga-edit-button"
                                            onClick={() =>
                                                iniciarEdicao(vaga)
                                            }
                                        >
                                            ✏️ Editar
                                        </button>


                                        <button
                                            type="button"
                                            className="vaga-delete-button"
                                            onClick={() =>
                                                excluirVaga(vaga)
                                            }
                                        >
                                            🗑️ Excluir
                                        </button>

                                    </div>


                                </article>


                                {/* ==================================
                                    BOTÃO CANDIDATOS
                                ================================== */}

                                <div className="vaga-candidatos-actions">

                                    <button
                                        type="button"
                                        className="vaga-candidatos-button"
                                        onClick={() =>
                                            visualizarCandidatos(vaga)
                                        }
                                    >

                                        {vagaSelecionada?.id === vaga.id
                                            ? 'Ocultar candidatos'
                                            : '👥 Ver candidatos'}

                                    </button>

                                </div>


                                {/* ==================================
                                    CANDIDATOS
                                ================================== */}

                                {vagaSelecionada?.id === vaga.id && (

                                    <div className="vaga-candidatos">


                                        <div className="vaga-candidatos-header">

                                            <div>

                                                <span className="vagas-label">
                                                    CANDIDATURAS
                                                </span>


                                                <h3>
                                                    Candidatos — {vaga.titulo}
                                                </h3>

                                            </div>

                                        </div>


                                        {carregandoCandidatos ? (

                                            <p>
                                                Carregando candidatos...
                                            </p>


                                        ) : candidatos.length === 0 ? (

                                            <p>
                                                Ainda não há candidatos para esta vaga.
                                            </p>


                                        ) : (

                                            <div>


                                                <p className="vaga-candidatos-count">

                                                    <strong>
                                                        {candidatos.length}
                                                    </strong>{' '}

                                                    candidato(s)

                                                </p>


                                                {candidatos.map(
                                                    (candidato) => {

                                                        const competencias =
                                                            competenciasCandidatos[
                                                            candidato.usuarioId
                                                            ] || []


                                                        return (

                                                            <div
                                                                key={candidato.id}
                                                                className="candidato-card"
                                                            >


                                                                <h4>
                                                                    👤 {candidato.nome}
                                                                </h4>


                                                                <p>
                                                                    📧 {candidato.email}
                                                                </p>


                                                                <p>
                                                                    📱 {candidato.telefone}
                                                                </p>


                                                                <p>
                                                                    📍 {candidato.cidade}
                                                                </p>


                                                                <p>

                                                                    <strong>
                                                                        Status:
                                                                    </strong>{' '}

                                                                    {candidato.status}

                                                                </p>


                                                                <p>

                                                                    <strong>
                                                                        Data da candidatura:
                                                                    </strong>{' '}

                                                                    {new Date(
                                                                        candidato.dataCandidatura
                                                                    ).toLocaleString(
                                                                        'pt-BR'
                                                                    )}

                                                                </p>


                                                                {/* ==========================
                                                                    COMPETÊNCIAS
                                                                ========================== */}

                                                                <div className="candidato-competencias">

                                                                    <span className="candidato-competencias-title">
                                                                        COMPETÊNCIAS
                                                                    </span>


                                                                    {competencias.length === 0 ? (

                                                                        <p>
                                                                            Nenhuma competência cadastrada.
                                                                        </p>

                                                                    ) : (

                                                                        <div className="candidato-competencias-list">

                                                                            {competencias.map(
                                                                                (competencia) => (

                                                                                    <span
                                                                                        key={competencia.id}
                                                                                        className="candidato-competencia"
                                                                                    >
                                                                                        ✓ {competencia.nome}
                                                                                    </span>

                                                                                )
                                                                            )}

                                                                        </div>

                                                                    )}

                                                                </div>


                                                            </div>

                                                        )
                                                    }
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        ))

                    )}

                </section>

            </main>

        </div>
    )
}


export default GerenciarVagas