import { ConverterPage } from "./pages/converterPage/converterPage";
import { RatioPage } from "./pages/ratioPage/ratioPage";
import { NotFoundPage } from "./pages/notFoundPage/notFoundPage";

const routes = {
  "/": ConverterPage,
  "/converter": ConverterPage,
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