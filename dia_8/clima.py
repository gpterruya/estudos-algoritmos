from flask import Flask, jsonify, request, render_template
import requests
import time
import re

app = Flask(__name__)
API_KEY = "a8dfa9fb09b70fef84f3790c753a463d"

# Cache em memória
cache = {}
CACHE_TIMEOUT = 300  # Tempo em segundos (5 minutos)

def validar_cidade(cidade):
    # Verifica se a entrada está vazia ou contém caracteres inválidos
    if not cidade or not re.match(r'^[a-zA-Z\s-]+$', cidade):
        return False
    return True

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/clima/<cidade>", methods=["GET"])
def consultar_clima(cidade):

    if not validar_cidade(cidade):
        return jsonify({"erro": "Nome de cidade inválido. Por favor, insira um nome válido."}), 400
    
    agora = time.time()  # Timestamp atual
    
    # Verificar se a cidade está no cache e se os dados ainda são válidos
    if cidade in cache:
        dados_cache = cache[cidade]
        if agora - dados_cache["timestamp"] < CACHE_TIMEOUT:
            return jsonify(dados_cache["dados"])  # Retorna os dados do cache

    # Fazer uma nova consulta à API se não estiver no cache ou o cache expirou
    url = f"http://api.openweathermap.org/data/2.5/weather?q={cidade}&appid={API_KEY}&units=metric&lang=pt_br"
    resposta = requests.get(url)
    if resposta.status_code == 200:
        dados = resposta.json()
        clima = {
            "cidade": dados["name"],
            "descricao": dados["weather"][0]["description"],
            "temperatura": dados["main"]["temp"],
            "umidade": dados["main"]["humidity"],
            "velocidade do vento": dados["wind"]["speed"],
        }
        # Salvar no cache
        cache[cidade] = {
            "dados": clima,
            "timestamp": agora,
        }
        return jsonify(clima)
    else:
        return jsonify({"erro": "Não foi possível obter o clima."}), 404

if __name__ == "__main__":
    app.run(debug=True)