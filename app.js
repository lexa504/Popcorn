const NUM_CORNS = 200;
const KERNEL_HEIGHT = 0.02;
const KERNEL_ASPECT_RATIO = 142 / 94;
const POPCORN_HEIGHT = 0.07;
const POPCORN_ASPECT_RATIO = 1119 / 1033;
const TIME_MIN = 2000;
const TIME_MAX = 10000;
const POPCORN_MULT_MIN = 0.85;
const POPCORN_MULT_MAX = 1.15;
const POPCORN_SPEED = 0.00125;
const POPCORN_SPIN = 0.01;
const G = 0.000001;
let unpoppedImg;
let poppedImg;
let kernelHeight;
let kernelHeightPct;
let kernelWidth;
let kernelWidthPct;
let canvas;
let context;
let corns = [];
let popcornHeight;
let popcornHeightPct;
let popcornWidth;
let popcornWidthPct;
let timePrior = 0;

window.onload = init;

function animate(timeNow) {
  let timeChange = timeNow - timePrior;
  context.clearRect(0, 0, canvas.width, canvas.height);
  updateCorn(timeChange);
  drawCorn();
  timePrior = timeNow;
  requestAnimationFrame(animate);
}

function drawCorn() {
  for (let i = 0; i < NUM_CORNS; ++i) {
    let corn = corns[i];
    context.translate(corn.x * canvas.width, corn.y * canvas.height);
    context.rotate(corn.a);
    context.drawImage(
      corn.img,
      -0.5 * corn.w * canvas.width,
      -0.5 * corn.h * canvas.height,
      corn.w * canvas.width,
      corn.h * canvas.height
    );
    context.rotate(-corn.a);
    context.translate(-corn.x * canvas.width, -corn.y * canvas.height);
  }
}

function init() {
  canvas = document.getElementById("canvas");
  unpoppedImg = document.getElementById("unpopped");
  poppedImg = document.getElementById("popped");
  context = canvas.getContext("2d");
  makeCorn();
  window.onresize = resize;
  resize();
  requestAnimationFrame(animate);
}

function makeCorn() {
  for (let i = 0; i < NUM_CORNS; ++i) {
    let corn = {
      x: Math.random(),
      y: undefined,
      w: undefined,
      h: undefined,
      a: 2 * Math.PI * Math.random(),
      spin: 0,
      img: unpoppedImg,
      isPopped: false,
      mult:
        POPCORN_MULT_MIN +
        (POPCORN_MULT_MAX - POPCORN_MULT_MIN) * Math.random(),
      vx: 0,
      vy: 0,
    };
    let time = TIME_MIN + (TIME_MAX - TIME_MIN) * Math.random();
    setTimeout(() => {
      corn.img = poppedImg;
      corn.w = popcornWidthPct * corn.mult;
      corn.h = popcornHeightPct * corn.mult;
      corn.y = 1 - 0.5 * popcornHeightPct * corn.mult;
      corn.vy = -POPCORN_SPEED;
      corn.vx = -POPCORN_SPEED / 2 + POPCORN_SPEED * Math.random();
      corn.spin = -POPCORN_SPIN + 2 * POPCORN_SPIN * Math.random();
      corn.isPopped = true;
    }, time);
    corns.push(corn);
  }
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  kernelHeight = KERNEL_HEIGHT * canvas.height;
  kernelWidth = kernelHeight * KERNEL_ASPECT_RATIO;
  kernelHeightPct = KERNEL_HEIGHT;
  kernelWidthPct = kernelWidth / canvas.width;
  popcornHeight = POPCORN_HEIGHT * canvas.height;
  popcornWidth = popcornHeight * POPCORN_ASPECT_RATIO;
  popcornHeightPct = POPCORN_HEIGHT;
  popcornWidthPct = popcornWidth / canvas.width;
  for (let i = 0; i < NUM_CORNS; i++) {
    let corn = corns[i];
    if (corn.isPopped) {
      corn.w = popcornWidthPct * corn.mult;
      corn.h = popcornHeightPct * corn.mult;
    } else {
      corn.w = kernelWidthPct;
      corn.h = kernelHeightPct;
      corn.y = 1 - 0.5 * kernelHeightPct;
    }
  }
}

function updateCorn(timeChange) {
  for (let i = 0; i < NUM_CORNS; ++i) {
    let corn = corns[i];
    if (!corn.isPopped) {
      continue;
    }
    corn.vy += G * timeChange;
    corn.a += corn.spin * timeChange;
    corn.x += corn.vx * timeChange;
    corn.y += corn.vy * timeChange;
    if (corn.x < corn.w / 2) {
      corn.x = corn.w / 2;
      corn.vx *= -1;
    } else if (corn.x > 1 - corn.w / 2) {
      corn.x = 1 - corn.w / 2;
      corn.vx *= -1;
    }
    if (corn.y < corn.h / 2) {
      corn.y = corn.h / 2;
      corn.vy *= -1;
    } else if (corn.y > 1 - corn.h / 2) {
      corn.y = 1 - corn.h / 2;
      corn.vy = 0;
      corn.vx = 0;
      corn.spin = 0;
    }
   

    // let dx = -0.001 + 0.002 * Math.random();
    // // let dy = -0.001 + 0.002 * Math.random();
    // corn.x += dx;
    // // corn.y += dy;
  }
}
