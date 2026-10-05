import { useEffect, useState } from 'react'
import './App.css'

import {
  UserRound,
  Building2,
  Handshake,
  Target,
  BookOpen,
  Lightbulb,
  CircleCheck,
  CircleAlert
} from 'lucide-react'

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
  // RECUPERAR LOGIN SALVO
  // ==============================

  useEffect(() => {

    const usuarioSalvo =
      localStorage.getItem('usuarioLogado')

    if (usuarioSalvo) {

      setUsuarioLogado(
        JSON.parse(usuarioSalvo)
      )

      setPagina('dashboard')
    }

  }, [])


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

          localStorage.removeItem(
            'usuarioLogado'
          )

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

          localStorage.removeItem(
            'usuarioLogado'
          )

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

        usuario={usuarioLogado}

        onVoltar={() =>
          setPagina('dashboard')
        }

        onSair={() => {

          localStorage.removeItem(
            'usuarioLogado'
          )

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

          localStorage.removeItem(
            'usuarioLogado'
          )

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

          localStorage.removeItem(
            'usuarioLogado'
          )

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

          localStorage.setItem(
            'usuarioLogado',
            JSON.stringify(usuario)
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

              const tipoCadastro =
                formData.get('tipoCadastro')

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
                  ),

                perfil:
                  tipoCadastro === 'EMPRESA'
                    ? 'EMPRESA'
                    : 'USUARIO'

              }


              try {

                const resposta =
                  await fetch(
                    `${API_URL}/usuarios`,
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

            {/* ============================== */}
            {/* TIPO DE CADASTRO */}
            {/* ============================== */}

            <div className="form-group">

              <label>
                Como você deseja se cadastrar?
              </label>


              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '10px',
                  flexWrap: 'wrap'
                }}
              >

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >

                  <input
                    type="radio"
                    name="tipoCadastro"
                    value="USUARIO"
                    defaultChecked
                  />

                  <UserRound size={18} />

                  Sou candidato

                </label>


                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >

                  <input
                    type="radio"
                    name="tipoCadastro"
                    value="EMPRESA"
                  />

                  <Building2 size={18} />

                  Sou empresa

                </label>

              </div>

            </div>


            {/* NOME */}

            <div className="form-group">

              <label htmlFor="nome">
                Nome / Empresa
              </label>

              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome ou nome da empresa"
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


            {/* OBJETIVO */}

            <div className="form-group">

              <label htmlFor="objetivoProfissional">
                Objetivo profissional / Área de atuação
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


      {/* ============================== */}
      {/* NAVBAR */}
      {/* ============================== */}

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


      {/* ============================== */}
      {/* HERO */}
      {/* ============================== */}

      <section
        id="inicio"
        className="hero-section"
      >

        <div className="hero-content">

          <span className="hero-badge">

            <Handshake size={16} />

            Conectando pessoas a novas oportunidades

          </span>


          <h1>

            Encontre o próximo passo

            <span>
              da sua carreira
            </span>

          </h1>


          <p>

            Você sabe onde quer chegar. O Conecta+
            ajuda a descobrir o caminho: entenda suas
            competências, desenvolva novas habilidades
            e encontre oportunidades que combinam com você.

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
              <CircleCheck size={15} />
              Atualizado
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
                <CircleCheck size={16} />
              </span>

              Java

            </div>


            <div className="skill completed">

              <span>
                <CircleCheck size={16} />
              </span>

              SQL

            </div>


            <div className="skill completed">

              <span>
                <CircleCheck size={16} />
              </span>

              Git

            </div>


            <div className="skill missing">

              <span>
                <CircleAlert size={16} />
              </span>

              Docker

            </div>

          </div>


          <div className="recommendation">

            <strong>

              <Lightbulb size={17} />

              Recomendação

            </strong>

            <p>
              Você está quase lá! Desenvolver Docker
              pode aumentar sua compatibilidade com
              essa oportunidade.
            </p>

          </div>

        </div>

      </section>


      {/* ============================== */}
      {/* COMO FUNCIONA */}
      {/* ============================== */}

      <section
        id="como-funciona"
        className="features-section"
      >

        <div className="section-title">

          <span>
            COMO FUNCIONA
          </span>

          <h2>
            Seu próximo passo começa com o que você já sabe.
          </h2>

          <p>
            Entenda onde você está, descubra onde pode
            chegar e encontre oportunidades para dar
            o próximo passo.
          </p>

        </div>


        <div className="features">

          <article className="feature-card">

            <div className="feature-icon">

              <UserRound size={28} />

            </div>

            <h3>
              Conte um pouco sobre você
            </h3>

            <p>
              Mostre sua experiência, seus objetivos
              e as competências que já fazem parte
              da sua trajetória.
            </p>

          </article>


          <article className="feature-card">

            <div className="feature-icon">

              <Target size={28} />

            </div>

            <h3>
              Descubra onde você se encaixa
            </h3>

            <p>
              Veja como suas competências se relacionam
              com as oportunidades disponíveis.
            </p>

          </article>


          <article className="feature-card">

            <div className="feature-icon">

              <BookOpen size={28} />

            </div>

            <h3>
              Descubra o que pode desenvolver
            </h3>

            <p>
              Identifique suas lacunas e encontre
              caminhos para continuar evoluindo.
            </p>

          </article>

        </div>

      </section>


      {/* ============================== */}
      {/* SOBRE */}
      {/* ============================== */}

      <section
        id="sobre"
        className="about-section"
      >

        <div className="about-content">

          <span className="section-label">
            SOBRE O CONECTA+
          </span>

          <h2>
            Todo profissional tem potencial.
            <span> Às vezes, falta encontrar o caminho.</span>
          </h2>

          <p>
            O Conecta+ nasceu para ajudar pessoas que estão
            buscando uma oportunidade, uma recolocação ou
            até mesmo um novo caminho profissional.
          </p>

          <p>
            A ideia é simples: entender o que você já sabe,
            mostrar onde suas competências podem abrir portas
            e indicar caminhos para continuar evoluindo.
          </p>


          <div className="about-highlight">

            <span>

              <Lightbulb size={22} />

            </span>

            <p>
              Porque encontrar uma oportunidade é importante.
              Saber como chegar até ela também.
            </p>

          </div>

        </div>


        <div className="ods-card">

          <span className="ods-label">
            NOSSO IMPACTO
          </span>

          <h3>
            Tecnologia que também gera oportunidades.
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
            e redução das desigualdades fazem parte
            da inspiração por trás do Conecta+.
          </p>

        </div>

      </section>


      {/* ============================== */}
      {/* FOOTER */}
      {/* ============================== */}

      <footer>

        <div className="footer-brand">

          <div className="logo">
            CONECTA<span>+</span>
          </div>

          <p>
            Conectando pessoas, competências e oportunidades.
          </p>

        </div>


        <div className="footer-copy">

          <span>
            © 2026 Conecta+ • Todos os direitos reservados
          </span>

        </div>

      </footer>


    </main>

  )
}


export default App