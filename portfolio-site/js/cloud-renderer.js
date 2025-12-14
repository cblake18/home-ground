/**
 * WebGL Cloud Renderer with Dynamic Adaptive Quality
 * Continuously tunes parameters in real-time to maximize quality at 60fps
 * No hardcoded profiles - finds your GPU's true limits
 */

// ============================================================================
// GLSL Shader Code - Supports up to 12 octaves + 3 detail layers
// ============================================================================

const VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    
    void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const FRAGMENT_SHADER = `
    precision highp float;
    
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_opacity;
    uniform vec3 u_colorDark;
    uniform vec3 u_colorMid;
    uniform vec3 u_colorBright;
    uniform int u_octaves;          // 3-12
    uniform int u_detailLayers;     // 0-3
    uniform float u_detailScale;    // How much detail adds
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        float n_ = 0.142857142857;
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
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    
    // FBM with up to 20 octaves
    float fbm(vec3 p, int octaves) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
        
        for(int i = 0; i < 20; i++) {
            if(i >= octaves) break;
            value += amplitude * snoise(p * frequency);
            p.xy = rot * p.xy;
            p.yz = rot * p.yz;
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
    
    void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;
        uv.x *= aspect;
        
        float time = u_time * 0.00008;
        
        // Primary noise layer
        vec3 noiseCoord = vec3(uv * 3.0, time);
        float noise = fbm(noiseCoord, u_octaves);
        
        // Detail layers (up to 6)
        if(u_detailLayers >= 1) {
            vec3 d1 = vec3(uv * 6.0 + 100.0, time * 1.3);
            int oct1 = u_octaves - 2;
            if(oct1 < 3) oct1 = 3;
            noise += fbm(d1, oct1) * u_detailScale;
        }
        if(u_detailLayers >= 2) {
            vec3 d2 = vec3(uv * 12.0 + 200.0, time * 1.7);
            int oct2 = u_octaves - 3;
            if(oct2 < 3) oct2 = 3;
            noise += fbm(d2, oct2) * u_detailScale * 0.5;
        }
        if(u_detailLayers >= 3) {
            vec3 d3 = vec3(uv * 24.0 + 300.0, time * 2.1);
            int oct3 = u_octaves - 4;
            if(oct3 < 3) oct3 = 3;
            noise += fbm(d3, oct3) * u_detailScale * 0.25;
        }
        if(u_detailLayers >= 4) {
            vec3 d4 = vec3(uv * 48.0 + 400.0, time * 2.5);
            int oct4 = u_octaves - 5;
            if(oct4 < 3) oct4 = 3;
            noise += fbm(d4, oct4) * u_detailScale * 0.125;
        }
        
        // Normalize based on detail layers
        float normalizer = 1.0 + float(u_detailLayers) * u_detailScale * 0.5;
        noise = (noise / normalizer + 1.0) * 0.5;
        
        vec4 color = vec4(0.0);
        
        if(noise > 0.22) {
            float intensity = (noise - 0.22) / 0.78;
            intensity = smoothstep(0.0, 1.0, intensity);
            
            vec3 purple = u_colorBright;
            vec3 steelBlue = u_colorMid;
            vec3 darkGrey = u_colorDark;
            
            float blueMix = smoothstep(0.22, 0.42, noise);
            float purpleMix = smoothstep(0.45, 0.65, noise);
            
            vec3 cloudColor = mix(darkGrey, steelBlue, blueMix);
            cloudColor = mix(cloudColor, purple, purpleMix);
            
            float alpha = intensity * mix(0.80, 0.99, purpleMix);
            
            color = vec4(cloudColor * intensity, alpha * u_opacity);
        }
        
        gl_FragColor = color;
    }
`;

// ============================================================================
// Dynamic Quality Parameters
// ============================================================================

class DynamicQuality {
    constructor() {
        // Tunable parameters with min/max ranges
        this.octaves = 5;           // 3-20
        this.detailLayers = 0;      // 0-6
        this.detailScale = 0.3;     // 0.1-0.5
        this.resolution = 1.0;      // 0.5-6.0
        
        // Limits - UNCAPPED
        this.minOctaves = 3;
        this.maxOctaves = 30;
        this.minResolution = 0.5;
        this.maxResolution = 5;
        this.maxDetailLayers = 4;
    }
    
