function videoActions() {
  const wraps = document.querySelectorAll('[data-video="wrap"]');

  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const video = wrap.querySelector('[data-video="video"]');
    const toggle = wrap.querySelector('[data-video="audio"]');
    const unmute = wrap.querySelector('[data-video="unmute"]');
    const mute = wrap.querySelector('[data-video="mute"]');
    const restart = wrap.querySelector('[data-video="restart"]');
    const fullscreen = wrap.querySelector('[data-video="fullscreen"]');

    // Audio toggle
    toggle.addEventListener("click", function () {
      if (video.muted) {
        video.muted = false;
        unmute.style.display = "none";
        mute.style.display = "block";
      } else {
        video.muted = true;
        unmute.style.display = "block";
        mute.style.display = "none";
      }
    });

    // Restart button
    restart.addEventListener("click", function () {
      video.currentTime = 0;
      video.muted = false;
      unmute.style.display = "none";
      mute.style.display = "block";
    });

    // Fullscreen button
    fullscreen.addEventListener("click", function () {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Safari
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen(); // IE11
      }

      // Unmute when going fullscreen
      video.muted = false;
      unmute.style.display = "none";
      mute.style.display = "block";
    });
  });
}

function modal() {
  // Get all unique modal identifiers
  const modalWraps = document.querySelectorAll("[data-modal-wrap]");

  if (!modalWraps.length) {
    return;
  }

  modalWraps.forEach((wrap) => {
    const modalId = wrap.getAttribute("data-modal-wrap");
    const triggers = document.querySelectorAll(
      `[data-modal-trigger="${modalId}"]`
    );

    if (!triggers.length) {
      return;
    }

    const modal = wrap.querySelector(".modal_layout");
    const closeBtns = wrap.querySelectorAll(`[data-modal-close="${modalId}"]`);

    triggers.forEach((trigger) => {
      let lastFocusedElement;

      // GSAP Animation
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.2,
          ease: "power1.inOut",
        },
        onReverseComplete: () => {
          wrap.style.display = "none";

          // Clear form inputs inside modal
          wrap.querySelectorAll(".modal_wrap .form_input").forEach((input) => {
            input.value = "";
          });
        },
      });

      // Set initial states
      gsap.set(wrap, { opacity: 0, display: "none" });
      gsap.set(modal, { scale: 0.7, opacity: 0 });

      // Animation sequence
      tl.to(wrap, { opacity: 1 }).to(
        modal,
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out",
        },
        "<"
      );

      function openModal() {
        lastFocusedElement = document.activeElement;

        wrap.style.display = "flex";
        tl.timeScale(1).play();

        // Accessibility
        wrap.removeAttribute("inert");
        wrap.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Add event listeners to modal instead of document
        modal.addEventListener("keydown", trapFocus);
        wrap.addEventListener("keydown", closeOnEscape);

        // Find and focus first focusable element
        setTimeout(() => {
          const focusableElements = Array.from(
            modal.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter(
            (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
          );

          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }, 50);
      }

      function closeModal() {
        tl.timeScale(1.5).reverse();

        document.activeElement?.blur();

        wrap.setAttribute("aria-hidden", "true");
        wrap.setAttribute("inert", "");
        document.body.style.overflow = "";

        if (lastFocusedElement) {
          setTimeout(() => lastFocusedElement.focus(), 50);
        }

        // Remove listeners from modal instead of document
        modal.removeEventListener("keydown", trapFocus);
        wrap.removeEventListener("keydown", closeOnEscape);
      }

      function trapFocus(e) {
        if (e.key !== "Tab") return;

        const focusableElements = Array.from(
          modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        const isFirstElement = document.activeElement === firstFocusable;
        const isLastElement = document.activeElement === lastFocusable;

        if (e.shiftKey && isFirstElement) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && isLastElement) {
          e.preventDefault();
          firstFocusable.focus();
        }

        if (!modal.contains(document.activeElement)) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }

      function closeOnEscape(e) {
        if (e.key === "Escape" && wrap.style.display === "flex") {
          closeModal();
        }
      }

      // Event Listeners
      trigger.addEventListener("click", openModal);
      closeBtns.forEach((button) =>
        button.addEventListener("click", closeModal)
      );
      wrap.addEventListener("click", (e) => {
        if (e.target === wrap) closeModal();
      });
    });
  });
}

