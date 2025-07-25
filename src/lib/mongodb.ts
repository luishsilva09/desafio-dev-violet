import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!process.env.MONGODB_URI) {
    throw new Error('⚠️ Defina a variável de ambiente MONGODB_URI')
}

if (process.env.NODE_ENV === 'development') {
    // Usa cache global para evitar múltiplas conexões em dev
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // Em produção, sem cache global
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise
