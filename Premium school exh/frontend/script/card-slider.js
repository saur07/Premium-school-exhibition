let currentSlide = 0;
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const container = document.querySelector(".card__container");
const totalSlides = cards.length;
let autoSlideInterval;
let isUserInteracting = false;

function updateSlider() {
  if (window.innerWidth <= 767) {
    container.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update ARIA attributes and visual states
    dots.forEach((dot, index) => {
      const isActive = index === currentSlide;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive.toString());
      dot.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    cards.forEach((card, index) => {
      card.setAttribute("aria-hidden", (index !== currentSlide).toString());
    });

    const currentCard = cards[currentSlide];
    const cardTitle =
      currentCard.querySelector(".card__title")?.textContent ||
      `Slide ${currentSlide + 1}`;
    announceToScreenReader(`Now showing: ${cardTitle}`);
  }
}

function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
  updateSlider();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlider();
}

function startAutoSlide() {
  if (window.innerWidth <= 767 && !isUserInteracting) {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function pauseAutoSlide() {
  isUserInteracting = true;
  stopAutoSlide();
}

function resumeAutoSlide() {
  isUserInteracting = false;
  startAutoSlide();
}

// Keyboard navigation for dots
function handleDotKeydown(e, index) {
  let targetIndex = index;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      targetIndex = index === 0 ? totalSlides - 1 : index - 1;
      break;
    case "ArrowRight":
      e.preventDefault();
      targetIndex = (index + 1) % totalSlides;
      break;
    case "Home":
      e.preventDefault();
      targetIndex = 0;
      break;
    case "End":
      e.preventDefault();
      targetIndex = totalSlides - 1;
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      pauseAutoSlide();
      goToSlide(index);
      setTimeout(resumeAutoSlide, 3000);
      return;
    default:
      return;
  }

  dots[targetIndex].focus();
  pauseAutoSlide();
  goToSlide(targetIndex);
  setTimeout(resumeAutoSlide, 3000);
}

// Touch/swipe functionality
let startX = 0;
let isDragging = false;

container.addEventListener("touchstart", (e) => {
  if (window.innerWidth <= 767) {
    startX = e.touches[0].clientX;
    isDragging = true;
    pauseAutoSlide();
  }
});

container.addEventListener("touchmove", (e) => {
  if (!isDragging || window.innerWidth > 767) return;
  e.preventDefault();
});

container.addEventListener("touchend", (e) => {
  if (!isDragging || window.innerWidth > 767) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  const threshold = 80;

  if (Math.abs(diff) > threshold) {
    if (diff > 0 && currentSlide < totalSlides - 1) {
      nextSlide();
    } else if (diff < 0 && currentSlide > 0) {
      prevSlide();
    }
  }

  isDragging = false;
  setTimeout(resumeAutoSlide, 3000);
});

// Keyboard navigation for container
container.addEventListener("keydown", (e) => {
  if (window.innerWidth > 767) return;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      pauseAutoSlide();
      prevSlide();
      setTimeout(resumeAutoSlide, 3000);
      break;
    case "ArrowRight":
      e.preventDefault();
      pauseAutoSlide();
      nextSlide();
      setTimeout(resumeAutoSlide, 3000);
      break;
  }
});

// Dot event handlers
dots.forEach((dot, index) => {
  // Click handler
  dot.addEventListener("click", () => {
    pauseAutoSlide();
    goToSlide(index);
    setTimeout(resumeAutoSlide, 3000);
  });

  // Keyboard handler
  dot.addEventListener("keydown", (e) => {
    handleDotKeydown(e, index);
  });

  // Focus handlers for auto-slide pause/resume
  dot.addEventListener("focus", pauseAutoSlide);
  dot.addEventListener("blur", () => {
    setTimeout(resumeAutoSlide, 100);
  });
});

// Pause auto-slide when user hovers over the slider
const slider = document.querySelector(".card__slider");
if (slider) {
  slider.addEventListener("mouseenter", pauseAutoSlide);
  slider.addEventListener("mouseleave", resumeAutoSlide);
}

// Reset on resize
window.addEventListener("resize", () => {
  stopAutoSlide();
  if (window.innerWidth > 767) {
    container.style.transform = "";
    currentSlide = 0;
    // Reset ARIA attributes for desktop view
    cards.forEach((card) => card.removeAttribute("aria-hidden"));
    dots.forEach((dot, index) => {
      dot.setAttribute("tabindex", "0");
      dot.setAttribute("aria-selected", "false");
    });
  } else {
    updateSlider();
    startAutoSlide();
  }
});

if (window.innerWidth <= 767) {
  // Make container focusable for keyboard navigation
  container.setAttribute("tabindex", "0");
  container.setAttribute(
    "aria-label",
    "Use arrow keys to navigate between school types"
  );
}

updateSlider();
startAutoSlide();
