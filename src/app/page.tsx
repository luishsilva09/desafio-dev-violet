'use client'

import { useEffect, useState } from 'react'

type Agricultores = {
  _id: string
  fullName: string
  cpf: string
  birthDate: string
  phone: string
  active: boolean
}

export default function Home() {
  const [agricultores, setAgricultores] = useState<Agricultores[]>([])
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCpf, setFiltroCpf] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos')
  const [editando, setEditando] = useState<Agricultores | null>(null)


  useEffect(() => {
    fetch('/api/agricultor')
      .then(res => res.json())
      .then(data => setAgricultores(data))
  }, [])

  const deletarUsuario = async (id: string) => {
    const confirm = window.confirm('Deseja realmente deletar este usuário?')
    if (!confirm) return

    const res = await fetch(`/api/agricultor?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setAgricultores(prev => prev.filter(user => user._id !== id))
    }
  }

  const agricultoresFiltrados = agricultores.filter(agricultor => {
    const nomeMatch = agricultor.fullName.toLowerCase().includes(filtroNome.toLowerCase())
    const cpfMatch = agricultor.cpf.includes(filtroCpf)
    const statusMatch =
      filtroAtivo === 'todos'
        ? true
        : filtroAtivo === 'ativos'
          ? agricultor.active
          : !agricultor.active

    return nomeMatch && cpfMatch && statusMatch
  })
  const salvarEdicao = async () => {
    if (!editando) return
    const res = await fetch('/api/agricultor', {
      method: 'PUT',
      body: JSON.stringify(editando),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      setAgricultores(prev =>
        prev.map(a => (a._id === editando._id ? editando : a))
      )
      setEditando(null)
    } else {
      alert('Erro ao salvar')
    }
  }

  return (
    <main className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Agricultores Cadastrados</h1>

      {/* Filtros */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Filtrar por CPF"
          value={filtroCpf}
          onChange={e => setFiltroCpf(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={filtroAtivo}
          onChange={e => setFiltroAtivo(e.target.value as any)}
          className="border p-2 rounded w-full"
        >
          <option value="todos">Todos</option>
          <option value="ativos">Apenas Ativos</option>
          <option value="inativos">Apenas Inativos</option>
        </select>
      </div>

      {agricultoresFiltrados.length === 0 ? (
        <p>Nenhum agricultor encontrado.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">CPF</th>
              <th className="p-2 border">Nascimento</th>
              <th className="p-2 border">Telefone</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {agricultoresFiltrados.map(agricultor => (
              <tr key={agricultor._id} className="border-t">
                <td className="p-2">{agricultor.fullName}</td>
                <td className="p-2">{agricultor.cpf}</td>
                <td className="p-2">{agricultor.birthDate}</td>
                <td className="p-2">{agricultor.phone}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setEditando(agricultor)}
                  >
                    Editar
                  </button>
                  {!agricultor.active && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deletarUsuario(agricultor._id)}
                    >
                      Deletar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Editar Agricultor</h2>

            <div className="space-y-4">
              <input
                type="text"
                className="border p-2 w-full"
                placeholder="Nome"
                value={editando.fullName}
                onChange={e =>
                  setEditando({ ...editando, fullName: e.target.value })
                }
              />
              <input
                type="text"
                className="border p-2 w-full"
                placeholder="CPF"
                value={editando.cpf}
                disabled
              />
              <input
                type="date"
                className="border p-2 w-full"
                value={editando.birthDate}
                onChange={e =>
                  setEditando({ ...editando, birthDate: e.target.value })
                }
              />
              <input
                type="text"
                className="border p-2 w-full"
                placeholder="Telefone"
                value={editando.phone}
                onChange={e =>
                  setEditando({ ...editando, phone: e.target.value })
                }
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editando.active}
                  onChange={e =>
                    setEditando({ ...editando, active: e.target.checked })
                  }
                />
                Ativo
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setEditando(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={salvarEdicao}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