function socialShare() {
  const linkShareButtons = document.querySelectorAll('[data-share="link"]');

  if (!linkShareButtons.length) {
    return;
  }

  const handleLinkCopy = async (button) => {
    const currentUrl = window.location.href;
    const copyIcon = button.querySelector('[data-share="copy"]');
    const copiedIcon = button.querySelector('[data-share="copied"]');
    const text = button.querySelector('[data-share="text"]');

    try {
      await navigator.clipboard.writeText(currentUrl);

      // Update text
      if (text) {
        text.textContent = "Link copied!";
      }

      // Swap icons
      if (copyIcon && copiedIcon) {
        copyIcon.style.display = "none";
        copiedIcon.style.display = "block";
      }

      // Reset after 2 seconds
      setTimeout(() => {
        if (text) {
          text.textContent = "Copy link";
        }

        if (copyIcon && copiedIcon) {
          copyIcon.style.display = "block";
          copiedIcon.style.display = "none";
        }
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  linkShareButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      handleLinkCopy(button);
    });
  });
}

function accordion() {
  const accordionLists = document.querySelectorAll(".layout_accordions_slot");

  if (!accordionLists) {
    return;
  }

  accordionLists.forEach((list) => {
    const accordionItems = gsap.utils.toArray(".accordion_wrap");

    accordionItems.forEach((item) => {
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      gsap.set(content, { height: 0, display: "none" });
      item.classList.remove("is-open");
      gsap.set(icon, { rotate: 0 });
    });

    // Function to open a specific accordion
    const openAccordion = (item) => {
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      if (!item.classList.contains("is-open")) {
        gsap.set(content, { display: "block" });
        gsap.to(content, {
          height: "auto",
          duration: 0.7,
          ease: easeBase,
          onComplete: () => item.classList.add("is-open"),
        });

        gsap.to(icon, {
          rotate: -180,
          duration: 0.7,
          ease: easeBase,
        });
      }
    };

    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion_title");
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      header.addEventListener("click", () => {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector(".accordion_content");
            const otherIcon = otherItem.querySelector(".accordion_icon");

            if (otherItem.classList.contains("is-open")) {
              gsap.to(otherContent, {
                height: 0,
                duration: 0.7,
                ease: easeBase,
                onComplete: () => {
                  otherItem.classList.remove("is-open");
                  gsap.set(otherContent, { display: "none" });
                },
              });

              gsap.to(otherIcon, {
                rotate: 0,
                duration: 0.7,
                ease: easeBase,
              });
            }
          }
        });

        if (!item.classList.contains("is-open")) {
          openAccordion(item);
        } else {
          gsap.to(content, {
            height: 0,
            duration: 0.7,
            ease: easeBase,
            onComplete: () => {
              item.classList.remove("is-open");
              gsap.set(content, { display: "none" });
            },
          });

          gsap.to(icon, {
            rotate: 0,
            duration: 0.7,
            ease: easeBase,
          });
        }
      });
    });

    // Check for hash in URL and open corresponding accordion
    const hash = window.location.hash;
    if (hash) {
      const targetAccordion = document.querySelector(hash);
      if (
        targetAccordion &&
        targetAccordion.classList.contains("accordion_wrap")
      ) {
        // Scroll to the accordion
        setTimeout(() => {
          targetAccordion.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Open the accordion after scrolling
          setTimeout(() => {
            openAccordion(targetAccordion);
          }, 500);
        }, 100);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  videoActions();
  modal();
  socialShare();
  accordion();
});