import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

class LEDSign {
  constructor(scene, position = new THREE.Vector3(0, 2, 0)) {
    this.scene = scene;
    this.position = position;
    this.letters = [];
    
    // Create neon material with white color and purple emissive
    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,  // White base color
      emissive: 0x9d00ff,  // Purple emissive color
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    });

    // Load font and create text
    this.loadFont();
  }

  loadFont() {
    const fontLoader = new FontLoader();
    fontLoader.load(
      '/models/fonts/helvetiker_regular.typeface.json',
      (font) => {
        this.createText(font);
      },
      undefined,
      (error) => {
        console.error('Error loading font:', error);
      }
    );
  }

  createText(font) {
    const textGeometry = new TextGeometry('M', {
      font: font,
      size: 0.6,  // Reduced from 1.0
      height: 0.1,  // Reduced from 0.2
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,  // Reduced from 0.03
      bevelSize: 0.01,  // Reduced from 0.02
      bevelOffset: 0,
      bevelSegments: 5
    });

    // Center the text
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    
    const textMesh = new THREE.Mesh(textGeometry, this.material);
    textMesh.position.set(
      this.position.x - textWidth / 2,
      this.position.y - textHeight / 2,
      this.position.z
    );

    this.letters.push(textMesh);
    this.scene.add(textMesh);
    this.animate();
  }

  animate() {
    let time = 0;
    const animate = () => {
      time += 0.05;
      this.letters.forEach((letter) => {
        // Create pulsing glow effect with purple
        const intensity = 0.4 + Math.sin(time) * 0.3;
        letter.material.emissiveIntensity = intensity;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  dispose() {
    this.letters.forEach(letter => {
      this.scene.remove(letter);
      letter.geometry.dispose();
      letter.material.dispose();
    });
  }
}

export default LEDSign; 