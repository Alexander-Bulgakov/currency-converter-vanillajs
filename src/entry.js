import styles from "./styles/index.scss";
import catImage from "./assets/images/cat.png";
import handleLocation from "./router.js";

document.querySelector(".navbar__image img").src = catImage;

handleLocation();
