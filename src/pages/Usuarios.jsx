import { useEffect, useState } from 'react'
import API_URL from '../config/api'

function Usuarios({ onVoltar, onSair }) {

  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)

  const [modoEdicao, setModoEdicao] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cidade: '',
    objetivoProfissional: ''
  })

  // ==========================================
  // CARREGAR USUÁRIOS
  // ==========================================

  async function carregarUsuarios() {

    try {

      setCarregando(true)

      const resposta = await fetch(`${API_URL}/usuarios`)

      if (!resposta.ok) {
        alert('Não foi possível carregar os usuários.')
        return
      }

      const dados = await resposta.json()

      setUsuarios(dados)

    } catch (erro) {

      console.error('Erro ao carregar usuários:', erro)

      alert(
        'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
      )

    } finally {

      setCarregando(false)

    }
  }

  // ==========================================
  // CARREGAR AO ABRIR A PÁGINA
  // ==========================================

  useEffect(() => {

    carregarUsuarios()

  }, [])

  // ==========================================
  // ALTERAR CAMPOS DO FORMULÁRIO
  // ==========================================

  function handleChange(event) {

    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

  }

  // ==========================================
  // LIMPAR FORMULÁRIO
  // ==========================================

  function limparFormulario() {

    setFormulario({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      cidade: '',
      objetivoProfissional: ''
    })

    setModoEdicao(false)
    setUsuarioEditando(null)

  }

  // ==========================================
  // CRIAR / ATUALIZAR USUÁRIO
  // ==========================================

  async function salvarUsuario(event) {

    event.preventDefault()

    try {

      let resposta

      // ======================================
      // ATUALIZAÇÃO
      // ======================================

      if (modoEdicao) {

        const usuarioAtualizado = {
          nome: formulario.nome,
          email: formulario.email,
          telefone: formulario.telefone,
          cidade: formulario.cidade,
          objetivoProfissional:
            formulario.objetivoProfissional
        }

        resposta = await fetch(
          `${API_URL}/usuarios/${usuarioEditando.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioAtualizado)
          }
        )

      }

      // ======================================
      // CRIAÇÃO
      // ======================================

      else {

        const novoUsuario = {
          nome: formulario.nome,
          email: formulario.email,
          senha: formulario.senha,
          telefone: formulario.telefone,
          cidade: formulario.cidade,
          objetivoProfissional:
            formulario.objetivoProfissional
        }

        resposta = await fetch(
          `${API_URL}/usuarios`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
          }
        )

      }

      // ======================================
      // TRATAMENTO DE ERRO
      // ======================================

      if (!resposta.ok) {

        let mensagem =
          'Não foi possível salvar o usuário.'

        try {

          const erro = await resposta.json()

          if (erro.mensagem) {
            mensagem = erro.mensagem
          }

        } catch {
          // Mantém a mensagem padrão
        }

        alert(mensagem)

        return
      }

      // ======================================
      // SUCESSO
      // ======================================

      alert(
        modoEdicao
          ? 'Usuário atualizado com sucesso!'
          : 'Usuário criado com sucesso!'
      )

      limparFormulario()

      await carregarUsuarios()

    } catch (erro) {

      console.error('Erro ao salvar usuário:', erro)

      alert(
        'Não foi possível conectar ao servidor.'
      )

    }

  }

  // ==========================================
  // EDITAR USUÁRIO
  // ==========================================

  function editarUsuario(usuario) {

    setModoEdicao(true)
    setUsuarioEditando(usuario)

    setFormulario({
      nome: usuario.nome || '',
      email: usuario.email || '',
      senha: '',
      telefone: usuario.telefone || '',
      cidade: usuario.cidade || '',
      objetivoProfissional:
        usuario.objetivoProfissional || ''
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }

  // ==========================================
  // EXCLUIR USUÁRIO
  // ==========================================

  async function excluirUsuario(usuario) {

    const confirmar = window.confirm(
      `Deseja realmente excluir o usuário "${usuario.nome}"?`
    )

    if (!confirmar) {
      return
    }

    try {

      const resposta = await fetch(
        `${API_URL}/usuarios/${usuario.id}`,
        {
          method: 'DELETE'
        }
      )

      if (!resposta.ok) {

        alert(
          'Não foi possível excluir o usuário.'
        )

        return
      }

      alert('Usuário excluído com sucesso!')

      await carregarUsuarios()

    } catch (erro) {

      console.error(
        'Erro ao excluir usuário:',
        erro
      )

      alert(
        'Não foi possível conectar ao servidor.'
      )

    }

  }

  // ==========================================
  // TELA
  // ==========================================

  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7fb',
        paddingBottom: '60px'
      }}
    >

      {/* =====================================
          CABEÇALHO
      ====================================== */}

      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '18px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >

        <div
          style={{
            fontSize: '24px',
            fontWeight: '800'
          }}
        >
          CONECTA<span style={{ color: '#2563eb' }}>+</span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px'
          }}
        >

          <button
            onClick={onVoltar}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              cursor: 'pointer'
            }}
          >
            ← Voltar
          </button>

          <button
            onClick={onSair}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#dc2626',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>

        </div>

      </header>


      {/* =====================================
          CONTEÚDO
      ====================================== */}

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px'
        }}
      >

        <div
          style={{
            marginBottom: '30px'
          }}
        >

          <span
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#2563eb',
              letterSpacing: '1px'
            }}
          >
            ADMINISTRAÇÃO
          </span>

          <h1
            style={{
              margin: '8px 0',
              fontSize: '32px'
            }}
          >
            Gerenciamento de usuários
          </h1>

          <p
            style={{
              color: '#6b7280'
            }}
          >
            Crie, consulte, edite e remova usuários
            cadastrados no Conecta+.
          </p>

        </div>


        {/* ===================================
            FORMULÁRIO
        ==================================== */}

        <section
          style={{
            background: '#ffffff',
            padding: '28px',
            borderRadius: '14px',
            marginBottom: '30px',
            boxShadow:
              '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}
        >

          <h2
            style={{
              marginTop: 0
            }}
          >
            {modoEdicao
              ? 'Editar usuário'
              : 'Novo usuário'}
          </h2>

          <form onSubmit={salvarUsuario}>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: '18px'
              }}
            >

              {/* NOME */}

              <div>

                <label>Nome</label>

                <input
                  type="text"
                  name="nome"
                  value={formulario.nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo"
                  style={estiloInput}
                />

              </div>


              {/* E-MAIL */}

              <div>

                <label>E-mail</label>

                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={handleChange}
                  required
                  placeholder="E-mail"
                  style={estiloInput}
                />

              </div>


              {/* SENHA */}

              {!modoEdicao && (

                <div>

                  <label>Senha</label>

                  <input
                    type="password"
                    name="senha"
                    value={formulario.senha}
                    onChange={handleChange}
                    required
                    minLength="8"
                    placeholder="Mínimo 8 caracteres"
                    style={estiloInput}
                  />

                </div>

              )}


              {/* TELEFONE */}

              <div>

                <label>Telefone</label>

                <input
                  type="text"
                  name="telefone"
                  value={formulario.telefone}
                  onChange={handleChange}
                  required
                  placeholder="Telefone"
                  style={estiloInput}
                />

              </div>


              {/* CIDADE */}

              <div>

                <label>Cidade</label>

                <input
                  type="text"
                  name="cidade"
                  value={formulario.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Cidade"
                  style={estiloInput}
                />

              </div>


              {/* OBJETIVO */}

              <div>

                <label>Objetivo profissional</label>

                <input
                  type="text"
                  name="objetivoProfissional"
                  value={formulario.objetivoProfissional}
                  onChange={handleChange}
                  required
                  placeholder="Ex.: Desenvolvedor Backend Java"
                  style={estiloInput}
                />

              </div>

            </div>


            {/* BOTÕES */}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px'
              }}
            >

              <button
                type="submit"
                style={{
                  padding: '12px 22px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {modoEdicao
                  ? 'Salvar alterações'
                  : 'Criar usuário'}
              </button>


              {modoEdicao && (

                <button
                  type="button"
                  onClick={limparFormulario}
                  style={{
                    padding: '12px 22px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

              )}

            </div>

          </form>

        </section>


        {/* ===================================
            LISTA
        ==================================== */}

        <section
          style={{
            background: '#ffffff',
            padding: '28px',
            borderRadius: '14px',
            boxShadow:
              '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >

            <h2
              style={{
                margin: 0
              }}
            >
              Usuários cadastrados
            </h2>

            <span
              style={{
                color: '#6b7280'
              }}
            >
              {usuarios.length} usuário(s)
            </span>

          </div>


          {carregando ? (

            <p>
              Carregando usuários...
            </p>

          ) : usuarios.length === 0 ? (

            <p>
              Nenhum usuário cadastrado.
            </p>

          ) : (

            <div
              style={{
                overflowX: 'auto'
              }}
            >

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}
              >

                <thead>

                  <tr>

                    <th style={estiloCelulaCabecalho}>
                      ID
                    </th>

                    <th style={estiloCelulaCabecalho}>
                      Nome
                    </th>

                    <th style={estiloCelulaCabecalho}>
                      E-mail
                    </th>

                    <th style={estiloCelulaCabecalho}>
                      Cidade
                    </th>

                    <th style={estiloCelulaCabecalho}>
                      Objetivo
                    </th>

                    <th style={estiloCelulaCabecalho}>
                      Ações
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {usuarios.map((usuario) => (

                    <tr key={usuario.id}>

                      <td style={estiloCelula}>
                        {usuario.id}
                      </td>

                      <td style={estiloCelula}>
                        {usuario.nome}
                      </td>

                      <td style={estiloCelula}>
                        {usuario.email}
                      </td>

                      <td style={estiloCelula}>
                        {usuario.cidade}
                      </td>

                      <td style={estiloCelula}>
                        {usuario.objetivoProfissional}
                      </td>

                      <td style={estiloCelula}>

                        <div
                          style={{
                            display: 'flex',
                            gap: '8px'
                          }}
                        >

                          <button
                            onClick={() =>
                              editarUsuario(usuario)
                            }
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '6px',
                              background: '#2563eb',
                              color: '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              excluirUsuario(usuario)
                            }
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '6px',
                              background: '#dc2626',
                              color: '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            Excluir
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>

  )
}


// ==========================================
// ESTILOS
// ==========================================

const estiloInput = {
  width: '100%',
  padding: '11px 12px',
  marginTop: '7px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  boxSizing: 'border-box',
  fontSize: '14px'
}

const estiloCelulaCabecalho = {
  textAlign: 'left',
  padding: '13px',
  borderBottom: '2px solid #e5e7eb',
  fontSize: '13px'
}

const estiloCelula = {
  padding: '13px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '14px'
}

export default Usuarios