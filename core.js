// GLOBAL VARIABLES
const durationFast = 0.4;
const durationBase = 0.8;
const durationSlow = 1.2;
const easeBase = "power4.inOut";
const easeBack = "back.inOut";

// GENERAL

function lenisScroll() {
  (lenis = new Lenis({
    lerp: 0.12,
  })),
    lenis.on("scroll", ScrollTrigger.update),
    gsap.ticker.add((e) => {
      lenis.raf(1e3 * e);
    }),
    gsap.ticker.lagSmoothing(0);
}

function isMenuOpen() {
  const menu = document.querySelector(".nav_menu");
  return menu && menu.getAttribute("aria-hidden") === "false";
}

function navScroll() {
  const navComponent = document.querySelector('[data-menu="nav"]');

  if (!navComponent) return;

  // Check if scroll behavior is disabled
  const menuScroll = navComponent.getAttribute("data-menu-scroll");
  if (menuScroll === "false") return;

  let navHidden = false;
  let activeTween = null;

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      if (isMenuOpen()) {
        if (activeTween) activeTween.kill();
        gsap.set(navComponent, { y: "0%" });
        navHidden = false;
        return;
      }

      const scrollingUp = self.direction === -1;

      if (scrollingUp && navHidden) {
        if (activeTween) activeTween.kill();
        navHidden = false;

        activeTween = gsap.to(navComponent, {
          y: "0%",
          duration: durationBase,
          ease: easeBase,
          onComplete: () => {
            activeTween = null;
          },
        });
      } else if (!scrollingUp && !navHidden) {
        if (activeTween) activeTween.kill();
        navHidden = true;

        activeTween = gsap.to(navComponent, {
          y: (i) => (i === 0 ? "-100%" : 0),
          duration: durationBase,
          ease: easeBase,
          onComplete: () => {
            activeTween = null;
          },
        });
      }
    },
  });
}

function copyright() {
  const copyrightDate = document.querySelector(
    '[data-element="copyright-date"]'
  );

  if (copyrightDate) {
    const currentYear = new Date().getFullYear();
    copyrightDate.textContent = currentYear;
  }
}

// LOAD ANIMATION

function createSplitText(target, type = "lines", options = {}) {
  const element = target.querySelector("h1, h2, h3, h4, h5, h6, p") || target;

  const split = new SplitText(element, {
    type,
    mask: "lines",
    linesClass: "line",
    autoSplit: true,
    deepSplit: true,
    reduceWhiteSpace: false,
    preserveWhitespace: false,
    ...options,
  });

  return {
    split,
    lines: split.lines,
    words: split.words,
    chars: split.chars,
  };
}

function loader() {
  const block = document.querySelector(".loader_block");
  const hero = document.querySelector('[data-menu="hero"]');
  const ups = document.querySelectorAll('[data-load="fade-up"]');
  const lefts = document.querySelectorAll('[data-load="fade-left"]');

  let tl = gsap.timeline({
    defaults: {
      duration: durationSlow,
      ease: "power4.out",
    },
  });

  tl.to(
    block,
    {
      borderRadius: "0 0 100% 100%",
      height: "0%",
      ease: "power4.inOut",
    },
    0
  );

  if (hero) {
    const heading = hero.querySelector(".g_heading");

    if (heading) {
      const { words } = createSplitText(heading, "lines, words");
      if (words?.length) {
        gsap.set(words, { yPercent: 110 });
        gsap.set(heading, { visibility: "visible" });

        tl.to(
          words,
          {
            yPercent: 0,
            stagger: 0.1,
            duration: 0.5,
          },
          0.7
        );
      }
    }
  }

  if (ups.length) {
    tl.to(
      ups,
      {
        opacity: 1,
        y: "0rem",
        stagger: 0.1,
        duration: durationBase,
      },
      0.9
    );
  }

  if (lefts.length) {
    tl.to(
      lefts,
      {
        opacity: 1,
        x: "0rem",
        stagger: 0.2,
        duration: durationBase,
      },
      1
    );
  }
}

// SCROLL ANIMATIONS

function wordsScroll() {
  const headings = document.querySelectorAll(
    '[data-scroll="words"], .heading_wrap .g_heading.u-text-style-h2, .split_main_text .g_heading.u-text-style-h2'
  );
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { words } = createSplitText(heading, "lines, words");
    if (!words?.length) return;

    gsap.set(words, { yPercent: 110 });
    gsap.set(heading, { visibility: "visible" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: 0.5,
          ease: "power4.out",
        },
      })
      .to(words, {
        yPercent: 0,
        stagger: 0.1,
        delay: 0.1,
      });
  });
}

function linesScroll() {
  const headings = document.querySelectorAll('[data-scroll="lines"]');
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { lines } = createSplitText(heading, "lines");
    if (!lines?.length) return;

    gsap.set(lines, { yPercent: 110 });
    gsap.set(heading, { visibility: "visible" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: 1,
          ease: "power4.out",
        },
      })
      .to(lines, {
        yPercent: 0,
        stagger: 0.08,
        delay: 0.3,
      });
  });
}

