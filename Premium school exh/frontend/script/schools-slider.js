function initSchoolsSlider() {
  const rows = document.querySelectorAll(".schools__logo .row");
  const schoolsLogo = document.querySelector(".schools__logo");

  rows.forEach((row, index) => {
    const images = row.querySelectorAll("img");
    if (images.length === 0) return;

    const imageWidth = 270;
    let position = 0;
    let animationId = null;
    let isPaused = false;

    images.forEach((img) => {
      const clone = img.cloneNode(true);
      row.appendChild(clone);
    });

    const totalWidth = imageWidth * images.length;

    if (index === 1) {
      position = -totalWidth;
      row.style.transform = `translateX(${position}px)`;
    }

    function animate() {
      if (isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const speed = 0.5;

      if (index === 0) {
        // First row
        position -= speed;
        if (position <= -totalWidth) {
          position = 0;
        }
        row.style.transform = `translateX(${position}px)`;
      } else {
        // Second row
        position += speed;
        if (position >= 0) {
          position = -totalWidth;
        }
        row.style.transform = `translateX(${position}px)`;
      }

      animationId = requestAnimationFrame(animate);
    }

    schoolsLogo.addEventListener("mouseenter", () => {
      isPaused = true;
    });

    schoolsLogo.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      } else {
        animate();
      }
    });

    animate();
  });
}

function initHeroSlider() {
  const sliderContainer = document.querySelector(".slider-container");
  const heroSlider = document.querySelector(".hero__wrapper-slider");
  const sliderRows = sliderContainer.querySelectorAll(".slider-row");

  if (sliderRows.length === 0) return;

  const rowHeight = 150;
  let position = 0;
  let animationId = null;
  let isPaused = false;

  sliderRows.forEach((row) => {
    const clone = row.cloneNode(true);
    sliderContainer.appendChild(clone);
  });

  const totalHeight = rowHeight * sliderRows.length;

  function animate() {
    if (isPaused) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const speed = 0.3;

    position -= speed;
    if (position <= -totalHeight) {
      position = 0;
    }
    sliderContainer.style.transform = `translateY(${position}px)`;

    animationId = requestAnimationFrame(animate);
  }

  heroSlider.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  heroSlider.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    } else {
      animate();
    }
  });

  animate();
}

document.addEventListener("DOMContentLoaded", () => {
  initSchoolsSlider();
  initHeroSlider();
});