    // Calculate a quality score for display
    getQualityScore() {
        const octaveScore = ((this.octaves - this.minOctaves) / (this.maxOctaves - this.minOctaves)) * 45;
        const resScore = ((this.resolution - this.minResolution) / (this.maxResolution - this.minResolution)) * 30;
        const detailScore = (this.detailLayers / this.maxDetailLayers) * 25;
        return Math.round(octaveScore + resScore + detailScore);
    }
    
    // Get human-readable quality tier
    getQualityTier() {
        const score = this.getQualityScore();
        if (score >= 95) return 'ASCENDED';
        if (score >= 85) return 'GODLIKE';
        if (score >= 70) return 'EXTREME';
        if (score >= 55) return 'ULTRA';
        if (score >= 40) return 'HIGH';
        if (score >= 25) return 'MEDIUM';
        if (score >= 12) return 'LOW';
        return 'POTATO';
    }
    
    clone() {
        const q = new DynamicQuality();
        q.octaves = this.octaves;
        q.detailLayers = this.detailLayers;
        q.detailScale = this.detailScale;
        q.resolution = this.resolution;
        return q;
    }
    
    // Increase quality - FAST steps, detail layers early
    increase() {
        // Priority: detail layers -> resolution -> octaves
        if (this.detailLayers < this.maxDetailLayers) {
            this.detailLayers++;
            return 'detail';
        }
        if (this.resolution < this.maxResolution) {
            this.resolution = Math.min(this.resolution + 0.5, this.maxResolution);
            return 'resolution';
        }
        if (this.octaves < this.maxOctaves) {
            this.octaves += 2;
            if (this.octaves > this.maxOctaves) this.octaves = this.maxOctaves;
            return 'octaves';
        }
        return false;
    }
    
    // Decrease quality - reverse order
    decrease() {
        if (this.octaves > this.minOctaves) {
            this.octaves -= 2;
            if (this.octaves < this.minOctaves) this.octaves = this.minOctaves;
            return 'octaves';
        }
        if (this.resolution > this.minResolution) {
            this.resolution = Math.max(this.resolution - 0.5, this.minResolution);
            return 'resolution';
        }
        if (this.detailLayers > 0) {
            this.detailLayers--;
            return 'detail';
        }
        return false;
    }
    
    toString() {
        return `${this.getQualityTier()} [${this.getQualityScore()}%] (${this.octaves}oct, ${this.resolution.toFixed(1)}x, ${this.detailLayers}detail)`;
    }
}

// ============================================================================
// WebGL Cloud Renderer with Dynamic Adaptive Quality
// ============================================================================

