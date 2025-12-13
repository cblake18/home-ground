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

    // Track typing animations
    let typingAnimationsComplete = 0;
    const totalTypingAnimations = 7;
    let cloudRenderers = [];
    
    function onTypingComplete() {
        typingAnimationsComplete++;
        console.log(`Typing animation complete: ${typingAnimationsComplete}/${totalTypingAnimations}`);
        
        if (typingAnimationsComplete >= totalTypingAnimations) {
            console.log('All typing animations complete, starting cloud animations');
            // Start all cloud animations - WebGL handles performance automatically
            cloudRenderers.forEach(renderer => {
                renderer.start();
            });
        }
    }
    
    // Initialize WebGL cloud renderers (much faster than Canvas 2D)
    function initCloudRenderers() {
        const heroCanvas = document.getElementById('hero-fractal');
        const contactCanvas = document.getElementById('contact-fractal');
        
        // Check if WebGLCloudRenderer is available (loaded from cloud-renderer.js)
        const RendererClass = window.WebGLCloudRenderer || null;
        
        if (!RendererClass) {
            console.warn('WebGLCloudRenderer not loaded, clouds will be disabled');
            return;
        }
        
        if (heroCanvas) {
            console.log('Initializing hero canvas with WebGL cloud renderer');
            const heroRenderer = new RendererClass(heroCanvas, { opacity: 1.0 });
            cloudRenderers.push(heroRenderer);
        }
        
        if (contactCanvas) {
            console.log('Initializing contact canvas with WebGL cloud renderer');
            const contactRenderer = new RendererClass(contactCanvas, { opacity: 1.0 });
            cloudRenderers.push(contactRenderer);
        }
        
        console.log(`Initialized ${cloudRenderers.length} cloud renderer(s)`);
    }
    
    // Initialize cloud renderers immediately (no performance detection needed - GPU handles it)
    initCloudRenderers();
    
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
    
    // Note: Color animation removed - theme cycling system now handles colors
    // See colorThemes array and cycleColorTheme() function
    
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
            console.log(`Warning: Only ${typingAnimationsComplete}/${totalTypingAnimations} typing animations completed after 30 seconds`);
            console.log('Force-starting cloud animations as fallback');
            cloudRenderers.forEach(renderer => {
                console.log('Starting cloud animation (fallback)');
                renderer.start();
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
                    }, 5000);
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
                    }, 5000);
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
                }, 100);
            }
        });
    });
    
    // =========================================================================
    // Color Theme Cycling System
    // =========================================================================
    
    // Preset color themes that cycle through the spectrum
    const colorThemes = [
        {
            name: 'Steel Blue',
            highlight: '#5d8aa8',
            highlightSecondary: '#445d70',
            highlightDark: '#3d6a82',
            accent: '#a5c8e1',
            fractalPurple: '#8e44ad',
            fractalPurpleLight: '#a569bd',
            // Text colors (darker versions for readability)
            textPrimary: '#3d6a82',
            textSecondary: '#445d70',
            // Text glow colors (dark to light)
            textGlow1: '#213e5e',
            textGlow2: '#4b7099',
            textGlow3: '#3b6796',
            textGlow4: '#819db8',
            // Cloud colors (RGB 0-1)
            cloudDark: [0.235, 0.235, 0.275],
            cloudMid: [0.365, 0.541, 0.659],
            cloudBright: [0.557, 0.267, 0.678]
        },
        {
            name: 'Teal',
            highlight: '#2a9d8f',
            highlightSecondary: '#1d6e63',
            highlightDark: '#1a5c54',
            accent: '#8ed4c8',
            fractalPurple: '#264653',
            fractalPurpleLight: '#457b8c',
            textPrimary: '#1a5c54',
            textSecondary: '#1d6e63',
            textGlow1: '#153d3a',
            textGlow2: '#1d6e63',
            textGlow3: '#2a9d8f',
            textGlow4: '#6dc4b8',
            cloudDark: [0.15, 0.27, 0.33],
            cloudMid: [0.165, 0.616, 0.561],
            cloudBright: [0.35, 0.82, 0.75]
        },
        {
            name: 'Emerald',
            highlight: '#27ae60',
            highlightSecondary: '#1e8449',
            highlightDark: '#186a3b',
            accent: '#82e0aa',
            fractalPurple: '#145a32',
            fractalPurpleLight: '#239b56',
            textPrimary: '#186a3b',
            textSecondary: '#1e8449',
            textGlow1: '#0e3d22',
            textGlow2: '#1e8449',
            textGlow3: '#27ae60',
            textGlow4: '#58d68d',
            cloudDark: [0.08, 0.35, 0.20],
            cloudMid: [0.153, 0.682, 0.376],
            cloudBright: [0.40, 0.88, 0.55]
        },
        {
            name: 'Gold',
            highlight: '#d4a03a',
            highlightSecondary: '#a67c00',
            highlightDark: '#7d5e00',
            accent: '#f4d793',
            fractalPurple: '#8b6914',
            fractalPurpleLight: '#c9a227',
            textPrimary: '#7d5e00',
            textSecondary: '#8b6914',
            textGlow1: '#5c4400',
            textGlow2: '#8b6914',
            textGlow3: '#c9a227',
            textGlow4: '#f4d793',
            cloudDark: [0.35, 0.28, 0.12],
            cloudMid: [0.831, 0.627, 0.227],
            cloudBright: [0.96, 0.82, 0.45]
        },
        {
            name: 'Coral',
            highlight: '#e07b53',
            highlightSecondary: '#b85c3a',
            highlightDark: '#8e4529',
            accent: '#f4b89a',
            fractalPurple: '#943126',
            fractalPurpleLight: '#c0564b',
            textPrimary: '#8e4529',
            textSecondary: '#943126',
            textGlow1: '#5c1f17',
            textGlow2: '#943126',
            textGlow3: '#c0564b',
            textGlow4: '#e89a8c',
            cloudDark: [0.35, 0.20, 0.15],
            cloudMid: [0.878, 0.482, 0.325],
            cloudBright: [0.96, 0.65, 0.50]
        },
        {
            name: 'Rose',
            highlight: '#c0392b',
            highlightSecondary: '#922b21',
            highlightDark: '#6e2018',
            accent: '#f1948a',
            fractalPurple: '#641e16',
            fractalPurpleLight: '#a93226',
            textPrimary: '#6e2018',
            textSecondary: '#7a241a',
            textGlow1: '#3d120d',
            textGlow2: '#641e16',
            textGlow3: '#922b21',
            textGlow4: '#d4726a',
            cloudDark: [0.30, 0.12, 0.12],
            cloudMid: [0.753, 0.224, 0.169],
            cloudBright: [0.94, 0.45, 0.42]
        },
        {
            name: 'Magenta',
            highlight: '#9b59b6',
            highlightSecondary: '#76448a',
            highlightDark: '#5b3469',
            accent: '#d7bde2',
            fractalPurple: '#512e5f',
            fractalPurpleLight: '#884ea0',
            textPrimary: '#5b3469',
            textSecondary: '#663d75',
            textGlow1: '#341d3d',
            textGlow2: '#512e5f',
            textGlow3: '#76448a',
            textGlow4: '#bb8fce',
            cloudDark: [0.25, 0.15, 0.30],
            cloudMid: [0.608, 0.349, 0.714],
            cloudBright: [0.85, 0.55, 0.90]
        },
        {
            name: 'Violet',
            highlight: '#6c5ce7',
            highlightSecondary: '#4834d4',
            highlightDark: '#3627a3',
            accent: '#a29bfe',
            fractalPurple: '#2c2057',
            fractalPurpleLight: '#5b4bbd',
            textPrimary: '#3627a3',
            textSecondary: '#3d2db5',
            textGlow1: '#1a133a',
            textGlow2: '#2c2057',
            textGlow3: '#4834d4',
            textGlow4: '#8c82e8',
            cloudDark: [0.17, 0.13, 0.34],
            cloudMid: [0.424, 0.361, 0.906],
            cloudBright: [0.70, 0.58, 0.98]
        }
    ];
    
    let currentThemeIndex = 0;
    
    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Apply a color theme
    function applyColorTheme(theme) {
        const root = document.documentElement;
        
        // Update main CSS variables
        root.style.setProperty('--highlight', theme.highlight);
        root.style.setProperty('--highlight-secondary', theme.highlightSecondary);
        root.style.setProperty('--highlight-dark', theme.highlightDark);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--fractal-purple', theme.fractalPurple);
        root.style.setProperty('--fractal-purple-light', theme.fractalPurpleLight);
        
        // Update text colors
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        
        // Update text glow colors
        root.style.setProperty('--text-glow-1', theme.textGlow1);
        root.style.setProperty('--text-glow-2', theme.textGlow2);
        root.style.setProperty('--text-glow-3', theme.textGlow3);
        root.style.setProperty('--text-glow-4', theme.textGlow4);
        
        // Generate glow colors from highlight
        const rgb = hexToRgb(theme.highlight);
        if (rgb) {
            root.style.setProperty('--glow-color', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
            root.style.setProperty('--glow-color-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
            root.style.setProperty('--glow-color-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
            root.style.setProperty('--grid-color', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.03)`);
        }
        
        // Update cloud renderer colors
        cloudRenderers.forEach(renderer => {
            if (renderer.setColors) {
                renderer.setColors(theme.cloudDark, theme.cloudMid, theme.cloudBright);
            }
        });
        
        console.log(`Applied theme: ${theme.name}`);
    }
    
    // Cycle to next theme
    function cycleColorTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % colorThemes.length;
        applyColorTheme(colorThemes[currentThemeIndex]);
    }
    
    // =========================================================================
    
    // Skill items interaction
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.add('active');
            playRandomKeySound();
            
            // Cycle color theme on click
            cycleColorTheme();
            
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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

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