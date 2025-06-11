document.addEventListener('DOMContentLoaded', function() {
 // Initialize EmailJS once when the page loads
    if (typeof emailjs !== 'undefined') {
        emailjs.init("sSqyl_v4Vrj4_6k2M");
    } else {
        console.error('EmailJS library not loaded.');
    }

    // Performance detection
    let performanceLevel = 'high'; // 'low', 'medium', 'high'
    
    function detectPerformance(callback) {
        let fps = 0;
        let frameCount = 0;
        let lastTime = performance.now();
        const testDuration = 500; // Test for 500ms
        
        function measureFrame() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= testDuration) {
                fps = (frameCount * 1000) / (currentTime - lastTime);
                
                // Determine performance level
                if (fps < 30) {
                    performanceLevel = 'low';
                } else if (fps < 50) {
                    performanceLevel = 'medium';
                } else {
                    performanceLevel = 'high';
                }
                
                console.log(`Detected FPS: ${fps.toFixed(1)}, Performance: ${performanceLevel}`);
                callback(performanceLevel);
            } else {
                requestAnimationFrame(measureFrame);
            }
        }
        
        requestAnimationFrame(measureFrame);
    }
    
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
    function drawPerlinClouds(canvas, quality = performanceLevel) {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const perlin = new PerlinNoise();
        let time = 0;
        let animationId;
        let isPaused = true;
        
        // Adjust quality settings based on performance
        const qualitySettings = {
            low: { pixelSkip: 4, octaves: 2, frameSkip: 2 },
            medium: { pixelSkip: 3, octaves: 3, frameSkip: 1 },
            high: { pixelSkip: 2, octaves: 4, frameSkip: 0 }
        };
        
        const settings = qualitySettings[quality];
        let frameCounter = 0;
        
        function animate() {
            if (isPaused) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            // Skip frames for low performance
            if (frameCounter++ % (settings.frameSkip + 1) !== 0) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create image data for pixel manipulation
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;
            
            // Scale factors for noise
            const scale = 0.005;
            const timeScale = 0.0001;
            
            for (let x = 0; x < canvas.width; x += settings.pixelSkip) {
                for (let y = 0; y < canvas.height; y += settings.pixelSkip) {
                    // Generate multiple octaves for more complex patterns
                    let value = 0;
                    let amplitude = 1;
                    let frequency = 1;
                    let maxValue = 0;
                    
                    for (let i = 0; i < settings.octaves; i++) {
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
                        for (let dx = 0; dx < settings.pixelSkip; dx++) {
                            for (let dy = 0; dy < settings.pixelSkip; dy++) {
                                if (x + dx < canvas.width && y + dy < canvas.height) {
                                    const fillIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
                                    data[fillIndex] = data[index];
                                    data[fillIndex + 1] = data[index + 1];
                                    data[fillIndex + 2] = data[index + 2];
                                    data[fillIndex + 3] = data[index + 3];
                                }
                            }
                        }
                    }
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            time += 16;
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // Return control object
        return {
            start: () => { isPaused = false; },
            stop: () => { isPaused = true; },
            cleanup: () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        };
    }

    // Track typing animations
    let typingAnimationsComplete = 0;
    const totalTypingAnimations = 7; // hero title, subtitle, logo, and section headings
    let cloudAnimations = [];
    
    function onTypingComplete() {
        typingAnimationsComplete++;
        console.log(`Typing animation complete: ${typingAnimationsComplete}/${totalTypingAnimations}`);
        
        if (typingAnimationsComplete >= totalTypingAnimations) {
            console.log('All typing animations complete, starting Perlin clouds');
            // Start all cloud animations
            cloudAnimations.forEach(anim => {
                console.log('Starting cloud animation');
                anim.start();
            });
        }
    }
    
    // Initialize Perlin clouds (but don't start them yet)
    detectPerformance((detectedLevel) => {
        performanceLevel = detectedLevel;
        
        const heroCanvas = document.getElementById('hero-fractal');
        const contactCanvas = document.getElementById('contact-fractal');
        
        if (heroCanvas) {
            console.log('Initializing hero canvas Perlin noise');
            const heroAnim = drawPerlinClouds(heroCanvas, performanceLevel);
            cloudAnimations.push(heroAnim);
        }
        
        if (contactCanvas) {
            console.log('Initializing contact canvas Perlin noise');
            const contactAnim = drawPerlinClouds(contactCanvas, performanceLevel);
            cloudAnimations.push(contactAnim);
        }
    });
    
    // Single resize handler for canvases
    window.addEventListener('resize', () => {
        // Re-detect performance on significant resize (might be switching device orientation)
        detectPerformance((newLevel) => {
            if (newLevel !== performanceLevel) {
                performanceLevel = newLevel;
                console.log(`Performance level changed to: ${performanceLevel}`);
                
                // Recreate animations with new performance level
                cloudAnimations.forEach(anim => anim.cleanup());
                cloudAnimations = [];
                
                const heroCanvas = document.getElementById('hero-fractal');
                const contactCanvas = document.getElementById('contact-fractal');
                
                if (heroCanvas) {
                    const heroAnim = drawPerlinClouds(heroCanvas, performanceLevel);
                    if (typingAnimationsComplete >= totalTypingAnimations) {
                        heroAnim.start();
                    }
                    cloudAnimations.push(heroAnim);
                }
                
                if (contactCanvas) {
                    const contactAnim = drawPerlinClouds(contactCanvas, performanceLevel);
                    if (typingAnimationsComplete >= totalTypingAnimations) {
                        contactAnim.start();
                    }
                    cloudAnimations.push(contactAnim);
                }
            }
        });
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
            } else {
                // Always call onTypingComplete when done
                onTypingComplete();
                if (callback) {
                    callback();
                }
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
            
            // Check if element is already in viewport
            setTimeout(() => {
                const rect = heading.getBoundingClientRect();
                const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
                if (inViewport && !heading.classList.contains('typed')) {
                    console.log(`Element already in viewport, triggering typing: ${heading.id}`);
                    heading.classList.add('typed');
                    typeEffect(heading, originalText);
                    
                    if (heading.tagName === 'H2') {
                        setTimeout(() => {
                            heading.classList.add('typing');
                        }, (originalText.length || 0) * 70 + 100);
                    }
                    observer.unobserve(heading);
                }
            }, 100);
        }
    });

    const logoElement = document.getElementById('logo');
    if (logoElement) {
        const originalLogoText = logoElement.textContent;
        typeEffect(logoElement, originalLogoText);
    }
    
    // Debug logging
    console.log(`Total typing animations to track: ${totalTypingAnimations}`);
    console.log(`Headings found: ${headings.filter(h => h !== null).length}`);
    console.log(`Logo found: ${logoElement ? 'yes' : 'no'}`);
    
    // Fallback mechanism - if typing animations haven't started after 5 seconds, start clouds anyway
    setTimeout(() => {
        if (typingAnimationsComplete < totalTypingAnimations) {
            console.log(`Warning: Only ${typingAnimationsComplete}/${totalTypingAnimations} typing animations completed after 5 seconds`);
            console.log('Force-starting Perlin clouds as fallback');
            cloudAnimations.forEach(anim => {
                console.log('Starting cloud animation (fallback)');
                anim.start();
            });
        }
    }, 10000);
    
     // Contact form with EmailJS
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            formStatus.innerHTML = ''; // Clear previous status
            
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS not loaded. Please set up EmailJS to send emails.');
                formStatus.innerHTML = `
                    <p style="color: #e74c3c;">⚠️ Email service not configured</p>
                    <p style="font-size: 14px; margin-top: 10px;">
                        For now, you can reach me at: <a href="mailto:christianblake3333@gmail.com" style="color: var(--highlight);">christianblake3333@gmail.com</a>
                    </p>
                `;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                to_name: 'Christian Blake'
            };
            
            // Service ID, Template ID, and Template Params
            emailjs.send('service_cyin44b', 'template_6u5ge6p', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    submitBtn.textContent = "Message Sent!";
                    formStatus.innerHTML = '<p style="color: #27ae60;">✓ Thank you! I\'ll get back to you soon.</p>';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        formStatus.innerHTML = '';
                    }, 5000); // Keep message longer
                }, function(error) {
                    console.error('FAILED...', error);
                    submitBtn.textContent = "Send Failed";
                    formStatus.innerHTML = `
                        <p style="color: #e74c3c;">Failed to send message.</p>
                        <p style="font-size: 14px;">Please email me directly at: <a href="mailto:christianblake3333@gmail.com" style="color: var(--highlight);">christianblake3333@gmail.com</a></p>
                    `;
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 5000); // Keep message longer
                });
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