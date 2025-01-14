const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB!");

        const db = client.db("meuBanco");
        const colecao = db.collection("usuarios");

        // Inserir um documento
        const resultado = await colecao.insertOne({ nome: "Ana", idade: 22 });
        console.log("Documento inserido:", resultado.insertedId);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);