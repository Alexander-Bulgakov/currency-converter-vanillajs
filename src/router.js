// let locationResolver = (location) => {
//   console.log(location);
// };

let route = (event) => {
  event.preventDefault();
  console.log(event.target);
};

export default route;

// function getRouteInfo() {
//   let hash = location.hash;
//   console.log(hash);
// }

// export default {
//   init() {
//     window.addEventListener("hashchange", getRouteInfo);
//     getRouteInfo();
//   },
// };
