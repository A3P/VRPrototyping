import * as THREE from 'three';
import Stats from 'stats-js';
import Chess from './Chess/Chess';
import ChessAPI from './Chess/API/ChessAPI';
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
// Request animation frame loop function

const animate = () => {
  stats.begin();
  if (webvr.enterVR.isPresenting()) {
    webvr.getControls().update();
    renderer.render(globalScene, camera);
    effect.render(globalScene, camera);
  } else {
    renderer.render(globalScene, camera);
  }
  animationDisplay.requestAnimationFrame(animate);
  stats.end();
};

const ChessGame = new Chess(globalScene);
ChessGame.initGenericBlender().then((values) => {
  ChessGame.init(values);
  // Get the HMD
  webvr.enterVR.getVRDisplay().then((display) => {
    animationDisplay = display;
    display.requestAnimationFrame(animate);
  }).catch(() => {
    // If there is no display available, fallback to window
    animationDisplay = window;
    window.requestAnimationFrame(animate);
  });

  webvr.enterVR.on('enter', () => {
    // hook for entering VR
    console.log('hit');
    const g = document.getElementsByClassName('game-selected');
    console.log('here is g', g);
    if (g[0]) {
      ChessGame.play(g[0].innerText);
    } else {
      ChessGame.initializeSet();
    }
  });
});

const dynamicEvent = (el) => {
  if (el.srcElement.className.includes('game-selected')) {
    el.srcElement.className = 'game-item';
    el.srcElement.style.backgroundColor = '';
    ChessGame.initializeSet();
  } else {
    el.srcElement.className += ' game-selected';
    el.srcElement.style.backgroundColor = 'red';
    ChessGame.play(el.srcElement.innerText);
  }
};

ChessAPI.getCurrentGames().then(resp => {
  const games = JSON.parse(resp);
  console.log(games);
  // games.push('first');
  // games.push('second');
  Object.keys(games).forEach((el) => {
    console.log(`Game ${el}`, games[el]);
    const ul = document.getElementById('gamesList');
    const li = document.createElement('li');
    li.className = 'game-item';
    li.appendChild(document.createTextNode(games[el]));
    ul.appendChild(li);
    li.onclick = dynamicEvent; // Attach the event!
  });
}).catch(err => {
  console.log('error', err);
});
