/**
 * WebGL Cloud Renderer
 * GPU-accelerated simplex noise for smooth cloud animations
 * Falls back to optimized Canvas 2D if WebGL unavailable
 */

// ============================================================================
// GLSL Shader Code
// ============================================================================

const VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    
    void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Simplex noise implementation in GLSL (faster than Perlin, no grid artifacts)
// Based on Stefan Gustavson's webgl-noise, now public domain
const FRAGMENT_SHADER = `
    precision highp float;
    
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_opacity;
    
    // Simplex 3D noise helper functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    // 3D Simplex Noise
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        // Permutations
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        // Gradients: 7x7 points over a square, mapped onto an octahedron
        float n_ = 0.142857142857; // 1.0/7.0
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    
    // Fractal Brownian Motion with rotated octaves (eliminates grid artifacts)
    float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        // Rotation matrix to break up grid alignment between octaves
        mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
        
        for(int i = 0; i < 5; i++) {
            value += amplitude * snoise(p * frequency);
            p.xy = rot * p.xy;  // Rotate XY plane
            p.yz = rot * p.yz;  // Rotate YZ plane
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        
        return value;
    }
    
    void main() {
        // Scale coordinates for cloud-like appearance
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;
        uv.x *= aspect;
        
        // Slower time scale for gentle movement
        float time = u_time * 0.00008;
        
        // Generate noise with time as Z coordinate for smooth animation
        vec3 noiseCoord = vec3(uv * 3.0, time);
        float noise = fbm(noiseCoord);
        
        // Normalize to 0-1 range
        noise = (noise + 1.0) * 0.5;
        
        // Cloud threshold and color mixing
        vec4 color = vec4(0.0);
        
        if(noise > 0.35) {
            float intensity = (noise - 0.35) / 0.65;
            intensity = smoothstep(0.0, 1.0, intensity); // Smoother falloff
            
            // Three-color gradient: dark grey -> steel blue -> purple
            vec3 purple = vec3(0.557, 0.267, 0.678);     // #8e44ad
            vec3 steelBlue = vec3(0.365, 0.541, 0.659);  // #5d8aa8 (your --highlight)
            vec3 darkGrey = vec3(0.235, 0.235, 0.275);
            
            // Create smooth transitions between colors
            float blueMix = smoothstep(0.35, 0.52, noise);   // Grey -> Blue
            float purpleMix = smoothstep(0.55, 0.75, noise); // Blue -> Purple
            
            // Blend: darkGrey -> steelBlue -> purple
            vec3 cloudColor = mix(darkGrey, steelBlue, blueMix);
            cloudColor = mix(cloudColor, purple, purpleMix);
            
            // Apply intensity to alpha
            float alpha = intensity * mix(0.55, 0.75, purpleMix);
            
            color = vec4(cloudColor * intensity, alpha * u_opacity);
        }
        
        gl_FragColor = color;
    }
`;

// ============================================================================
// WebGL Cloud Renderer Class
// ============================================================================

