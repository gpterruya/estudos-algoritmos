document.getElementById("buscar").addEventListener("click", () => {
    const cidade = document.getElementById("cidade").value;
    const apiKey = "a8dfa9fb09b70fef84f3790c753a463d"; // Substitua pela sua chave da OpenWeather
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric`;
  
    axios.get(url)
      .then((response) => {
        const dados = response.data;
        const resultado = document.getElementById("resultado");
        resultado.innerHTML = `
          <p><strong>Cidade:</strong> ${dados.name}</p>
          <p><strong>Clima:</strong> ${dados.weather[0].description}</p>
          <p><strong>Temperatura:</strong> ${dados.main.temp}°C</p>
        `;
      })
      .catch((error) => {
        console.error(error);
        document.getElementById("resultado").innerHTML = "<p>Erro ao buscar os dados.</p>";
      });
  });
  