/* ===================================================================
   Talha Ansari — AI Portfolio | Interactive Scripts
   GSAP, Neural Network Canvas, Particles, Chatbot, Animations
   =================================================================== */

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        document.body.classList.remove('no-scroll');
        initAnimations();
    }, 2800);
});
document.body.classList.add('no-scroll');

// ===== GSAP REGISTER =====
gsap.registerPlugin(ScrollTrigger);

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
    if (!cursorGlow.classList.contains('active')) cursorGlow.classList.add('active');
});

// Hide on mobile
if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
}

// ===== PARTICLES CANVAS =====
const particlesCanvas = document.getElementById('particlesCanvas');
const pCtx = particlesCanvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 60;

function resizeParticles() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
    }
    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        pCtx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

function drawParticleConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                pCtx.beginPath();
                pCtx.strokeStyle = `rgba(0, 240, 255, ${0.04 * (1 - dist / 150)})`;
                pCtx.lineWidth = 0.5;
                pCtx.moveTo(particles[i].x, particles[i].y);
                pCtx.lineTo(particles[j].x, particles[j].y);
                pCtx.stroke();
            }
        }
    }
}

function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawParticleConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NEURAL NETWORK CANVAS (Hero) =====
const neuralCanvas = document.getElementById('neuralCanvas');
const nCtx = neuralCanvas.getContext('2d');
let nodes = [];
const NODE_COUNT = 40;

function resizeNeural() {
    neuralCanvas.width = neuralCanvas.parentElement.offsetWidth;
    neuralCanvas.height = neuralCanvas.parentElement.offsetHeight;
    initNodes();
}

function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * neuralCanvas.width,
            y: Math.random() * neuralCanvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 3 + 1.5,
            pulse: Math.random() * Math.PI * 2
        });
    }
}

resizeNeural();
window.addEventListener('resize', resizeNeural);

function animateNeural() {
    nCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const alpha = 0.08 * (1 - dist / 200);
                nCtx.beginPath();
                const gradient = nCtx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                gradient.addColorStop(0, `rgba(0, 240, 255, ${alpha})`);
                gradient.addColorStop(1, `rgba(123, 47, 255, ${alpha})`);
                nCtx.strokeStyle = gradient;
                nCtx.lineWidth = 0.8;
                nCtx.moveTo(nodes[i].x, nodes[i].y);
                nCtx.lineTo(nodes[j].x, nodes[j].y);
                nCtx.stroke();
            }
        }
    }

    // Draw nodes
    nodes.forEach(node => {
        node.pulse += 0.02;
        const pulseSize = Math.sin(node.pulse) * 1.5;

        // glow
        const glow = nCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius + pulseSize + 10);
        glow.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        glow.addColorStop(1, 'rgba(0, 240, 255, 0)');
        nCtx.beginPath();
        nCtx.arc(node.x, node.y, node.radius + pulseSize + 10, 0, Math.PI * 2);
        nCtx.fillStyle = glow;
        nCtx.fill();

        // node
        nCtx.beginPath();
        nCtx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2);
        nCtx.fillStyle = 'rgba(0, 240, 255, 0.6)';
        nCtx.fill();

        // movement
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;
    });

    requestAnimationFrame(animateNeural);
}
animateNeural();

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkElements = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
});

// Hamburger
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Nav links click
navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active nav on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                navLinkElements.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'light' ? '' : 'light');
});

// ===== SCROLL ANIMATIONS =====
function initAnimations() {
    // Animate elements on scroll
    const animElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animElements.forEach(el => observer.observe(el));

    // Skill bars
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    skillFills.forEach(el => skillObserver.observe(el));

    // Timeline line fill
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const timelineFill = document.querySelector('.timeline-line-fill');
        ScrollTrigger.create({
            trigger: timeline,
            start: 'top 80%',
            end: 'bottom 60%',
            onUpdate: (self) => {
                timelineFill.style.height = (self.progress * 100) + '%';
            }
        });
    }

    // Stat counters
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statObserver.observe(el));

    // Hero entrance with GSAP
    gsap.from('.hero-badge', { y: -30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.hero-line.line-1', { y: 30, opacity: 0, duration: 0.8, delay: 0.4 });
    gsap.from('.hero-line.line-2', { y: 30, opacity: 0, duration: 0.8, delay: 0.6 });
    gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, delay: 0.8 });
    gsap.from('.hero-buttons', { y: 30, opacity: 0, duration: 0.8, delay: 1.0 });
    gsap.from('.hero-stats', { y: 30, opacity: 0, duration: 0.8, delay: 1.2 });

    // Code typing widget
    initCodeTyping();
}

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== 3D TILT EFFECT ON TECH CARDS =====
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});

