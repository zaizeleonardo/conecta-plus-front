import { useEffect, useState } from 'react'
import './Dashboard.css'
import API_URL from '../config/api'

function Dashboard({
  usuario,
  onVagas,
  onUsuarios,
  onGerenciarVagas,
  onGerenciarCursos,
  onSair
}) {

  // ==============================
  // ESTADOS
  // ==============================

  const [competencias, setCompetencias] = useState([])
  const [todasCompetencias, setTodasCompetencias] = useState([])
  const [diagnostico, setDiagnostico] = useState(null)
  const [candidaturas, setCandidaturas] = useState([])
  const [vagas, setVagas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false)
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState('')
  const [salvandoCompetencia, setSalvandoCompetencia] = useState(false)


  // ==============================
  // CARREGAR DADOS
  // ==============================

  async function carregarDados() {

    try {

      setCarregando(true)

      // ==============================
      // CARREGAR COMPETÊNCIAS DO USUÁRIO
      // ==============================

      const respostaCompetencias = await fetch(
        `${API_URL}/usuarios/${usuario.id}/competencias`
      )
      if (respostaCompetencias.ok) {

        const dadosCompetencias =
          await respostaCompetencias.json()

        setCompetencias(dadosCompetencias)

      }


      // ==============================
      // CARREGAR TODAS AS COMPETÊNCIAS
      // ==============================

      const respostaTodasCompetencias = await fetch(
        `${API_URL}/competencias`
      )

      if (respostaTodasCompetencias.ok) {

        const dadosTodasCompetencias =
          await respostaTodasCompetencias.json()

        setTodasCompetencias(dadosTodasCompetencias)

      }


      // ==============================
      // CARREGAR VAGAS
      // ==============================

      const respostaVagas = await fetch(
        `${API_URL}/vagas`
      )
      if (respostaVagas.ok) {

        const dadosVagas =
          await respostaVagas.json()

        setVagas(dadosVagas)

      }


      // ==============================
      // CARREGAR CANDIDATURAS
      // ==============================

      const respostaCandidaturas = await fetch(
        `${API_URL}/candidaturas/usuario/${usuario.id}`
      )

      if (respostaCandidaturas.ok) {

        const dadosCandidaturas =
          await respostaCandidaturas.json()

        setCandidaturas(dadosCandidaturas)

      }


      // ==============================
      // CARREGAR DIAGNÓSTICO
      // ==============================

      const respostaDiagnostico = await fetch(
        `${API_URL}/diagnosticos/usuarios/${usuario.id}/vagas/1`
      )

      if (respostaDiagnostico.ok) {

        const dadosDiagnostico =
          await respostaDiagnostico.json()

        setDiagnostico(dadosDiagnostico)

      }

    } catch (erro) {

      console.error(
        'Erro ao carregar dashboard:',
        erro
      )

    } finally {

      setCarregando(false)

    }

  }


  // ==============================
  // EXECUTAR AO ABRIR DASHBOARD
  // ==============================

  useEffect(() => {

    carregarDados()

  }, [usuario.id])


  // ==============================
  // ADICIONAR COMPETÊNCIA
  // ==============================

  async function adicionarCompetencia() {

    if (!competenciaSelecionada) {

      alert('Selecione uma competência.')

      return

    }

    try {

      setSalvandoCompetencia(true)

      const resposta = await fetch(
        `${API_URL}/usuarios/${usuario.id}/competencias/${competenciaSelecionada.id}`,
        {
          method: 'POST'
        }
      )

      if (!resposta.ok) {

        const mensagem =
          await resposta.text()

        alert(
          mensagem ||
          'Não foi possível adicionar a competência.'
        )

        return

      }

      alert(
        'Competência adicionada com sucesso!'
      )

      setCompetenciaSelecionada('')
      setMostrarAdicionar(false)

      await carregarDados()

    } catch (erro) {

      console.error(
        'Erro ao adicionar competência:',
        erro
      )

      alert(
        'Não foi possível conectar ao servidor.'
      )

    } finally {

      setSalvandoCompetencia(false)

    }

  }


  // ==============================
  // REMOVER COMPETÊNCIA
  // ==============================

  async function removerCompetencia(competenciaId) {

    const competencia =
      competencias.find(
        (item) =>
          item.id === competenciaId
      )

    const confirmar =
      window.confirm(
        `Deseja remover a competência "${competencia?.nome}"?`
      )

    if (!confirmar) {

      return

    }

    try {

      const resposta = await fetch(
        `${API_URL}/usuarios/${usuario.id}/competencias/${competenciaId}`,
        {
          method: 'DELETE'
        }
      )
      if (!resposta.ok) {

        alert(
          'Não foi possível remover a competência.'
        )

        return

      }

      alert(
        'Competência removida com sucesso!'
      )

      await carregarDados()

    } catch (erro) {

      console.error(
        'Erro ao remover competência:',
        erro
      )

      alert(
        'Não foi possível conectar ao servidor.'
      )

    }

  }


  // ==============================
  // FORMATAR DATA
  // ==============================

  function formatarData(data) {

    if (!data) {

      return '-'

    }

    const dataFormatada =
      new Date(data)

    return dataFormatada.toLocaleDateString(
      'pt-BR'
    )

  }


  // ==============================
  // ENCONTRAR VAGA DA CANDIDATURA
  // ==============================

  function encontrarVaga(vagaId) {

    return vagas.find(
      (vaga) =>
        vaga.id === vagaId
    )

  }


  // ==============================
  // LOADING
  // ==============================

  if (carregando) {

    return (

      <div className="dashboard-loading">

        Carregando seu dashboard...

      </div>

    )

  }


  // ==============================
  // COMPETÊNCIAS DISPONÍVEIS
  // ==============================

  const competenciasDisponiveis =
    todasCompetencias.filter(
      (competencia) =>
        !competencias.some(
          (minha) =>
            minha.id === competencia.id
        )
    )


  // ==============================
  // TELA
  // ==============================

  return (

    <div className="dashboard-page">


      {/* ==========================
          NAVBAR
      =========================== */}

      <header className="dashboard-navbar">

        <div className="dashboard-logo">

          Conecta<span>+</span>

        </div>


        <div className="dashboard-navbar-actions">

          <button
            className="dashboard-vagas-button"
            onClick={onVagas}
          >
            Ver vagas
          </button>


          <button
            className="dashboard-vagas-button"
            onClick={onUsuarios}
          >
            Gerenciar usuários
          </button>


          <button
            className="dashboard-vagas-button"
            onClick={onGerenciarVagas}
          >
            Gerenciar vagas
          </button>


          <button
            className="dashboard-vagas-button"
            onClick={onGerenciarCursos}
          >
            Gerenciar cursos
          </button>


          <button
            className="dashboard-sair-button"
            onClick={onSair}
          >
            Sair
          </button>

        </div>

      </header>


      {/* ==========================
          CONTEÚDO
      =========================== */}

      <main className="dashboard-container">


        {/* ==========================
            CABEÇALHO
        =========================== */}

        <section className="dashboard-welcome">

          <span className="dashboard-label">
            MEU PERFIL
          </span>


          <h1>
            Olá, {usuario.nome}! 👋
          </h1>


          <p>
            Acompanhe suas competências,
            compatibilidade profissional e
            candidaturas.
          </p>

        </section>


        {/* ==========================
            INFORMAÇÕES DO USUÁRIO
        =========================== */}

        <section className="dashboard-profile-card">

          <div>

            <span className="dashboard-profile-label">
              OBJETIVO PROFISSIONAL
            </span>


            <h2>

              {usuario.objetivoProfissional ||
                'Objetivo profissional não informado'}

            </h2>

          </div>


          <div className="dashboard-profile-info">

            <div>

              <span>
                E-mail
              </span>

              <strong>
                {usuario.email}
              </strong>

            </div>


            <div>

              <span>
                Cidade
              </span>

              <strong>
                {usuario.cidade || '-'}
              </strong>

            </div>

          </div>

        </section>


        {/* ==========================
            COMPETÊNCIAS
        =========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-label">
                DESENVOLVIMENTO
              </span>


              <h2>
                Minhas competências
              </h2>


              <p>
                Gerencie as competências que fazem
                parte do seu perfil profissional.
              </p>

            </div>

          </div>


          <div className="dashboard-skills">

            {competencias.length > 0 ? (

              competencias.map(
                (competencia) => (

                  <div
                    className="dashboard-skill"
                    key={competencia.id}
                  >

                    <span>
                      ✓ {competencia.nome}
                    </span>


                    <button
                      className="remove-skill"
                      onClick={() =>
                        removerCompetencia(
                          competencia.id
                        )
                      }
                      title="Remover competência"
                    >
                      ×
                    </button>

                  </div>

                )
              )

            ) : (

              <p>
                Nenhuma competência cadastrada.
              </p>

            )}

          </div>


          {/* BOTÃO ADICIONAR */}

          <button
            className="add-skill-button"
            onClick={() =>
              setMostrarAdicionar(
                !mostrarAdicionar
              )
            }
          >
            + Adicionar competência
          </button>


          {/* FORMULÁRIO */}

          {mostrarAdicionar && (

            <div className="add-skill-form">

              <select
                value={competenciaSelecionada}
                onChange={(event) =>
                  setCompetenciaSelecionada(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Selecione uma competência
                </option>


                {competenciasDisponiveis.map(
                  (competencia) => (

                    <option
                      key={competencia.id}
                      value={competencia.id}
                    >
                      {competencia.nome}
                    </option>

                  )
                )}

              </select>


              <button
                onClick={
                  adicionarCompetencia
                }
                disabled={
                  salvandoCompetencia
                }
              >

                {salvandoCompetencia
                  ? 'Adicionando...'
                  : 'Adicionar'}

              </button>

            </div>

          )}

        </section>


        {/* ==========================
            MINHAS CANDIDATURAS
        =========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-label">
                OPORTUNIDADES
              </span>


              <h2>
                Minhas candidaturas
              </h2>


              <p>
                Acompanhe as vagas para as quais
                você já enviou sua candidatura.
              </p>

            </div>

          </div>


          {candidaturas.length === 0 ? (

            <div className="candidaturas-empty">

              <div className="candidaturas-empty-icon">
                📋
              </div>


              <h3>
                Você ainda não possui candidaturas
              </h3>


              <p>
                Explore as vagas disponíveis e
                encontre uma oportunidade compatível
                com seu perfil.
              </p>


              <button
                className="candidaturas-vagas-button"
                onClick={onVagas}
              >
                Explorar vagas
              </button>

            </div>

          ) : (

            <div className="candidaturas-list">

              {candidaturas.map(
                (candidatura) => {

                  const vaga =
                    encontrarVaga(
                      candidatura.vagaId
                    )


                  return (

                    <div
                      className="candidatura-card"
                      key={candidatura.id}
                    >

                      <div className="candidatura-main">

                        <span className="candidatura-company">

                          {vaga?.empresa ||
                            'Empresa Conecta+'}

                        </span>


                        <h3>

                          {vaga?.titulo ||
                            `Vaga #${candidatura.vagaId}`}

                        </h3>


                        {vaga?.descricao && (

                          <p className="candidatura-description">

                            {vaga.descricao}

                          </p>

                        )}


                        <div className="candidatura-info">

                          {vaga?.cidade && (

                            <span>
                              📍 {vaga.cidade}
                            </span>

                          )}


                          {vaga?.modalidade && (

                            <span>
                              💼 {vaga.modalidade}
                            </span>

                          )}


                          {vaga?.salario && (

                            <span>

                              💰 R$ {Number(
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

                      </div>


                      <div className="candidatura-status-area">

                        <span className="candidatura-status">

                          ✓ {candidatura.status}

                        </span>


                        <span className="candidatura-date">

                          Enviada em{' '}

                          {formatarData(
                            candidatura.dataCandidatura
                          )}

                        </span>

                      </div>

                    </div>

                  )

                }
              )}

            </div>

          )}

        </section>


        {/* ==========================
            DIAGNÓSTICO
        =========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-label">
                DIAGNÓSTICO
              </span>


              <h2>
                Sua compatibilidade profissional
              </h2>


              <p>
                Veja como suas competências se
                relacionam com a vaga de
                Desenvolvedor Backend Java.
              </p>

            </div>

          </div>


          {diagnostico && (

            <div className="dashboard-diagnostic-card">


              {/* PERCENTUAL */}

              <div className="dashboard-score">

                <strong>
                  {diagnostico.percentualCompatibilidade?.toFixed(2)}%
                </strong>


                <span>
                  de compatibilidade
                </span>

              </div>


              {/* BARRA */}

              <div className="dashboard-progress">

                <div
                  className="dashboard-progress-bar"
                  style={{
                    width:
                      `${diagnostico.percentualCompatibilidade}%`
                  }}
                />

              </div>


              {/* COMPETÊNCIAS */}

              <div className="dashboard-diagnostic-grid">


                {/* ATENDIDAS */}

                <div className="dashboard-diagnostic-item">

                  <h3>
                    ✓ Competências encontradas
                  </h3>


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


                {/* FALTANTES */}

                <div className="dashboard-diagnostic-item">

                  <h3>
                    ⚠ Competências que faltam
                  </h3>


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

                <div className="dashboard-courses">

                  <h3>
                    📚 Cursos recomendados
                  </h3>


                  <div className="dashboard-course-list">

                    {diagnostico.cursosRecomendados.map(
                      (curso) => (

                        <div
                          className="dashboard-course"
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

        </section>


        {/* ==========================
            CTA VAGAS
        =========================== */}

        <section className="dashboard-cta">

          <div>

            <span>
              NOVAS OPORTUNIDADES
            </span>


            <h2>
              Encontre vagas compatíveis
              com seu perfil.
            </h2>


            <p>
              Consulte seu percentual de
              compatibilidade antes de se candidatar.
            </p>

          </div>


          <button
            onClick={onVagas}
          >
            Ver oportunidades →
          </button>

        </section>


      </main>

    </div>

  )

}

export default Dashboard