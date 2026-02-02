document.addEventListener('DOMContentLoaded', function() {

  // Form validation and accessibility enhancements
  function enhanceFormAccessibility() {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      // Add real-time validation feedback
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        clearFieldError(this);
      });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        announceToScreenReader('Form submitted successfully');
        console.log('Form would be submitted');
      } else {
        announceToScreenReader('Please correct the errors in the form');
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${getFieldLabel(field)} is required`;
    }

    // Phone number validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Update field state
    field.setAttribute('aria-invalid', (!isValid).toString());

    if (!isValid) {
      showFieldError(field, errorMessage);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);\n    if (label) return label.textContent;\n    return field.placeholder || field.name || 'Field';\n  }\n  \n  function showFieldError(field, message) {\n    let errorElement = document.getElementById(`${field.id}-error`);\n    \n    if (!errorElement) {\n      errorElement = document.createElement('div');\n      errorElement.id = `${field.id}-error`;\n      errorElement.className = 'field-error';\n      errorElement.setAttribute('role', 'alert');\n      errorElement.setAttribute('aria-live', 'polite');\n      field.parentNode.insertBefore(errorElement, field.nextSibling);\n    }\n    \n    errorElement.textContent = message;\n    field.setAttribute('aria-describedby', errorElement.id);\n    field.classList.add('error');\n  }\n  \n  function clearFieldError(field) {\n    const errorElement = document.getElementById(`${field.id}-error`);\n    if (errorElement) {\n      errorElement.textContent = '';\n    }\n    field.removeAttribute('aria-describedby');\n    field.classList.remove('error');\n  }\n  \n  // Screen reader announcements\n  function announceToScreenReader(message, priority = 'polite') {\n    const announcement = document.createElement('div');\n    announcement.setAttribute('aria-live', priority);\n    announcement.setAttribute('aria-atomic', 'true');\n    announcement.className = 'sr-only';\n    announcement.textContent = message;\n    document.body.appendChild(announcement);\n    \n    setTimeout(() => {\n      if (document.body.contains(announcement)) {\n        document.body.removeChild(announcement);\n      }\n    }, 1000);\n  }\n  \n  // Enhanced button accessibility\n  function enhanceButtonAccessibility() {\n    const buttons = document.querySelectorAll('.register__btn');\n    \n    buttons.forEach(button => {\n      // Ensure buttons are properly focusable\n      if (!button.hasAttribute('tabindex')) {\n        button.setAttribute('tabindex', '0');\n      }\n      \n      // Add keyboard support\n      button.addEventListener('keydown', function(e) {\n        if (e.key === 'Enter' || e.key === ' ') {\n          e.preventDefault();\n          this.click();\n        }\n      });\n      \n      // Add focus/blur handlers for better UX\n      button.addEventListener('focus', function() {\n        this.classList.add('focused');\n      });\n      \n      button.addEventListener('blur', function() {\n        this.classList.remove('focused');\n      });\n    });\n  }\n  \n  // Color contrast validation (basic check)\n  function validateColorContrast() {\n    const elementsToCheck = [\n      '.card__title',\n      '.card__para',\n      '.appointment__details-text',\n      '.exhibition__cards-card h4'\n    ];\n    \n    elementsToCheck.forEach(selector => {\n      const elements = document.querySelectorAll(selector);\n      elements.forEach(element => {\n        const styles = window.getComputedStyle(element);\n        const color = styles.color;\n        const backgroundColor = styles.backgroundColor;\n        \n        // Add text shadow for better contrast if needed\n        if (element.closest('.card') || element.closest('.exhibition__cards-card')) {\n          element.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.8)';\n        }\n      });\n    });\n  }\n  \n  // Keyboard trap for modal-like interactions\n  function createKeyboardTrap(container) {\n    const focusableElements = container.querySelectorAll(\n      'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])'\n    );\n    \n    const firstElement = focusableElements[0];\n    const lastElement = focusableElements[focusableElements.length - 1];\n    \n    container.addEventListener('keydown', function(e) {\n      if (e.key === 'Tab') {\n        if (e.shiftKey) {\n          if (document.activeElement === firstElement) {\n            e.preventDefault();\n            lastElement.focus();\n          }\n        } else {\n          if (document.activeElement === lastElement) {\n            e.preventDefault();\n            firstElement.focus();\n          }\n        }\n      }\n      \n      if (e.key === 'Escape') {\n        // Handle escape key if needed\n        container.blur();\n      }\n    });\n  }\n  \n  // Initialize all accessibility enhancements\n  function initializeAccessibility() {\n    enhanceFormAccessibility();\n    enhanceButtonAccessibility();\n    validateColorContrast();\n    \n    // Add keyboard traps to interactive sections\n    const interactiveSections = document.querySelectorAll('.card__slider, .exhibition__carousel');\n    interactiveSections.forEach(section => {\n      if (section.querySelectorAll('button, [tabindex]').length > 1) {\n        createKeyboardTrap(section);\n      }\n    });\n    \n    // Announce page load completion\n    setTimeout(() => {\n      announceToScreenReader('Page loaded successfully. Use Tab to navigate or press H to jump between headings.');\n    }, 1000);\n  }\n  \n  // Run initialization\n  initializeAccessibility();\n  \n  // Re-run on dynamic content changes\n  const observer = new MutationObserver(function(mutations) {\n    mutations.forEach(function(mutation) {\n      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {\n        // Re-initialize for new content\n        setTimeout(initializeAccessibility, 100);\n      }\n    });\n  });\n  \n  observer.observe(document.body, {\n    childList: true,\n    subtree: true\n  });\n});\n\n// Export for testing purposes\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = {\n    announceToScreenReader,\n    validateField,\n    enhanceFormAccessibility\n  };\n}\n