// ===== CODE TYPING WIDGET =====
function initCodeTyping() {
    const codeWidget = document.getElementById('codeTyping');
    const codeContent = document.getElementById('codeContent');

    const codeLines = [
        '<span class="keyword">from</span> fastapi <span class="keyword">import</span> FastAPI',
        '<span class="keyword">from</span> ai_engine <span class="keyword">import</span> NeuralNet',
        '',
        'app = <span class="function">FastAPI</span>()',
        'model = <span class="function">NeuralNet</span>(<span class="string">"gpt-4"</span>)',
        '',
        '<span class="comment"># AI-powered endpoint</span>',
        '<span class="keyword">@app.post</span>(<span class="string">"/generate"</span>)',
        '<span class="keyword">async def</span> <span class="function">generate</span>(prompt: <span class="keyword">str</span>):',
        '    result = <span class="keyword">await</span> model.<span class="function">predict</span>(prompt)',
        '    <span class="keyword">return</span> {<span class="string">"output"</span>: result}',
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentHTML = '';
    let displayedLines = [];

    // Show widget after scroll
    const showObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeWidget.classList.add('visible');
                startTyping();
                showObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) showObserver.observe(aboutSection);

    function startTyping() {
        if (lineIndex >= codeLines.length) {
            // Restart after delay
            setTimeout(() => {
                lineIndex = 0;
                displayedLines = [];
                codeContent.innerHTML = '';
                startTyping();
            }, 4000);
            return;
        }

        const line = codeLines[lineIndex];
        const plainText = line.replace(/<[^>]*>/g, '');

        if (plainText.length === 0) {
            displayedLines.push('');
            codeContent.innerHTML = displayedLines.join('\n');
            lineIndex++;
            setTimeout(startTyping, 200);
            return;
        }

        // Type character by character (using plain text for timing, HTML for rendering)
        if (charIndex < plainText.length) {
            charIndex++;
            // Build partial line — show full HTML up to charIndex of plain text
            const partialLine = getPartialHTML(line, charIndex);
            const allLines = [...displayedLines, partialLine + '<span class="cursor-blink">|</span>'];
            codeContent.innerHTML = allLines.join('\n');
            setTimeout(startTyping, 30 + Math.random() * 40);
        } else {
            displayedLines.push(line);
            charIndex = 0;
            lineIndex++;
            codeContent.innerHTML = displayedLines.join('\n');
            setTimeout(startTyping, 150);
        }
    }

    function getPartialHTML(html, visibleChars) {
        let result = '';
        let chars = 0;
        let inTag = false;

        for (let i = 0; i < html.length; i++) {
            if (html[i] === '<') {
                inTag = true;
                result += html[i];
            } else if (html[i] === '>') {
                inTag = false;
                result += html[i];
            } else if (inTag) {
                result += html[i];
            } else {
                if (chars < visibleChars) {
                    result += html[i];
                    chars++;
                }
            }
        }
        return result;
    }
}

// ===== CHATBOT =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbot = document.getElementById('chatbot');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatbotBody = document.getElementById('chatbotBody');

chatbotToggle.addEventListener('click', () => chatbot.classList.toggle('open'));
chatbotClose.addEventListener('click', () => chatbot.classList.remove('open'));

const chatResponses = {
    'skills': "Talha is skilled in Python, FastAPI, JavaScript, AI/ML, REST APIs, Docker, and modern frontend technologies. He specializes in AI-powered full-stack applications! 🚀",
    'projects': "Check out some of Talha's key projects: AI Caption Generator, WhatsApp AI Automation, Meta Ads Dashboard, and AI CV Generator. Scroll to the Projects section for details! 💼",
    'experience': "Talha has 3+ years of experience as an AI Full Stack Developer, including freelance AI engineering and continuous research in cutting-edge technologies. 📊",
    'contact': "You can reach Talha via the Contact form on this page, or connect through LinkedIn and GitHub. Links are in the Contact section below! 📧",
    'hello': "Hey there! 👋 Welcome to Talha's portfolio. I can tell you about his skills, projects, experience, or how to contact him. What would you like to know?",
    'hi': "Hello! 😊 Great to meet you. Ask me about Talha's skills, projects, or experience!",
    'who': "Talha Ansari is an AI Full Stack Engineer who builds intelligent, scalable applications. He combines AI expertise with modern web development to create innovative solutions. 🧠",
    'python': "Python is Talha's primary language! He uses it for AI/ML development, FastAPI backends, automation scripts, and data processing. Expertise level: 95%! 🐍",
    'fastapi': "Talha is an expert FastAPI developer — building high-performance async APIs with automatic documentation, type validation, and modern architecture patterns. ⚡",
    'ai': "Talha specializes in AI technologies including OpenAI GPT, Google Gemini, Hugging Face models, and custom ML pipelines. He builds AI-powered solutions that solve real problems! 🤖",
};

function getBotResponse(input) {
    const lower = input.toLowerCase();
    for (const [key, response] of Object.entries(chatResponses)) {
        if (lower.includes(key)) return response;
    }
    return "That's a great question! While I can answer basics about Talha's skills, projects, and experience, for specific inquiries please use the contact form. Try asking about 'skills', 'projects', or 'experience'! 😊";
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    div.innerHTML = `<p>${text}</p>`;
    chatbotBody.appendChild(div);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function handleChat() {
    const input = chatInput.value.trim();
    if (!input) return;

    addMessage(input, 'user');
    chatInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
        addMessage(getBotResponse(input), 'bot');
    }, 600);
}

chatSend.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sendBtn = contactForm.querySelector('.btn-send');
    sendBtn.classList.add('loading');

    setTimeout(() => {
        sendBtn.classList.remove('loading');
        // Reset
        contactForm.reset();
        // Show success
        const originalText = sendBtn.querySelector('span').textContent;
        sendBtn.querySelector('span').textContent = 'Message Sent! ✓';
        sendBtn.querySelector('span').style.color = '#28c840';
        setTimeout(() => {
            sendBtn.querySelector('span').textContent = originalText;
            sendBtn.querySelector('span').style.color = '';
        }, 3000);
    }, 1500);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== PAGE TRANSITION =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
