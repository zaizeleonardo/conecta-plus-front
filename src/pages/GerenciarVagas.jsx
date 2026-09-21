import { useEffect, useState } from 'react'
import VagaForm from '../components/VagaForm'
import VagaCard from '../components/VagaCard'
import API_URL from '../config/api'
import './Vagas.css'

function GerenciarVagas({ onVoltar, onSair }) {

    const [vagas, setVagas] = useState([])
    const [vagaEditando, setVagaEditando] = useState(null)
    const [carregando, setCarregando] = useState(true)

    async function carregarVagas() {

        try {

            setCarregando(true)

            const resposta = await fetch(`${API_URL}/vagas`)

            if (!resposta.ok) {
                alert('Não foi possível carregar as vagas.')
                return
            }

            const dados = await resposta.json()

            setVagas(dados)

        } catch (erro) {

            console.error('Erro ao carregar vagas:', erro)

            alert(
                'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
            )

        } finally {

            setCarregando(false)

        }
    }

    useEffect(() => {
        carregarVagas()
    }, [])

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

        const confirmar = window.confirm(
            `Deseja realmente excluir a vaga "${vaga.titulo}"?`
        )

        if (!confirmar) {
            return
        }

        try {

            const resposta = await fetch(
                `${API_URL}/vagas/${vaga.id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!resposta.ok) {

                alert('Não foi possível excluir a vaga.')

                return
            }

            alert('Vaga excluída com sucesso!')

            if (vagaEditando?.id === vaga.id) {
                setVagaEditando(null)
            }

            await carregarVagas()

        } catch (erro) {

            console.error('Erro ao excluir vaga:', erro)

            alert(
                'Não foi possível conectar ao servidor.'
            )

        }
    }

    async function aposSalvar() {

        setVagaEditando(null)

        await carregarVagas()

    }

    return (
        <div className="vagas-page">

            {/* NAVBAR */}

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

            {/* CONTEÚDO */}

            <main className="vagas-container">

                <div className="vagas-header">

                    <div>

                        <span className="vagas-label">
                            ADMINISTRAÇÃO
                        </span>

                        <h1>
                            Gerenciar vagas
                        </h1>

                        <p>
                            Cadastre, edite e remova oportunidades
                            disponíveis no Conecta+.
                        </p>

                    </div>

                </div>

                {/* FORMULÁRIO */}

                <VagaForm
                    vagaEditando={vagaEditando}
                    onSalvo={aposSalvar}
                    onCancelar={cancelarEdicao}
                />

                {/* LISTA */}

                <section className="vagas-list">

                    <div className="vagas-header">

                        <div>

                            <span className="vagas-label">
                                VAGAS CADASTRADAS
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
                                Cadastre a primeira oportunidade
                                utilizando o formulário acima.
                            </p>

                        </div>

                    ) : (

                        vagas.map((vaga) => (

                            <VagaCard
                                key={vaga.id}
                                vaga={vaga}
                                inscrito={false}
                                diagnostico={null}
                                carregandoCandidatura={null}
                                onCompatibilidade={() => { }}
                                onCandidatar={() => { }}
                                onEditar={iniciarEdicao}
                                onExcluir={excluirVaga}
                            />

                        ))

                    )}

                </section>

            </main>

        </div>
    )
}

export default GerenciarVagas