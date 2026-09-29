import { useEffect, useState } from 'react'

import VagaForm from '../components/VagaForm'
import VagaCard from '../components/VagaCard'

import { fetchAPI } from '../config/api'

import './Vagas.css'

function GerenciarVagas({ usuario, onVoltar, onSair }) {

    const [vagas, setVagas] = useState([])
    const [vagaEditando, setVagaEditando] = useState(null)
    const [carregando, setCarregando] = useState(true)

    const [vagaSelecionada, setVagaSelecionada] = useState(null)
    const [candidatos, setCandidatos] = useState([])
    const [carregandoCandidatos, setCarregandoCandidatos] = useState(false)

    async function carregarVagas() {

        try {

            setCarregando(true)

            const endpoint =
                usuario?.perfil === 'EMPRESA'
                    ? '/vagas/minhas'
                    : '/vagas'

            const resposta = await fetchAPI(endpoint)

            if (!resposta.ok) {
                alert('Não foi possível carregar as vagas.')
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

    async function aposSalvar() {

        setVagaEditando(null)

        await carregarVagas()
    }

    async function visualizarCandidatos(vaga) {

        // Se clicar novamente na mesma vaga,
        // fecha a lista de candidatos.
        if (vagaSelecionada?.id === vaga.id) {

            setVagaSelecionada(null)
            setCandidatos([])

            return
        }

        try {

            setVagaSelecionada(vaga)
            setCandidatos([])
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

            <main className="vagas-container">

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

                <VagaForm
                    vagaEditando={vagaEditando}
                    onSalvo={aposSalvar}
                    onCancelar={cancelarEdicao}
                />

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

                            <div key={vaga.id}>

                                <VagaCard
                                    vaga={vaga}
                                    inscrito={false}
                                    diagnostico={null}
                                    carregandoCandidatura={null}
                                    onCompatibilidade={() => { }}
                                    onCandidatar={() => { }}
                                    onEditar={iniciarEdicao}
                                    onExcluir={excluirVaga}
                                />

                                <div
                                    style={{
                                        marginTop: '10px',
                                        marginBottom: '20px'
                                    }}
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            visualizarCandidatos(vaga)
                                        }
                                        style={{
                                            padding: '10px 16px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: '#0f3d91',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >

                                        {vagaSelecionada?.id === vaga.id
                                            ? 'Ocultar candidatos'
                                            : '👥 Ver candidatos'}

                                    </button>

                                </div>

                                {vagaSelecionada?.id === vaga.id && (

                                    <div
                                        style={{
                                            marginBottom: '30px',
                                            padding: '20px',
                                            background: '#ffffff',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                                        }}
                                    >

                                        <h3>
                                            Candidatos — {vaga.titulo}
                                        </h3>

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

                                                <p>
                                                    <strong>
                                                        {candidatos.length}
                                                    </strong>{' '}
                                                    candidato(s)
                                                </p>

                                                {candidatos.map((candidato) => (

                                                    <div
                                                        key={candidato.id}
                                                        style={{
                                                            padding: '16px',
                                                            marginTop: '12px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '10px'
                                                        }}
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

                                                    </div>

                                                ))}

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