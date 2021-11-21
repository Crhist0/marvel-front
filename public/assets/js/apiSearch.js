const api = axios.create({
  baseURL: "https://api-backend-marvel-crhist0.herokuapp.com",
});

const params = new URLSearchParams(window.location.search);

function listaPersonagens() {
  let page = params.has("page") ? params.get("page") : "1";
  let name = document.getElementById("searchByName").value;
  let limit = 25;
  api
    .get("/", {
      params: { page, limit, name },
    })
    .then((result) => {
      console.log(result.data);

      const lista = result.data.data; // test page
      const searchResults = result.data.searchResults;
      const detailsPageResults = result.data.detailsPageResults;
      const copy = result.data.copy; // mensagem do final da pagina

      atualizaTabela("#searchCaracter", lista, detailsPageResults);
    })
    .catch((err) => {
      console.log("erro?");
      console.log(err);
      console.log(err.request);
      console.log(err.result);
    });
}

// function changePage(num) {
//   window.location.href = `http://127.0.0.1:5501/public/searchResults.html?page=${num}`; // trocar para o link do heroku
// }
function atualizaTabela(id, lista, detailsPageResults) {
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
        <div class="item m-4">
            <div class="card clickHere d-flex justify-content-center" style="width: 15rem; height: 15.2rem">
                
                    <img   src="${thumb}" class="card-img-top" alt="${personagem.name}" style="height: 15rem">
                
                    <div class="card-body d-flex align-items-center justify-content-center scrollable-element opacity_0_1" style="overflow: auto;" >
                        <a href="http://127.0.0.1:5501/public/results.html?page=${personagem.id}" > 
                            <p class="card-text" >
                            <strong>ID:</strong> ${personagem.id}<br>
                            <strong>Name:</strong> ${personagem.name}<br>
                           Comics: ${personagem.comics}<br>
                           Series: ${personagem.seriesList.length}<br>
                            
                            </p>
                        </a>
                    </div>
            </div>
        </div>`;
  }

  // console.log(searchResults);

  //   document.getElementById("footer").innerHTML = copy;
}
