document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".slider-container");

  sliderContainer.addEventListener("mouseenter", function () {
    this.style.animationPlayState = "paused";
  });

  sliderContainer.addEventListener("mouseleave", function () {
    this.style.animationPlayState = "running";
  });
});
