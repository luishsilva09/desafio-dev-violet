import clientPromise from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { validarCPF } from '@/utils/validarCPF'


export async function GET(req: NextRequest) {
    const client = await clientPromise
    const db = client.db('violet')
    const collection = db.collection('agricultores')

    const searchParams = req.nextUrl.searchParams

    const nome = searchParams.get('nome')?.toLowerCase()
    const cpf = searchParams.get('cpf')
    const ativo = searchParams.get('ativo')

    const filtros: any = {}

    if (nome) {
        filtros.fullName = { $regex: nome, $options: 'i' }
    }

    if (cpf) {
        filtros.cpf = { $regex: cpf }
    }

    if (ativo === 'true') {
        filtros.active = true
    } else if (ativo === 'false') {
        filtros.active = false
    }

    const data = await collection.find(filtros).toArray()

    return NextResponse.json(data)
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {cpf} = body
        const client = await clientPromise
        const db = client.db('violet')
        const colecao = db.collection('agricultores')
        if (!validarCPF(cpf)) {
            return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
        }
        const existente = await colecao.findOne({ cpf })
        if(existente){
            return NextResponse.json(
                { error: 'CPF já cadastrado' },
                { status: 401 }
            )
        }
        const resultado = await colecao.insertOne(body)

        return NextResponse.json({ ok: true, id: resultado.insertedId })
    } catch (e) {
        return NextResponse.json({ error: 'Erro ao inserir' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID ausente' }, { status: 400 })

    const client = await clientPromise
    const db = client.db('violet')

    // Busca o agricultor pelo ID
    const agricultor = await db.collection('agricultores').findOne({ _id: new ObjectId(id) })

    if (!agricultor) {
        return NextResponse.json({ error: 'Agricultor não encontrado' }, { status: 404 })
    }

    // Validação: só permite deletar se active for false
    if (agricultor.active) {
        return NextResponse.json({ error: 'Não é permitido deletar agricultor ativo' }, { status: 403 })
    }

    // Executa a exclusão
    await db.collection('agricultores').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest) {
    const client = await clientPromise
    const db = client.db('violet')
    const collection = db.collection('agricultores')

    const body = await req.json()

    const { _id, fullName, birthDate, phone, active } = body

    if (!_id || !fullName || !birthDate || !phone) {
        return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    await collection.updateOne(
        { _id: new ObjectId(_id) },
        {
            $set: {
                fullName,
                birthDate,
                phone,
                active
            }
        }
    )

    return NextResponse.json({ message: 'Atualizado com sucesso' })
}