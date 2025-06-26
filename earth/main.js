import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Stars Background
function addStars() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}
addStars();

// Earth Sphere
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load(
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 64, 64),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Animate
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsive canvas
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
