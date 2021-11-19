const api = axios.create({
    baseURL: "https://api-backend-marvel-crhist0.herokuapp.com",
});

const params = new URLSearchParams(window.location.search);

let page = params.has("page") ? params.get("page") : "1";
