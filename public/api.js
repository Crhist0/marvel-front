const api = axios.create({
    baseURL: "https://api-backend-marvel-crhist0.herokuapp.com",
});

const params = new URLSearchParams(window.location.search);

let page = params.has("page") ? params.get("page") : "1";

function listaPersonagens() {
    let name = document.getElementById("searchByName").value;
    api.get("/", {
        params: { page, name },
    })
        .then((result) => {
            console.log(result.data);

            const lista = result.data.data;
            const searchResults = result.data.searchResults;
            // const detailsPageResults = result.data.detailsPageResults;
            const copy = result.data.copy;

            atualizaTabela(lista, copy, searchResults);
        })
        .catch((err) => {
            console.log("erro?");
            console.log(err);
            console.log(err.request);
            console.log(err.result);
        });
}

function atualizaTabela(lista, copy, searchResults) {
    let list = document.querySelector("#listaPersonagens");
    list.style.display = "block";
    const tbodyLista = document.querySelector("#listaPersonagens > tbody");

    tbodyLista.innerHTML = "";

    for (const personagem of lista) {
        let thumb = personagem.thumbnail;
        // link para página de detalhes, em geral é a mesma que a comiclink page
        let details = personagem.details == -1 || personagem.details == "" ? "" : `<p><a href="${personagem.details}">details</a></p>`;
        // link para página wiki quando possui
        let wiki = personagem.wiki == -1 || personagem.wiki == "" ? "" : `<p><a href="${personagem.wiki}">wiki</a></p>`;
        // link para página de "comiclink", em geral é a mesma da de details
        let comiclink = personagem.comiclink == -1 || personagem.comiclink == "" ? "" : `<p><a href="${personagem.comiclink}">comiclink</a></p>`;

        if (
            personagem.thumbnail == "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ||
            personagem.thumbnail == `http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif` ||
            personagem.thumbnail == "insira aqui outra imagem para exceção"
        ) {
            // se for as imagens de "not found", mostra a logo marvel abaixo
            thumb = `https://i.ibb.co/vLhYShQ/Screenshot-1.png`;
        }
        tbodyLista.innerHTML += `
        <tr>
        <td>${personagem.id}</td>
        <td>${personagem.name}</td>
        <td>${personagem.description}</td>
        <td>${personagem.lastModified}</td>
        <td> 
        ${details} 
        ${wiki}
        ${comiclink}
        </td>
        <td><img height="120" src="${thumb}"></td>
        </tr>

        `;
    }
    console.log(searchResults);

    document.getElementById("footer").innerHTML = copy;
}
