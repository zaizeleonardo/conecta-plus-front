import { useEffect, useState } from 'react'
import CursoForm from '../components/CursoForm'
import CursoCard from '../components/CursoCard'
import API_URL from '../config/api'
import './Vagas.css'

function GerenciarCursos({ onVoltar, onSair }) {

    const [cursos, setCursos] = useState([])
    const [cursoEditando, setCursoEditando] = useState(null)
    const [carregando, setCarregando] = useState(true)

    async function carregarCursos() {

        try {

            setCarregando(true)

            const resposta = await fetch(`${API_URL}/cursos`)

            if (!resposta.ok) {
                alert('Não foi possível carregar os cursos.')
                return
            }

            const dados = await resposta.json()

            setCursos(dados)

        } catch (erro) {

            console.error('Erro ao carregar cursos:', erro)

            alert(
                'Não foi possível conectar ao servidor.'
            )

        } finally {

            setCarregando(false)

        }
    }

    useEffect(() => {

        carregarCursos()

    }, [])

    function iniciarEdicao(curso) {

        setCursoEditando(curso)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    function cancelarEdicao() {

        setCursoEditando(null)

    }

    async function excluirCurso(curso) {

        const confirmar = window.confirm(
            `Deseja realmente excluir o curso "${curso.nome}"?`
        )

        if (!confirmar) {
            return
        }

        try {

            const resposta = await fetch(
                `${API_URL}/cursos/${curso.id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!resposta.ok) {

                const mensagem = await resposta.text()

                alert(
                    mensagem ||
                    'Não foi possível excluir o curso.'
                )

                return
            }

            alert('Curso excluído com sucesso!')

            await carregarCursos()

        } catch (erro) {

            console.error('Erro ao excluir curso:', erro)

            alert(
                'Não foi possível conectar ao servidor.'
            )

        }
    }

    async function aposSalvar() {

        setCursoEditando(null)

        await carregarCursos()

    }

    return (

        <div className="vagas-page">

            <header className="vagas-navbar">

                <div className="vagas-logo">
                    Conecta<span>+</span>
                </div>

                <div className="vagas-navbar-actions">

                    <button
                        className="vagas-back-button"
                        onClick={onVoltar}
                    >
                        ← Voltar
                    </button>

                    <button
                        className="vagas-sair-button"
                        onClick={onSair}
                    >
                        Sair
                    </button>

                </div>

            </header>

            <main className="vagas-container">

                <section className="vagas-header">

                    <span className="vagas-label">
                        ADMINISTRAÇÃO
                    </span>

                    <h1>
                        Gerenciar cursos
                    </h1>

                    <p>
                        Cadastre, edite e remova cursos recomendados
                        disponíveis no Conecta+.
                    </p>

                </section>

                <CursoForm
                    cursoEditando={cursoEditando}
                    onSalvo={aposSalvar}
                    onCancelar={cancelarEdicao}
                />

                <section className="vagas-list">

                    <div className="vagas-list-header">

                        <div>

                            <span className="vagas-label">
                                CURSOS CADASTRADOS
                            </span>

                            <h2>
                                Cursos
                            </h2>

                            <p>
                                {cursos.length} curso(s)
                            </p>

                        </div>

                    </div>

                    {carregando ? (

                        <p>
                            Carregando cursos...
                        </p>

                    ) : cursos.length === 0 ? (

                        <p>
                            Nenhum curso cadastrado.
                        </p>

                    ) : (

                        <div className="vagas-grid">

                            {cursos.map((curso) => (

                                <CursoCard
                                    key={curso.id}
                                    curso={curso}
                                    onEditar={iniciarEdicao}
                                    onExcluir={excluirCurso}
                                />

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>

    )
}

export default GerenciarCursos