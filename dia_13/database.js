const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // URL do MongoDB
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB");
        return client.db("meuapp"); // Nome do banco de dados
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB:", err);
        process.exit(1);
    }
}

module.exports = connectToDatabase;
