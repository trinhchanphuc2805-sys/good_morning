

import { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const gardenRef = useRef<HTMLCanvasElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const elapseClockRef = useRef<HTMLDivElement>(null);
  const loveuRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLAnchorElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  // Helper: Typewriter effect
  function typewriterEffect(element: HTMLElement, speed = 75) {
    const html = element.innerHTML;
    let i = 0;
    element.innerHTML = '';
    const timer = setInterval(() => {
        const char = html.substr(i, 1);
      if (char === '<') {
        i = html.indexOf('>', i) + 1;
      } else {
        i++;
      }
      element.innerHTML = html.substring(0, i) + (i & 1 ? '_' : '');
      if (i >= html.length) clearInterval(timer);
    }, speed);
  }

  // Helper: Time elapse
  function timeElapse(startDate: Date, elapseClock: HTMLElement) {
    const now = new Date();
    let seconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
    const days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    seconds = seconds % 3600;
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secondsStr = String(seconds % 60).padStart(2, '0');
    elapseClock.innerHTML = `<span class="digit">${days}</span> days <span class="digit">${hours}</span> hours <span class="digit">${minutes}</span> minutes <span class="digit">${secondsStr}</span> seconds`;
  }

  // Helper: Confetti, Sparkles, Floating Hearts
  function createConfetti() {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  }
  function createSparkles() {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.position = 'fixed';
    sparkleContainer.style.top = '0';
    sparkleContainer.style.left = '0';
    sparkleContainer.style.width = '100%';
    sparkleContainer.style.height = '100%';
    sparkleContainer.style.pointerEvents = 'none';
    sparkleContainer.style.zIndex = '1000';
    document.body.appendChild(sparkleContainer);
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 2 + 's';
      sparkleContainer.appendChild(sparkle);
    }
  }
  function createFloatingHearts() {
    const heartContainer = document.createElement('div');
    heartContainer.className = 'floating-hearts';
    document.body.appendChild(heartContainer);
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = ['💕', '💖', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDelay = Math.random() * 2 + 's';
      heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
      heartContainer.appendChild(heart);
    }
    setTimeout(() => heartContainer.remove(), 6000);
  }

  // Birthday animation
  function startBirthdayAnimation() {
    createConfetti();
    createSparkles();
    createFloatingHearts();
    if (messagesRef.current) messagesRef.current.classList.add('birthday-bounce');
    setInterval(createConfetti, 2000);
    setInterval(createFloatingHearts, 3000);
  }

  // Show/hide messages
  function showMessages() {
    if (messagesRef.current) {
      messagesRef.current.style.display = 'block';
      setTimeout(() => showLoveU(), 5000);
    }
  }
  function showLoveU() {
    if (loveuRef.current) loveuRef.current.style.display = 'block';
  }


  // --- Hiệu ứng hoa nở trái tim (Garden, Bloom, Petal, Vector) ---
  class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    rotate(angle: number) {
      const x = this.x;
      const y = this.y;
      this.x = Math.cos(angle) * x - Math.sin(angle) * y;
      this.y = Math.sin(angle) * x + Math.cos(angle) * y;
      return this;
    }
    mult(factor: number) {
      this.x *= factor;
      this.y *= factor;
      return this;
    }
    clone() {
      return new Vector(this.x, this.y);
    }
  }

  class Petal {
    stretchA: number;
    stretchB: number;
    startAngle: number;
    angle: number;
    bloom: Bloom;
    growFactor: number;
    r: number;
    isfinished: boolean;
    constructor(a: number, f: number, b: number, e: number, c: number, d: Bloom) {
      this.stretchA = a;
      this.stretchB = f;
      this.startAngle = b;
      this.angle = e;
      this.bloom = d;
      this.growFactor = c;
      this.r = 1;
      this.isfinished = false;
    }
    draw() {
      const ctx = this.bloom.garden.ctx;
  const e = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
  const d = e.clone().rotate(Garden.degrad(this.angle));
  const c = e.clone().mult(this.stretchA);
  const b = d.clone().mult(this.stretchB);
  ctx.strokeStyle = this.bloom.c;
  ctx.beginPath();
  ctx.moveTo(e.x, e.y);
  ctx.bezierCurveTo(c.x, c.y, b.x, b.y, d.x, d.y);
  ctx.stroke();
    }
    render() {
      if (this.r <= this.bloom.r) {
        this.r += this.growFactor;
        this.draw();
      } else {
        this.isfinished = true;
      }
    }
  }

  class Bloom {
    p: Vector;
    r: number;
    c: string;
    pc: number;
    petals: Petal[] = [];
    garden: Garden;
    constructor(e: Vector, d: number, f: string, a: number, b: Garden) {
      this.p = e;
      this.r = d;
      this.c = f;
      this.pc = a;
      this.garden = b;
      this.init();
      this.garden.addBloom(this);
    }
    draw() {
      let b = true;
      this.garden.ctx.save();
      this.garden.ctx.translate(this.p.x, this.p.y);
      for (let a = 0; a < this.petals.length; a++) {
        const c = this.petals[a];
        c.render();
        b = b && c.isfinished;
      }
      this.garden.ctx.restore();
      if (b === true) {
        this.garden.removeBloom(this);
      }
    }
    init() {
      const c = 360 / this.pc;
      const b = Garden.randomInt(0, 90);
      for (let a = 0; a < this.pc; a++) {
        this.petals.push(
          new Petal(
            Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max),
            Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max),
            b + a * c,
            c,
            Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max),
            this
          )
        );
      }
    }
  }

  class Garden {
    blooms: Bloom[] = [];
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    static options = {
      petalCount: { min: 8, max: 15 },
      petalStretch: { min: 0.1, max: 3 },
      growFactor: { min: 0.1, max: 1 },
      bloomRadius: { min: 8, max: 10 },
      density: 10,
      growSpeed: 1000 / 60,
      color: { rmin: 128, rmax: 255, gmin: 0, gmax: 128, bmin: 0, bmax: 128, opacity: 0.1 },
      tanAngle: 60,
    };
    constructor(ctx: CanvasRenderingContext2D, element: HTMLCanvasElement) {
      this.ctx = ctx;
      this.element = element;
    }
    render() {
      for (let a = 0; a < this.blooms.length; a++) {
        this.blooms[a].draw();
      }
    }
    addBloom(a: Bloom) {
      this.blooms.push(a);
    }
    removeBloom(a: Bloom) {
      for (let c = 0; c < this.blooms.length; c++) {
        if (this.blooms[c] === a) {
          this.blooms.splice(c, 1);
          return;
        }
      }
    }
    createRandomBloom(x: number, y: number) {
      this.createBloom(
        x,
        y,
        Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max),
        Garden.randomrgba(
          Garden.options.color.rmin,
          Garden.options.color.rmax,
          Garden.options.color.gmin,
          Garden.options.color.gmax,
          Garden.options.color.bmin,
          Garden.options.color.bmax,
          Garden.options.color.opacity
        ),
        Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max)
      );
    }
    createBloom(x: number, y: number, r: number, c: string, pc: number) {
      new Bloom(new Vector(x, y), r, c, pc, this);
    }
    clear() {
      this.blooms = [];
      this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }
    static random(b: number, a: number) {
      return Math.random() * (a - b) + b;
    }
    static randomInt(b: number, a: number) {
      return Math.floor(Math.random() * (a - b + 1)) + b;
    }
    static degrad(a: number) {
      return (Math.PI * 2 / 360) * a;
    }
    static rgba(r: number, g: number, b: number, a: number) {
      return `rgba(${r},${g},${b},${a})`;
    }
    static randomrgba(rmin: number, rmax: number, gmin: number, gmax: number, bmin: number, bmax: number, opacity: number) {
      const r = Math.round(Garden.random(rmin, rmax));
      const g = Math.round(Garden.random(gmin, gmax));
      const b = Math.round(Garden.random(bmin, bmax));
      const e = 5;
      if (Math.abs(r - g) <= e && Math.abs(g - b) <= e && Math.abs(b - r) <= e) {
        return Garden.rgba(rmin, gmin, bmin, opacity);
      } else {
        return Garden.rgba(r, g, b, opacity);
      }
    }
  }

  // Lấy điểm trên đường trái tim
  function getHeartPoint(angle: number, offsetX: number, offsetY: number) {
    const t = angle / Math.PI;
    const x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    const y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [offsetX + x, offsetY + y];
  }

  // Hiệu ứng hoa nở trái tim
  function startHeartAnimation(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'lighter';
    const garden = new Garden(ctx, canvas);
  const offsetX = canvas.width / 2;
  const offsetY = canvas.height / 2 - 55;
  let d = 10;
  const blooms: [number, number][] = [];
    const interval = setInterval(() => {
      const [x, y] = getHeartPoint(d, offsetX, offsetY);
      let canDraw = true;
      for (let i = 0; i < blooms.length; i++) {
        const [bx, by] = blooms[i];
        const dist = Math.sqrt((bx - x) ** 2 + (by - y) ** 2);
        if (dist < Garden.options.bloomRadius.max * 1.3) {
          canDraw = false;
          break;
        }
      }
      if (canDraw) {
        blooms.push([x, y]);
        garden.createRandomBloom(x, y);
      }
      if (d >= 30) {
        clearInterval(interval);
      } else {
        d += 0.2;
      }
    }, 50);
    // Render loop
    const renderLoop = () => {
      garden.render();
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }

  useEffect(() => {
    // Typewriter effect
    if (codeRef.current) typewriterEffect(codeRef.current);

    // Heart canvas animation: hiệu ứng hoa nở trái tim
    if (gardenRef.current) {
      const canvas = gardenRef.current;
      canvas.width = 670;
      canvas.height = 625;
      startHeartAnimation(canvas);
    }

    // Birthday animation (confetti, sparkles, hearts)
    setTimeout(() => {
      startBirthdayAnimation();
      setTimeout(showMessages, 1000);
    }, 2000);

    // Accept button: show elapse clock
    if (acceptRef.current && elapseClockRef.current) {
      acceptRef.current.onclick = (e) => {
        e.preventDefault();
        acceptRef.current!.style.display = 'none';
        elapseClockRef.current!.style.display = 'block';
        const together = new Date('2025-04-30T00:00:00');
        timeElapse(together, elapseClockRef.current!);
        setInterval(() => timeElapse(together, elapseClockRef.current!), 500);
      };
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div id="mainDiv">
      <div id="content">
        <div id="code" ref={codeRef}>
          <div className="love-message">
            <div className="message-header">
              <span className="heart-icon">💕</span>
              <span className="beautiful-name">Chấn Phúc</span>
              <span className="heart-icon">💕</span>
            </div>
            <div className="message-content">
              <p className="greeting">Chào buổi sáng em yêu!</p>
              <p className="wish">Chúc em một ngày mới thật nhiều niềm vui,</p>
              <p className="wish">luôn mỉm cười rạng rỡ và gặp toàn điều may mắn.</p>
              <p className="sweet-message">Anh mong hôm nay của em sẽ ngọt ngào như chính em vậy.</p>
            </div>
            <div className="gift-container">
              <div className="gift-box">🎁</div>
              <div className="gift-box">🌹</div>
              <div className="gift-box">💝</div>
              <div className="gift-box">🎀</div>
            </div>
          </div>
        </div>
        <div id="loveHeart">
          <canvas id="garden" ref={gardenRef}></canvas>
          <div id="words">
            <div id="messages" ref={messagesRef}>
              <center>
                {/* Google Ads script placeholder */}
              </center>
              <span className="beautiful-name floating-text">Nhung</span> yêu 💕 Chúng ta đã quen nhau được
              <div id="elapseClock" ref={elapseClockRef} style={{ display: 'none' }}></div>
              <a href="#" id="accept" ref={acceptRef}>Nhấn vào đây để xem thời gian yêu nhau!</a>
            </div>
            <div id="loveu" ref={loveuRef}>
              Chúc em một ngày mới thật nhiều niềm vui, luôn mỉm cười rạng rỡ và gặp toàn điều may mắn. Anh mong hôm nay của em sẽ ngọt ngào như chính em vậy.<br />
              <div className="signature"><span className="glow-text">- Chấn Phúc</span> 💕</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
