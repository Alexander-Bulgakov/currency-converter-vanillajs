import notFoundHtml from "./notFoundPage.html";

function NotFoundPage() {
  document.querySelector("#root").innerHTML = notFoundHtml;
}

export { NotFoundPage };
