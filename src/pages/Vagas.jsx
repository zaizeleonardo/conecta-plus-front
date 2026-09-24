import { useEffect, useState } from 'react'
import './Vagas.css'
import API_URL from '../config/api'
function Vagas({ usuario, onVoltar, onSair }) {

  const [vagas, setVagas] = useState([])
  const [diagnosticos, setDiagnosticos] = useState({})
  const [candidaturas, setCandidaturas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoCandidatura, setCarregandoCandidatura] = useState(null)

  async function carregarDados() {

    try {

      setCarregando(true)

      // Carrega as vagas
      const respostaVagas = await fetch(`${API_URL}/vagas`,
      )

      if (respostaVagas.ok) {

        const dadosVagas = await respostaVagas.json()

        setVagas(dadosVagas)

      }

      // Carrega as candidaturas do usuário
      const respostaCandidaturas = await fetch(
        `${API_URL}/candidaturas/usuario/${usuario.id}`
      )


      if (respostaCandidaturas.ok) {

        const dadosCandidaturas =
          await respostaCandidaturas.json()

        setCandidaturas(dadosCandidaturas)

      }

    } catch (erro) {

      console.error(
        'Erro ao carregar vagas:',
        erro
      )

    } finally {

      setCarregando(false)

    }
  }

  useEffect(() => {

    carregarDados()

  }, [usuario.id])


  async function verCompatibilidade(vagaId) {

    try {

      const resposta = await fetch(
        `${API_URL}/diagnosticos/usuarios/${usuario.id}/vagas/${vagaId}`
      )

      if (!resposta.ok) {

        alert(
          'Não foi possível calcular a compatibilidade.'
        )

        return
      }

      const dados = await resposta.json()

      setDiagnosticos((anterior) => ({
        ...anterior,
        [vagaId]: dados
      }))

    } catch (erro) {

      console.error(
        'Erro ao consultar diagnóstico:',
        erro
      )

      alert(
        'Não foi possível conectar ao servidor.'
      )
    }
  }


  async function candidatar(vagaId) {

    const jaCandidatado = candidaturas.some(
      (candidatura) =>
        candidatura.vagaId === vagaId
    )

    if (jaCandidatado) {

      alert(
        'Você já está inscrito nesta vaga.'
      )

      return
    }

    try {

      setCarregandoCandidatura(vagaId)

      const resposta = await fetch(
        `${API_URL}/candidaturas?usuarioId=${usuario.id}&vagaId=${vagaId}`,
        {
          method: 'POST'
        }
      )
      if (resposta.status === 409) {

        alert(
          'Você já está inscrito nesta vaga.'
        )

        await carregarDados()

        return
      }

      if (!resposta.ok) {

        alert(
          'Não foi possível enviar sua candidatura.'
        )

        return
      }

      const novaCandidatura =
        await resposta.json()

      setCandidaturas((anterior) => [
        ...anterior,
        novaCandidatura
      ])

      alert(
        '🎉 Candidatura enviada com sucesso!'
      )

    } catch (erro) {

      console.error(
        'Erro ao realizar candidatura:',
        erro
      )

      alert(
        'Não foi possível conectar ao servidor.'
      )

    } finally {

      setCarregandoCandidatura(null)

    }
  }


  function jaCandidatado(vagaId) {

    return candidaturas.some(
      (candidatura) =>
        candidatura.vagaId === vagaId
    )

  }


  function fecharDiagnostico(vagaId) {

    setDiagnosticos((anterior) => {

      const novo = { ...anterior }

      delete novo[vagaId]

      return novo

    })

  }


  if (carregando) {

    return (
      <div className="vagas-loading">
        Carregando vagas...
      </div>
    )

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
              OPORTUNIDADES
            </span>

            <h1>
              Encontre sua próxima oportunidade
            </h1>

            <p>
              Confira as vagas disponíveis e descubra
              o quanto seu perfil combina com cada uma.
            </p>

          </div>

        </div>


        {/* LISTA DE VAGAS */}

        <div className="vagas-list">

          {vagas.length === 0 ? (

            <div className="vaga-empty">

              <h3>
                Nenhuma vaga encontrada
              </h3>

              <p>
                No momento não existem vagas cadastradas.
              </p>

            </div>

          ) : (

            vagas.map((vaga) => {

              const diagnostico =
                diagnosticos[vaga.id]

              const inscrito =
                jaCandidatado(vaga.id)

              return (

                <article
                  className="vaga-card"
                  key={vaga.id}
                >

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


                  {/* BOTÕES */}

                  <div className="vaga-actions">

                    <button
                      className="vaga-compatibilidade-button"
                      onClick={() =>
                        verCompatibilidade(vaga.id)
                      }
                    >
                      Ver compatibilidade →
                    </button>


                    <button
                      className={
                        inscrito
                          ? 'vaga-candidatura-button inscrito'
                          : 'vaga-candidatura-button'
                      }
                      onClick={() =>
                        candidatar(vaga.id)
                      }
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

                        <button
                          onClick={() =>
                            fecharDiagnostico(vaga.id)
                          }
                          className="diagnostico-close"
                        >
                          ×
                        </button>

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
                              Você possui todas as competências
                              necessárias!
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

            })

          )}

        </div>

      </main>

    </div>

  )

}

export default Vagas