function charsScroll() {
  const headings = document.querySelectorAll('[data-scroll="chars"]');
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { chars } = createSplitText(heading, "lines, chars");
    if (!chars?.length) return;

    gsap.set(chars, { yPercent: 110 });
    gsap.set(heading, { visibility: "visible" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top bottom",
          toggleActions: "play none none reset",
        },
        defaults: {
          duration: 1,
          ease: "power4.out",
        },
      })
      .to(chars, {
        yPercent: 0,
        stagger: 0.05,
        delay: 0.2,
      });
  });
}

function fadeUpScroll() {
  const fades = document.querySelectorAll('[data-scroll="fade-up"]');

  if (!fades.length) return;

  fades.forEach((fade) => {
    const tl = gsap.timeline({
      defaults: {
        duration: durationBase,
        ease: "power4.out",
      },
      scrollTrigger: {
        trigger: fade,
        start: "top bottom",
        toggleActions: "play none none reverse",
      },
      paused: true,
    });

    tl.to(
      fade,
      {
        opacity: 1,
        y: "0rem",
      },
      0.2
    );
  });
}

function parallax() {
  const wraps = document.querySelectorAll('[data-parallax="wrap"]');
  if (!wraps.length) {
    return;
  }

  wraps.forEach((wrap) => {
    const parallax = wrap.querySelectorAll(".u-cover-absolute");
    if (!parallax.length) {
      return;
    }

    gsap.set(parallax, { y: "-15%" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: parallax,
          start: "top bottom",
          scrub: true,
        },
      })
      .to(parallax, {
        y: "15%,",
      });
  });
}

// MOBILE MENU

function mobileMenu() {
  const nav = document.querySelector('[data-menu="nav"]');
  const menu = nav.querySelector(".nav_content");
  const button = nav.querySelector(".nav_hamburger");
  const links = menu.querySelectorAll('[data-menu="item"]');

  const lineTop = button.children[0];
  const lineBottom = button.children[1];

  gsap.set(links, { y: "2rem", opacity: 0 });

  let isAnimating = false;
  let isMenuOpen = false;

  let menuTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.6,
      ease: easeBack,
    },
    onStart: () => {
      isAnimating = true;
      if (!isMenuOpen) {
        gsap.set(menu, { display: "flex" });
        nav.classList.add("is-open");
      }
    },
    onComplete: () => {
      isAnimating = false;
      isMenuOpen = !isMenuOpen;
    },
    onReverseComplete: () => {
      gsap.set(menu, { display: "none" });
      nav.classList.remove("is-open");
      isAnimating = false;
      isMenuOpen = false;
    },
  });

  menuTl
    .to(
      lineTop,
      {
        y: 6,
        rotate: -135,
        duration: durationBase,
      },
      0
    )
    .to(
      lineBottom,
      {
        y: -6,
        rotate: 135,
        duration: durationBase,
      },
      0
    )
    .to(menu, { opacity: 1 }, 0)
    .to(links, { y: "0rem", opacity: 1, stagger: 0.06 }, 0.05);

  function closeMenu() {
    if (isAnimating || !isMenuOpen) return;
    menuTl.timeScale(2).reverse();
  }

  button.addEventListener("click", () => {
    if (isAnimating) return;

    if (!isMenuOpen) {
      menuTl.timeScale(1).play();
    } else {
      closeMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

// HOVER ANIMATIONS

function charsHover() {
  const links = document.querySelectorAll('[data-hover-chars="wrap"]');
  if (!links.length) return;

  links.forEach((link) => {
    const text = link.querySelectorAll('[data-hover-chars="text"]');
    if (!text.length) return;

    const splitTexts = [];
    text.forEach((textEl) => {
      const split = new SplitText(textEl, {
        type: "chars",
        tag: "span",
        charsClass: "char",
      });
      splitTexts.push(split);
    });

    link.addEventListener("mouseenter", () => {
      gsap.killTweensOf([splitTexts[0].chars, splitTexts[1].chars]);

      gsap.set([splitTexts[0].chars, splitTexts[1].chars], {
        yPercent: 0,
      });

      // Run the animation
      gsap
        .timeline({
          defaults: { duration: 0.5, ease: easeBack },
        })
        .to(
          splitTexts[0].chars,
          {
            yPercent: -100,
            stagger: 0.014,
          },
          -0.1
        )
        .to(
          splitTexts[1].chars,
          {
            yPercent: -100,
            stagger: 0.014,
          },
          -0.1
        );
    });

    link.addEventListener("mouseleave", () => {
      gsap.killTweensOf([splitTexts[0].chars, splitTexts[1].chars]);
      gsap.set([splitTexts[0].chars, splitTexts[1].chars], {
        yPercent: 0,
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  lenisScroll();
  loader();
  navScroll();
  copyright();
  wordsScroll();
  linesScroll();
  charsScroll();
  fadeUpScroll();

  gsap.matchMedia().add("(min-width: 992px)", () => {
    parallax();
    charsHover();
  });

  gsap.matchMedia().add("(max-width: 991px)", () => {
    mobileMenu();
  });
});