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
    let url = urlParams.has("name");

    if (url) {
        name = params.get("name");
        params.delete("name");
        name == null ? (name = document.getElementById("getSearchName").innerText) : (name = name);
    } else {
        name = document.getElementById("searchByName").value;
    }
    limit = 15;
    api.get("/", {
        params: { page: pageC, name, limit },
    })
        .then((result) => {
            const lista = result.data.data; // test page
            const searchResultQuantity = result.data.data2; // test page
            const searchResults = result.data.searchResults;
            const detailsPageResults = result.data.detailsPageResults;
            const copy = result.data.copy; // mensagem do final da pagina

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
    list.innerHTML = "";
    for (const personagem of lista) {
        let thumb = personagem.thumbnail;
        let details = personagem.details == -1 || personagem.details == "" ? "" : `<p><a href="${personagem.details}">details</a></p>`;
        let wiki = personagem.wiki == -1 || personagem.wiki == "" ? "" : `<p><a href="${personagem.wiki}">wiki</a></p>`;
        let comiclink = personagem.comiclink == -1 || personagem.comiclink == "" ? "" : `<p><a href="${personagem.comiclink}">comiclink</a></p>`;

        if (
            personagem.thumbnail == "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ||
            personagem.thumbnail == `http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif` ||
            personagem.thumbnail == "insira aqui outra imagem para exceção"
        ) {
            // se for as imagens de "not found", mostra a logo marvel abaixo
            thumb = `https://i.ibb.co/vLhYShQ/Screenshot-1.png`;
        }

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
    document.getElementById("replaceNameSeparator").innerHTML = `${Number(document.getElementById("").innerText) * 15} of ${searchResultQuantity} Results for 
    "<span id="getSearchName">${name}</span>"`;
    document.getElementById("replaceNameSeparator").value = Math.ceil(searchResultQuantity / 15);
    window.location.assign("#replaceNameSeparator");

    let page = Number(document.getElementById("pageCounter").innerText);
    let pageQuantity = Math.ceil(searchResultQuantity / 15);

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
}

function showResultsIfSearched() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const name = urlParams.get("name");
    urlParams.has("name") ? listaPersonagens(name) : console.log("how did you get in here?");
}

function changePageAfterBefore(x) {
    let page = Number(document.getElementById("pageCounter").innerText);
    page = page + x;
    document.getElementById("pageCounter").innerText = page;
    let pageQuantity = document.getElementById("replaceNameSeparator").value;
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    let limit = page * 15;
    let name = document.getElementById("getSearchName").innerText;
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
