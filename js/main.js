(() => {
  const WHATSAPP_NUMBER = "528442254900";

  document.body.classList.add("loading");

  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mob-menu");
  const year = document.getElementById("year");
  const marquee = document.getElementById("marquee");
  const form = document.getElementById("wa-form");

  if (year) year.textContent = new Date().getFullYear();

  const hideLoader = () => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("loading");
  };

  window.setTimeout(hideLoader, 2200);
  window.addEventListener("load", () => window.setTimeout(hideLoader, 300));

  const setNavbarState = () => {
    navbar?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  setNavbarState();
  window.addEventListener("scroll", setNavbarState, { passive: true });

  hamburger?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("is-open");
    hamburger.classList.toggle("is-active", Boolean(isOpen));
    hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      hamburger?.classList.remove("is-active");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  if (marquee) {
    const items = [
      "Avalados por la SEP",
      "Sin exámenes",
      "Confiable y seguro",
      "Acuerdo 286",
      "Certificaciones oficiales",
      "Atención por WhatsApp",
      "Saltillo, Coahuila"
    ];
    marquee.innerHTML = [...items, ...items, ...items, ...items]
      .map((item) => `<span>${item}</span>`)
      .join("");
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  const animateCount = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = `${value.toLocaleString("es-MX")}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach(animateCount);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsGrid = document.querySelector(".stats-grid");
  if (statsGrid) statsObserver.observe(statsGrid);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("f-name");
    const interest = document.getElementById("f-interest");
    const message = document.getElementById("f-msg");

    const nameValue = name?.value.trim() || "";
    const messageValue = message?.value.trim() || "";

    if (!nameValue || !messageValue) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola, visité la página de Sarape Consultoría.",
      `Mi nombre es: ${nameValue}.`,
      `Me interesa: ${interest?.value || "Asesoría educativa"}.`,
      `Mi caso: ${messageValue}`
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  class ParticleField {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
      this.options = {
        count: options.count || 48,
        colors: options.colors || ["rgba(255,214,0,0.75)", "rgba(46,125,50,0.55)", "rgba(255,255,255,0.45)"],
        maxSize: options.maxSize || 2.8,
        speed: options.speed || 0.32
      };
      this.particles = [];
      this.resize = this.resize.bind(this);
      this.render = this.render.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
      this.seed();
      requestAnimationFrame(this.render);
    }

    resize() {
      const ratio = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      this.canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    seed() {
      this.particles = Array.from({ length: this.options.count }, () => this.createParticle());
    }

    createParticle(resetX = false) {
      return {
        x: resetX ? -12 : Math.random() * this.width,
        y: Math.random() * this.height,
        size: 0.8 + Math.random() * this.options.maxSize,
        speedX: (0.18 + Math.random() * this.options.speed),
        speedY: -0.1 + Math.random() * 0.2,
        alpha: 0.25 + Math.random() * 0.6,
        color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)]
      };
    }

    render() {
      this.context.clearRect(0, 0, this.width, this.height);

      this.particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > this.width + 12 || particle.y < -12 || particle.y > this.height + 12) {
          this.particles[index] = this.createParticle(true);
          return;
        }

        this.context.globalAlpha = particle.alpha;
        this.context.fillStyle = particle.color;
        this.context.beginPath();
        this.context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.context.fill();
      });

      this.context.globalAlpha = 1;
      requestAnimationFrame(this.render);
    }
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    const heroCanvas = document.getElementById("hero-canvas");
    if (heroCanvas) {
      new ParticleField(heroCanvas, { count: 80, maxSize: 2.4, speed: 0.42 });
    }

    document.querySelectorAll(".particle-canvas").forEach((canvas) => {
      new ParticleField(canvas, {
        count: 34,
        maxSize: 2,
        speed: 0.24,
        colors: ["rgba(255,214,0,0.48)", "rgba(46,125,50,0.42)", "rgba(255,255,255,0.32)"]
      });
    });
  }
})();
