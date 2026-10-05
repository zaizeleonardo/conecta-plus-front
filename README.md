# Conecta+ Frontend

Frontend do **Conecta+**, projeto final desenvolvido no Programa Transforma Futuros – Recode.

A aplicação foi desenvolvida em ReactJS com Vite e integra-se à API Java/Spring Boot do projeto.

## 🎯 Proposta

O Conecta+ ajuda profissionais a entender suas competências, encontrar oportunidades e identificar quais habilidades podem ser desenvolvidas para aumentar sua compatibilidade com uma vaga.

Para empresas, a plataforma permite publicar e administrar vagas e visualizar candidatos e suas competências.

## 🌱 ODS relacionadas

- **ODS 4 – Educação de Qualidade**
- **ODS 8 – Trabalho Decente e Crescimento Econômico**
- **ODS 10 – Redução das Desigualdades**

## 🛠️ Tecnologias

- ReactJS
- Vite
- JavaScript
- CSS
- Lucide React
- API REST

## 🧩 Principais recursos

### Candidato

- Cadastro e login
- Visualização de oportunidades
- Consulta de compatibilidade com vagas
- Identificação de competências encontradas e faltantes
- Cursos recomendados
- Candidatura a vagas
- Gestão das próprias competências
- Acompanhamento de candidaturas

### Empresa

- Cadastro como empresa
- Dashboard da empresa
- Criação de vagas
- Edição de vagas
- Exclusão de vagas
- Visualização de candidatos
- Visualização das competências dos candidatos

### Administrador

- Gestão de usuários
- Gestão de vagas
- Gestão de cursos

## 🧱 Componentização

O frontend utiliza páginas e componentes reutilizáveis, incluindo formulários e cards para as funcionalidades de vagas e cursos.

## 🔌 Integração com a API

A URL da API é centralizada em:

```text
src/config/api.js
```

Para desenvolvimento local, é possível utilizar a variável de ambiente:

```env
VITE_API_URL=http://localhost:8080
```

Em produção, a aplicação utiliza a API publicada no Railway.

## ▶️ Executando localmente

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

Execute o build de produção:

```bash
npm run build
```

## 🌐 Ambiente publicado

**Aplicação:** https://conecta-plus-front.vercel.app

**API:** https://conecta-plus-api-production.up.railway.app

## ✅ Validações realizadas

- Build de produção executado com sucesso
- Login validado
- Cadastro de candidato validado
- Cadastro de empresa validado
- Visualização de vagas validada
- Candidatura validada
- Diagnóstico de compatibilidade validado
- Gestão de vagas validada em produção
- Edição de vaga validada em produção
- Exclusão de vaga validada em produção
- Visualização de candidatos validada em produção

---

Projeto desenvolvido para fins acadêmicos no Programa Transforma Futuros – Recode.
