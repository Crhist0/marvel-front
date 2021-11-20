const api = axios.create({
  baseURL: "https://api-backend-marvel-crhist0.herokuapp.com",
});

const params = new URLSearchParams(window.location.search);

function listaPersonagens() {
  let page = params.has("page") ? params.get("page") : "1";
  let name = document.getElementById("searchByName").value;
  api
    .get("/", {
      params: { page, name },
    })
    .then((result) => {
      console.log(result.data);

      const lista = result.data.data; // test page
      const searchResults = result.data.searchResults;
      const detailsPageResults = result.data.detailsPageResults;
      const copy = result.data.copy; // mensagem do final da pagina

      atualizaTabela("#searchCaracter", lista, copy, searchResults, detailsPageResults);
    })
    .catch((err) => {
      console.log("erro?");
      console.log(err);
      console.log(err.request);
      console.log(err.result);
    });
}
function AllListCharacter(numero, idHtmlTag) {
  let page = params.has("page") ? params.get("page") : numero;
  let name = document.getElementById("searchByName").value;
  api
    .get("/", {
      params: { page, name },
    })
    .then((result) => {
      console.log(result.data);

      const lista = result.data.data; // test page
      const searchResults = result.data.searchResults;
      const detailsPageResults = result.data.detailsPageResults;
      const copy = result.data.copy; // mensagem do final da pagina

      atualizaTabela(idHtmlTag, lista, copy, searchResults, detailsPageResults);
    })
    .catch((err) => {
      console.log("erro?");
      console.log(err);
      console.log(err.request);
      console.log(err.result);
    });
}

function atualizaTabela(id, lista, copy, searchResults, detailsPageResults) {
  let list = document.querySelector(id);
  list.style.display = "block";
  //   const tbodyLista = document.querySelector("#searchCaracter > div");
  console.log(detailsPageResults);
  list.innerHTML = "";

  for (const personagem of lista) {
    let thumb = personagem.thumbnail;
    // link para página de detalhes, em geral é a mesma que a comiclink page
    let details =
      personagem.details == -1 || personagem.details == ""
        ? ""
        : `<p><a href="${personagem.details}">details</a></p>`;
    // link para página wiki quando possui
    let wiki =
      personagem.wiki == -1 || personagem.wiki == ""
        ? ""
        : `<p><a href="${personagem.wiki}">wiki</a></p>`;
    // link para página de "comiclink", em geral é a mesma da de details
    let comiclink =
      personagem.comiclink == -1 || personagem.comiclink == ""
        ? ""
        : `<p><a href="${personagem.comiclink}">comiclink</a></p>`;

    if (
      personagem.thumbnail ==
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ||
      personagem.thumbnail == `http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif` ||
      personagem.thumbnail == "insira aqui outra imagem para exceção"
    ) {
      // se for as imagens de "not found", mostra a logo marvel abaixo
      thumb = `https://i.ibb.co/vLhYShQ/Screenshot-1.png`;
    }
    list.innerHTML += `
                
        <div class="card" style="width: 300px; height: 700px">
        <a href="#" target="blank">
            <img   src="${thumb}" class="card-img-top" alt="${personagem.name}"></a>
            <div class="card-body scrollable-element" style="overflow: auto;">
                <p class="card-text">
                    <strong>ID:</strong> ${personagem.id}<br>
                    <strong>Name:</strong> ${personagem.name}<br>
                    ${personagem.lastModified}<br>
                    <strong>Description:</strong> 
                    ${
                      personagem.description == null
                        ? "Description not found."
                        : personagem.description
                    }<br>
                    <strong>Name:</strong> ${personagem.name}<br>
                </p>
                <div> 
        ${details} 
        ${wiki}
        ${comiclink}
        </div>
            </div>
        </div>
        

        

        </li>`;
  }
  // console.log(searchResults);

  //   document.getElementById("footer").innerHTML = copy;
}
