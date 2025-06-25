// Import Three.js libraries
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

// Create renderer with transparent background
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// Add orbit controls with limitations
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.5;
controls.enablePan = false;

// Add lighting
// Ambient light for overall scene illumination
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Blue point light for accent
const blueLight = new THREE.PointLight(0x00bfff, 2, 10);
blueLight.position.set(-2, 1, 2);
scene.add(blueLight);

// Purple point light for accent
const purpleLight = new THREE.PointLight(0x8a2be2, 2, 10);
purpleLight.position.set(2, -1, -2);
scene.add(purpleLight);

// Create stars
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });

  const starsVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  return stars;
}

const stars = createStars();

// Array to store models for animation
const animateModels = [];

// Load models
const loader = new GLTFLoader();
const mixers = [];
let actions = {};
let activeAction;

// Load astronaut
loader.load("./modals/astronaut.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(-3, 0.5, 0);
  model.scale.set(0.9, 0.9, 0.9);

  scene.add(model);

  console.log("animations:", gltf.animations);
  // Play animation if available
  if (gltf.animations && gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });

    // Start with idle
    activeAction = actions["idle"];
    activeAction.play();

    // Example: Switch to 'wave' after 3 seconds
    setTimeout(() => {
      activeAction.fadeOut(0.5);
      activeAction = actions["wave"];
      activeAction.reset().fadeIn(0.5).play();
    }, 3000);

    setTimeout(() => {
      activeAction.fadeOut(0.5);
      activeAction = actions["moon_walk"];
      activeAction.reset().fadeIn(0.5).play();
    }, 6000);

    mixers.push(mixer); // Add mixer to array for updating in render loop
  }
  animateModels.push({
    model,
    baseY: model.position.y,
    rotationSpeed: 1,
    floatSpeed: 0.003,
    floatAmplitude: 0.3,
  });
});

loader.load("./modals/rock.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(35, -17, -25);
  model.scale.set(0.3, 0.3, 0.3);
  scene.add(model);
  animateModels.push({
    model,
    baseY: model.position.y,
    rotationSpeed: 1.5,
    floatSpeed: 0.002,
    floatAmplitude: 0.2,
  });
});

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixers.forEach((mixer) => mixer.update(delta));

  time += 0.01;

  // Update controls
  controls.update();

  // Animate models
  animateModels.forEach((item) => {
    item.model.rotation.y += item.rotationSpeed * clock.getDelta();
    item.model.position.y =
      item.baseY + Math.sin(time * item.floatSpeed) * item.floatAmplitude;
  });

  // Rotate stars slowly
  stars.rotation.y += 0.0015;

  // Render scene
  renderer.render(scene, camera);
}

animate();

// Add renderer to DOM
document.getElementById("space-scene").appendChild(renderer.domElement);

// Typing animation
const typingTextElement = document.querySelector(".typing-text");
const words = ["Modern Web", "Mobile Apps"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typingSpeed = 1000; // Pause at end of word
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingSpeed = 500; // Pause before typing next word
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start typing animation
setTimeout(typeEffect, 1000);

// Animation transition handler
function switchAnimation(name) {
  if (actions[name] && activeAction !== actions[name]) {
    activeAction?.fadeOut(0.5);
    activeAction = actions[name];
    activeAction.reset().fadeIn(0.5).play();
  }
}

// Event delegation for animation buttons
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".anim-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const animName = btn.getAttribute("data-anim");
      switchAnimation(animName);
    });
  });
});

window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.transition = "opacity 1s ease";
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = "none";
      document.getElementById("main-content").style.display = "block";
    }, 1000); // match transition duration
  }, 2000); // loader duration
});
