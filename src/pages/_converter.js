import converter from "./converter.html";
const Converter = {
    $: {
        root: document.querySelector("#root"),

    },
    init() {
        this.$.root.innerHTML = converter
    }
}
Converter.init();