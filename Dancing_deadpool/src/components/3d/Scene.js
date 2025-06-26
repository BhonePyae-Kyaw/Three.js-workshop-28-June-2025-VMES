import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

class Scene {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = null;
    this.clock = new THREE.Clock();
    this.deadpoolMixer = null;
    
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Add cyberpunk background
    this.setupBackground();
    
    // Initialize controls after renderer is set up
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setupControls();
    
    this.setupLights();
    
    this.loader = new GLTFLoader();
    this.fontLoader = new FontLoader();
    this.textMesh = null;
    
    this.loadModels();
    this.loadText();
    
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.animate();
  }

  setupControls() {
    if (!this.controls) return;
    
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.5;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.update();
  }
  
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);
    
    const spotLight1 = new THREE.SpotLight(0x39ff14, 3.5);
    spotLight1.position.set(10, 10, 10);
    spotLight1.angle = 0.15;
    spotLight1.penumbra = 1;
    spotLight1.castShadow = true;
    this.scene.add(spotLight1);
    
    const spotLight2 = new THREE.SpotLight(0x39ff14, 2.7);
    spotLight2.position.set(-10, 10, -10);
    spotLight2.angle = 0.15;
    spotLight2.penumbra = 1;
    spotLight2.castShadow = true;
    this.scene.add(spotLight2);
    
    const pointLight1 = new THREE.PointLight(0x39ff14, 3.8);
    pointLight1.position.set(0, 5, 0);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x39ff14, 3.2);
    pointLight2.position.set(0, -5, 0);
    this.scene.add(pointLight2);
  }
  
  loadText() {
    this.fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      () => {
        this.createTextGeometry();
      },
      undefined,
      (error) => {
        console.error('Error loading font:', error);
        this.createTextGeometry();
      }
    );
  }
  
  createTextGeometry() {
    const createLEDTexture = (text, width, height) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = '72px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = '#ff3366';
      ctx.shadowBlur = 20;
      
      for (let y = 0; y < height; y += 2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, y, width, 1);
      }
      
      ctx.fillStyle = '#ffffff';
      
      ctx.fillText(text, 20, height/2);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 16) {
        if (pixels[i + 3] > 0) {
          pixels[i] = Math.round(pixels[i] / 32) * 32;
          pixels[i + 1] = Math.round(pixels[i + 1] / 32) * 32;
          pixels[i + 2] = Math.round(pixels[i + 2] / 32) * 32;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      
      return new THREE.CanvasTexture(canvas);
    };

    const createLEDMaterial = (texture) => new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0xff3366,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const lucasTexture = createLEDTexture('Lucas 👨🏻‍💻', 512, 256);
    const lucasGeometry = new THREE.PlaneGeometry(0.5, 0.2);
    this.textMesh = new THREE.Mesh(lucasGeometry, createLEDMaterial(lucasTexture));
    this.textMesh.position.set(1, 0.8, 2.3);
    this.textMesh.rotation.y = Math.PI / 2;
    this.textMesh.castShadow = false;
    this.textMesh.receiveShadow = false;
    this.scene.add(this.textMesh);

    const lucasGlowGeometry = new THREE.PlaneGeometry(0.51, 0.21);
    const lucasGlowMesh = new THREE.Mesh(lucasGlowGeometry, glowMaterial);
    lucasGlowMesh.position.copy(this.textMesh.position);
    lucasGlowMesh.rotation.copy(this.textMesh.rotation);
    lucasGlowMesh.position.z -= 0.001;
    this.scene.add(lucasGlowMesh);

    const scrollTexture = createLEDTexture('Full Stack Developer', 1024, 256);
    const scrollGeometry = new THREE.PlaneGeometry(0.8, 0.15);
    this.scrollMesh = new THREE.Mesh(scrollGeometry, createLEDMaterial(scrollTexture));
    this.scrollMesh.position.set(1, 0.6, 2.15);
    this.scrollMesh.rotation.y = Math.PI / 2;
    this.scrollMesh.castShadow = true;
    this.scrollMesh.receiveShadow = true;
    this.scene.add(this.scrollMesh);

    const scrollGlowGeometry = new THREE.PlaneGeometry(0.81, 0.16);
    const scrollGlowMesh = new THREE.Mesh(scrollGlowGeometry, glowMaterial);
    scrollGlowMesh.position.copy(this.scrollMesh.position);
    scrollGlowMesh.rotation.copy(this.scrollMesh.rotation);
    scrollGlowMesh.position.z -= 0.001;
    this.scene.add(scrollGlowMesh);
    
    const textLight = new THREE.PointLight(0xff3366, 4.2, 2);
    textLight.position.set(1, 0.7, 2.2);
    this.scene.add(textLight);

    // Add moon
    const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0xfefce5,
      emissive: 0xfefce5,
      emissiveIntensity: 5,
      shininess: 100,
      map: null,
      bumpMap: null,
      bumpScale: 0.05,
      specularMap: null,
      specular: new THREE.Color(0xfefce5)
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(-20, 20, -30);
    this.scene.add(moon);

    // Add moon glow
    const moonGlowGeometry = new THREE.SphereGeometry(1.6, 32, 32);
    const moonGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0.15
    });
    const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
    moonGlow.position.copy(moon.position);
    this.scene.add(moonGlow);

    // Add moon light
    const moonLight = new THREE.PointLight(0x4444ff, 0.8, 50);
    moonLight.position.copy(moon.position);
    this.scene.add(moonLight);

    // Load moon textures
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/textures/moon/moon.jpg',
      (texture) => {
        moonMaterial.map = texture;
        moonMaterial.needsUpdate = true;
      }
    );
    // textureLoader.load(
    //   '/textures/moon/moon_bump.jpg',
    //   (bumpMap) => {
    //     moonMaterial.bumpMap = bumpMap;
    //     moonMaterial.needsUpdate = true;
    //   }
    // );
    // textureLoader.load(
    //   '/textures/moon/moon_specular.jpg',
    //   (specularMap) => {
    //     moonMaterial.specularMap = specularMap;
    //     moonMaterial.needsUpdate = true;
    //   }
    // );

    this.glowMeshes = [lucasGlowMesh, scrollGlowMesh];
    this.textLight = textLight;
    this.textures = [lucasTexture, scrollTexture];
  }
  
  loadModel(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });
  }
  
  async loadModels() {
    try {
      const [computerRoomModel, deadpoolModel] = await Promise.all([
        this.loadModel('/models/computer-room/sci-fi_computer_room.glb'),
        this.loadModel('/models/dancing_deadpool/deadpool_dancing.glb')
      ]);

      this.computerRoom = computerRoomModel.scene;
      this.computerRoom.scale.set(1, 1, 1);
      this.computerRoom.position.set(0, 0, 0);
      this.scene.add(this.computerRoom);

      this.deadpool = deadpoolModel.scene;
      this.deadpool.scale.set(0.4, 0.4, 0.45);
      this.deadpool.position.set(-0.9, -1, 1.8);
      this.scene.add(this.deadpool);

      const deadpoolLight = new THREE.PointLight(0xff3366, 1, 3);
      deadpoolLight.position.set(1.5, -1, 1.5);
      this.scene.add(deadpoolLight);

      if (deadpoolModel.animations && deadpoolModel.animations.length > 0) {
        this.deadpoolMixer = new THREE.AnimationMixer(this.deadpool);
        const action = this.deadpoolMixer.clipAction(deadpoolModel.animations[2]);
        action.play();
      }

      // Set camera position and controls target after models are loaded
      this.camera.position.set(2, -0.7, 2.7);
      if (this.controls) {
        this.controls.target.set(-0.3, 1, -0.1);
        this.controls.update();
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  setupBackground() {
    // Create a large grid floor
    const gridSize = 50;
    const gridDivisions = 50;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xff3366, 0xff3366);
    gridHelper.position.y = -2;
    this.scene.add(gridHelper);

    // Add fog for depth
    this.scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // Add ambient particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = Math.random() * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      colors[i3] = Math.random() * 0.5 + 0.5;     // R
      colors[i3 + 1] = Math.random() * 0.2 + 0.8; // G
      colors[i3 + 2] = Math.random() * 0.5 + 0.5; // B
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(particleSystem);
    this.particleSystem = particleSystem;

    // Add volumetric light beams
    // const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
    // const beamMaterial = new THREE.MeshPhongMaterial({
    //   color: 0x39ff14,
    //   transparent: true,
    //   opacity: 0.2,
    //   side: THREE.DoubleSide
    // });

    // for (let i = 0; i < 5; i++) {
    //   const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    //   beam.position.set(
    //     (Math.random() - 0.5) * 20,
    //     10,
    //     (Math.random() - 0.5) * 20
    //   );
    //   beam.rotation.x = Math.PI / 2;
    //   this.scene.add(beam);
    // }
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Animate particles
    if (this.particleSystem) {
      const positions = this.particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Update controls if they exist
    if (this.controls) {
      this.controls.update();
    }

    // Update Deadpool animation
    if (this.deadpoolMixer) {
      this.deadpoolMixer.update(0.016);
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    if (this.deadpoolMixer) {
      this.deadpoolMixer.stopAllAction();
    }
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}

export default Scene;