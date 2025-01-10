from flask import Flask, request, jsonify, render_template
from db import db
from models import Tarefa
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Criação do banco ao iniciar a aplicação
with app.app_context():
    if not os.path.exists("database.db"):
        db.create_all()

# Rotas

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/tarefas", methods=["POST"])
def criar_tarefa():
    dados = request.json
    if not dados.get("titulo"):
        return jsonify({"erro": "O campo 'titulo' é obrigatório."}), 400 
    nova_tarefa = Tarefa(titulo=dados["titulo"], descricao=dados.get("descricao", ""), status=dados.get("status", ""))
    db.session.add(nova_tarefa)
    db.session.commit()
    return jsonify({"mensagem": "Tarefa criada com sucesso!"}), 201

@app.route("/tarefas", methods=["GET"])
def listar_tarefas():
    # Parâmetros de paginação
    pagina = request.args.get("pagina", 1, type=int)  # Página atual (padrão: 1)
    tamanho = request.args.get("tamanho", 5, type=int)  # Tamanho da página (padrão: 5)

    # Consulta ao banco com limites
    tarefas_query = Tarefa.query.paginate(page=pagina, per_page=tamanho, error_out=False)

    # Formatar os resultados
    tarefas = [
        {"id": tarefa.id, "titulo": tarefa.titulo, "descricao": tarefa.descricao}
        for tarefa in tarefas_query.items
    ]

    # Retornar os dados paginados
    return jsonify({
        "tarefas": tarefas,
        "pagina_atual": tarefas_query.page,
        "total_paginas": tarefas_query.pages,
        "total_tarefas": tarefas_query.total,
        "tamanho_pagina": tarefas_query.per_page,
    })

@app.route("/tarefas/<int:id>", methods=["PUT"])
def atualizar_tarefa(id):
    tarefa = Tarefa.query.get(id)
    if not tarefa:
        return jsonify({"erro": "Tarefa não encontrada"}), 404
    dados = request.json
    tarefa.titulo = dados.get("titulo", tarefa.titulo)
    tarefa.descricao = dados.get("descricao", tarefa.descricao)
    db.session.commit()
    return jsonify({"mensagem": "Tarefa atualizada com sucesso!"})

@app.route("/tarefas/<int:id>", methods=["DELETE"])
def deletar_tarefa(id):
    tarefa = Tarefa.query.get(id)
    if not tarefa:
        return jsonify({"erro": "Tarefa não encontrada"}), 404
    db.session.delete(tarefa)
    db.session.commit()
    return jsonify({"mensagem": "Tarefa deletada com sucesso!"})

if __name__ == "__main__":
    app.run(debug=True)
