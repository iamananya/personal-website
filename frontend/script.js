// ==== PROFESSIONAL ANIMATIONS & INTERACTIONS ====

// DOM Elements
const header = document.querySelector('header');
const heroTitle = document.querySelector('.hero-title');
const animatedSections = document.querySelectorAll('.animated-section');
const revealTexts = document.querySelectorAll('.reveal-text');
const skillCards = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');
const statItems = document.querySelectorAll('.stat-item');
const progressBars = document.querySelectorAll('.progress-bar');

// ==== SMOOTH SCROLLING FOR NAVIGATION ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==== ADVANCED SCROLL EFFECTS ====
let ticking = false;

function updateScrollEffects() {
    const scrollTop = window.pageYOffset;
    
    // Header blur effect
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);

// ==== INTERSECTION OBSERVER FOR ANIMATIONS ====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Main animation observer
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // Trigger specific animations
            if (entry.target.classList.contains('section-header')) {
                animateHeaderLine(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all animated elements
[...animatedSections, ...revealTexts, ...document.querySelectorAll('.section-header')].forEach(element => {
    animationObserver.observe(element);
});

// ==== STAGGERED ANIMATIONS FOR CARDS ====
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.skill-card, .project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('in-view');
                }, index * 150);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe card containers
document.querySelectorAll('.skills-grid, .projects-grid').forEach(grid => {
    staggerObserver.observe(grid);
});

// ==== ANIMATED COUNTERS ====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            const numberElement = entry.target.querySelector('.stat-number');
            animateCounter(numberElement, 0, target, 2000);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statItems.forEach(item => {
    counterObserver.observe(item);
});

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ==== SKILL PROGRESS BARS ====
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.progress-bar');
            const width = progressBar.dataset.width;
            
            setTimeout(() => {
                progressBar.style.width = width + '%';
            }, 500);
            
            progressObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillCards.forEach(card => {
    progressObserver.observe(card);
});

// ==== 3D TILT EFFECT ====
function initTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', handleTiltMove);
        element.addEventListener('mouseleave', handleTiltLeave);
    });
}

function handleTiltMove(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
}

function handleTiltLeave(e) {
    const element = e.currentTarget;
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
}

// ==== ACTIVE NAVIGATION HIGHLIGHTING ====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const current = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, {
    threshold: 0.6,
    rootMargin: '-20% 0px -20% 0px'
});

sections.forEach(section => {
    navObserver.observe(section);
});

// ==== ENHANCED CONTACT FORM ====
const contactForm = document.querySelector('.contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

// Form validation and submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Enhanced validation
    if (!validateForm(name, email, message)) {
        return;
    }
    
    // Submit animation
    const submitBtn = this.querySelector('.btn-primary');
    submitBtn.style.transform = 'scale(0.95)';
    submitBtn.innerHTML = '<span>Sending...</span>';
    
    // Simulate sending (replace with actual form submission)
    setTimeout(() => {
        showSuccessMessage();
        this.reset();
        submitBtn.innerHTML = '<span>Send Message</span>';
        submitBtn.style.transform = 'scale(1)';
    }, 2000);
});

function validateForm(name, email, message) {
    const errors = [];
    
    if (!name || name.length < 2) {
        errors.push('Please enter a valid name');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!message || message.length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('. '));
        return false;
    }
    
    return true;
}

function showSuccessMessage() {
    const message = createFloatingMessage('Thank you! I\'ll get back to you soon.', 'success');
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 4000);
}

function showErrorMessage(error) {
    const message = createFloatingMessage(error, 'error');
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 4000);
}

function createFloatingMessage(text, type) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
    }, 100);
    
    return message;
}

// ==== FORM INPUT ANIMATIONS ====
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// ==== TYPING EFFECT FOR HERO TITLE ====
function initTypewriter() {
    const words = heroTitle.querySelectorAll('.word');
    
    words.forEach((word, index) => {
        word.style.animationDelay = `${index * 0.1 + 0.5}s`;
    });
}

// ==== SCROLL INDICATOR ====
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// ==== MOUSE CURSOR EFFECTS ====
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        opacity: 0.3;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, [data-tilt]');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.opacity = '0.6';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.opacity = '0.3';
        });
    });
}

// ==== HELPER FUNCTIONS ====
function animateHeaderLine(header) {
    setTimeout(() => {
        const line = header.querySelector('h2::after');
        if (line) {
            line.style.width = '60px';
        }
    }, 300);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==== PARTICLE SYSTEM FOR HERO BACKGROUND ====
function createParticleSystem() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.6;
    `;
    
    const hero = document.querySelector('.hero');
    hero.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.save();
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.strokeStyle = getComputedStyle(document.documentElement)
                        .getPropertyValue('--primary-color');
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ==== MAGNETIC BUTTONS EFFECT ====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x / rect.width * 10;
            const moveY = y / rect.height * 10;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0px, 0px)';
        });
    });
}

// ==== TEXT SCRAMBLE EFFECT ====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ==== GLITCH EFFECT FOR HEADERS ====
function initGlitchEffect() {
    const headers = document.querySelectorAll('.section-header h2');
    
    headers.forEach(header => {
        header.addEventListener('mouseenter', () => {
            const scrambler = new TextScramble(header);
            scrambler.setText(header.textContent);
        });
    });
}

// ==== LOADING SCREEN ====
function createLoadingScreen() {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 2rem;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 60px;
        height: 60px;
        border: 3px solid var(--border);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    const text = document.createElement('div');
    text.textContent = 'Loading Experience...';
    text.style.cssText = `
        color: var(--text-primary);
        font-size: 1.2rem;
        font-weight: 600;
    `;
    
    loader.appendChild(spinner);
    loader.appendChild(text);
    document.body.appendChild(loader);
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    return loader;
}

// ==== PERFORMANCE MONITORING ====
function initPerformanceMonitoring() {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// ==== ACCESSIBILITY ENHANCEMENTS ====
function initAccessibility() {
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('[data-tilt], .btn, .nav-links a');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        const animations = document.querySelectorAll('*');
        animations.forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// ==== INITIALIZATION ====
document.addEventListener('DOMContentLoaded', () => {
    const loader = createLoadingScreen();
    
    // Initialize all features after a short delay
    setTimeout(() => {
        initTypewriter();
        initTilt();
        createScrollProgress();
        createParticleSystem();
        initMagneticButtons();
        initGlitchEffect();
        initAccessibility();
        initPerformanceMonitoring();
        
        // Hide loading screen
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            loader.remove();
            document.body.classList.add('loaded');
        }, 500);
    }, 1500);
});

// ==== RESIZE HANDLER ====
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent animations
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(element => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
}, 250));

// ==== ERROR HANDLING ====
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // Could implement user-friendly error reporting here
});

// ==== DARK MODE TOGGLE (Optional Enhancement) ====
function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '🌙';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        transition: var(--transition);
    `;
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        toggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
    
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
    });
    
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(toggle);
}

// Uncomment to enable theme toggle
// createThemeToggle();

// ==== EXPORT FOR POTENTIAL MODULE USE ====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TextScramble,
        debounce,
        throttle,
        createParticleSystem,
        initMagneticButtons
    };
}