import { useEffect, useState } from 'react'
import './Dashboard.css'
import { fetchAPI } from '../config/api'

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
  // TOAST
  // ==============================

  const [toast, setToast] = useState(null)

  function mostrarToast(mensagem, tipo = 'sucesso') {

    setToast({
      mensagem,
      tipo
    })

    setTimeout(() => {
      setToast(null)
    }, 3000)

  }

  // ==============================
  // IDENTIFICAR PERFIL
  // ==============================

  const isEmpresa = usuario?.perfil === 'EMPRESA'

  // ==============================
  // CARREGAR DADOS
  // ==============================

  async function carregarDados() {

    try {

      setCarregando(true)

      // ==============================
      // CARREGAR COMPETÊNCIAS DO USUÁRIO
      // ==============================

      const respostaCompetencias = await fetchAPI(
        `/usuarios/${usuario.id}/competencias`
      )

      if (respostaCompetencias.ok) {

        const dadosCompetencias =
          await respostaCompetencias.json()

        setCompetencias(dadosCompetencias)

      }

      // ==============================
      // CARREGAR TODAS AS COMPETÊNCIAS
      // ==============================

      const respostaTodasCompetencias = await fetchAPI(
        '/competencias'
      )

      if (respostaTodasCompetencias.ok) {

        const dadosTodasCompetencias =
          await respostaTodasCompetencias.json()

        setTodasCompetencias(dadosTodasCompetencias)

      }

      // ==============================
      // CARREGAR VAGAS
      // ==============================

      const respostaVagas =
        await fetchAPI('/vagas')

      if (respostaVagas.ok) {

        const dadosVagas =
          await respostaVagas.json()

        setVagas(dadosVagas)

      }

      // ==============================
      // CARREGAR CANDIDATURAS
      // ==============================

      const respostaCandidaturas =
        await fetchAPI(
          `/candidaturas/usuario/${usuario.id}`
        )

      if (respostaCandidaturas.ok) {

        const dadosCandidaturas =
          await respostaCandidaturas.json()

        setCandidaturas(dadosCandidaturas)

      }

      // ==============================
      // CARREGAR DIAGNÓSTICO
      // ==============================

      const respostaDiagnostico =
        await fetchAPI(
          `/diagnosticos/usuarios/${usuario.id}/vagas/1`
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
  // ATUALIZAR DIAGNÓSTICO
  // ==============================

  async function atualizarDiagnostico() {

    try {

      const respostaDiagnostico =
        await fetchAPI(
          `/diagnosticos/usuarios/${usuario.id}/vagas/1`
        )

      if (respostaDiagnostico.ok) {

        const dadosDiagnostico =
          await respostaDiagnostico.json()

        setDiagnostico(dadosDiagnostico)

      }

    } catch (erro) {

      console.error(
        'Erro ao atualizar diagnóstico:',
        erro
      )

    }

  }

  // ==============================
  // EXECUTAR AO ABRIR DASHBOARD
  // ==============================

  useEffect(() => {

    if (isEmpresa) {

      setCarregando(false)

      return

    }

    carregarDados()

  }, [usuario.id, isEmpresa])


  // ==============================
  // ADICIONAR COMPETÊNCIA
  // ==============================

  async function adicionarCompetencia() {

    if (!competenciaSelecionada) {

      mostrarToast(
        'Selecione uma competência.',
        'aviso'
      )

      return

    }

    try {

      setSalvandoCompetencia(true)

      const competenciaId =
        Number(competenciaSelecionada)

      const resposta =
        await fetchAPI(
          `/usuarios/${usuario.id}/competencias/${competenciaId}`,
          {
            method: 'POST'
          }
        )

      if (!resposta.ok) {

        const mensagem =
          await resposta.text()

        mostrarToast(
          mensagem ||
          'Não foi possível adicionar a competência.',
          'erro'
        )

        return

      }

      // Encontrar a competência cadastrada

      const competenciaAdicionada =
        todasCompetencias.find(
          (item) =>
            item.id === competenciaId
        )

      // Atualizar somente a lista de competências

      if (competenciaAdicionada) {

        setCompetencias(
          (anteriores) => [
            ...anteriores,
            competenciaAdicionada
          ]
        )

      }

      setCompetenciaSelecionada('')
      setMostrarAdicionar(false)

      // ==============================
      // CONFIRMAÇÃO IMEDIATA
      // ==============================

      mostrarToast(
        'Competência adicionada com sucesso!',
        'sucesso'
      )

      // ==============================
      // ATUALIZAR DIAGNÓSTICO
      // ==============================

      await atualizarDiagnostico()

    } catch (erro) {

      console.error(
        'Erro ao adicionar competência:',
        erro
      )

      mostrarToast(
        'Não foi possível conectar ao servidor.',
        'erro'
      )

    } finally {

      setSalvandoCompetencia(false)

    }

  }


  // ==============================
  // REMOVER COMPETÊNCIA
  // ==============================

  async function removerCompetencia(
    competenciaId
  ) {

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

      const resposta =
        await fetchAPI(
          `/usuarios/${usuario.id}/competencias/${competenciaId}`,
          {
            method: 'DELETE'
          }
        )

      if (!resposta.ok) {

        mostrarToast(
          'Não foi possível remover a competência.',
          'erro'
        )

        return

      }

      // Remove somente do estado local

      setCompetencias(
        (anteriores) =>
          anteriores.filter(
            (item) =>
              item.id !== competenciaId
          )
      )

      // Atualiza o diagnóstico

      await atualizarDiagnostico()

      mostrarToast(
        'Competência removida com sucesso!',
        'sucesso'
      )

    } catch (erro) {

      console.error(
        'Erro ao remover competência:',
        erro
      )

      mostrarToast(
        'Não foi possível conectar ao servidor.',
        'erro'
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


  // ==================================================
  // DASHBOARD DA EMPRESA
  // ==================================================

  if (isEmpresa) {

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
              onClick={onGerenciarVagas}
            >
              Gerenciar minhas vagas
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
              ÁREA DA EMPRESA
            </span>


            <h1>
              Olá, {usuario.nome}! 👋
            </h1>


            <p>
              Gerencie suas oportunidades e encontre
              profissionais compatíveis com suas vagas.
            </p>

          </section>


          {/* ==========================
              INFORMAÇÕES DA EMPRESA
          =========================== */}

          <section className="dashboard-profile-card">

            <div>

              <span className="dashboard-profile-label">
                EMPRESA
              </span>


              <h2>
                {usuario.nome}
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
              GESTÃO DE VAGAS
          =========================== */}

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="dashboard-label">
                  OPORTUNIDADES
                </span>


                <h2>
                  Gestão de vagas
                </h2>


                <p>
                  Cadastre, visualize, edite e exclua
                  as oportunidades da sua empresa.
                </p>

              </div>

            </div>


            <div className="dashboard-cta">

              <div>

                <span>
                  MINHAS VAGAS
                </span>


                <h2>
                  Gerencie suas oportunidades
                </h2>


                <p>
                  Acesse o painel para cadastrar novas
                  vagas e administrar as oportunidades existentes.
                </p>

              </div>


              <button
                onClick={onGerenciarVagas}
              >
                Gerenciar vagas →
              </button>

            </div>

          </section>


          {/* ==========================
              CANDIDATOS
          =========================== */}

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="dashboard-label">
                  TALENTOS
                </span>


                <h2>
                  Encontre profissionais
                </h2>


                <p>
                  Publique suas vagas para conectar sua
                  empresa a profissionais em busca de oportunidades.
                </p>

              </div>

            </div>


            <div className="candidaturas-empty">

              <div className="candidaturas-empty-icon">
                👥
              </div>


              <h3>
                Publique uma vaga e encontre candidatos
              </h3>


              <p>
                Crie oportunidades alinhadas às competências
                que sua empresa procura.
              </p>


              <button
                className="candidaturas-vagas-button"
                onClick={onGerenciarVagas}
              >
                Criar vaga
              </button>

            </div>

          </section>


        </main>

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


  // ==================================================
  // DASHBOARD DO CANDIDATO
  // ==================================================

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


          {usuario.perfil === 'ADMIN' && (

            <button
              className="dashboard-vagas-button"
              onClick={onUsuarios}
            >
              Gerenciar usuários
            </button>

          )}


          {usuario.perfil === 'ADMIN' && (

            <button
              className="dashboard-vagas-button"
              onClick={onGerenciarVagas}
            >
              Gerenciar vagas
            </button>

          )}


          {usuario.perfil === 'ADMIN' && (

            <button
              className="dashboard-vagas-button"
              onClick={onGerenciarCursos}
            >
              Gerenciar cursos
            </button>

          )}


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


      {/* ==========================
          TOAST
      =========================== */}

      {toast && (

        <div
          className={`dashboard-toast ${toast.tipo}`}
        >

          <span className="dashboard-toast-icon">

            {toast.tipo === 'sucesso' && '✓'}

            {toast.tipo === 'erro' && '✕'}

            {toast.tipo === 'aviso' && '⚠'}

          </span>


          <span>
            {toast.mensagem}
          </span>

        </div>

      )}

    </div>

  )

}

export default Dashboard