const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const connectToDatabase = require("./database");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Rota de cadastro
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha, role } = req.body;

    const db = await connectToDatabase();
    const usuarios = db.collection("usuarios");

    // Verificar se o usuário já existe
    const usuarioExistente = await usuarios.findOne({ email });
    if (usuarioExistente) {
        return res.status(400).json({ mensagem: "Usuário já cadastrado" });
    }

    // Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Salvar o usuário no banco de dados
    const novoUsuario = { nome, email, senha: senhaHash, role: "usuario" };
    await usuarios.insertOne(novoUsuario);

    res.status(201).json({ mensagem: "Usuário registrado com sucesso" });
});


// Rota de login
const refreshTokens = []; // Armazena refresh tokens (pode ser substituído por um banco de dados)

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const db = await connectToDatabase();
    const usuarios = db.collection("usuarios");

    // Buscar o usuário no banco de dados
    const usuario = await usuarios.findOne({ email });
    if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Validar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    // Gerar o token JWT
    const token = jwt.sign(
        { id: usuario._id, role: usuario.role },
        "chave-secreta",
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: usuario.email },
        "chave-secreta-refresh",
        { expiresIn: "7d" }
    );

    await usuarios.updateOne(
        { _id: usuario._id },
        { $set: { refreshToken } }
    );

    res.json({ mensagem: "Login bem-sucedido", token });
});

app.post("/token/renovar", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ mensagem: "Refresh token é obrigatório" });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ mensagem: "Refresh token inválido" });
    }

    try {
        const usuario = jwt.verify(refreshToken, "chave-secreta-refresh");

        // Gerar novo access token
        const newAccessToken = jwt.sign(
            { id: usuario.id, role: usuario.role },
            "chave-secreta",
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ mensagem: "Refresh token inválido ou expirado" });
    }
});



// Rota protegida
app.get("/protegido", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ mensagem: "Acesso negado" });
    }

    try {
        const usuario = jwt.verify(token, "chave-secreta");
        res.json({ mensagem: "Acesso permitido", usuario });
    } catch (err) {
        res.status(403).json({ mensagem: "Token inválido ou expirado" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});