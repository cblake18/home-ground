document.addEventListener('DOMContentLoaded', function() {
    // Perlin Noise implementation
    class PerlinNoise {
        constructor() {
            this.permutation = [];
            for (let i = 0; i < 256; i++) {
                this.permutation[i] = i;
            }
            // Shuffle
            for (let i = 255; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
            }
            // Duplicate
            for (let i = 0; i < 256; i++) {
                this.permutation[i + 256] = this.permutation[i];
            }
        }

        fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        lerp(t, a, b) {
            return a + t * (b - a);
        }

        grad(hash, x, y) {
            const h = hash & 3;
            const u = h < 2 ? x : y;
            const v = h < 2 ? y : x;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }

        noise(x, y) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            
            x -= Math.floor(x);
            y -= Math.floor(y);
            
            const u = this.fade(x);
            const v = this.fade(y);
            
            const a = this.permutation[X] + Y;
            const aa = this.permutation[a];
            const ab = this.permutation[a + 1];
            const b = this.permutation[X + 1] + Y;
            const ba = this.permutation[b];
            const bb = this.permutation[b + 1];
            
            return this.lerp(v,
                this.lerp(u, this.grad(this.permutation[aa], x, y), this.grad(this.permutation[ba], x - 1, y)),
                this.lerp(u, this.grad(this.permutation[ab], x, y - 1), this.grad(this.permutation[bb], x - 1, y - 1))
            );
        }
    }

    // Cloud drawing function using Perlin noise
    function drawPerlinClouds(canvas) {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const perlin = new PerlinNoise();
        let time = 0;
        let animationId;
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create image data for pixel manipulation
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;
            
            // Scale factors for noise
            const scale = 0.005;
            const timeScale = 0.0001;
            
            for (let x = 0; x < canvas.width; x += 2) { // Skip pixels for performance
                for (let y = 0; y < canvas.height; y += 2) {
                    // Generate multiple octaves for more complex patterns
                    let value = 0;
                    let amplitude = 1;
                    let frequency = 1;
                    let maxValue = 0;
                    
                    for (let i = 0; i < 4; i++) {
                        value += perlin.noise(
                            x * scale * frequency + time * timeScale,
                            y * scale * frequency
                        ) * amplitude;
                        
                        maxValue += amplitude;
                        amplitude *= 0.5;
                        frequency *= 2;
                    }
                    
                    value = value / maxValue;
                    value = (value + 1) / 2; // Normalize to 0-1
                    
                    // Create threshold for cloud-like appearance
                    if (value > 0.4) {
                        const intensity = (value - 0.4) / 0.6;
                        const index = (y * canvas.width + x) * 4;
                        
                        // Mix purple and dark grey based on noise value
                        if (value > 0.6) {
                            // Purple areas
                            data[index] = 142 * intensity;     // R
                            data[index + 1] = 68 * intensity;  // G
                            data[index + 2] = 173 * intensity; // B
                            data[index + 3] = intensity * 180; // A
                        } else {
                            // Dark grey areas
                            data[index] = 60 * intensity;      // R
                            data[index + 1] = 60 * intensity;  // G
                            data[index + 2] = 70 * intensity;  // B
                            data[index + 3] = intensity * 150; // A
                        }
                        
                        // Fill skipped pixels
                        if (x + 1 < canvas.width) {
                            const indexRight = (y * canvas.width + (x + 1)) * 4;
                            data[indexRight] = data[index];
                            data[indexRight + 1] = data[index + 1];
                            data[indexRight + 2] = data[index + 2];
                            data[indexRight + 3] = data[index + 3];
                        }
                        if (y + 1 < canvas.height) {
                            const indexBelow = ((y + 1) * canvas.width + x) * 4;
                            data[indexBelow] = data[index];
                            data[indexBelow + 1] = data[index + 1];
                            data[indexBelow + 2] = data[index + 2];
                            data[indexBelow + 3] = data[index + 3];
                        }
                    }
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            time += 16;
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // Return cleanup function
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }

    // Initialize Perlin clouds
    const heroCanvas = document.getElementById('hero-fractal');
    const contactCanvas = document.getElementById('contact-fractal');
    
    if (heroCanvas) {
        console.log('Initializing hero canvas Perlin noise');
        drawPerlinClouds(heroCanvas);
    }
    
    if (contactCanvas) {
        console.log('Initializing contact canvas Perlin noise');
        drawPerlinClouds(contactCanvas);
    }
    
    // Single resize handler for canvases
    window.addEventListener('resize', () => {
        const heroCanvasResize = document.getElementById('hero-fractal');
        const contactCanvasResize = document.getElementById('contact-fractal');
        
        if (heroCanvasResize) {
            heroCanvasResize.width = heroCanvasResize.offsetWidth;
            heroCanvasResize.height = heroCanvasResize.offsetHeight;
        }
        if (contactCanvasResize) {
            contactCanvasResize.width = contactCanvasResize.offsetWidth;
            contactCanvasResize.height = contactCanvasResize.offsetHeight;
        }
    });

    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link-item');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    // Sound effects
    const keyClick1 = document.getElementById('keyClick1');
    const keyClick2 = document.getElementById('keyClick2');
    const keyClick3 = document.getElementById('keyClick3');
    
    const keyElements = document.querySelectorAll('.key');
    const keyInputs = document.querySelectorAll('.key-input');
    
    keyElements.forEach(key => {
        key.addEventListener('mousedown', function() {
            this.classList.add('active');
            playRandomKeySound();
        });
        key.addEventListener('mouseup', function() {
            this.classList.remove('active');
        });
        key.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
    
    keyInputs.forEach(input => {
        input.addEventListener('keydown', () => playRandomKeySound());
    });
    
    function playRandomKeySound() {
        const sounds = [keyClick1, keyClick2, keyClick3];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        if (randomSound && randomSound.play) {
            randomSound.currentTime = 0;
            randomSound.volume = 0.3;
            randomSound.play().catch(e => {});
        }
    }
    
    // Color animation
    function updateSilverBlueColors() {
        const time = Date.now() * 0.0003;
        const hue1 = 210 + Math.sin(time) * 5;
        const hue2 = 220 + Math.cos(time) * 5;
        const hue3 = 200 + Math.sin(time + 1) * 5;
        document.documentElement.style.setProperty('--highlight', `hsl(${hue1}, 25%, 48%)`);
        document.documentElement.style.setProperty('--accent', `hsl(${hue2}, 30%, 70%)`);
        document.documentElement.style.setProperty('--highlight-secondary', `hsl(${hue3}, 30%, 35%)`);
    }
    setInterval(updateSilverBlueColors, 1000);
    
    // Typing effect
    function typeEffect(element, text, speed = 70, callback = null) {
        if (!element || !text) return;
        let i = 0;
        element.textContent = '';
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else if (callback) {
                callback();
            }
        }
        typing();
    }
    
    const headings = [
        document.getElementById('hero-title'),
        document.getElementById('hero-subtitle'),
        document.getElementById('about-heading'),
        document.getElementById('skills-heading'),
        document.getElementById('projects-heading'),
        document.getElementById('contact-heading')
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (!element) return;
                
                const originalText = element.dataset.originalText;
                
                if (!element.classList.contains('typed')) {
                    element.classList.add('typed');
                    typeEffect(element, originalText);
                    
                    if (element.tagName === 'H2') {
                        setTimeout(() => {
                            element.classList.add('typing');
                        }, (originalText.length || 0) * 70 + 100);
                    }
                }
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    headings.forEach(heading => {
        if (heading) {
            const originalText = heading.textContent;
            heading.textContent = '';
            heading.dataset.originalText = originalText;
            observer.observe(heading);
        }
    });

    const logoElement = document.getElementById('logo');
    if (logoElement) {
        const originalLogoText = logoElement.textContent;
        typeEffect(logoElement, originalLogoText);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.textContent = "Message Sent!";
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        this.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.classList.contains('nav-link-item')) return;
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Skill items interaction
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.add('active');
            playRandomKeySound();
            setTimeout(() => {
                this.classList.remove('active');
            }, 200);
        });
    });
    
    // Mouse movement effects
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const gridElements = document.querySelectorAll('.keyboard-grid');
        gridElements.forEach(grid => {
            grid.style.backgroundPosition = `${x * 10}px ${y * 10}px`;
        });
        
        // Metal surface effect move
        const metalSurface = document.querySelector('.metal-surface');
        if (metalSurface) {
            metalSurface.style.backgroundPosition = `${x * 30}% ${y * 30}%`;
        }
    });
});