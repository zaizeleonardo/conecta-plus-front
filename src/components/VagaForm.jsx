import { useEffect, useState } from 'react'
import API_URL from '../config/api'

function VagaForm({ vagaEditando, onSalvo, onCancelar }) {

    const [formulario, setFormulario] = useState({
        titulo: '',
        empresa: '',
        descricao: '',
        cidade: '',
        modalidade: '',
        salario: ''
    })

    const [salvando, setSalvando] = useState(false)

    useEffect(() => {

        if (vagaEditando) {

            setFormulario({
                titulo: vagaEditando.titulo || '',
                empresa: vagaEditando.empresa || '',
                descricao: vagaEditando.descricao || '',
                cidade: vagaEditando.cidade || '',
                modalidade: vagaEditando.modalidade || '',
                salario: vagaEditando.salario || ''
            })

        } else {

            setFormulario({
                titulo: '',
                empresa: '',
                descricao: '',
                cidade: '',
                modalidade: '',
                salario: ''
            })

        }

    }, [vagaEditando])

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

            const dados = {
                titulo: formulario.titulo,
                empresa: formulario.empresa,
                descricao: formulario.descricao,
                cidade: formulario.cidade,
                modalidade: formulario.modalidade,
                salario: Number(formulario.salario)
            }

            const url = vagaEditando
                ? `${API_URL}/vagas/${vagaEditando.id}`
                : `${API_URL}/vagas`

            const metodo = vagaEditando ? 'PUT' : 'POST'

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })

            if (!resposta.ok) {

                let mensagem = 'Não foi possível salvar a vaga.'

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
                vagaEditando
                    ? 'Vaga atualizada com sucesso!'
                    : 'Vaga criada com sucesso!'
            )

            setFormulario({
                titulo: '',
                empresa: '',
                descricao: '',
                cidade: '',
                modalidade: '',
                salario: ''
            })

            onSalvo()

        } catch (erro) {

            console.error('Erro ao salvar vaga:', erro)

            alert(
                'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
            )

        } finally {

            setSalvando(false)

        }

    }

    return (
        <section className="vaga-form-container">

            <div className="vaga-form-header">

                <span className="vagas-label">
                    GERENCIAMENTO
                </span>

                <h2>
                    {vagaEditando
                        ? 'Editar vaga'
                        : 'Cadastrar nova vaga'}
                </h2>

                <p>
                    {vagaEditando
                        ? 'Atualize as informações da oportunidade.'
                        : 'Cadastre uma nova oportunidade no Conecta+.'}
                </p>

            </div>

            <form onSubmit={salvar} className="vaga-form">

                <div className="vaga-form-grid">

                    <div className="vaga-form-field">

                        <label htmlFor="titulo">
                            Título da vaga
                        </label>

                        <input
                            id="titulo"
                            name="titulo"
                            type="text"
                            value={formulario.titulo}
                            onChange={handleChange}
                            placeholder="Ex.: Desenvolvedor Backend Java"
                            required
                        />

                    </div>

                    <div className="vaga-form-field">

                        <label htmlFor="empresa">
                            Empresa
                        </label>

                        <input
                            id="empresa"
                            name="empresa"
                            type="text"
                            value={formulario.empresa}
                            onChange={handleChange}
                            placeholder="Nome da empresa"
                            required
                        />

                    </div>

                    <div className="vaga-form-field">

                        <label htmlFor="cidade">
                            Cidade
                        </label>

                        <input
                            id="cidade"
                            name="cidade"
                            type="text"
                            value={formulario.cidade}
                            onChange={handleChange}
                            placeholder="Ex.: São Paulo"
                            required
                        />

                    </div>

                    <div className="vaga-form-field">

                        <label htmlFor="modalidade">
                            Modalidade
                        </label>

                        <select
                            id="modalidade"
                            name="modalidade"
                            value={formulario.modalidade}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Selecione
                            </option>

                            <option value="Remoto">
                                Remoto
                            </option>

                            <option value="Híbrido">
                                Híbrido
                            </option>

                            <option value="Presencial">
                                Presencial
                            </option>

                        </select>

                    </div>

                    <div className="vaga-form-field">

                        <label htmlFor="salario">
                            Salário
                        </label>

                        <input
                            id="salario"
                            name="salario"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formulario.salario}
                            onChange={handleChange}
                            placeholder="Ex.: 4500.00"
                            required
                        />

                    </div>

                </div>

                <div className="vaga-form-field">

                    <label htmlFor="descricao">
                        Descrição
                    </label>

                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formulario.descricao}
                        onChange={handleChange}
                        placeholder="Descreva as principais atividades e requisitos da vaga."
                        rows="5"
                        required
                    />

                </div>

                <div className="vaga-form-actions">

                    <button
                        type="submit"
                        className="vaga-form-save-button"
                        disabled={salvando}
                    >
                        {salvando
                            ? 'Salvando...'
                            : vagaEditando
                                ? 'Salvar alterações'
                                : 'Cadastrar vaga'}
                    </button>

                    {vagaEditando && (

                        <button
                            type="button"
                            className="vaga-form-cancel-button"
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

export default VagaForm