class WebGLCloudRenderer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = {
            opacity: options.opacity || 1.0,
            ...options
        };
        
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.animationId = null;
        this.isRunning = false;
        this.isVisible = true;
        this.startTime = performance.now();
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 60;
        
        // Try to initialize WebGL
        this.webglSupported = this.initWebGL();
        
        if (!this.webglSupported) {
            console.warn('WebGL not supported, falling back to Canvas 2D');
            this.fallbackRenderer = new OptimizedCanvas2DRenderer(canvas, options);
        }
        
        // Create toggle button
        this.createToggleButton();
        
        // Set up visibility observer
        this.setupVisibilityObserver();
        
        // Handle resize
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }
    
    initWebGL() {
        try {
            this.gl = this.canvas.getContext('webgl', {
                alpha: true,
                premultipliedAlpha: false,
                antialias: false,
                preserveDrawingBuffer: false
            }) || this.canvas.getContext('experimental-webgl');
            
            if (!this.gl) return false;
            
            // Create shaders
            const vertexShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER);
            const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
            
            if (!vertexShader || !fragmentShader) return false;
            
            // Create program
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, vertexShader);
            this.gl.attachShader(this.program, fragmentShader);
            this.gl.linkProgram(this.program);
            
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
                return false;
            }
            
            // Set up geometry (fullscreen quad)
            const positions = new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                 1,  1
            ]);
            
            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
            
            // Get attribute and uniform locations (cache these!)
            const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            
            // Cache uniform locations (critical for performance)
            this.uniforms = {
                time: this.gl.getUniformLocation(this.program, 'u_time'),
                resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
                opacity: this.gl.getUniformLocation(this.program, 'u_opacity')
            };
            
            // Enable blending for transparency
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            
            return true;
        } catch (e) {
            console.error('WebGL initialization failed:', e);
            return false;
        }
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'cloud-toggle-btn';
        button.innerHTML = '☁';
        button.title = 'Toggle cloud animation';
        
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        if (this.webglSupported && this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
        
        if (this.fallbackRenderer) {
            this.fallbackRenderer.handleResize();
        }
    }
    
    render(timestamp) {
        if (!this.webglSupported) {
            if (this.fallbackRenderer) {
                this.fallbackRenderer.render(timestamp);
            }
            return;
        }
        
        const gl = this.gl;
        
        // Clear with transparent background
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use program and set uniforms
        gl.useProgram(this.program);
        gl.uniform1f(this.uniforms.time, timestamp);
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uniforms.opacity, this.options.opacity);
        
        // Draw fullscreen quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    animate(timestamp) {
        if (!this.isRunning) {
            this.animationId = requestAnimationFrame((t) => this.animate(t));
            return;
        }
        
        if (!this.isVisible) {
            this.animationId = requestAnimationFrame((t) => this.animate(t));
            return;
        }
        
        // FPS tracking
        this.frameCount++;
        if (timestamp - this.lastFrameTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = timestamp;
        }
        
        this.render(timestamp);
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.toggleButton?.classList.remove('disabled');
        
        if (this.fallbackRenderer) {
            this.fallbackRenderer.start();
        } else {
            this.animate(performance.now());
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Clear canvas
        if (this.webglSupported && this.gl) {
            this.gl.clearColor(0, 0, 0, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        } else {
            const ctx = this.canvas.getContext('2d');
            ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.toggleButton?.classList.add('disabled');
        
        if (this.fallbackRenderer) {
            this.fallbackRenderer.stop();
        }
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.fallbackRenderer) {
            this.fallbackRenderer.pause();
        }
    }
    
    resume() {
        if (this.isRunning && !this.animationId) {
            this.animate(performance.now());
        }
        if (this.fallbackRenderer) {
            this.fallbackRenderer.resume();
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
        
        if (this.toggleButton?.parentNode) {
            this.toggleButton.parentNode.removeChild(this.toggleButton);
        }
        
        if (this.gl) {
            // Clean up WebGL resources
            const ext = this.gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
        }
        
        if (this.fallbackRenderer) {
            this.fallbackRenderer.cleanup();
        }
    }
    
    // Expose performance level for compatibility
    get performanceLevel() {
        return this.webglSupported ? 'high' : 'medium';
    }
}

// ============================================================================
// Optimized Canvas 2D Fallback (for devices without WebGL)
// ============================================================================

class OptimizedCanvas2DRenderer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = options;
        this.time = 0;
        this.animationId = null;
        this.isRunning = false;
        this.isVisible = true;
        
        // Use simplex noise for better quality
        this.initSimplex();
        
        // Pre-compute noise texture for better performance
        this.noiseTexture = null;
        this.noiseTextureSize = 128;
        this.precomputeNoiseTexture();
        
        // Offscreen canvas for rendering
        this.offscreen = document.createElement('canvas');
        this.offscreenCtx = this.offscreen.getContext('2d');
    }
    
    initSimplex() {
        // Optimized 2D simplex noise
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        
        // Fisher-Yates shuffle
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        
        for (let i = 0; i < 512; i++) {
            this.perm[i] = p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
        
        // Gradients for 2D
        this.grad3 = new Float32Array([
            1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
            1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
            0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1
        ]);
    }
    
    simplex2D(x, y) {
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;
        
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        
        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        
        const ii = i & 255;
        const jj = j & 255;
        
        let n0 = 0, n1 = 0, n2 = 0;
        
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            const gi0 = this.permMod12[ii + this.perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (this.grad3[gi0] * x0 + this.grad3[gi0 + 1] * y0);
        }
        
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (this.grad3[gi1] * x1 + this.grad3[gi1 + 1] * y1);
        }
        
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (this.grad3[gi2] * x2 + this.grad3[gi2 + 1] * y2);
        }
        
        return 70 * (n0 + n1 + n2);
    }
    
    precomputeNoiseTexture() {
        // Pre-compute a tileable noise texture with multiple octaves in RGBA
        const size = this.noiseTextureSize;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const idx = (y * size + x) * 4;
                
                // Store different octaves in each channel (tileable via modulo)
                const nx = x / size;
                const ny = y / size;
                
                // Use sine-based wrapping for seamless tiling
                const angle1 = nx * Math.PI * 2;
                const angle2 = ny * Math.PI * 2;
                
                const cx1 = Math.cos(angle1);
                const sx1 = Math.sin(angle1);
                const cx2 = Math.cos(angle2);
                const sx2 = Math.sin(angle2);
                
                // Sample at different frequencies
                data[idx] = ((this.simplex2D(cx1 * 2, sx1 * 2) + 1) * 0.5 * 255) | 0;     // Octave 0
                data[idx + 1] = ((this.simplex2D(cx2 * 4 + 10, sx2 * 4 + 10) + 1) * 0.5 * 255) | 0; // Octave 1
                data[idx + 2] = ((this.simplex2D(cx1 * 8 + 20, sx1 * 8 + 20) + 1) * 0.5 * 255) | 0; // Octave 2
                data[idx + 3] = 255;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.noiseTexture = canvas;
    }
    
    handleResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.offscreen.width = Math.floor(this.canvas.width * 0.5);
        this.offscreen.height = Math.floor(this.canvas.height * 0.5);
    }
    
    render(timestamp) {
        const width = this.offscreen.width;
        const height = this.offscreen.height;
        
        this.offscreenCtx.clearRect(0, 0, width, height);
        
        const imageData = this.offscreenCtx.createImageData(width, height);
        const data = imageData.data;
        
        const time = timestamp * 0.00005;
        const scale = 0.008;
        
        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                // Animated noise using time
                let value = 0;
                value += this.simplex2D(x * scale + time, y * scale) * 0.5;
                value += this.simplex2D(x * scale * 2 + time * 1.5, y * scale * 2) * 0.25;
                value += this.simplex2D(x * scale * 4 + time * 2, y * scale * 4) * 0.125;
                
                value = (value + 1) * 0.5;
                
                if (value > 0.35) {
                    const intensity = (value - 0.35) / 0.65;
                    const idx = (y * width + x) * 4;
                    
                    // Three-tier color: grey -> blue -> purple
                    if (value > 0.6) {
                        // Purple for brightest areas
                        data[idx] = 142 * intensity;
                        data[idx + 1] = 68 * intensity;
                        data[idx + 2] = 173 * intensity;
                        data[idx + 3] = intensity * 190;
                    } else if (value > 0.48) {
                        // Steel blue (#5d8aa8) for mid areas
                        data[idx] = 93 * intensity;
                        data[idx + 1] = 138 * intensity;
                        data[idx + 2] = 168 * intensity;
                        data[idx + 3] = intensity * 165;
                    } else {
                        // Dark grey for darker areas
                        data[idx] = 60 * intensity;
                        data[idx + 1] = 60 * intensity;
                        data[idx + 2] = 70 * intensity;
                        data[idx + 3] = intensity * 140;
                    }
                    
                    // Fill 2x2 block
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const fillIdx = ((y + dy) * width + (x + dx)) * 4;
                            data[fillIdx] = data[idx];
                            data[fillIdx + 1] = data[idx + 1];
                            data[fillIdx + 2] = data[idx + 2];
                            data[fillIdx + 3] = data[idx + 3];
                        }
                    }
                }
            }
        }
        
        this.offscreenCtx.putImageData(imageData, 0, 0);
        
        // Scale up to main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.drawImage(this.offscreen, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    start() {
        this.isRunning = true;
    }
    
    stop() {
        this.isRunning = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    pause() {}
    resume() {}
    
    cleanup() {
        this.stop();
    }
}

// ============================================================================
// Export for use in main scripts
// ============================================================================

// Make available globally
window.WebGLCloudRenderer = WebGLCloudRenderer;
window.OptimizedCanvas2DRenderer = OptimizedCanvas2DRenderer;