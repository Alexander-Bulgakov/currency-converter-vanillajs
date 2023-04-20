import styles from "./styles/index.scss";
import image from "./images/cat.png";
import handleLocation from "./router.js";
// import card from "./components/Card.html";
// import { rotateArrow } from "./helpers";

document.querySelector(".navbar__image img").src = image;

handleLocation();

