document.documentElement.classList.add("js-enabled");

const navLinks = document.getElementById("navLinks");
const menuToggle = document.querySelector(".menu-toggle");

function setMenuOpen(isOpen) {
  if (!navLinks || !menuToggle) return;

  navLinks.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.innerHTML = `<i class="fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}" aria-hidden="true"></i>`;
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
let scrollFrameRequested = false;

function updateScrollUI() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progress}%`;
  backToTop?.classList.toggle("visible", window.scrollY > 500);
  scrollFrameRequested = false;
}

window.addEventListener("scroll", () => {
  if (scrollFrameRequested) return;
  scrollFrameRequested = true;
  window.requestAnimationFrame(updateScrollUI);
}, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateScrollUI();

const revealItems = document.querySelectorAll(
  ".section-title, .about-card, .skill-box, .project-card, .certificate-link, .edu-card, .contact-form-shell"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${(index % 4) * 65}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = document.querySelectorAll("main section[id], body > section[id]");
const sectionLinks = navLinks?.querySelectorAll('a[href^="#"]') ?? [];

if ("IntersectionObserver" in window && sectionLinks.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

// EmailJS credentials
const SERVICE_ID = "service_83wgp1g";
const TEMPLATE_ID = "template_zx7f3bf";
const PUBLIC_KEY = "BsdmZmKRycZ5-8X5c";

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

if (window.emailjs) {
  window.emailjs.init({ publicKey: PUBLIC_KEY });
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!window.emailjs || !submitBtn || !formStatus) {
    if (formStatus) {
      formStatus.textContent = "Email service is unavailable. Please email me directly.";
      formStatus.dataset.state = "error";
    }
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  formStatus.textContent = "";
  formStatus.dataset.state = "";

  try {
    await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm);
    formStatus.textContent = "Message sent successfully!";
    formStatus.dataset.state = "success";
    contactForm.reset();
  } catch (error) {
    console.error("EmailJS submission failed:", error);
    formStatus.textContent = error?.text || "Failed to send message. Please try again.";
    formStatus.dataset.state = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});
