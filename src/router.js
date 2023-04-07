import converter from "./pages/converter.html";
import ratioPage from "./pages/ratio.html";
import notFound from "./pages/404.html";

const routes = {
  "/": converter,
  "/converter": converter,
  "/ratio": ratioPage,
  404: notFound,
};


const handleLocation = () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  document.querySelector("#root").innerHTML = route;
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