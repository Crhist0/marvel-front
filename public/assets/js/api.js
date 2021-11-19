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
            // console.log(result.data);

            const lista = result.data.data; // test page
            const searchResults = result.data.searchResults;
            const detailsPageResults = result.data.detailsPageResults;
            const copy = result.data.copy; // mensagem do final da pagina

            atualizaTabela(lista, copy, searchResults, detailsPageResults);
        })
        .catch((err) => {
            console.log("erro?");
            console.log(err);
            console.log(err.request);
            console.log(err.result);
        });
}

function atualizaTabela(lista, copy, searchResults, detailsPageResults) {
    let list = document.querySelector("#listaPersonagens");
    list.style.display = "block";
    const tbodyLista = document.querySelector("#listaPersonagens > tbody");
    console.log(detailsPageResults);
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
    // console.log(searchResults);

    document.getElementById("footer").innerHTML = copy;
}

function searchCharacterById() {
    let id = document.getElementById("searchByName").value;
    api.get("/" + id, {
        params: { page },
    })
        .then((res) => {
            console.log(res.data);
            const character = res.data.data[0];
            const copy = res.data.copy;
            console.log(character.thumbnail.path + character.thumbnail.extension);
            document.getElementById("replaceNameSeparator").innerText = character.name;
            document.getElementById("replaceThumbnailResults").src = character.thumbnail.path + "." + character.thumbnail.extension;
            document.getElementById("replaceNameResults").innerText = character.name;
            document.getElementById("replaceDescriptionResults").innerText = character.description;
            document.getElementById("replaceLinkResults").innerText = character.urls[0].url;
            document.getElementById("replaceComicsQuantityResults").innerText = character.comics.available;
            document.getElementById("replaceSeriesQuantityResults").innerText = character.series.available;
            document.getElementById("replaceStoriesQuantityResults").innerText = character.stories.available;
            document.getElementById("replaceEventsQuantityResults").innerText = character.events.available;
        })
        .catch((err) => {
            console.log("erro :(");
            console.log(err);
            console.log(err.req);
            console.log(err.res);
        });
}

function searchCharacterComicsById() {
    let id = document.getElementById("searchByName").value;
    api.get("/comics/" + id, {
        params: { page },
    })
        .then((res) => {
            console.log("log da res.data:");
            console.log(res.data);
            const comicsList = res.data.data;
            const copy = res.data.copy;

            for (const comic of comicsList) {
                let thumb = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
                if (
                    thumb == "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ||
                    thumb == `http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif` ||
                    thumb == "insira aqui outra imagem para exceção"
                ) {
                    // se for as imagens de "not found", mostra a logo marvel abaixo
                    thumb = `https://i.ibb.co/JQM4M31/Wallpaperkiss-2389005-1666.jpg`; // logo da marvel
                }

                console.log("log da comic:");
                console.log(comic);

                document.getElementById("comicsList").innerHTML += `
                
                <li class="mt-3 ms-2 me-2" style="max-width: 300px;">
                
                <div class="card" style="width: 300px; height: 800px">
                    <img src="${thumb}" class="card-img-top" alt="${comic.title}">
                    <div class="card-body" style="overflow: auto;">
                        <p class="card-text">
                            <strong>Title:</strong> ${comic.title}<br>
                            <strong>Series:</strong> ${comic.series.name}<br>
                            <strong>Description:</strong> 
                            ${comic.description == null ? "Description not found." : comic.description}
                        </p>
                    </div>
                </div>
                

                

                </li>
    
                `;
            }
        })
        .catch((err) => {
            console.log("erro :(");
            console.log(err);
            console.log(err.req);
            console.log(err.res);
        });
}
