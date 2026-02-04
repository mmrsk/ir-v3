import * as THREE from 'three';
import { SVGLoader } from 'https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/loaders/SVGLoader.js';

console.log(THREE)
console.log(SVGLoader)

const scene = new THREE.Scene

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 )
camera.position.set(-50, -100, 300)

const renderer = new THREE.WebGLRenderer({ 
  alpha: true,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.querySelector('.scene-container').appendChild(renderer.domElement)

// Extract SVG paths from the DOM
const svgMarkup = document.querySelector('.symbol').outerHTML
const loader = new SVGLoader()
const svgData = loader.parse(svgMarkup)

// Convert SVG to extruded 3D geometry

const group = new THREE.Group()

svgData.paths.forEach((path) => {
  const shapes = SVGLoader.createShapes(path)

  shapes.forEach((shape) => {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 80,
      bevelEnabled: false
    })
    const material = new THREE.MeshStandardMaterial({
      color: 0x0270e0
    })
    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)
  })
})

// Fix SVG coordinate system
group.scale.y = -1
group.scale.setScalar(1.0) // try 0.2–0.5

group.updateMatrixWorld(true)

// Center it
const box = new THREE.Box3().setFromObject(group);
const size = new THREE.Vector3();
box.getSize(size);

const yOffset = size.y / -2;
const xOffset = size.x / -2;

// Offset all of group's elements, to center them
group.children.forEach(item => {
  item.position.x = xOffset;
  item.position.y = yOffset;
});

scene.add(group)

// Lock in the isometric tilt
const ISO_X = THREE.MathUtils.degToRad(135)
const ISO_Y = THREE.MathUtils.degToRad(45)

group.rotation.set(ISO_X, ISO_Y, 45)

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 1.0))

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
dirLight.position.set(100, 800, -200)

scene.add(dirLight)

// Render loop
function animate() {
  requestAnimationFrame(animate)
  group.rotation.z += 0.003
  renderer.render(scene, camera)
}

animate()

// Axes helper
// const axesHelper = new THREE.AxesHelper( 400 )
// scene.add(axesHelper)

// GSAP Scramble Text
gsap.registerPlugin(ScrambleTextPlugin)

let tl = gsap.timeline()
tl.to('.scramble-1', { duration: 0.75, chars: 'lowerCase', scrambleText: 'Your ' })
  .to('.scramble-2', { duration: 0.75, chars: 'lowerCase', scrambleText: 'Data.' })
  .to('.scramble-3', { duration: 0.5, chars: 'lowerCase', scrambleText: 'Your' })
  .to('.scramble-4', { duration: 0.5, chars: 'lowerCase', scrambleText: 'Busienss.' })
  .to('.scramble-5', { duration: 0.5, chars: 'lowerCase', scrambleText: 'Your' })
  .to('.scramble-6', { duration: 1, chars: 'lowerCase', scrambleText: 'Story.' })
