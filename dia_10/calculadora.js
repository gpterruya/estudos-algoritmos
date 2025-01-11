function validarEntrada() {
    const num1 = document.getElementById("numero1").value;
    const num2 = document.getElementById("numero2").value;

    if (num1 === "" || num2 === "") {
        document.getElementById("resultado").innerText = "Erro: Preencha ambos os campos.";
        return false;
    }

    if (isNaN(num1) || isNaN(num2)) {
        document.getElementById("resultado").innerText = "Erro: Por favor, insira números válidos.";
        return false;
    }

    return true;
}

document.getElementById("somar").addEventListener("click", function () {
    if (!validarEntrada()) return;
    const num1 = parseFloat(document.getElementById("numero1").value);
    const num2 = parseFloat(document.getElementById("numero2").value);
    const resultado = num1 + num2;

    document.getElementById("resultado").innerText = `O resultado é: ${resultado}`;
});

document.getElementById("subtrair").addEventListener("click", function () {
    if (!validarEntrada()) return;
    const num1 = parseFloat(document.getElementById("numero1").value);
    const num2 = parseFloat(document.getElementById("numero2").value);
    const resultado = num1 - num2;

    document.getElementById("resultado").innerText = `O resultado é: ${resultado}`;
});

document.getElementById("multiplicar").addEventListener("click", function () {
    if (!validarEntrada()) return;
    const num1 = parseFloat(document.getElementById("numero1").value);
    const num2 = parseFloat(document.getElementById("numero2").value);
    const resultado = num1 * num2;

    document.getElementById("resultado").innerText = `O resultado é: ${resultado}`;
});

document.getElementById("dividir").addEventListener("click", function () {
    if (!validarEntrada()) return;
    const num1 = parseFloat(document.getElementById("numero1").value);
    const num2 = parseFloat(document.getElementById("numero2").value);
    if (num2 === 0) {
        document.getElementById("resultado").innerText = "Erro: Divisão por zero não é permitida.";
    } else {
        const resultado = num1 / num2;
        document.getElementById("resultado").innerText = `O resultado da divisão é: ${resultado}`;
    }

    document.getElementById("resultado").innerText = `O resultado é: ${resultado}`;
});