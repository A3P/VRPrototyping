import * as THREE from 'three';
import './VRControls';

const globalScene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const controls = new THREE.VRControls(camera);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 1, 1).normalize();
globalScene.add(light);

let animationDisplay;
// Request animation frame loop function

const animate = () => {
  controls.update();
  renderer.render(globalScene, camera);
  animationDisplay.requestAnimationFrame(animate);
};

animationDisplay = window;
window.requestAnimationFrame(animate);