class WebGLCloudRenderer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.name = options.name || canvas.id || 'cloud';
        this.options = {
            opacity: options.opacity || 1.0,
            targetFps: options.targetFps || 58,
            adaptiveQuality: options.adaptiveQuality !== false,
            ...options
        };
        
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.animationId = null;
        this.isRunning = false;
        this.isVisible = true;
        
        // Dynamic quality system
        this.quality = new DynamicQuality();
        this.lastQuality = this.quality.clone();
        
        // FPS tracking - using frame times for accurate calculation
        this.frameTimes = [];
        this.currentFps = 60;
        this.fpsHistory = [];
        this.lastFpsUpdate = 0;
        this.lastFrameTime = 0;
        
        // Tuning state
        this.tuningPhase = 'warmup';    // 'warmup', 'ramp-up', 'stable'
        this.warmupStart = 0;
        this.warmupDuration = 400;      // 400ms warmup
        this.lastAdjustment = 0;
        this.adjustmentDelay = 150;     // 150ms between adjustments - FAST
        this.stableFrames = 0;
        this.peakQuality = null;        // Best quality that worked
        
        // Initialize WebGL
        this.webglSupported = this.initWebGL();
        
        if (!this.webglSupported) {
            console.warn('WebGL not supported, falling back to Canvas 2D');
            this.fallbackRenderer = new OptimizedCanvas2DRenderer(canvas, options);
        }
        
        this.createToggleButton();
        this.setupVisibilityObserver();
        
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        
        this.colors = {
            dark: [0.235, 0.235, 0.275],
            mid: [0.365, 0.541, 0.659],
            bright: [0.557, 0.267, 0.678]
        };
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
            
            const vertexShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER);
            const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
            
            if (!vertexShader || !fragmentShader) return false;
            
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, vertexShader);
            this.gl.attachShader(this.program, fragmentShader);
            this.gl.linkProgram(this.program);
            
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
                return false;
            }
            
            const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
            
            const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            
            this.uniforms = {
                time: this.gl.getUniformLocation(this.program, 'u_time'),
                resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
                opacity: this.gl.getUniformLocation(this.program, 'u_opacity'),
                colorDark: this.gl.getUniformLocation(this.program, 'u_colorDark'),
                colorMid: this.gl.getUniformLocation(this.program, 'u_colorMid'),
                colorBright: this.gl.getUniformLocation(this.program, 'u_colorBright'),
                octaves: this.gl.getUniformLocation(this.program, 'u_octaves'),
                detailLayers: this.gl.getUniformLocation(this.program, 'u_detailLayers'),
                detailScale: this.gl.getUniformLocation(this.program, 'u_detailScale')
            };
            
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
                const wasVisible = this.isVisible;
                this.isVisible = entry.isIntersecting;
                
                if (wasVisible && !this.isVisible) {
                    console.log(`☁️ [${this.name}] Off-screen, pausing render`);
                } else if (!wasVisible && this.isVisible) {
                    console.log(`☁️ [${this.name}] On-screen, resuming render`);
                    this.lastFrameTime = 0;
                    // Don't reset fpsHistory or tuning state - preserve quality
                }
            });
        }, { threshold: 0 });
        
        observer.observe(this.canvas);
    }
    
    handleResize() {
        this.updateCanvasSize();
    }
    
    updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        const scale = dpr * this.quality.resolution;
        
        this.canvas.width = Math.floor(rect.width * scale);
        this.canvas.height = Math.floor(rect.height * scale);
        
        if (this.webglSupported && this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    // ========================================================================
    // Dynamic Adaptive Quality System
    // ========================================================================
    
    updateFps(timestamp) {
        // Calculate actual FPS from frame delta time
        if (this.lastFrameTime > 0) {
            const delta = timestamp - this.lastFrameTime;
            if (delta > 0) {
                const instantFps = 1000 / delta;
                this.frameTimes.push(instantFps);
                if (this.frameTimes.length > 60) this.frameTimes.shift();
            }
        }
        this.lastFrameTime = timestamp;
        
        // Calculate smoothed FPS from recent frames
        if (this.frameTimes.length >= 5) {
            const sorted = [...this.frameTimes.slice(-15)].sort((a, b) => a - b);
            this.currentFps = sorted[Math.floor(sorted.length / 2)];
        }
        
        // Update FPS history every 100ms - FAST
        if (timestamp - this.lastFpsUpdate > 100 && this.frameTimes.length >= 5) {
            this.fpsHistory.push(this.currentFps);
            if (this.fpsHistory.length > 10) this.fpsHistory.shift();
            this.lastFpsUpdate = timestamp;
            
            if (this.options.adaptiveQuality) {
                this.adaptQuality(timestamp);
            }
        }
    }
    
    adaptQuality(timestamp) {
        // Warmup phase - just collect data
        if (this.tuningPhase === 'warmup') {
            if (this.warmupStart === 0) this.warmupStart = timestamp;
            if (timestamp - this.warmupStart < this.warmupDuration) return;
            
            // Warmup complete, start ramping
            this.tuningPhase = 'ramp-up';
            console.log(`☁️ [${this.name}] Warmup complete @ ${Math.round(this.currentFps)}fps, starting quality ramp...`);
            this.lastAdjustment = timestamp;
            return;
        }
        
        if (timestamp - this.lastAdjustment < this.adjustmentDelay) return;
        if (this.fpsHistory.length < 2) return;
        
        const recentFps = this.fpsHistory.slice(-2);
        const avgFps = recentFps.reduce((a, b) => a + b, 0) / recentFps.length;
        const minFps = Math.min(...recentFps);
        const targetFps = this.options.targetFps;
        
        if (this.tuningPhase === 'ramp-up') {
            // Keep increasing as long as we have headroom
            if (minFps >= targetFps) {
                const increased = this.quality.increase();
                if (increased) {
                    console.log(`☁️ [${this.name}] ↑ ${this.quality.toString()} @ ${Math.round(avgFps)}fps`);
                    this.updateCanvasSize();
                    this.lastAdjustment = timestamp;
                    this.fpsHistory = [];
                    this.peakQuality = this.quality.clone();
                } else {
                    // Maxed out all parameters!
                    this.tuningPhase = 'stable';
                    console.log(`🚀 [${this.name}] MAXED OUT: ${this.quality.toString()} @ ${Math.round(avgFps)}fps`);
                }
            } else if (minFps < targetFps - 8) {
                // Dropped below threshold, back off one step
                this.quality.decrease();
                this.tuningPhase = 'stable';
                console.log(`☁️ [${this.name}] ↓ Found limit: ${this.quality.toString()} @ ${Math.round(avgFps)}fps`);
                this.updateCanvasSize();
                this.lastAdjustment = timestamp;
                this.fpsHistory = [];
            }
            // If between targetFps-8 and targetFps, just wait for more data
        } else if (this.tuningPhase === 'stable') {
            // Keep decreasing until FPS is actually at target
            if (avgFps < targetFps) {
                const decreased = this.quality.decrease();
                if (decreased) {
                    console.log(`☁️ [${this.name}] ↓ FPS recovery: ${this.quality.toString()} @ ${Math.round(avgFps)}fps → targeting ${targetFps}fps`);
                    this.updateCanvasSize();
                    this.lastAdjustment = timestamp;
                    this.fpsHistory = [];
                } else {
                    console.log(`⚠️ [${this.name}] At minimum quality, FPS: ${Math.round(avgFps)}`);
                }
            } else if (avgFps >= targetFps + 10) {
                // FPS recovered well, log it
                console.log(`✓ [${this.name}] FPS stable: ${this.quality.toString()} @ ${Math.round(avgFps)}fps`);
                this.fpsHistory = []; // Prevent repeated logging
            }
        }
    }
    
    // Manual controls
    forceMaxQuality() {
        this.quality.octaves = this.quality.maxOctaves;
        this.quality.resolution = this.quality.maxResolution;
        this.quality.detailLayers = this.quality.maxDetailLayers;
        this.tuningPhase = 'stable'; // Will auto-decrease if needed
        this.fpsHistory = [];
        this.updateCanvasSize();
        console.log(`☁️ [${this.name}] Forced max: ${this.quality.toString()}`);
    }
    
    retune() {
        this.quality = new DynamicQuality();
        this.tuningPhase = 'warmup';
        this.warmupStart = 0;
        this.stableFrames = 0;
        this.fpsHistory = [];
        this.frameTimes = [];
        this.peakQuality = null;
        this.updateCanvasSize();
        console.log(`☁️ [${this.name}] Re-tuning from scratch...`);
    }
    
    // ========================================================================
    // Rendering
    // ========================================================================
    
    render(timestamp) {
        if (!this.webglSupported) {
            if (this.fallbackRenderer) {
                this.fallbackRenderer.render(timestamp);
            }
            return;
        }
        
        const gl = this.gl;
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(this.program);
        gl.uniform1f(this.uniforms.time, timestamp);
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uniforms.opacity, this.options.opacity);
        gl.uniform3fv(this.uniforms.colorDark, this.colors.dark);
        gl.uniform3fv(this.uniforms.colorMid, this.colors.mid);
        gl.uniform3fv(this.uniforms.colorBright, this.colors.bright);
        gl.uniform1i(this.uniforms.octaves, this.quality.octaves);
        gl.uniform1i(this.uniforms.detailLayers, this.quality.detailLayers);
        gl.uniform1f(this.uniforms.detailScale, this.quality.detailScale);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    setColors(dark, mid, bright) {
        this.colors.dark = dark;
        this.colors.mid = mid;
        this.colors.bright = bright;
        
        if (this.fallbackRenderer) {
            this.fallbackRenderer.setColors(dark, mid, bright);
        }
    }
    
    animate(timestamp) {
        // Don't render if not running
        if (!this.isRunning) {
            this.animationId = requestAnimationFrame((t) => this.animate(t));
            return;
        }
        
        // Don't render if off-screen - skip entirely
        if (!this.isVisible) {
            this.lastFrameTime = 0; // Reset frame timing
            this.animationId = requestAnimationFrame((t) => this.animate(t));
            return;
        }
        
        this.updateFps(timestamp);
        this.render(timestamp);
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.toggleButton?.classList.remove('disabled');
        
        // Reset tracking
        this.frameTimes = [];
        this.fpsHistory = [];
        this.lastFrameTime = 0;
        this.warmupStart = 0;
        this.tuningPhase = 'warmup';
        
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
        
        if (this.webglSupported && this.gl) {
            this.gl.clearColor(0, 0, 0, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
    }
    
    resume() {
        if (this.isRunning && !this.animationId) {
            this.animate(performance.now());
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
            const ext = this.gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
        }
    }
    
    get currentQuality() {
        return this.quality.toString();
    }
    
    get qualityScore() {
        return this.quality.getQualityScore();
    }
}

// ============================================================================
// Canvas 2D Fallback (simplified for brevity)
// ============================================================================

class OptimizedCanvas2DRenderer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = options;
        this.isRunning = false;
        this.quality = new DynamicQuality();
        this.quality.octaves = 4;
        this.quality.resolution = 0.5;
        
        this.colors = {
            dark: [60, 60, 70],
            mid: [93, 138, 168],
            bright: [142, 68, 173]
        };
        
        this.initSimplex();
        this.offscreen = document.createElement('canvas');
        this.offscreenCtx = this.offscreen.getContext('2d');
        
        // FPS tracking
        this.frameTimestamps = [];
        this.fpsHistory = [];
        this.lastFpsUpdate = 0;
        this.lastAdjustment = 0;
        this.tuningPhase = 'ramp-up';
        this.stableFrames = 0;
    }
    
    initSimplex() {
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) {
            this.perm[i] = p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
        this.grad3 = new Float32Array([
            1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1
        ]);
    }
    
    simplex2D(x, y) {
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const x0 = x - (i - t);
        const y0 = y - (j - t);
        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        const ii = i & 255;
        const jj = j & 255;
        let n0 = 0, n1 = 0, n2 = 0;
        let t0 = 0.5 - x0*x0 - y0*y0;
        if (t0 >= 0) {
            const gi0 = this.permMod12[ii + this.perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (this.grad3[gi0] * x0 + this.grad3[gi0+1] * y0);
        }
        let t1 = 0.5 - x1*x1 - y1*y1;
        if (t1 >= 0) {
            const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (this.grad3[gi1] * x1 + this.grad3[gi1+1] * y1);
        }
        let t2 = 0.5 - x2*x2 - y2*y2;
        if (t2 >= 0) {
            const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (this.grad3[gi2] * x2 + this.grad3[gi2+1] * y2);
        }
        return 70 * (n0 + n1 + n2);
    }
    
    handleResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        const scale = this.quality.resolution * 0.5;
        this.offscreen.width = Math.floor(this.canvas.width * scale);
        this.offscreen.height = Math.floor(this.canvas.height * scale);
    }
    
    updateFps(timestamp) {
        this.frameTimestamps.push(timestamp);
        const cutoff = timestamp - 1000;
        while (this.frameTimestamps.length > 0 && this.frameTimestamps[0] < cutoff) {
            this.frameTimestamps.shift();
        }
        this.currentFps = this.frameTimestamps.length;
        
        if (timestamp - this.lastFpsUpdate > 500) {
            this.fpsHistory.push(this.currentFps);
            if (this.fpsHistory.length > 6) this.fpsHistory.shift();
            this.lastFpsUpdate = timestamp;
            this.adaptQuality(timestamp);
        }
    }
    
    adaptQuality(timestamp) {
        if (timestamp - this.lastAdjustment < 1000) return;
        if (this.fpsHistory.length < 3) return;
        
        const avgFps = this.fpsHistory.slice(-3).reduce((a,b) => a+b, 0) / 3;
        
        if (this.tuningPhase === 'ramp-up') {
            if (avgFps >= 55) {
                if (this.quality.octaves < 6) {
                    this.quality.octaves++;
                    console.log(`☁️ Canvas2D ↑ ${this.quality.toString()}`);
                    this.handleResize();
                    this.lastAdjustment = timestamp;
                    this.fpsHistory = [];
                } else {
                    this.tuningPhase = 'stable';
                    console.log(`🎯 Canvas2D tuned: ${this.quality.toString()}`);
                }
            } else if (avgFps < 50) {
                this.quality.octaves = Math.max(3, this.quality.octaves - 1);
                this.tuningPhase = 'stable';
                console.log(`☁️ Canvas2D ↓ ${this.quality.toString()}`);
                this.handleResize();
            }
        }
    }
    
    render(timestamp) {
        this.updateFps(timestamp);
        
        const width = this.offscreen.width;
        const height = this.offscreen.height;
        if (width <= 0 || height <= 0) return;
        
        this.offscreenCtx.clearRect(0, 0, width, height);
        const imageData = this.offscreenCtx.createImageData(width, height);
        const data = imageData.data;
        
        const time = timestamp * 0.00005;
        const scale = 0.008;
        const octaves = this.quality.octaves;
        
        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                let value = 0;
                let amp = 0.5;
                let freq = 1;
                for (let o = 0; o < octaves; o++) {
                    value += this.simplex2D(x * scale * freq + time * (1 + o * 0.5), y * scale * freq) * amp;
                    freq *= 2;
                    amp *= 0.5;
                }
                value = (value + 1) * 0.5;
                
                if (value > 0.25) {
                    const intensity = (value - 0.25) / 0.75;
                    const idx = (y * width + x) * 4;
                    
                    if (value > 0.52) {
                        data[idx] = this.colors.bright[0] * intensity;
                        data[idx+1] = this.colors.bright[1] * intensity;
                        data[idx+2] = this.colors.bright[2] * intensity;
                        data[idx+3] = intensity * 230;
                    } else if (value > 0.38) {
                        data[idx] = this.colors.mid[0] * intensity;
                        data[idx+1] = this.colors.mid[1] * intensity;
                        data[idx+2] = this.colors.mid[2] * intensity;
                        data[idx+3] = intensity * 200;
                    } else {
                        data[idx] = this.colors.dark[0] * intensity;
                        data[idx+1] = this.colors.dark[1] * intensity;
                        data[idx+2] = this.colors.dark[2] * intensity;
                        data[idx+3] = intensity * 175;
                    }
                    
                    // Fill 2x2
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const fi = ((y+dy) * width + (x+dx)) * 4;
                            data[fi] = data[idx];
                            data[fi+1] = data[idx+1];
                            data[fi+2] = data[idx+2];
                            data[fi+3] = data[idx+3];
                        }
                    }
                }
            }
        }
        
        this.offscreenCtx.putImageData(imageData, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.drawImage(this.offscreen, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    start() { this.isRunning = true; this.frameTimestamps = []; this.fpsHistory = []; }
    stop() { this.isRunning = false; this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
    pause() {}
    resume() {}
    setColors(d, m, b) {
        this.colors.dark = [d[0]*255, d[1]*255, d[2]*255];
        this.colors.mid = [m[0]*255, m[1]*255, m[2]*255];
        this.colors.bright = [b[0]*255, b[1]*255, b[2]*255];
    }
    cleanup() { this.stop(); }
}

// ============================================================================
// Export
// ============================================================================

window.WebGLCloudRenderer = WebGLCloudRenderer;
window.OptimizedCanvas2DRenderer = OptimizedCanvas2DRenderer;
window.DynamicQuality = DynamicQuality;