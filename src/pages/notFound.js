import notFoundPage from "./404.html";

function NotFoundPage() {
    document.querySelector("#root").innerHTML = notFoundPage;
}

export { NotFoundPage };