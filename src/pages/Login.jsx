import { useState } from 'react'
import './Login.css'

import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

import API_URL from '../config/api'

function Login({ onVoltar, onCadastro, onLoginSucesso }) {

  const [mostrarSenha, setMostrarSenha] = useState(false)


  // ==============================
  // LOGIN
  // ==============================

  async function handleLogin(event) {

    event.preventDefault()

    const formData = new FormData(
      event.currentTarget
    )

    const login = {

      email:
        formData.get('email'),

      senha:
        formData.get('senha')

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
              JSON.stringify(login)
          }
        )


      // ==============================
      // LOGIN INVÁLIDO
      // ==============================

      if (resposta.status === 401) {

        alert(
          'E-mail ou senha inválidos.'
        )

        return

      }


      // ==============================
      // OUTROS ERROS
      // ==============================

      if (!resposta.ok) {

        alert(
          'Não foi possível realizar o login.'
        )

        return

      }


      // ==============================
      // RESPOSTA DO BACKEND
      // ==============================

      const respostaLogin =
        await resposta.json()


      console.log(
        'Usuário autenticado:',
        respostaLogin.usuario
      )


      // ==============================
      // SALVAR JWT
      // ==============================

      localStorage.setItem(
        'token',
        respostaLogin.token
      )


      // ==============================
      // MENSAGEM
      // ==============================

      alert(
        `Bem-vindo, ${respostaLogin.usuario.nome}!`
      )


      // ==============================
      // ENVIAR USUÁRIO PARA APP
      // ==============================

      onLoginSucesso(
        respostaLogin.usuario
      )


    } catch (erro) {

      console.error(
        'Erro no login:',
        erro
      )

      alert(
        'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
      )

    }

  }


  // ==============================
  // INTERFACE
  // ==============================

  return (

    <div className="login-page">

      <div className="login-container">


        {/* ==============================
            CABEÇALHO
        ============================== */}

        <div className="login-header">

          <div className="login-logo">
            CONECTA<span>+</span>
          </div>


          <h1>
            Bem-vindo de volta!
          </h1>


          <p>
            Entre na sua conta para acompanhar sua evolução profissional.
          </p>

        </div>


        {/* ==============================
            FORMULÁRIO
        ============================== */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >


          {/* ==============================
              E-MAIL
          ============================== */}

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


          {/* ==============================
              SENHA
          ============================== */}

          <div className="form-group">

            <label htmlFor="senha">
              Senha
            </label>


            <div
              style={{
                position: 'relative'
              }}
            >

              <input
                type={
                  mostrarSenha
                    ? 'text'
                    : 'password'
                }
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                required
                style={{
                  paddingRight: '45px'
                }}
              />


              <button
                type="button"

                onClick={() =>
                  setMostrarSenha(
                    (anterior) =>
                      !anterior
                  )
                }

                aria-label={
                  mostrarSenha
                    ? 'Ocultar senha'
                    : 'Visualizar senha'
                }

                title={
                  mostrarSenha
                    ? 'Ocultar senha'
                    : 'Visualizar senha'
                }

                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  width: '24px',
                  height: '24px',

                  padding: 0,

                  border: 'none',
                  background: 'transparent',

                  color: '#64748b',

                  cursor: 'pointer'
                }}
              >

                {mostrarSenha ? (

                  <EyeOff
                    size={18}
                    strokeWidth={2}
                  />

                ) : (

                  <Eye
                    size={18}
                    strokeWidth={2}
                  />

                )}

              </button>

            </div>

          </div>


          {/* ==============================
              OPÇÕES
          ============================== */}

          <div className="login-options">

            <label>

              <input
                type="checkbox"
              />

              Lembrar de mim

            </label>


            <a
              href="#"

              onClick={(event) =>
                event.preventDefault()
              }
            >
              Esqueci minha senha
            </a>

          </div>


          {/* ==============================
              BOTÃO LOGIN
          ============================== */}

          <button
            type="submit"
            className="login-button"
          >
            Entrar
          </button>

        </form>


        {/* ==============================
            RODAPÉ
        ============================== */}

        <div className="login-footer">

          <p>
            Ainda não possui uma conta?
          </p>


          <button
            className="register-link"
            onClick={onCadastro}
          >
            Criar minha conta
          </button>


          <button
            className="back-link"
            onClick={onVoltar}
          >

            <ArrowLeft
              size={16}
              strokeWidth={2.2}
            />

            Voltar para o início

          </button>

        </div>


      </div>

    </div>

  )

}

export default Login