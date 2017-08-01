import * as THREE from 'three';
import Stats from './Stats.js';
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

const stats = new Stats();

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

// max 32 bit unsigned integer for going over full screen
stats.domElement.style.zIndex = 2147483647;

document.body.appendChild(stats.domElement);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 1, 1).normalize();
globalScene.add(light);

let animationDisplay;
const ChessGame = new Chess(globalScene);

document.getElementById('create-game').onclick = function() {
  ChessGame.api.createGame()
  .then(JSON.parse)
  .then((resp) => {
    ChessGame.play(resp);
  });
};

const animate = () => {
  stats.begin();
  if (webvr.enterVR.isPresenting()) {
    webvr.getControls().update();
    renderer.render(globalScene, camera);
    effect.render(globalScene, camera);
  } else {
    renderer.render(globalScene, camera);
  }
  ChessGame.boardcontroller.animateMovement();
  animationDisplay.requestAnimationFrame(animate);
  stats.end();
};

const showGames = () => {
  ChessGame.api.getCurrentGames()
  .then(JSON.parse)
  .then((resp) => {
    let radiosInnerHtml = '';

    for (let i = 0; i < resp.length; i++) {
      const label = `<label><input class="games-radio" type="radio" name="games" value="${resp[i]}">${resp[i]}</label>`
      radiosInnerHtml = radiosInnerHtml + label;
    }

    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = radiosInnerHtml;

    const radios = document.getElementsByClassName('games-radio');

    for (let i = 0; i < radios.length; i++) {
      radios[i].onclick = function() {
        ChessGame.play(this.value);
      };
    }
  }).catch((err) => {
    console.log('error is', err);
  });
}

ChessGame.initGenericBlender().then((values) => {
  ChessGame.init(values);
  ChessGame.play();
  showGames();
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
