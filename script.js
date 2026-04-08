const form = document.getElementById('contactForm');
const responseMsg = document.getElementById('responseMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  responseMsg.textContent = "Thanks! Your message has been sent.";
  form.reset();
});
