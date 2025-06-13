const particlesConfig = {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: ["#6e48aa", "#9d50bb", "#4776e6"] },
    shape: { type: "circle" },
    opacity: { value: 0.8, random: true },
    size: { value: 5, random: true },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: true,
      out_mode: "out",
      attract: { enable: true, rotateX: 600, rotateY: 1200 }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: false },
      onclick: { enable: false },
      resize: true
    }
  },
  retina_detect: true
};

// Load particles.js dynamically
function loadParticles() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  script.onload = () => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', particlesConfig);
    }
  };
  document.body.appendChild(script);
}

// Trigger particles on big wins
function triggerParticles() {
  const particlesDiv = document.createElement('div');
  particlesDiv.id = 'particles-js';
  particlesDiv.style.position = 'absolute';
  particlesDiv.style.width = '100%';
  particlesDiv.style.height = '100%';
  particlesDiv.style.top = '0';
  particlesDiv.style.left = '0';
  particlesDiv.style.zIndex = '100';
  particlesDiv.style.pointerEvents = 'none';
  
  document.querySelector('.slot-machine').appendChild(particlesDiv);
  loadParticles();

  // Remove after 3 seconds
  setTimeout(() => {
    particlesDiv.remove();
  }, 3000);
}

// Export for use in slot-machine.js
if (typeof module !== 'undefined') {
  module.exports = { particlesConfig, triggerParticles };
}