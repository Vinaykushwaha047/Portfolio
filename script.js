function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}


// Credentials
const SERVICE_ID = "service_83wgp1g";
const TEMPLATE_ID = "template_zx7f3bf";
const PUBLIC_KEY = "BsdmZmKRycZ5-8X5c";

// DOM Elements
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

if (window.emailjs) {
  window.emailjs.init({ publicKey: PUBLIC_KEY });
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!window.emailjs) {
    formStatus.innerText = "Email service is unavailable. Please email me directly.";
    formStatus.style.color = "#d32f2f";
    return;
  }

  // Prevent multiple clicks
  submitBtn.disabled = true;
  submitBtn.innerText = "Sending...";
  formStatus.innerText = "";

  // Send the form values directly to EmailJS
  window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
    .then(function () {
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";
      
      formStatus.innerText = "Message sent successfully!";
      formStatus.style.color = "#2e7d32"; // Success green

      contactForm.reset();
      }).catch(function (error) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";

        formStatus.innerText = error?.text || "Failed to send message. Please try again.";
      formStatus.style.color = "#d32f2f"; // Error red
      
      console.error("EmailJS Submission Error:", error);
    });
});