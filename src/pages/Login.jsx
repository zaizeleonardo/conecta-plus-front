import './Login.css'
import API_URL from '../config/api'

function Login({ onVoltar, onCadastro, onLoginSucesso }) {

  async function handleLogin(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const login = {
      email: formData.get('email'),
      senha: formData.get('senha')
    }

    try {

      const resposta = await fetch(
        `${API_URL}/usuarios/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(login)
        }
      )

      if (resposta.status === 401) {

        alert('E-mail ou senha inválidos.')

        return
      }

      if (!resposta.ok) {

        alert('Não foi possível realizar o login.')

        return
      }

      const usuario = await resposta.json()

      console.log('Usuário autenticado:', usuario)

      alert(`Bem-vindo, ${usuario.nome}!`)

      onLoginSucesso(usuario)

    } catch (erro) {

      console.error('Erro no login:', erro)

      alert(
        'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
      )
    }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">

          <div className="login-logo">
            CONECTA<span>+</span>
          </div>

          <h1>Bem-vindo de volta!</h1>

          <p>
            Entre na sua conta para acompanhar sua evolução profissional.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

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

          <div className="form-group">

            <label htmlFor="senha">
              Senha
            </label>

            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              required
            />

          </div>

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Lembrar de mim
            </label>

            <a
              href="#"
              onClick={(event) => event.preventDefault()}
            >
              Esqueci minha senha
            </a>

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Entrar
          </button>

        </form>

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
            ← Voltar para o início
          </button>

        </div>

      </div>

    </div>
  )
}

export default Login