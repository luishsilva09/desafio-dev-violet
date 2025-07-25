# 🌱 Desafio dev violet

Este projeto é uma aplicação full-stack utilizando **Next.js** com **API Routes** integradas ao **MongoDB**. Os dados são gerenciados via rotas da API (`/api`) dentro do próprio projeto.

---
## Podendo ser usado a versao em deploy: 
https://desafio-dev-violet.vercel.app/
## 🚀 Instruções para rodar o projeto localmente

### 🔧 Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: versão LTS)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ou MongoDB local)

### 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/desafio-dev-violet.git
cd seu-desafio-dev-violet.git

# Instale as dependências
npm install
```

# ⚙️ Variáveis de ambiente

```txt
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/database?retryWrites=true&w=majority
``` 

# ▶️ Rodar o projeto

```bash
npm run dev
```

O app estará disponível em: http://localhost:3000

# 🧱 Tecnologias utilizadas
- Next.js (App Router ou Pages Router)
- MongoDB
- Tailwind CSS (opcional)

# 📘 Documentação da API
Os endpoints da API estão em /app/api.

## 🔹 Exemplo: Agricultores (/api/agricultor)

### Lista de agricultores
```http
GET /api/agricultor
```
Retorna a lista de agricultores. Aceita filtros:

| Parâmetro | Tipo         | Descrição                |
| --------- | ------------ | ------------------------ |
| `nome`    | `string`     | Filtro parcial por nome  |
| `cpf`     | `string`     | Filtro parcial por CPF   |
| `ativo`   | `true/false` | Filtrar por status ativo |

### Criar novo agricultor

``` http
POST /api/agricultor
```
Cria um novo agricultor.
```json
{
  "fullName": "João Silva", //Obrigatório
  "cpf": "12345678901", //Obrigatório único
  "birthDate": "2000-01-01", //opcional
  "phone": "11999999999",//opcional
  "active": true //Default true
}
``` 
### Editar agricultor
```http
PUT /api/agricultor
```
Atualiza um agricultor existente (exceto CPF).
```json
{
  "_id": "ID do MongoDB",
  "fullName": "Novo Nome",
  "birthDate": "1999-12-31",
  "phone": "11988888888",
  "active": false
}
```

### Deletar agricultor
```http
DELETE /api/agricultor?id=ID
```
Remove um agricultor com base no _id. Apenas se active for false

