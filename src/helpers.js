const rotateArrow = (arrow, turnDown = false) => {
    if (turnDown) {
      arrow.classList.remove("arrow-up");
    } else {
      arrow.classList.toggle("arrow-up");
    }
  }

export { rotateArrow };