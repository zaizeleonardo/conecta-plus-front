import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vagas from './pages/Vagas'
import Usuarios from './pages/Usuarios'
import GerenciarVagas from './pages/GerenciarVagas'
import GerenciarCursos from './pages/GerenciarCursos.jsx'
import API_URL from './config/api'
function App() {

  const [pagina, setPagina] = useState('inicio')

  const [usuarioLogado, setUsuarioLogado] = useState(null)


  // ==============================
  // DASHBOARD
  // ==============================

  if (pagina === 'dashboard') {

    return (

      <Dashboard
        usuario={usuarioLogado}

        onVagas={() =>
          setPagina('vagas')
        }

        onUsuarios={() =>
          setPagina('usuarios')
        }

        onGerenciarVagas={() =>
          setPagina('gerenciar-vagas')
        }

        onGerenciarCursos={() =>
          setPagina('gerenciar-cursos')
        }

        onSair={() => {

          setUsuarioLogado(null)

          setPagina('inicio')

        }}
      />

    )
  }


  // ==============================
  // VAGAS
  // ==============================

  if (pagina === 'vagas') {

    return (

      <Vagas
        usuario={usuarioLogado}

        onVoltar={() =>
          setPagina('dashboard')
        }

        onSair={() => {

          setUsuarioLogado(null)

          setPagina('inicio')

        }}
      />

    )
  }


  // ==============================
  // GERENCIAR VAGAS
  // ==============================

  if (pagina === 'gerenciar-vagas') {

    return (

      <GerenciarVagas
        onVoltar={() =>
          setPagina('dashboard')
        }

        onSair={() => {

          setUsuarioLogado(null)

          setPagina('inicio')

        }}
      />

    )
  }


  // ==============================
  // GERENCIAR CURSOS
  // ==============================

  if (pagina === 'gerenciar-cursos') {

    return (

      <GerenciarCursos
        onVoltar={() =>
          setPagina('dashboard')
        }

        onSair={() => {

          setUsuarioLogado(null)

          setPagina('inicio')

        }}
      />

    )
  }


  // ==============================
  // USUÁRIOS
  // ==============================

  if (pagina === 'usuarios') {

    return (

      <Usuarios
        onVoltar={() =>
          setPagina('dashboard')
        }

        onSair={() => {

          setUsuarioLogado(null)

          setPagina('inicio')

        }}
      />

    )
  }


  // ==============================
  // LOGIN
  // ==============================

  if (pagina === 'login') {

    return (

      <Login
        onVoltar={() =>
          setPagina('inicio')
        }

        onCadastro={() =>
          setPagina('cadastro')
        }

        onLoginSucesso={(usuario) => {

          console.log(
            'Login realizado:',
            usuario
          )

          setUsuarioLogado(usuario)

          setPagina('dashboard')

        }}
      />

    )
  }


  // ==============================
  // CADASTRO
  // ==============================

  if (pagina === 'cadastro') {

    return (

      <div className="login-page">

        <div className="login-container">

          <div className="login-header">

            <div className="login-logo">
              CONECTA<span>+</span>
            </div>

            <h1>
              Criar sua conta
            </h1>

            <p>
              Cadastre-se para descobrir
              seu potencial profissional.
            </p>

          </div>


          <form
            className="login-form"

            onSubmit={async (event) => {

              event.preventDefault()

              const formData =
                new FormData(
                  event.currentTarget
                )

              const usuario = {

                nome:
                  formData.get('nome'),

                email:
                  formData.get('email'),

                senha:
                  formData.get('senha'),

                telefone:
                  formData.get('telefone'),

                cidade:
                  formData.get('cidade'),

                objetivoProfissional:
                  formData.get(
                    'objetivoProfissional'
                  )

              }


              try {

                const resposta =
                  await fetch(
                    `${API_URL}/usuarios/login`,
                    {
                      method: 'POST',

                      headers: {
                        'Content-Type':
                          'application/json'
                      },

                      body:
                        JSON.stringify(usuario)

                    }
                  )


                const dados =
                  await resposta.json()


                if (!resposta.ok) {

                  alert(
                    dados.mensagem ||
                    'Não foi possível realizar o cadastro.'
                  )

                  return

                }


                alert(
                  'Cadastro realizado com sucesso!'
                )

                setPagina('login')


              } catch (erro) {

                console.error(erro)

                alert(
                  'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
                )

              }

            }}
          >


            {/* NOME */}

            <div className="form-group">

              <label htmlFor="nome">
                Nome
              </label>

              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome"
                required
              />

            </div>


            {/* E-MAIL */}

            <div className="form-group">

              <label htmlFor="email">
                E-mail
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                required
              />

            </div>


            {/* SENHA */}

            <div className="form-group">

              <label htmlFor="senha">
                Senha
              </label>

              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                minLength="8"
                required
              />

            </div>


            {/* TELEFONE */}

            <div className="form-group">

              <label htmlFor="telefone">
                Telefone
              </label>

              <input
                type="text"
                id="telefone"
                name="telefone"
                placeholder="Digite seu telefone"
                required
              />

            </div>


            {/* CIDADE */}

            <div className="form-group">

              <label htmlFor="cidade">
                Cidade
              </label>

              <input
                type="text"
                id="cidade"
                name="cidade"
                placeholder="Digite sua cidade"
                required
              />

            </div>


            {/* OBJETIVO PROFISSIONAL */}

            <div className="form-group">

              <label htmlFor="objetivoProfissional">
                Objetivo profissional
              </label>

              <input
                type="text"
                id="objetivoProfissional"
                name="objetivoProfissional"
                placeholder="Ex.: Desenvolvedor Backend Java"
                required
              />

            </div>


            {/* BOTÃO */}

            <button
              type="submit"
              className="login-button"
            >
              Criar conta
            </button>

          </form>


          {/* RODAPÉ */}

          <div className="login-footer">

            <p>
              Já possui uma conta?
            </p>

            <button
              className="register-link"
              onClick={() =>
                setPagina('login')
              }
            >
              Voltar para o Login
            </button>

            <button
              className="back-link"
              onClick={() =>
                setPagina('inicio')
              }
            >
              ← Voltar para o início
            </button>

          </div>

        </div>

      </div>

    )
  }


  // ==============================
  // PÁGINA INICIAL
  // ==============================

  return (

    <main className="app">


      {/* NAVBAR */}

      <header className="navbar">

        <div className="logo">
          CONECTA<span>+</span>
        </div>


        <nav>

          <a href="#inicio">
            Início
          </a>

          <a href="#como-funciona">
            Como funciona
          </a>

          <a href="#sobre">
            Sobre
          </a>

        </nav>


        <div className="navbar-buttons">

          <button
            className="btn btn-outline"
            onClick={() =>
              setPagina('login')
            }
          >
            Entrar
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              setPagina('cadastro')
            }
          >
            Criar conta
          </button>

        </div>

      </header>


      {/* HERO */}

      <section
        id="inicio"
        className="hero-section"
      >

        <div className="hero-content">

          <span className="hero-badge">
            🚀 Conectando talentos a oportunidades
          </span>

          <h1>

            Descubra o seu

            <span>
              potencial profissional
            </span>

          </h1>

          <p>

            O Conecta+ analisa suas competências,
            identifica as habilidades que você
            precisa desenvolver e encontra
            oportunidades alinhadas ao seu perfil.

          </p>


          <div className="hero-buttons">

            <button
              className="btn btn-primary btn-large"
              onClick={() =>
                setPagina('cadastro')
              }
            >
              Começar agora
            </button>


            <button
              className="btn btn-outline btn-large"
              onClick={() =>
                setPagina('vagas')
              }
            >
              Ver oportunidades
            </button>

          </div>

        </div>


        <div className="hero-card">

          <div className="card-header">

            <span>
              Seu diagnóstico
            </span>

            <span className="status">
              ● Atualizado
            </span>

          </div>


          <div className="compatibility">

            <strong>
              80%
            </strong>

            <span>
              compatibilidade
            </span>

          </div>


          <div className="progress">

            <div className="progress-bar"></div>

          </div>


          <div className="skills">

            <div className="skill completed">

              <span>
                ✓
              </span>

              Java

            </div>


            <div className="skill completed">

              <span>
                ✓
              </span>

              SQL

            </div>


            <div className="skill completed">

              <span>
                ✓
              </span>

              Git

            </div>


            <div className="skill missing">

              <span>
                !
              </span>

              Docker

            </div>

          </div>


          <div className="recommendation">

            <strong>
              📚 Recomendação
            </strong>

            <p>
              Desenvolva Docker para aumentar
              sua compatibilidade.
            </p>

          </div>

        </div>

      </section>


      {/* COMO FUNCIONA */}

      <section
        id="como-funciona"
        className="features-section"
      >

        <div className="section-title">

          <span>
            COMO FUNCIONA
          </span>

          <h2>
            Sua evolução profissional em um só lugar
          </h2>

          <p>
            O Conecta+ transforma suas competências
            em oportunidades reais de desenvolvimento
            profissional.
          </p>

        </div>


        <div className="features">

          <article className="feature-card">

            <div className="feature-icon">
              👤
            </div>

            <h3>
              Crie seu perfil
            </h3>

            <p>
              Cadastre suas informações profissionais
              e suas competências.
            </p>

          </article>


          <article className="feature-card">

            <div className="feature-icon">
              🎯
            </div>

            <h3>
              Descubra sua compatibilidade
            </h3>

            <p>
              Compare suas competências com os
              requisitos das oportunidades disponíveis.
            </p>

          </article>


          <article className="feature-card">

            <div className="feature-icon">
              📚
            </div>

            <h3>
              Desenvolva suas habilidades
            </h3>

            <p>
              Receba recomendações de cursos para
              preencher suas principais lacunas profissionais.
            </p>

          </article>

        </div>

      </section>


      {/* SOBRE */}

      <section
        id="sobre"
        className="about-section"
      >

        <div className="about-content">

          <span className="section-label">
            SOBRE O CONECTA+
          </span>

          <h2>
            Transformando competências em oportunidades
          </h2>

          <p>
            O Conecta+ foi desenvolvido para apoiar
            pessoas que buscam inserção, recolocação
            ou transição profissional.
          </p>

          <p>
            A plataforma identifica competências,
            apresenta oportunidades compatíveis e
            indica caminhos para desenvolver novas habilidades.
          </p>

        </div>


        <div className="ods-card">

          <h3>
            Impacto social
          </h3>

          <div className="ods">

            <span>
              ODS 4
            </span>

            <span>
              ODS 8
            </span>

            <span>
              ODS 10
            </span>

          </div>

          <p>
            Educação de qualidade, trabalho decente
            e redução das desigualdades.
          </p>

        </div>

      </section>


      {/* FOOTER */}

      <footer>

        <div className="logo">
          CONECTA<span>+</span>
        </div>

        <p>
          Conectando competências a oportunidades.
        </p>

        <span>
          © 2026 Conecta+.
        </span>

      </footer>

    </main>

  )
}

export default App