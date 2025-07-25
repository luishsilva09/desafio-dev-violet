'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validarCPF } from '@/utils/validarCPF'

export default function Agricultor() {
    const [form, setForm] = useState({
        fullName: '',
        cpf: '',
        birthDate: '',
        phone: '',
        active: true
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        if (!validarCPF(form.cpf)) {
            setError('CPF inválido.')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/agricultor', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Erro ao cadastrar.')
            } else {
                setSuccess('Cadastro realizado com sucesso!')
                setForm({
                    fullName: '',
                    cpf: '',
                    birthDate: '',
                    phone: '',
                    active: true
                })
                setTimeout(() => {
                    router.push('/')
                }, 1000)
            }
        } catch (err) {
            setError('Erro de rede ou servidor.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4"
        >
            <h2 className="text-xl font-semibold mb-4">Cadastro de Agricultor</h2>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div>
                <label className="block text-sm font-medium">Nome completo</label>
                <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="mt-1 w-full border px-3 py-2 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">CPF</label>
                <input
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="mt-1 w-full border px-3 py-2 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Data de nascimento</label>
                <input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                    className="mt-1 w-full border px-3 py-2 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Telefone</label>
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(11) 91234-5678"
                    className="mt-1 w-full border px-3 py-2 rounded-md"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
                {loading ? 'Enviando...' : 'Enviar'}
            </button>
        </form>
    )
}
