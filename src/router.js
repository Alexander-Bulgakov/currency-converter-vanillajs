// // import converter from "./pages/converter.html";
// import ratioPage from "./pages/ratio.html";
// import notFound from "./pages/404.html";
import { Converter } from "./pages/converter";
import { RatioPage } from "./pages/ratio";
import { NotFoundPage } from "./pages/notFound";

const routes = {
  "/": Converter,
  "/converter": Converter,
  "/ratio": RatioPage,
  404: NotFoundPage,
};


const handleLocation = () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  route();
  // document.querySelector("#root").innerHTML = route;
};

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  console.log(event.target.href);
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};
window.onpopstate = handleLocation;
window.route = route;

export default handleLocation;
// handleLocation();