# Three.js Workshop - 3D Scene Example

This is a complete Three.js workshop example featuring an interactive 3D cyberpunk scene with animations, lighting effects, and custom materials.

## 🚀 Features

- **Interactive 3D Environment**: Computer room with cyberpunk aesthetics
- **Animated Character**: Dancing Deadpool with GLTF animations
- **Dynamic Lighting**: Multiple colored lights with shadows
- **LED Text Effects**: Custom canvas-based LED text rendering
- **Particle Systems**: Ambient floating particles
- **Camera Controls**: Mouse-based orbit controls
- **Moon with Textures**: Textured celestial body with glow effects

## 📁 Project Structure

```
threejs-workshop-example/
├── index.html                          # Main HTML file (vanilla JS)
├── js/
│   └── scene-vanilla.js                # Vanilla JS version of the scene
├── src/components/3d/                  # Original ES6 modules (for reference)
│   ├── Scene.js                        # ES6 module version
│   └── LEDSign.js                      # LED sign component
├── public/
│   ├── models/
│   │   ├── computer-room/
│   │   │   └── sci-fi_computer_room.glb
│   │   ├── dancing_deadpool/
│   │   │   └── deadpool_dancing.glb
│   │   └── fonts/
│   │       └── helvetiker_regular.typeface.json
│   └── textures/
│       └── moon/
│           └── moon.jpg
└── package.json                       # Dependencies reference
```

## 🛠️ Setup Instructions

### Option 1: Local HTTP Server (Recommended)

Due to CORS restrictions, you need to serve the files through a local HTTP server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
# Install serve globally
npm install -g serve

# Serve the current directory
serve -p 8000
```

**Using Live Server (VS Code Extension):**
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

Then open: `http://localhost:8000`

### Option 2: Copy to Web Server

Simply upload all files to your web server and access the `index.html` file.

## 🎮 Controls

- **Mouse Left Click + Drag**: Rotate camera around the scene
- **Mouse Scroll**: Zoom in/out
- **Mouse Right Click + Drag**: Pan camera position

## 🔧 Technical Details

### Dependencies (CDN)
- Three.js r128 (Core library)
- OrbitControls (Camera controls)
- GLTFLoader (3D model loading)
- FontLoader (Font loading for text)

### Key Components

1. **Scene Setup**: Camera, renderer, lighting configuration
2. **Model Loading**: GLTF loader for 3D assets
3. **Text Rendering**: Canvas-based LED text with glow effects
4. **Animation Loop**: 60fps animation with mixer for character animations
5. **Background Effects**: Grid floor, fog, particle systems

### File Formats Used
- `.glb`: 3D models (binary GLTF)
- `.jpg`: Texture images
- `.json`: Font files (Three.js typeface format)

## 📚 Learning Points

This example demonstrates:

1. **Scene Management**: Setting up cameras, lights, and renderers
2. **Asset Loading**: Loading and displaying 3D models and textures
3. **Animation Systems**: Character animations using THREE.AnimationMixer
4. **Custom Materials**: Creating LED-style materials with emissive properties
5. **Interactive Controls**: Implementing mouse-based camera controls
6. **Performance**: Optimizing render loops and asset management
7. **Error Handling**: Graceful fallbacks for failed asset loads

## 🚨 Troubleshooting

**Models not loading?**
- Ensure you're using an HTTP server (not file://)
- Check browser console for CORS errors
- Verify model files are in the correct paths

**Black screen?**
- Check browser console for JavaScript errors
- Ensure Three.js CDN links are working
- Try refreshing the page

**Poor performance?**
- Reduce particle count in the scene
- Lower shadow quality settings
- Check if hardware acceleration is enabled

## 🎨 Customization

You can easily modify the scene by:

1. **Changing text**: Edit the text content in `createTextGeometry()`
2. **Adjusting colors**: Modify the color values (hex codes) throughout the scene
3. **Adding models**: Load additional GLTF models using the `loadModel()` method
4. **Modifying lighting**: Adjust light positions, colors, and intensities
5. **Camera settings**: Change initial camera position and control limits

## 📝 Notes

- This example uses vanilla JavaScript for easy integration
- The ES6 module versions are provided for reference
- All assets are included for a complete working example
- The scene is optimized for modern browsers with WebGL support

Happy coding! 🎉
