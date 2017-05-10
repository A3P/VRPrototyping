/*
  Add cubes to the ThreeJS scene whenever the fps goes over a certain limit.
  Bigger canvases will have lower fps.
  Takes 1-2 minutes for the fps graph to become steady

  Add this to site.js to run:


  import performanceTest from './performance';

  performanceTest();
*/


import * as THREE from 'three';
import Stats from 'stats-js';


export default () => {
  const stats = new Stats();
  stats.setMode(1);
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );
  const fpsText = document.getElementById('fpsText');

  const cubes = [];
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );

  // Camera distance can be adjusted to test with a further spread of cubes
  camera.position.z = 20;


  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1 ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  // Add randomly positioned and colored cubes
  const addCube = () => {
    const material = new THREE.MeshBasicMaterial( { color: getRandomColor() } );
    const cube = new THREE.Mesh( geometry, material );

    // Translates object positions randomly
    // The spread value determines how far cubes can be randomly spread
    const spread = 50

    cube.translateX(
      Math.floor ( (Math.random() * (spread - 1)) - (spread / 2) )
    );
    cube.translateY(
      Math.floor ( (Math.random() * (spread - 1)) - (spread / 2) )
    );
    cube.translateZ(
      Math.floor ( (Math.random() * (spread -1 )) - (spread / 2) )
    );

    cubes.push(cube);
    scene.add(cube);
  }


  const checkFPS = () => {
    const fps = parseInt(fpsText.innerHTML, 10);
    if(fps > 40) {
      addCube();
      console.log(cubes.length);
    }
  }

  const render = () => {
    requestAnimationFrame( render );
    stats.begin();
    // Rotates cubes in space
    for (let i = 0; i < cubes.length; i += 1) {
      cubes[i].rotation.x += 0.1;
      cubes[i].rotation.y += 0.1;
      cubes[i].rotation.z += 0.1;
    }
    renderer.render(scene, camera);
    checkFPS();
    stats.end();
  };

  addCube();
  render();
};
