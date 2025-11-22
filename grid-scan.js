// GridScan - Vanilla JavaScript version converted from React component
// 3D grid animation with scan effect

class GridScan {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      sensitivity: options.sensitivity || 0.55,
      lineThickness: options.lineThickness || 1,
      linesColor: options.linesColor || '#1a0d2e', // Darker purple
      scanColor: options.scanColor || '#8e2de2', // Purple matching theme
      scanOpacity: options.scanOpacity || 0.4,
      gridScale: options.gridScale || 0.1,
      lineStyle: options.lineStyle || 'solid',
      lineJitter: options.lineJitter || 0.1,
      scanDirection: options.scanDirection || 'pingpong',
      enablePost: options.enablePost !== false,
      bloomIntensity: options.bloomIntensity || 0.6,
      bloomThreshold: options.bloomThreshold || 0,
      bloomSmoothing: options.bloomSmoothing || 0,
      chromaticAberration: options.chromaticAberration || 0.002,
      noiseIntensity: options.noiseIntensity || 0.01,
      scanGlow: options.scanGlow || 0.5,
      scanSoftness: options.scanSoftness || 2,
      scanPhaseTaper: options.scanPhaseTaper || 0.9,
      scanDuration: options.scanDuration || 2.0,
      scanDelay: options.scanDelay || 2.0,
      ...options
    };

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.material = null;
    this.composer = null;
    this.bloom = null;
    this.chroma = null;
    this.rafId = null;
    this.lookTarget = new THREE.Vector2(0, 0);
    this.tiltTarget = 0;
    this.yawTarget = 0;
    this.lookCurrent = new THREE.Vector2(0, 0);
    this.lookVel = new THREE.Vector2(0, 0);
    this.tiltCurrent = 0;
    this.tiltVel = 0;
    this.yawCurrent = 0;
    this.yawVel = 0;
    this.MAX_SCANS = 8;
    this.scanStarts = [];

    this.init();
  }

  init() {
    if (!this.container || !window.THREE) {
      console.warn('GridScan: Container or THREE.js not available');
      return;
    }

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 0);
    
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: this.createUniforms(),
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    // Create scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(quad);

    // Setup post-processing if enabled
    if (this.options.enablePost && window.EffectComposer) {
        try {
          this.composer = new window.EffectComposer(this.renderer);
          const renderPass = new window.RenderPass(this.scene, this.camera);
          this.composer.addPass(renderPass);

        if (window.BloomEffect) {
          this.bloom = new window.BloomEffect({
            intensity: 1.0,
            luminanceThreshold: this.options.bloomThreshold,
            luminanceSmoothing: this.options.bloomSmoothing
          });
          this.bloom.blendMode.opacity.value = Math.max(0, this.options.bloomIntensity);
        }

        if (window.ChromaticAberrationEffect) {
          this.chroma = new window.ChromaticAberrationEffect({
            offset: new THREE.Vector2(this.options.chromaticAberration, this.options.chromaticAberration),
            radialModulation: true,
            modulationOffset: 0.0
          });
        }

        if (this.bloom || this.chroma) {
          const effects = [this.bloom, this.chroma].filter(Boolean);
          const effectPass = new window.EffectPass(this.camera, ...effects);
          effectPass.renderToScreen = true;
          this.composer.addPass(effectPass);
        }
      } catch (error) {
        console.warn('GridScan: Post-processing not available, using standard renderer', error);
        this.composer = null;
      }
    }

    // Setup event listeners
    this.setupEventListeners();

    // Start animation
    this.animate();
  }

  createUniforms() {
    const s = THREE.MathUtils.clamp(this.options.sensitivity, 0, 1);
    const skewScale = THREE.MathUtils.lerp(0.06, 0.2, s);
    const tiltScale = THREE.MathUtils.lerp(0.12, 0.3, s);
    const yawScale = THREE.MathUtils.lerp(0.1, 0.28, s);

    return {
      iResolution: {
        value: new THREE.Vector3(
          this.container.clientWidth,
          this.container.clientHeight,
          this.renderer ? this.renderer.getPixelRatio() : 1
        )
      },
      iTime: { value: 0 },
      uSkew: { value: new THREE.Vector2(0, 0) },
      uTilt: { value: 0 },
      uYaw: { value: 0 },
      uLineThickness: { value: this.options.lineThickness },
      uLinesColor: { value: this.srgbColor(this.options.linesColor) },
      uScanColor: { value: this.srgbColor(this.options.scanColor) },
      uGridScale: { value: this.options.gridScale },
      uLineStyle: { value: this.options.lineStyle === 'dashed' ? 1 : this.options.lineStyle === 'dotted' ? 2 : 0 },
      uLineJitter: { value: Math.max(0, Math.min(1, this.options.lineJitter || 0)) },
      uScanOpacity: { value: this.options.scanOpacity },
      uNoise: { value: this.options.noiseIntensity },
      uBloomOpacity: { value: this.options.bloomIntensity },
      uScanGlow: { value: this.options.scanGlow },
      uScanSoftness: { value: this.options.scanSoftness },
      uPhaseTaper: { value: this.options.scanPhaseTaper },
      uScanDuration: { value: this.options.scanDuration },
      uScanDelay: { value: this.options.scanDelay },
      uScanDirection: { value: this.options.scanDirection === 'backward' ? 1 : this.options.scanDirection === 'pingpong' ? 2 : 0 },
      uScanStarts: { value: new Array(this.MAX_SCANS).fill(0) },
      uScanCount: { value: 0 }
    };
  }

  getVertexShader() {
    return `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;
  }

  getFragmentShader() {
    return `
      precision highp float;
      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec2 uSkew;
      uniform float uTilt;
      uniform float uYaw;
      uniform float uLineThickness;
      uniform vec3 uLinesColor;
      uniform vec3 uScanColor;
      uniform float uGridScale;
      uniform float uLineStyle;
      uniform float uLineJitter;
      uniform float uScanOpacity;
      uniform float uScanDirection;
      uniform float uNoise;
      uniform float uBloomOpacity;
      uniform float uScanGlow;
      uniform float uScanSoftness;
      uniform float uPhaseTaper;
      uniform float uScanDuration;
      uniform float uScanDelay;
      varying vec2 vUv;
      uniform float uScanStarts[8];
      uniform float uScanCount;
      const int MAX_SCANS = 8;

      float smoother01(float a, float b, float x) {
        float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
        vec3 ro = vec3(0.0);
        vec3 rd = normalize(vec3(p, 2.0));
        float cR = cos(uTilt), sR = sin(uTilt);
        rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;
        float cY = cos(uYaw), sY = sin(uYaw);
        rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;
        vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
        rd.xy += skew * rd.z;

        vec3 color = vec3(0.0);
        float minT = 1e20;
        float gridScale = max(1e-5, uGridScale);
        float fadeStrength = 2.0;
        vec2 gridUV = vec2(0.0);
        float hitIsY = 1.0;

        for (int i = 0; i < 4; i++) {
          float isY = float(i < 2);
          float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
          float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
          float den = isY * rd.y + (1.0 - isY) * rd.x;
          float t = num / den;
          vec3 h = ro + rd * t;
          float depthBoost = smoothstep(0.0, 3.0, h.z);
          h.xy += skew * 0.15 * depthBoost;
          bool use = t > 0.0 && t < minT;
          gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
          minT = use ? t : minT;
          hitIsY = use ? isY : hitIsY;
        }

        vec3 hit = ro + rd * minT;
        float dist = length(hit - ro);
        float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
        
        if (jitterAmt > 0.0) {
          vec2 j = vec2(
            sin(gridUV.y * 2.7 + iTime * 1.8),
            cos(gridUV.x * 2.3 - iTime * 1.6)
          ) * (0.15 * jitterAmt);
          gridUV += j;
        }

        float fx = fract(gridUV.x);
        float fy = fract(gridUV.y);
        float ax = min(fx, 1.0 - fx);
        float ay = min(fy, 1.0 - fy);
        float wx = fwidth(gridUV.x);
        float wy = fwidth(gridUV.y);
        float halfPx = max(0.0, uLineThickness) * 0.5;
        float tx = halfPx * wx;
        float ty = halfPx * wy;
        float aax = wx;
        float aay = wy;
        float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
        float lineY = 1.0 - smoothstep(ty, ty + aay, ay);

        if (uLineStyle > 0.5) {
          float dashRepeat = 4.0;
          float dashDuty = 0.5;
          float vy = fract(gridUV.y * dashRepeat);
          float vx = fract(gridUV.x * dashRepeat);
          float dashMaskY = step(vy, dashDuty);
          float dashMaskX = step(vx, dashDuty);
          if (uLineStyle < 1.5) {
            lineX *= dashMaskY;
            lineY *= dashMaskX;
          }
        }

        float primaryMask = max(lineX, lineY);
        vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
        
        if (jitterAmt > 0.0) {
          vec2 j2 = vec2(
            cos(gridUV2.y * 2.1 - iTime * 1.4),
            sin(gridUV2.x * 2.5 + iTime * 1.7)
          ) * (0.15 * jitterAmt);
          gridUV2 += j2;
        }

        float fx2 = fract(gridUV2.x);
        float fy2 = fract(gridUV2.y);
        float ax2 = min(fx2, 1.0 - fx2);
        float ay2 = min(fy2, 1.0 - fy2);
        float wx2 = fwidth(gridUV2.x);
        float wy2 = fwidth(gridUV2.y);
        float tx2 = halfPx * wx2;
        float ty2 = halfPx * wy2;
        float aax2 = wx2;
        float aay2 = wy2;
        float lineX2 = 1.0 - smoothstep(tx2, tx2 + aax2, ax2);
        float lineY2 = 1.0 - smoothstep(ty2, ty2 + aay2, ay2);

        if (uLineStyle > 0.5) {
          float dashRepeat2 = 4.0;
          float dashDuty2 = 0.5;
          float vy2m = fract(gridUV2.y * dashRepeat2);
          float vx2m = fract(gridUV2.x * dashRepeat2);
          float dashMaskY2 = step(vy2m, dashDuty2);
          float dashMaskX2 = step(vx2m, dashDuty2);
          if (uLineStyle < 1.5) {
            lineX2 *= dashMaskY2;
            lineY2 *= dashMaskX2;
          }
        }

        float altMask = max(lineX2, lineY2);
        float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
        float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
        float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
        float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
        altMask *= edgeGate;
        float lineMask = max(primaryMask, altMask);
        float fade = exp(-dist * fadeStrength);

        float dur = max(0.05, uScanDuration);
        float del = max(0.0, uScanDelay);
        float scanZMax = 2.0;
        float widthScale = max(0.1, uScanGlow);
        float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
        float sigmaA = sigma * 2.0;
        float combinedPulse = 0.0;
        float combinedAura = 0.0;
        float cycle = dur + del;
        float tCycle = mod(iTime, cycle);
        float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
        float phase = scanPhase;

        if (uScanDirection > 0.5 && uScanDirection < 1.5) {
          phase = 1.0 - phase;
        } else if (uScanDirection > 1.5) {
          float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
          phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
        }

        float scanZ = phase * scanZMax;
        float dz = abs(hit.z - scanZ);
        float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
        float taper = clamp(uPhaseTaper, 0.0, 0.49);
        float headW = taper;
        float tailW = taper;
        float headFade = smoother01(0.0, headW, phase);
        float tailFade = 1.0 - smoother01(1.0 - tailW, 1.0, phase);
        float phaseWindow = headFade * tailFade;
        float pulseBase = lineBand * phaseWindow;
        combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
        float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
        combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

        for (int i = 0; i < MAX_SCANS; i++) {
          if (float(i) >= uScanCount) break;
          float tActiveI = iTime - uScanStarts[i];
          float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
          if (uScanDirection > 0.5 && uScanDirection < 1.5) {
            phaseI = 1.0 - phaseI;
          } else if (uScanDirection > 1.5) {
            phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
          }
          float scanZI = phaseI * scanZMax;
          float dzI = abs(hit.z - scanZI);
          float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
          float headFadeI = smoother01(0.0, headW, phaseI);
          float tailFadeI = 1.0 - smoother01(1.0 - tailW, 1.0, phaseI);
          float phaseWindowI = headFadeI * tailFadeI;
          combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
          float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
          combinedAura += (auraBandI * 0.25) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
        }

        float lineVis = lineMask;
        vec3 gridCol = uLinesColor * lineVis * fade;
        vec3 scanCol = uScanColor * combinedPulse;
        vec3 scanAura = uScanColor * combinedAura;
        color = gridCol + scanCol + scanAura;

        float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
        color += (n - 0.5) * uNoise;
        color = clamp(color, 0.0, 1.0);

        float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
        float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
        float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
        float halo = max(gx, gy) * fade;
        alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));

        fragColor = vec4(color, alpha);
      }

      void main() {
        vec4 c;
        mainImage(c, vUv * iResolution.xy);
        gl_FragColor = c;
      }
    `;
  }

  setupEventListeners() {
    if (!this.container) return;

    const s = THREE.MathUtils.clamp(this.options.sensitivity, 0, 1);
    const skewScale = THREE.MathUtils.lerp(0.06, 0.2, s);
    const tiltScale = THREE.MathUtils.lerp(0.12, 0.3, s);
    const yawScale = THREE.MathUtils.lerp(0.1, 0.28, s);
    const smoothTime = THREE.MathUtils.lerp(0.45, 0.12, s);
    const maxSpeed = Infinity;
    const yBoost = THREE.MathUtils.lerp(1.2, 1.6, s);

    let leaveTimer = null;

    const onMove = (e) => {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }

      const rect = this.container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      this.lookTarget.set(nx, ny);
    };

    const onLeave = () => {
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        this.lookTarget.set(0, 0);
        this.tiltTarget = 0;
        this.yawTarget = 0;
      }, 250);
    };

    this.container.addEventListener('mousemove', onMove);
    this.container.addEventListener('mouseleave', onLeave);

    // Store cleanup function
    this.cleanupEvents = () => {
      this.container.removeEventListener('mousemove', onMove);
      this.container.removeEventListener('mouseleave', onLeave);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }

  smoothDampVec2(current, target, currentVelocity, smoothTime, maxSpeed, deltaTime) {
    const out = current.clone();
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    let change = current.clone().sub(target);
    const originalTo = target.clone();
    const maxChange = maxSpeed * smoothTime;
    if (change.length() > maxChange) change.setLength(maxChange);
    const tempTarget = current.clone().sub(change);
    const temp = currentVelocity.clone().addScaledVector(change, omega).multiplyScalar(deltaTime);
    currentVelocity.sub(temp.clone().multiplyScalar(omega));
    currentVelocity.multiplyScalar(exp);
    out.copy(tempTarget.clone().add(change.add(temp).multiplyScalar(exp)));
    const origMinusCurrent = originalTo.clone().sub(current);
    const outMinusOrig = out.clone().sub(originalTo);
    if (origMinusCurrent.dot(outMinusOrig) > 0) {
      out.copy(originalTo);
      currentVelocity.set(0, 0);
    }
    return out;
  }

  smoothDampFloat(current, target, velRef, smoothTime, maxSpeed, deltaTime) {
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    let change = current - target;
    const originalTo = target;
    const maxChange = maxSpeed * smoothTime;
    change = Math.sign(change) * Math.min(Math.abs(change), maxChange);
    const tempTarget = current - change;
    const temp = (velRef.v + omega * change) * deltaTime;
    velRef.v = (velRef.v - omega * temp) * exp;
    let out = tempTarget + (change + temp) * exp;
    const origMinusCurrent = originalTo - current;
    const outMinusOrig = out - originalTo;
    if (origMinusCurrent * outMinusOrig > 0) {
      out = originalTo;
      velRef.v = 0;
    }
    return { value: out, v: velRef.v };
  }

  animate() {
    if (!this.renderer || !this.material) return;

    let last = performance.now();
    const s = THREE.MathUtils.clamp(this.options.sensitivity, 0, 1);
    const skewScale = THREE.MathUtils.lerp(0.06, 0.2, s);
    const tiltScale = THREE.MathUtils.lerp(0.12, 0.3, s);
    const yawScale = THREE.MathUtils.lerp(0.1, 0.28, s);
    const smoothTime = THREE.MathUtils.lerp(0.45, 0.12, s);
    const maxSpeed = Infinity;
    const yBoost = THREE.MathUtils.lerp(1.2, 1.6, s);

    const tick = () => {
      const now = performance.now();
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
      last = now;

      this.lookCurrent.copy(
        this.smoothDampVec2(this.lookCurrent, this.lookTarget, this.lookVel, smoothTime, maxSpeed, dt)
      );

      const tiltSm = this.smoothDampFloat(
        this.tiltCurrent,
        this.tiltTarget,
        { v: this.tiltVel },
        smoothTime,
        maxSpeed,
        dt
      );
      this.tiltCurrent = tiltSm.value;
      this.tiltVel = tiltSm.v;

      const yawSm = this.smoothDampFloat(
        this.yawCurrent,
        this.yawTarget,
        { v: this.yawVel },
        smoothTime,
        maxSpeed,
        dt
      );
      this.yawCurrent = yawSm.value;
      this.yawVel = yawSm.v;

      const skew = new THREE.Vector2(
        this.lookCurrent.x * skewScale,
        -this.lookCurrent.y * yBoost * skewScale
      );

      this.material.uniforms.uSkew.value.set(skew.x, skew.y);
      this.material.uniforms.uTilt.value = this.tiltCurrent * tiltScale;
      this.material.uniforms.uYaw.value = THREE.MathUtils.clamp(this.yawCurrent * yawScale, -0.6, 0.6);
      this.material.uniforms.iTime.value = now / 1000;

      this.renderer.clear(true, true, true);

      if (this.composer) {
        this.composer.render(dt);
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  srgbColor(hex) {
    const c = new THREE.Color(hex);
    return c.convertSRGBToLinear();
  }

  resize() {
    if (!this.renderer || !this.container) return;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    if (this.material) {
      this.material.uniforms.iResolution.value.set(
        this.container.clientWidth,
        this.container.clientHeight,
        this.renderer.getPixelRatio()
      );
    }
    if (this.composer) {
      this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  }

  dispose() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.cleanupEvents) {
      this.cleanupEvents();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }

    if (this.renderer && this.container) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}

// Make available globally
window.GridScan = GridScan;

