// Typing Effect
const typingTexts = ['Junior Developer', 'Web Developer', 'Problem Solver', 'Creative Coder'];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeText() {
    if (!typingElement) return;
    
    const currentText = typingTexts[currentTextIndex];
    
    if (!isDeleting && currentCharIndex < currentText.length) {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        setTimeout(typeText, 100);
    } else if (isDeleting && currentCharIndex > 0) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        setTimeout(typeText, 50);
    } else if (!isDeleting && currentCharIndex === currentText.length) {
        setTimeout(() => {
            isDeleting = true;
            typeText();
        }, 2000);
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        setTimeout(typeText, 500);
    }
}

// Start typing effect when page loads
if (typingElement) {
    setTimeout(typeText, 1000);
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ri-menu-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        }
    });
}

// Close mobile menu when clicking on a link
if (navLinksItems.length > 0 && menuToggle) {
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
    });
}

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight - 200) {
            current = sectionId;
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('load', setActiveNavLink);

// Smooth Scroll for Navigation Links
navLinksArray.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and project tiles
document.querySelectorAll('section, .project-tile, .skill-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Navbar Background on Scroll
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.backgroundColor = 'rgba(35, 41, 70, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.backgroundColor = 'rgba(35, 41, 70, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Projects Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            if (targetTab === 'featured') {
                document.getElementById('featured-projects').classList.add('active');
            } else if (targetTab === 'github') {
                document.getElementById('github-projects').classList.add('active');
                // Load GitHub projects if not already loaded
                if (!document.getElementById('github-projects-grid').hasAttribute('data-loaded')) {
                    loadGitHubProjects();
                }
            }
        });
    });
}

// Fetch GitHub Projects
async function loadGitHubProjects() {
    const githubProjectsGrid = document.getElementById('github-projects-grid');
    if (!githubProjectsGrid) return;
    
    try {
        const username = 'masummgr01';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub projects');
        }
        
        const repos = await response.json();
        
        // Filter out Portfolio-Website and forked repos, sort by updated date
        const filteredRepos = repos
            .filter(repo => !repo.fork && repo.name.toLowerCase() !== 'portfolio-website')
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 12); // Limit to 12 most recent projects
        
        githubProjectsGrid.innerHTML = '';
        githubProjectsGrid.setAttribute('data-loaded', 'true');
        
        if (filteredRepos.length === 0) {
            githubProjectsGrid.innerHTML = '<div class="loading-spinner"><p>No projects found</p></div>';
            return;
        }
        
        filteredRepos.forEach(repo => {
            const projectCard = createProjectCard(repo);
            githubProjectsGrid.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        githubProjectsGrid.innerHTML = '<div class="loading-spinner"><p>Error loading projects. Please try again later.</p></div>';
    }
}

// Create Project Card from GitHub Repo
function createProjectCard(repo) {
    const card = document.createElement('a');
    card.href = repo.html_url;
    card.target = '_blank';
    card.className = 'project-tile';
    
    const language = repo.language || 'Code';
    const languageColor = getLanguageColor(repo.language);
    
    card.innerHTML = `
        <div class="project-image">
            <div class="github-repo-placeholder" style="background: linear-gradient(135deg, ${languageColor}20, ${languageColor}40);">
                <i class="ri-github-fill" style="font-size: 64px; color: ${languageColor};"></i>
            </div>
            <div class="project-overlay">
                <i class="ri-external-link-line"></i>
            </div>
        </div>
        <div class="project-info">
            <h3><span>&lt;</span>${repo.name}<span>/&gt;</span></h3>
            <p>${repo.description || 'No description available'}</p>
            <div class="repo-stats">
                <span class="repo-stat"><i class="ri-star-line"></i> ${repo.stargazers_count}</span>
                <span class="repo-stat"><i class="ri-git-branch-line"></i> ${repo.forks_count}</span>
                <span class="repo-stat" style="color: ${languageColor}"><i class="ri-circle-fill"></i> ${language}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Get Language Color
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Python': '#3776ab',
        'Java': '#ed8b00',
        'HTML': '#e34c26',
        'CSS': '#1572b6',
        'PHP': '#777bb4',
        'Ruby': '#cc342d',
        'Go': '#00add8',
        'Rust': '#000000',
        'C++': '#00599c',
        'C': '#a8b9cc',
        'C#': '#239120',
        'Swift': '#fa7343',
        'Kotlin': '#7f52ff',
        'Dart': '#0175c2',
        'Vue': '#4fc08d',
        'React': '#61dafb',
        'Angular': '#dd0031',
        'Node.js': '#339933',
        'Default': '#eebbc3'
    };
    return colors[language] || colors['Default'];
}


