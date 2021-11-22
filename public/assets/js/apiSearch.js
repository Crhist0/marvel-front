const api = axios.create({
    baseURL: "https://api-backend-marvel-crhist0.herokuapp.com",
});

const params = new URLSearchParams(window.location.search);

function searchInSearchResultsPage() {
    let name = document.getElementById("searchByName").value;
    document.getElementById("getSearchName").innerText = name;
    listaPersonagens(name);
}

function listaPersonagens(name, limit) {
    let pageC = document.getElementById("pageCounter").innerText;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // let page = urlParams.has("page") ? params.get("page") : "1";
    let url = urlParams.has("name");
    console.log(`
    url tem name? = ${url}`);
    if (url) {
        name = params.get("name");
        console.log(`
        name dentro do if: ${name}`);
        params.delete("name");
        name == null ? (name = document.getElementById("getSearchName").innerText) : (name = name);
        console.log(`
        name dentro do if depois de ver se é nulo: ${name}`);
    } else {
        name = document.getElementById("searchByName").value;
        console.log(`
        name dentro do else: ${name}`);
    }
    console.log(`
Nome antes da chamada da api
name: ${name}
`);
    // let page = Number(document.getElementById("pageCounter").innerText);
    limit = 15;
    api.get("/", {
        params: { page: pageC, name, limit },
    })
        .then((result) => {
            // console.log(result.data);

            const lista = result.data.data; // test page
            const searchResultQuantity = result.data.data2; // test page
            console.log(result);
            const searchResults = result.data.searchResults;
            const detailsPageResults = result.data.detailsPageResults;
            const copy = result.data.copy; // mensagem do final da pagina
            console.log(lista);

            atualizaTabela("#searchCaracter", lista, searchResultQuantity, detailsPageResults, name);
        })
        .catch((err) => {
            console.log("erro?");
            console.log(err);
            console.log(err.request);
            console.log(err.result);
        });
}

function atualizaTabela(id, lista, searchResultQuantity, detailsPageResults, name) {
    let list = document.querySelector(id);
    list.style.display = "block";
    //   const tbodyLista = document.querySelector("#searchCaracter > div");
    // console.log(detailsPageResults);
    list.innerHTML = "";
    // console.log(lista);
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
        let showing = Number(document.getElementById("").innerText) * 15;
        list.innerHTML += `
        <div class="item m-4">
            <div class="card clickHere d-flex justify-content-center" style="width: 15rem; ">
                
                    <img id="test1"  src="${thumb}" class="card-img-top" alt="${personagem.name}" style="height: 15rem;border-radius: 40px;">
                
                    <div class="card-body d-flex align-items-center justify-content-center scrollable-element opacity_0_1" style="overflow: auto;" >
                        <a href="https://api-frontend-marvel-crhist0.herokuapp.com/results.html?id=${personagem.id}" >  <!-- trocado link pelo do heroku!  -->
                            <p class="card-text" style="text-align:center;font-weight:normal;font-size:0.8rem;letter-spacing:2px" >
                            <!-- <strong>ID:</strong> ${personagem.id}<br>  -->
                            <strong>Name:</strong> ${personagem.name}<br>
                           Comics: ${personagem.comics}<br>
                           Series: ${personagem.seriesList.length}<br>
                            
                            </p>
                        </a>
                    </div>
            </div>
        </div>`;
    }
    document.getElementById("replaceNameSeparator").innerHTML = `${showing} of ${searchResultQuantity} Results for 
    "<span id="getSearchName">${name}</span>"`;
    document.getElementById("replaceNameSeparator").value = Math.ceil(searchResultQuantity / 15);
    window.location.assign("#replaceNameSeparator");

    let page = Number(document.getElementById("pageCounter").innerText);
    console.log(`Page: ${page}`);
    console.log(`quantidade de resultados: ${searchResultQuantity}`);
    let pageQuantity = Math.ceil(searchResultQuantity / 15);
    console.log(`Page quantity: ${pageQuantity}`);

    // console.log(`counter: ${counter}`);
    if (page <= 1) {
        document.getElementById("liBefore").style.display = "none";
    } else if (page > 1) {
        document.getElementById("liBefore").style.display = "block";
    }
    if (pageQuantity <= 1) {
        document.getElementById("liAfter").style.display = "none";
        document.getElementById("page-item1").style.display = "none";
    } else if (pageQuantity > 1) {
        document.getElementById("liAfter").style.display = "block";
        document.getElementById("page-item1").style.display = "block";
    }
    if (page >= pageQuantity) {
        document.getElementById("liAfter").style.display = "none";
    }
    // console.log(searchResults);

    //   document.getElementById("footer").innerHTML = copy;
}

function showResultsIfSearched() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const name = urlParams.get("name");
    urlParams.has("name") ? listaPersonagens(name) : console.log("how did you get in here?");
}

function changePageAfterBefore(x) {
    let page = Number(document.getElementById("pageCounter").innerText);
    console.log("pag era: " + page);
    page = page + x;
    console.log("agora pag é: " + page);
    document.getElementById("pageCounter").innerText = page;
    let pageQuantity = document.getElementById("replaceNameSeparator").value;
    console.log("pageQuantity: " + pageQuantity);
    if (page <= 1) {
        document.getElementById("liBefore").style.display = "none";
    } else if (page > 1) {
        document.getElementById("liBefore").style.display = "block";
    }
    if (pageQuantity <= 1) {
        document.getElementById("liAfter").style.display = "none";
        document.getElementById("page-item1").style.display = "none";
    } else if (pageQuantity > 1) {
        document.getElementById("liAfter").style.display = "block";
        document.getElementById("page-item1").style.display = "block";
    }
    if (page >= pageQuantity) {
        document.getElementById("liAfter").style.display = "none";
    }
    console.log(page);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    let limit = page * 15;
    let name = document.getElementById("getSearchName").innerText;
    console.log(`
    Antes de listar
    limit: ${limit}
    name: ${name}
    `);
    listaPersonagens(name, limit);
}

var input = document.getElementById("searchByName");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("basic-addon2").click();
    }
});

//
