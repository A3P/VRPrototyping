import * as THREE from 'three';
import 'webvr-polyfill';
import * as webvrui from 'webvr-ui';

import './VRControls';
import './VREffect';

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

// webvr config
const options = {
  color: 'white',
  background: false,
  corners: 'square'
};

const enterVR = new webvrui.EnterVRButton(renderer.domElement, options)

enterVR.on('enter', () => {
    console.log('enter VR')
});
enterVR.on('exit', () => {
  console.log('exit VR');
  camera.quaternion.set(0,0,0,1);
  camera.position.set(0,controls.userHeight,0);
})
enterVR.on('error', (error) => {
  document.getElementById('learn-more').style.display = 'inline';
  console.error(error)
})
enterVR.on('hide', () => {
  document.getElementById('ui').style.display = 'none';
  // On iOS there is no button to close fullscreen mode, so we need to provide one
  if(enterVR.state === webvrui.State.PRESENTING_FULLSCREEN) document.getElementById('exit').style.display = 'initial';
})
enterVR.on('show', () => {
  document.getElementById('ui').style.display = 'inherit';
  document.getElementById('exit').style.display = 'none';
});


// Add button to the #button element
document.getElementById('button').appendChild(enterVR.domElement);
document.getElementById('noVr').addEventListener('click', () => enterVR.requestEnterFullscreen());

//
// WEBGL SCENE SETUP
//

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();


// Create VR Effect rendering in stereoscopic mode
const effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

// Create 3D objects in scene.
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, controls.userHeight, -0.8);
scene.add(cube);


const onResize = () => {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Hande canvas resizing
window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);


let animationDisplay;
// Request animation frame loop function
let lastRender = 0;

const animate = (timestamp) => {
  const delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;
  // Apply rotation to cube mesh
  cube.rotation.y += delta * 0.0003;
  if(enterVR.isPresenting()){
    controls.update();
    renderer.render(scene,camera);
    effect.render(scene, camera);
  } else {
    renderer.render(scene,camera);
  }
  animationDisplay.requestAnimationFrame(animate);
};


// Get the HMD

enterVR.getVRDisplay().then((display) => {
    animationDisplay = display;
    display.requestAnimationFrame(animate);
  }).catch(() => {
    // If there is no display available, fallback to window
    animationDisplay = window;
    window.requestAnimationFrame(animate);
  });