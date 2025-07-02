// Project data structure containing all information
const projectData = {
    'memory-allocator': {
        title: 'Custom Memory Allocator',
        tagline: 'A low-level memory management system implementing three allocation algorithms with performance analysis and fragmentation tracking.',
        links: {
            //demo: '#',
            github: 'https://github.com/cblake18/home-ground/tree/main/projects/custom_Mem_Alloc'
        },
        description: {
            problem: 'Operating systems need efficient memory management to handle dynamic allocation requests from multiple processes. Poor allocation strategies lead to memory fragmentation, wasted space, and degraded system performance.',
            solution: 'I developed a comprehensive memory allocator in C that implements three distinct allocation strategies: First Fit (quickly allocates the first available block), Best Fit (searches for the smallest suitable block), and Buddy System (uses power-of-2 block sizes for fast allocation).',
            role: 'This was an individual project where I designed and implemented the core allocation algorithms from scratch, built a free list management system with coalescing, created comprehensive testing suite processing 1000+ allocation/deallocation requests, and implemented performance metrics tracking.'
        },
        techStack: ['C', 'Linux', 'GCC', 'Valgrind', 'Make'],
        challenges: [
            {
                title: 'Pointer Arithmetic Complexity',
                description: 'Managing memory addresses and calculating block sizes required careful pointer arithmetic. I solved this by creating detailed diagrams of memory layouts and implementing extensive boundary checking.'
            },
            {
                title: 'Coalescing Adjacent Free Blocks',
                description: 'Preventing fragmentation required merging adjacent free blocks. I implemented a recursive coalescing algorithm that checks for valid buddy pairs based on address alignment.'
            },
            {
                title: 'Performance vs. Memory Efficiency Trade-off',
                description: 'First Fit was fast but wasteful, while Best Fit was efficient but slow. I learned to analyze algorithmic trade-offs and choose appropriate strategies based on workload characteristics.'
            }
        ]
    },
    'binary-bomb': {
        title: 'x86-64 Binary Bomb Defuser',
        tagline: 'Reverse-engineered a multi-phase binary executable using assembly analysis and GDB to defuse a "bomb" without source code.',
        links: {
            github: 'https://github.com/cblake18/home-ground/tree/main/projects/bin_Bomb'
            //writeup: '#'
        },
        description: {
            problem: 'Understanding compiled binaries and assembly code is crucial for security researchers and systems programmers. The Binary Bomb tests these skills through a compiled program with six hidden phases.',
            solution: 'I systematically reverse-engineered each phase using static analysis (examining assembly code), dynamic analysis (using GDB), and pattern recognition. Each phase required specific input strings to proceed without detonation.',
            role: 'Working independently, I analyzed 1000+ lines of x86-64 assembly code, mapped control flow diagrams, identified encoding schemes, documented the solution process, and successfully defused all six phases plus the secret phase.'
        },
        techStack: ['GDB', 'objdump', 'x86-64 Assembly', 'Linux', 'C'],
        challenges: [
            {
                title: 'Understanding Optimized Assembly',
                description: 'The compiler had optimized the code, making logic non-intuitive. I learned to recognize optimization patterns like multiplication replaced with shifts and adds.'
            },
            {
                title: 'Recursive Function Analysis',
                description: 'Phase 4 involved a recursive function difficult to trace in assembly. I solved this by carefully tracking the stack frame and drawing out the recursion tree.'
            },
            {
                title: 'Hidden Data Structures',
                description: 'Phase 6 used a hidden linked list. By examining memory dumps and pointer relationships, I discovered the node structure and traversal logic.'
            }
        ]
    },
    'donut-shop': {
        title: 'Concurrent Donut Shop Simulator',
        tagline: 'A high-performance producer-consumer system using POSIX threads, demonstrating advanced synchronization with mutexes and condition variables.',
        links: {
            //demo: '#',
            github: 'https://github.com/cblake18/home-ground/tree/main/projects/sem_ProdCons'
        },
        description: {
            problem: 'The producer-consumer problem is a classic synchronization challenge. Multiple threads must coordinate access to shared resources without deadlock, race conditions, or starvation.',
            solution: 'I implemented a robust multithreaded system with 30 producer threads making 4 flavors, 50 consumer threads collecting 2000 dozen each, ring buffer data structures, fine-grained locking, and performance monitoring.',
            role: 'I designed the concurrent architecture, implemented thread-safe ring buffers, created a logging system, built signal handling, and optimized performance to handle 50 concurrent consumers efficiently.'
        },
        techStack: ['C', 'POSIX Threads', 'Mutexes', 'Condition Variables', 'Linux', 'Makefile'],
        challenges: [
            {
                title: 'Avoiding Deadlock',
                description: 'With multiple mutexes for different flavors, I prevented circular waiting by establishing strict locking order and using separate producer/consumer mutexes.'
            },
            {
                title: 'Preventing Buffer Overflow/Underflow',
                description: 'The ring buffer required careful pointer management. I implemented producer waiting when full and consumer waiting when empty.'
            },
            {
                title: 'Performance Optimization',
                description: 'I optimized by using condition variables instead of busy-waiting, implementing batch operations, and fine-tuning buffer sizes.'
            }
        ]
    },
    'face-recognition': {
        title: 'SVM-Based Face Recognition System',
        tagline: 'Achieved 95%+ accuracy on face pair matching using Support Vector Machines with advanced feature engineering and hyperparameter optimization.',
        links: {
            //demo: '#',
            github: 'https://github.com/cblake18/home-ground/tree/main/projects/ml_SVM_FaceRec'
            //notebook: '#'
        },
        description: {
            problem: 'Face recognition requires determining whether two face images show the same person. The LFW dataset presents real-world challenges with varying lighting, poses, and expressions.',
            solution: 'I developed a machine learning pipeline processing 13,000+ face images, implementing PCA for dimensionality reduction, using SVM with RBF kernel, and achieving 95%+ accuracy through hyperparameter tuning.',
            role: 'I analyzed the complex dataset, implemented feature extraction techniques, designed the ML pipeline, conducted hyperparameter optimization, and created detailed visualizations.'
        },
        techStack: ['Python', 'scikit-learn', 'NumPy', 'Matplotlib', 'SVM', 'PCA'],
        challenges: [
            {
                title: 'High-Dimensional Data',
                description: 'With 5828 features per image pair, I applied PCA to reduce dimensions while preserving variance, significantly improving training speed.'
            },
            {
                title: 'Class Imbalance',
                description: 'I addressed uneven distribution using balanced class_weight parameter and stratified sampling.'
            },
            {
                title: 'Hyperparameter Optimization',
                description: 'I used RandomizedSearchCV with log-uniform distributions to efficiently explore the parameter space, testing 20 configurations.'
            }
        ]
    },
    'university-db': {
        title: 'University Course Management System',
        tagline: 'A full-stack web application managing students, courses, and instructors with role-based access control and comprehensive course rating system.',
        links: {
            //demo: '#',
            github: 'https://github.com/cblake18/home-ground/tree/main/projects/uni_DB'
            //schema: '#'
        },
        description: {
            problem: 'Universities need comprehensive systems to manage course registration, student records, and feedback. Manual processes lead to scheduling conflicts and enrollment errors.',
            solution: 'I developed a database-driven web application with multi-role authentication, course registration with conflict checking, instructor dashboards, student features, and a course rating system.',
            role: 'I designed a normalized database with 15+ tables, implemented secure authentication, created responsive interfaces, built complex SQL queries, and developed the rating system.'
        },
        techStack: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript', 'Apache', 'phpMyAdmin'],
        challenges: [
            {
                title: 'Complex Database Relationships',
                description: 'I created junction tables for many-to-many relationships and enforced referential integrity across students, courses, sections, and ratings.'
            },
            {
                title: 'Role-Based Access Control',
                description: 'I implemented session-based authentication with role checking on each page load to ensure proper security and permissions.'
            },
            {
                title: 'Real-Time Constraint Checking',
                description: 'I wrote complex SQL queries with multiple joins and used transactions to ensure data consistency during registration.'
            }
        ]
    },
    'nbody-sim': {
        title: 'N-Body Physics Simulator',
        tagline: 'Real-time visualization of planetary motion using Newton\'s law of gravitation, featuring accurate orbital mechanics and scalable performance.',
        links: {
            //demo: '#',
            github: 'https://github.com/cblake18/home-ground/tree/main/projects/sim_NBody'
            //docs: '#'
        },
        description: {
            problem: 'Simulating gravitational interactions between multiple celestial bodies is computationally intensive, requiring O(n²) force calculations per time step.',
            solution: 'I built a physics engine that calculates gravitational forces, updates positions using numerical integration, renders with accurate scaling, and supports variable time steps.',
            role: 'I implemented the physics engine, designed the OOP architecture, created the rendering system, optimized performance, built file I/O, and added debug output.'
        },
        techStack: ['C++', 'SFML', 'Object-Oriented Design', 'Makefile', 'Git'],
        challenges: [
            {
                title: 'Numerical Stability',
                description: 'Simple integration accumulated errors over time. I implemented leapfrog integration for better energy conservation.'
            },
            {
                title: 'Coordinate System Transformation',
                description: 'I developed a scaling system that automatically adjusts based on window size while maintaining aspect ratios.'
            },
            {
                title: 'Performance Optimization',
                description: 'I implemented spatial optimization, efficient vector operations, and smart rendering that only updates changed positions.'
            }
        ]
    }
};

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
    
  class OptimizedPerlinNoise {
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

// Optimized cloud renderer with WebGL fallback
class CloudRenderer {
    constructor(canvas, performanceLevel = 'medium') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.performanceLevel = performanceLevel;
        this.perlin = new OptimizedPerlinNoise();
        this.time = 0;
        this.animationId = null;
        this.isRunning = false;
        this.isVisible = true;
        this.frameCounter = 0;
        
        // Performance settings - preserve original quality for high performance
        this.settings = {
            low: { 
                pixelSkip: 3,        // Sample every 3rd pixel
                octaves: 2,          // octave count
                frameSkip: 0,        // Skip 2 frames
                useOffscreen: true,
                resolution: 0.5      // 50% resolution for offscreen
            },
            medium: { 
                pixelSkip: 2,        // Sample every 2nd pixel
                octaves: 3,          // octave count
                frameSkip: 0,        // Skip 1 frame
                useOffscreen: true,
                resolution: 0.75     // 75% resolution for offscreen
            },
            high: { 
                pixelSkip: 1,        // Original pixel-by-pixel
                octaves: 4,          // octave count
                frameSkip: 0,        // No frame skipping
                useOffscreen: false, // Render directly to canvas
                resolution: 1.0      // Full resolution
            }
        }[performanceLevel];
        
        // Create offscreen canvas only for lower performance modes
        if (this.settings.useOffscreen) {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        }
        
        // Add toggle button
        this.createToggleButton();
        
        // Set up intersection observer for visibility
        this.setupVisibilityObserver();
        
        // Resize handler
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }
    
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'cloud-toggle-btn';
        button.innerHTML = '☁';
        button.title = 'Toggle cloud animation';
        
        // Position relative to canvas
        const container = this.canvas.parentElement;
        container.style.position = 'relative';
        
        button.addEventListener('click', () => {
            this.toggle();
            button.classList.toggle('disabled');
            
            // Play key sound if available
            const keyClick = document.getElementById('keyClick1');
            if (keyClick) {
                keyClick.currentTime = 0;
                keyClick.volume = 0.3;
                keyClick.play().catch(() => {});
            }
        });
        
        container.appendChild(button);
        this.toggleButton = button;
        
        // Set initial state based on performance
        if (this.performanceLevel === 'low') {
            this.isRunning = false;
            button.classList.add('disabled');
        }
    }
    
    setupVisibilityObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (!this.isVisible && this.isRunning) {
                    this.pause();
                } else if (this.isVisible && this.isRunning) {
                    this.resume();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.canvas);
    }
    
    handleResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Resize offscreen canvas if using one
        if (this.settings.useOffscreen) {
            this.offscreenCanvas.width = Math.floor(this.canvas.width * this.settings.resolution);
            this.offscreenCanvas.height = Math.floor(this.canvas.height * this.settings.resolution);
        }
    }
    
    generateClouds() {
        const targetCanvas = this.settings.useOffscreen ? this.offscreenCanvas : this.canvas;
        const targetCtx = this.settings.useOffscreen ? this.offscreenCtx : this.ctx;
        const width = targetCanvas.width;
        const height = targetCanvas.height;
        
        targetCtx.clearRect(0, 0, width, height);
        
        // Create image data for pixel manipulation
        const imageData = targetCtx.createImageData(width, height);
        const data = imageData.data;
        
        // Original scale factors for noise
        const scale = 0.005;
        const timeScale = 0.0001;
        const pixelSkip = this.settings.pixelSkip;
        
        for (let x = 0; x < width; x += pixelSkip) {
            for (let y = 0; y < height; y += pixelSkip) {
                // Generate multiple octaves for complex patterns (original algorithm)
                let value = 0;
                let amplitude = 1;
                let frequency = 1;
                let maxValue = 0;
                
                for (let i = 0; i < this.settings.octaves; i++) {
                    value += this.perlin.noise(
                        x * scale * frequency + this.time * timeScale,
                        y * scale * frequency
                    ) * amplitude;
                    
                    maxValue += amplitude;
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                
                value = value / maxValue;
                value = (value + 1) / 2; // Normalize to 0-1
                
                // Create threshold for cloud-like appearance (original thresholds)
                if (value > 0.4) {
                    const intensity = (value - 0.4) / 0.6;
                    const index = (y * width + x) * 4;
                    
                    // Mix purple and dark grey based on noise value (original colors)
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
                    
                    // Fill skipped pixels (for performance modes)
                    if (pixelSkip > 1) {
                        for (let dx = 0; dx < pixelSkip; dx++) {
                            for (let dy = 0; dy < pixelSkip; dy++) {
                                if (x + dx < width && y + dy < height) {
                                    const fillIndex = ((y + dy) * width + (x + dx)) * 4;
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
        }
        
        targetCtx.putImageData(imageData, 0, 0);
        
        // If using offscreen canvas, scale up to main canvas
        if (this.settings.useOffscreen) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            this.ctx.drawImage(
                this.offscreenCanvas,
                0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height,
                0, 0, this.canvas.width, this.canvas.height
            );
        }
    }
    
    animate() {
        if (!this.isRunning || !this.isVisible) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }
        
        // Skip frames for lower performance
        if (this.frameCounter++ % (this.settings.frameSkip + 1) !== 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.generateClouds();
        this.time += 16;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.toggleButton.classList.remove('disabled');
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.toggleButton.classList.add('disabled');
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (this.isRunning && !this.animationId) {
            this.animate();
        }
    }
    
    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    cleanup() {
        this.stop();
        window.removeEventListener('resize', this.handleResize);
        if (this.toggleButton && this.toggleButton.parentNode) {
            this.toggleButton.parentNode.removeChild(this.toggleButton);
        }
    }
}

    // Track typing animations
    let typingAnimationsComplete = 0;
    const totalTypingAnimations = 7;
    let cloudRenderers = [];
    
    // Performance detection based on FPS measurement
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
                
                // Determine performance level based on achievable FPS
                let performanceLevel;
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
    
    function onTypingComplete() {
        typingAnimationsComplete++;
        console.log(`Typing animation complete: ${typingAnimationsComplete}/${totalTypingAnimations}`);
        
        if (typingAnimationsComplete >= totalTypingAnimations) {
            console.log('All typing animations complete, starting cloud animations');
            // Start cloud animations only if performance is high
            cloudRenderers.forEach(renderer => {
                if (renderer.performanceLevel == 'high') {
                    renderer.start();
                }
            });
        }
    }
    
    // Initialize cloud renderers
    detectPerformance((performanceLevel) => {
        const heroCanvas = document.getElementById('hero-fractal');
        const contactCanvas = document.getElementById('contact-fractal');
        
        if (heroCanvas) {
            console.log(`Initializing hero canvas with performance level: ${performanceLevel}`);
            const heroRenderer = new CloudRenderer(heroCanvas, performanceLevel);
            cloudRenderers.push(heroRenderer);
        }
        
        if (contactCanvas) {
            console.log(`Initializing contact canvas with performance level: ${performanceLevel}`);
            const contactRenderer = new CloudRenderer(contactCanvas, performanceLevel);
            cloudRenderers.push(contactRenderer);
        }
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        cloudRenderers.forEach(renderer => renderer.cleanup());
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
    //let typingSoundsEnabled = true; // Track typing sound state
    
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

    let typingSoundsEnabled = true; // track typing sound state
     keyInputs.forEach(input => {
        input.addEventListener('keydown', () => {
            if (typingSoundsEnabled) {
                playRandomKeySound();
            }
        });
    });
     
    function playRandomKeySound() {
        const sounds = [keyClick1, keyClick2, keyClick3];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        if (randomSound && randomSound.play) {
            randomSound.currentTime = 0;
            randomSound.volume = 0.18;
            randomSound.play().catch(e => {});
        }
    }

    function createTypingSoundToggle() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        // Create toggle button
        const button = document.createElement('button');
        button.className = 'sound-toggle-btn';
        button.innerHTML = '🔊';
        button.title = 'Toggle typing sounds';
        
        // Set initial state
        if (!typingSoundsEnabled) {
            button.classList.add('disabled');
            button.innerHTML = '🔇';
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            typingSoundsEnabled = !typingSoundsEnabled;
            button.classList.toggle('disabled');
            button.innerHTML = typingSoundsEnabled ? '🔊' : '🔇';
            
            // Play key sound on toggle if enabling
            if (typingSoundsEnabled) {
                playRandomKeySound();
            }
        });
        
        // Insert the button at the top of the contact form
        contactForm.insertBefore(button, contactForm.firstChild);
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
    
    // Typing effect function
function typeEffect(element, text, speed = 80, callback = null) {
    if (!element || !text) return;
    let i = 0;
    // Clear the element completely
    element.innerHTML = '';
    
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

// Get all heading elements
const headings = [
    document.getElementById('hero-title'),
    document.getElementById('hero-subtitle'),
    document.getElementById('about-heading'),
    document.getElementById('skills-heading'),
    document.getElementById('projects-heading'),
    document.getElementById('contact-heading')
];

// Store original text and prepare elements
headings.forEach(heading => {
    if (heading) {
        // Store original text
        heading.dataset.originalText = heading.textContent.trim();
        // Use CSS to maintain height
        heading.style.minHeight = heading.offsetHeight + 'px';
        // Clear content
        heading.textContent = '';
        console.log(`Prepared ${heading.id}: "${heading.dataset.originalText}"`);
    }
});

// Create observer for all headings
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            if (!element || element.classList.contains('typed')) return;
            
            const originalText = element.dataset.originalText;
            
            // Special handling for hero-subtitle - don't start it automatically
            if (element.id === 'hero-subtitle') {
                observer.unobserve(element);
                return;
            }
            
            element.classList.add('typed');
            
            // Special handling for hero-title
            if (element.id === 'hero-title') {
                typeEffect(element, originalText, 70, () => {
                    // When hero-title is done, start hero-subtitle
                    const heroSubtitle = document.getElementById('hero-subtitle');
                    if (heroSubtitle && !heroSubtitle.classList.contains('typed')) {
                        console.log('Starting hero-subtitle animation');
                        heroSubtitle.classList.add('typed');
                        typeEffect(heroSubtitle, heroSubtitle.dataset.originalText, 25);
                    }
                });
            } else {
                // Normal typing for other elements
                typeEffect(element, originalText);
            }
            
            // Add typing class for H2 elements
            if (element.tagName === 'H2') {
                setTimeout(() => {
                    element.classList.add('typing');
                }, originalText.length * 70 + 100);
            }
            
            observer.unobserve(element);
        }
    });
}, { threshold: 0.5 });

// Start observing all headings
headings.forEach(heading => {
    if (heading) {
        observer.observe(heading);
    }
});

// Handle case where hero elements are already in viewport on load
setTimeout(() => {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle && !heroTitle.classList.contains('typed')) {
        const rect = heroTitle.getBoundingClientRect();
        const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (inViewport) {
            console.log('Hero title in viewport on load, starting animation');
            heroTitle.classList.add('typed');
            observer.unobserve(heroTitle);
            
            typeEffect(heroTitle, heroTitle.dataset.originalText, 70, () => {
                if (heroSubtitle && !heroSubtitle.classList.contains('typed')) {
                    console.log('Starting hero-subtitle animation after hero-title');
                    heroSubtitle.classList.add('typed');
                    typeEffect(heroSubtitle, heroSubtitle.dataset.originalText, 20);
                }
            });
        }
    }
}, 100);

// Logo typing animation
const logoElement = document.getElementById('logo');
if (logoElement) {
    const originalLogoText = logoElement.textContent;
    typeEffect(logoElement, originalLogoText);
    createTypingSoundToggle();
}
    
    // Debug logging
    console.log(`Total typing animations to track: ${totalTypingAnimations}`);
    console.log(`Headings found: ${headings.filter(h => h !== null).length}`);
    console.log(`Logo found: ${logoElement ? 'yes' : 'no'}`);
    
    // Fallback mechanism - if typing animations haven't started after 30 seconds, start clouds anyway
    setTimeout(() => {
        if (typingAnimationsComplete < totalTypingAnimations) {
            console.log(`Warning: Only ${typingAnimationsComplete}/${totalTypingAnimations} typing animations completed after 5 seconds`);
            console.log('Force-starting Perlin clouds as fallback');
            cloudAnimations.forEach(anim => {
                console.log('Starting cloud animation (fallback)');
                anim.start();
            });
        }
    }, 30000);
    
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
        // Skip if already handled by nav link logic
        if (anchor.classList.contains('nav-link-item')) return;
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add a small delay to let animations complete
                setTimeout(() => {
                    // Use getBoundingClientRect for more accurate positioning
                    const rect = targetElement.getBoundingClientRect();
                    const absoluteTop = window.pageYOffset + rect.top;
                    
                    window.scrollTo({
                        top: absoluteTop + 50, // offset for sticky header
                        behavior: 'smooth'
                    });
                }, 100); // 100ms delay to let animations settle
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

    // Modal functionality
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementsByClassName('modal-close')[0];

    // Function to open modal with project data
    function openProjectModal(projectId) {
        const project = projectData[projectId];
        if (!project) return;

        // Play key click sound if available
        playRandomKeySound();

        // Set title and tagline
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalTagline').textContent = project.tagline;

        // Set links
        const linksHtml = Object.entries(project.links).map(([key, url]) => {
            const linkText = key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
            const icon = key === 'github' ? '📁' : key === 'demo' ? '🚀' : '📄';
            return `<a href="${url}" target="_blank">${icon} ${linkText}</a>`;
        }).join('');
        document.getElementById('modalLinks').innerHTML = linksHtml;

        // Set description
        const descHtml = `
            <h4>The Problem</h4>
            <p>${project.description.problem}</p>
            <h4>The Solution</h4>
            <p>${project.description.solution}</p>
            <h4>My Role & Contributions</h4>
            <p>${project.description.role}</p>
        `;
        document.getElementById('modalDescription').innerHTML = descHtml;

        // Set tech stack
        const techHtml = project.techStack.map(tech => 
            `<span class="tech-item">${tech}</span>`
        ).join('');
        document.getElementById('modalTechStack').innerHTML = techHtml;

        // Set challenges
        const challengesHtml = project.challenges.map(challenge => `
            <div class="challenge-box">
                <strong>${challenge.title}:</strong>
                <p>${challenge.description}</p>
            </div>
        `).join('');
        document.getElementById('modalChallenges').innerHTML = challengesHtml;

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    modalClose.onclick = function() {
        playRandomKeySound();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            playRandomKeySound();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Add click handlers to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent if clicking on a link inside the card
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.preventDefault();
            }
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

     const tiltCards = document.querySelectorAll('.project-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse x position within the card
            const y = e.clientY - rect.top;  // Mouse y position within the card

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation values. Max rotation is set to 10 degrees.
            const rotateX = (centerY - y) / centerY * 10;
            const rotateY = (x - centerX) / centerX * 10;

            // Apply the dynamic transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseenter', () => {
            // Set a quick transition for the transform when the mouse enters
            card.style.transition = 'box-shadow 0.3s ease, transform 0.1s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            // Reset the card to its default state smoothly
            card.style.transition = 'box-shadow 0.3s ease, transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
});