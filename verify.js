// Obter a URL atual
const currentUrl = window.location.href;

// Verificar se a URL corresponde ao padrão desejado
if (/^https:\/\/pt\.khanacademy\.org\/profile\/me\/teacher\/.*/.test(currentUrl)) {
    console.log("URL corresponde ao padrão!");

    // Obter o elemento pelo XPath
    const xpath = "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/main/div/div[1]/div/div/div/div/div[1]/div[2]/div/span/span[1]";
    const element = document.evaluate(
        xpath, // O XPath
        document, // O documento no qual a busca será feita
        null, // Sem namespaces adicionais
        XPathResult.FIRST_ORDERED_NODE_TYPE, // Tipo de retorno desejado
        null // Sem resultados prévios
    ).singleNodeValue; // Obter o único valor do nó

    // Verificar se o elemento foi encontrado
    if (element) {
        console.log("Elemento encontrado:", element);
        console.log("Conteúdo do elemento:", element.textContent); // Exibir o texto do elemento
    } else {
        console.log("Elemento não encontrado com o XPath fornecido.");
    }
} else {
    console.log("URL não corresponde ao padrão desejado.");
}
