from flask import Flask, jsonify, request

app = Flask(__name__)

# Base de dados simulada
usuarios = [
    {"id": 1, "nome": "Ana", "idade": 25},
    {"id": 2, "nome": "João", "idade": 30},
]

# Rota para listar usuários
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    return jsonify(usuarios)

# Rota para adicionar um usuário
@app.route("/usuarios", methods=["POST"])
def adicionar_usuario():
    novo_usuario = request.json
    usuarios.append(novo_usuario)
    return jsonify({"mensagem": "Usuário adicionado com sucesso!"}), 201

# Rota para deletar um usuário
@app.route("/usuarios/<int:id>", methods=["DELETE"])
def deletar_usuario(id):
    global usuarios
    usuarios = [u for u in usuarios if u["id"] != id]
    return jsonify({"mensagem": "Usuário deletado com sucesso!"})

if __name__ == "__main__":
    app.run(debug=True)