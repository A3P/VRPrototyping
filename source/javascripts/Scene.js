import * as THREE from 'three';
import Chess from './Chess/Chess';
import WebVr from './WebVR/WebVR';

const globalScene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const webvr = new WebVr(renderer, camera);
webvr.init();
webvr.injectButtonsToDom();
webvr.setStanding();

camera.position.y = webvr.getControls().userHeight;
// WEBGL SCENE SETUP

// Create VR Effect rendering in stereoscopic mode
const effect = webvr.getEffect();
effect.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 1, 1).normalize();
globalScene.add(light);

let animationDisplay;
// Request animation frame loop function
const ChessGame = new Chess(globalScene);

const animate = () => {
  if (webvr.enterVR.isPresenting()) {
    webvr.getControls().update();
    renderer.render(globalScene, camera);
    effect.render(globalScene, camera);
  } else {
    renderer.render(globalScene, camera);
  }
  ChessGame.boardcontroller.animateMovement();
  animationDisplay.requestAnimationFrame(animate);
};

ChessGame.initGenericBlender().then((values) => {
  ChessGame.init(values);
  ChessGame.play();
  // Get the HMD
  webvr.enterVR.getVRDisplay().then((display) => {
    animationDisplay = display;
    display.requestAnimationFrame(animate);
  }).catch(() => {
    // If there is no display available, fallback to window
    animationDisplay = window;
    window.requestAnimationFrame(animate);
  });
});
