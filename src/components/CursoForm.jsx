import { useEffect, useState } from 'react'
import API_URL from '../config/api'

function CursoForm({ cursoEditando, onSalvo, onCancelar }) {

    const [formulario, setFormulario] = useState({
        nome: '',
        plataforma: '',
        url: ''
    })

    const [salvando, setSalvando] = useState(false)

    useEffect(() => {

        if (cursoEditando) {

            setFormulario({
                nome: cursoEditando.nome || '',
                plataforma: cursoEditando.plataforma || '',
                url: cursoEditando.url || ''
            })

        } else {

            setFormulario({
                nome: '',
                plataforma: '',
                url: ''
            })

        }

    }, [cursoEditando])

    function handleChange(event) {

        const { name, value } = event.target

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }))

    }

    async function salvar(event) {

        event.preventDefault()

        try {

            setSalvando(true)

            const url = cursoEditando
                ? `${API_URL}/cursos/${cursoEditando.id}`
                : `${API_URL}/cursos`

            const metodo = cursoEditando
                ? 'PUT'
                : 'POST'

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formulario)
            })

            if (!resposta.ok) {

                let mensagem = 'Não foi possível salvar o curso.'

                try {

                    const erro = await resposta.json()

                    if (erro.mensagem) {
                        mensagem = erro.mensagem
                    }

                } catch {
                    // Mantém a mensagem padrão.
                }

                alert(mensagem)
                return
            }

            alert(
                cursoEditando
                    ? 'Curso atualizado com sucesso!'
                    : 'Curso criado com sucesso!'
            )

            setFormulario({
                nome: '',
                plataforma: '',
                url: ''
            })

            onSalvo()

        } catch (erro) {

            console.error('Erro ao salvar curso:', erro)

            alert(
                'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
            )

        } finally {

            setSalvando(false)

        }

    }

    return (
        <section className="curso-form-container">

            <div className="curso-form-header">

                <span className="vagas-label">
                    GERENCIAMENTO
                </span>

                <h2>
                    {cursoEditando
                        ? 'Editar curso'
                        : 'Cadastrar novo curso'}
                </h2>

                <p>
                    {cursoEditando
                        ? 'Atualize as informações do curso.'
                        : 'Cadastre um novo curso para o Conecta+.'}
                </p>

            </div>

            <form onSubmit={salvar} className="curso-form">

                <div className="curso-form-field">

                    <label htmlFor="nome">
                        Nome do curso
                    </label>

                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        value={formulario.nome}
                        onChange={handleChange}
                        placeholder="Ex.: Java com Spring Boot"
                        required
                    />

                </div>

                <div className="curso-form-field">

                    <label htmlFor="plataforma">
                        Plataforma
                    </label>

                    <input
                        id="plataforma"
                        name="plataforma"
                        type="text"
                        value={formulario.plataforma}
                        onChange={handleChange}
                        placeholder="Ex.: Alura, DIO, Udemy"
                        required
                    />

                </div>

                <div className="curso-form-field">

                    <label htmlFor="url">
                        URL do curso
                    </label>

                    <input
                        id="url"
                        name="url"
                        type="url"
                        value={formulario.url}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                    />

                </div>

                <div className="curso-form-actions">

                    <button
                        type="submit"
                        className="curso-form-save-button"
                        disabled={salvando}
                    >
                        {salvando
                            ? 'Salvando...'
                            : cursoEditando
                                ? 'Salvar alterações'
                                : 'Cadastrar curso'}
                    </button>

                    {cursoEditando && (

                        <button
                            type="button"
                            className="curso-form-cancel-button"
                            onClick={onCancelar}
                            disabled={salvando}
                        >
                            Cancelar
                        </button>

                    )}

                </div>

            </form>

        </section>
    )
}

export default CursoForm