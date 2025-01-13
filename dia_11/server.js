const http = require("http");
const saudacao = require("./meuModulo");

console.log(saudacao("Aluno"));

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Olá, mundo! Este é meu primeiro servidor.");
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
