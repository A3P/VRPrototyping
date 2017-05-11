/*
  Add objects to the ThreeJS scene whenever the fps goes over a certain limit.
  Bigger canvases will have lower fps.
  Takes 1-2 minutes for the fps graph to become steady


  Add this to your file to run:

  import performanceTest from './performance';

  performanceTest(object);

*/


import * as THREE from 'three';
import Stats from 'stats-js';

// Accepts a Mesh as an arguement.
export default (object) => {
  const stats = new Stats();
  stats.setMode(1);
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );
  const fpsText = document.getElementById('fpsText');

  const objects = [];
  const material = object.material;
  const geometry = object.geometry;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Camera distance can be adjusted to test with a further spread of objects
  camera.position.z = 20;


  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '0x';
    for (let i = 0; i < 6; i += 1 ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  // Add randomly positioned and colored objects
  const addObject = () => {
    // A new copy of the material has to be created everytime for different color meshes
    const objectCopy = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial().copy(material));
    objectCopy.material.color.setHex(getRandomColor());

    // Translates object positions randomly
    // The spread value determines how far objects can be randomly spread
    const spread = 50

    objectCopy.translateX(
      Math.floor ( (Math.random() * (spread - 1)) - (spread / 2) )
    );
    objectCopy.translateY(
      Math.floor ( (Math.random() * (spread - 1)) - (spread / 2) )
    );
    objectCopy.translateZ(
      Math.floor ( (Math.random() * (spread - 1)) - (spread / 2) )
    );

    objects.push(objectCopy);
    scene.add(objectCopy);
  }


  const checkFPS = () => {
    const fps = parseInt(fpsText.innerHTML, 10);
    if(fps > 40) {
      addObject();
      console.log(objects.length);
    }
  }

  const render = () => {
    requestAnimationFrame( render );
    stats.begin();
    // Rotates objects in space
    for (let i = 0; i < objects.length; i += 1) {
      objects[i].rotation.x += 0.1;
      objects[i].rotation.y += 0.1;
      objects[i].rotation.z += 0.1;
    }
    renderer.render(scene, camera);
    checkFPS();
    stats.end();
  };

  addObject();
  render();
};
