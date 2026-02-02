document.addEventListener("DOMContentLoaded", function () {
  let currentSlide = 0;
  const cards = document.querySelectorAll(".exhibition__cards-card");
  const totalSlides = cards.length;
  const cardsContainer = document.querySelector(".exhibition__cards");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const carousel = document.querySelector(".exhibition__carousel");

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

  function updateCarousel() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 767;

    if (isMobile) {
      const cardWidth = cards[0].offsetWidth;
      const gap = 20;
      const translateX = -(currentSlide * (cardWidth + gap));
      cardsContainer.style.transform = `translateX(${translateX}px)`;

      cards.forEach((card, index) => {
        card.setAttribute("aria-hidden", (index !== currentSlide).toString());
      });

      const currentCard = cards[currentSlide];
      const cardTitle =
        currentCard.querySelector("h4")?.textContent ||
        `Feature ${currentSlide + 1}`;
      announceToScreenReader(
        `Showing: ${cardTitle}. ${currentSlide + 1} of ${totalSlides}`
      );
    } else {
      cardsContainer.style.transform = "none";
      // Remove aria-hidden for desktop view
      cards.forEach((card) => card.removeAttribute("aria-hidden"));
    }

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === totalSlides - 1;

    prevBtn.disabled = isFirstSlide;
    nextBtn.disabled = isLastSlide;

    prevBtn.setAttribute("aria-disabled", isFirstSlide.toString());
    nextBtn.setAttribute("aria-disabled", isLastSlide.toString());

    // Update carousel region description
    carousel.setAttribute("aria-describedby", "carousel-status");

    // Update or create status element
    let statusElement = document.getElementById("carousel-status");
    if (!statusElement) {
      statusElement = document.createElement("div");
      statusElement.id = "carousel-status";
      statusElement.className = "sr-only";
      carousel.appendChild(statusElement);
    }

    if (window.innerWidth <= 767) {
      statusElement.textContent = `Slide ${currentSlide + 1} of ${totalSlides}`;
    } else {
      statusElement.textContent = "All exhibition features are visible";
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateCarousel();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    }
  }

  // Keyboard navigation for carousel
  function handleCarouselKeydown(e) {
    if (window.innerWidth > 767) return; // Only on mobile

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        prevSlide();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextSlide();
        break;
      case "Home":
        e.preventDefault();
        currentSlide = 0;
        updateCarousel();
        break;
      case "End":
        e.preventDefault();
        currentSlide = totalSlides - 1;
        updateCarousel();
        break;
    }
  }

  function handleButtonKeydown(e, direction) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (direction === "next") {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  window.addEventListener("resize", function () {
    // Reset to first slide on resize to avoid issues
    currentSlide = 0;
    updateCarousel();
  });

  if (nextBtn && prevBtn && carousel) {
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    nextBtn.addEventListener("keydown", (e) => handleButtonKeydown(e, "next"));
    prevBtn.addEventListener("keydown", (e) => handleButtonKeydown(e, "prev"));

    carousel.addEventListener("keydown", handleCarouselKeydown);

    if (window.innerWidth <= 767) {
      carousel.setAttribute("tabindex", "0");
      carousel.setAttribute(
        "aria-label",
        "Exhibition features carousel. Use arrow keys to navigate."
      );
    }

    updateCarousel();
  }
});
