document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  // Enhanced scroll handling
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScroll = currentScroll;
  });

  // Terminal-style typing effect for logo
  const logo = document.querySelector(".nav-logo");
  const text = logo.textContent;
  logo.textContent = "";

  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      logo.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      // Add blinking cursor after typing
      const cursor = document.createElement("span");
      cursor.textContent = "_";
      cursor.style.animation = "blink 1s step-end infinite";
      logo.appendChild(cursor);
    }
  };

  typeWriter();

  // Code comment tooltips
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const label = link.getAttribute("data-label");
      link.setAttribute("data-tooltip", `// ${label}`);
    });
  });

  // Active link handling with code syntax
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Simulate code execution
      console.log(`executing: ${link.getAttribute("data-label")}.js`);
    });
  });

  // Mobile menu with code theme
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    document.querySelector(".nav-links").style.display =
      document.querySelector(".nav-links").style.display === "none"
        ? "flex"
        : "none";
  });

  // GitHub API Integration
  const GITHUB_USERNAME = "frinklx";
  const GITHUB_TOKEN =
    "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"; // You'll need to use environment variables in production

  async function fetchGitHubData() {
    try {
      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
      };

      // Fetch user data
      const userData = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
        {
          headers,
        }
      ).then((res) => res.json());

      // Update stats
      document.getElementById("repo-count").textContent = userData.public_repos;
      document.getElementById("followers-count").textContent =
        userData.followers;
      document.getElementById("profile-img").src = userData.avatar_url;

      // Fetch repositories
      const repos = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=6`,
        {
          headers,
        }
      ).then((res) => res.json());

      // Calculate total stars
      const totalStars = repos.reduce(
        (acc, repo) => acc + repo.stargazers_count,
        0
      );
      document.getElementById("stars-count").textContent = totalStars;

      // Display repositories
      const repoCards = document.getElementById("repo-cards");
      repoCards.innerHTML = repos
        .map(
          (repo) => `
            <a href="${repo.html_url}" class="repo-card" target="_blank">
              <h3>
                <i class="far fa-folder"></i>
                ${repo.name}
              </h3>
              <p>${repo.description || "No description available"}</p>
              <div class="repo-meta">
                <span><i class="fas fa-star"></i> ${
                  repo.stargazers_count
                }</span>
                <span><i class="fas fa-code-branch"></i> ${
                  repo.forks_count
                }</span>
                <span>${repo.language || "N/A"}</span>
              </div>
            </a>
          `
        )
        .join("");
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  }

  // Typing effect for role
  function typeRole() {
    const roles = [
      "Full Stack Developer",
      "UI/UX Enthusiast",
      "Open Source Contributor",
    ];
    const roleElement = document.getElementById("role-text");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        roleElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        roleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // Initialize
  fetchGitHubData();
  typeRole();

  // Contact Form Handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Add your form submission logic here
      console.log("Form submitted:", data);

      // Example: Show success message
      const submitBtn = contactForm.querySelector(".submit-btn");
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      submitBtn.style.background = "var(--success-green)";

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.style.background = "var(--blue)";
      }, 3000);
    });
  }
});
