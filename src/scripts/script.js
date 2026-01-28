(function() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  if (!hamburger || !navMenu) {
    return;
  }

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.main-nav')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
})();

(function() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  const currentTheme = localStorage.getItem('theme') || 'light-mode';
  
  if (currentTheme === 'dark-mode') {
    body.classList.add('dark-mode');
    updateThemeIcon(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      
      const isDarkMode = body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
      updateThemeIcon(isDarkMode);
    });
  }

  function updateThemeIcon(isDarkMode) {
    const icon = themeToggle.querySelector('i');
    if (isDarkMode) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }
})();

(function() {
  const nav = document.getElementById('mainNav');
  const spacer = document.getElementById('navSpacer');
  if (!nav || !spacer) {
    return;
  }

  function updateSticky() {
    const isSticky = window.scrollY > 8;
    nav.classList.toggle('is-sticky', isSticky);
    spacer.style.height = isSticky ? `${nav.offsetHeight}px` : '0px';
  }

  updateSticky();
  window.addEventListener('scroll', updateSticky, { passive: true });
  window.addEventListener('resize', updateSticky);
})();

document.addEventListener('DOMContentLoaded', function() {

  emailjs.init('UlZ5ORSMxR6zApCRO');

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const visitorName = document.getElementById('visitor_name').value;
      const visitorEmail = document.getElementById('visitor_email').value;
      const messageContent = document.getElementById('message_content').value;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const templateParams = {
        to_email: 'saddambubt65@gmail.com',
        from_name: visitorName,
        from_email: visitorEmail,
        message: messageContent,
        time: new Date().toLocaleString()
      };

      emailjs.send('service_c2ld34l', 'template_1b8tnfb', templateParams)
        .then(function() {
          contactForm.style.display = 'none';
          const thankYouMessage = document.getElementById('thank-you-message');
          if (thankYouMessage) {
            thankYouMessage.style.display = 'block';
          }

          contactForm.reset();
        }, function(error) {
          console.error('Failed to send email:', error);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
          alert('Failed to send message. Please try again or contact directly at saddambubt65@gmail.com');
        });
    });
  }

  fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const aboutContent = document.getElementById('about-content');
      if (aboutContent) {
        aboutContent.textContent = data.personalInfo.aboutMe;
      }

      const skillGroupsContainer = document.querySelector('.skill-groups');
      if (skillGroupsContainer) {
        for (const category in data.skills) {
          if (data.skills.hasOwnProperty(category)) {
            const skillGroupDiv = document.createElement('div');
            skillGroupDiv.classList.add('skill-group');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = category;
            skillGroupDiv.appendChild(categoryHeading);

            const skillsList = document.createElement('ul');
            skillsList.classList.add('skills-list');

            data.skills[category].forEach((skill) => {
              const li = document.createElement('li');
              li.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
              skillsList.appendChild(li);
            });
            skillGroupDiv.appendChild(skillsList);
            skillGroupsContainer.appendChild(skillGroupDiv);
          }
        }
      }

      const experienceSection = document.querySelector(
        '#experience .experience-list'
      );
      if (experienceSection) {
        data.experience.forEach((exp) => {
          const expItem = document.createElement('div');
          expItem.classList.add('experience-item');
          expItem.innerHTML = `
              <h3>${exp.title}</h3>
              <p class="item-meta">${exp.company} | ${exp.duration}</p>
              <ul>
                  ${exp.responsibilities.map((resp) => `<li>${resp}</li>`).join('')}
              </ul>
          `;
          experienceSection.appendChild(expItem);
        });
      }

      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        data.projects.forEach((project) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-item');
          projectItem.innerHTML = `
              <h3>${project.title}</h3>
              <p class="item-meta"><a href="${project.link}" target="_blank">Live link</a></p>
              <p>${project.description}</p>
          `;
          projectsSection.appendChild(projectItem);
        });
      }

      const educationSection = document.getElementById('education');
      if (educationSection) {
        data.education.forEach((edu) => {
          const eduItem = document.createElement('div');
          eduItem.classList.add('education-item');
          eduItem.innerHTML = `
              <h3><i class="${edu.icon}"></i> ${edu.degree}</h3>
              <p class="item-meta"> ${edu.institution}</p>
              <div class="year-location-container">
                <p> <i class="fas fa-calendar-alt"></i> ${edu.year}</p>
                <p> <i class="fas fa-map-marker-alt"></i> Dhaka, Bangladesh</p>
              </div>
              ${edu.details
                .map((detail) => {
                  if (detail.startsWith('Notable Courses:')) {
                    const parts = detail.split(':');
                    return `<p class="notable-courses-text"><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</p>`;
                  } else {
                    return `<p>${detail}</p>`;
                  }
                })
                .join('')}
          `;
          educationSection.appendChild(eduItem);
        });
      }

      const socialIconsContainer = document.querySelector(
        '.social-icons-contact'
      );
      if (socialIconsContainer) {
        data.socialLinks.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.url;
          a.target = '_blank';
          a.classList.add('social-icon');
          a.setAttribute('aria-label', link.name);
          a.innerHTML = `<i class="${link.icon}"></i>`;
          socialIconsContainer.appendChild(a);
        });
      }

      const currentYear = document.getElementById('current-year');
      if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
      }
      const footerName = document.getElementById('footer-name');
      if (footerName) {
        footerName.textContent = data.personalInfo.name;
      }
    })
    .catch((error) => console.error('Error loading CV data:', error));
});

(function() {
  const targets = document.querySelectorAll('.section');
  if (!targets.length) return;

  targets.forEach((section) => section.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((section) => observer.observe(section));
})();
