/*
  Add objects to the ThreeJS scene whenever the fps goes over a certain limit.
  Bigger canvases will have lower fps.
  Takes 1-2 minutes for the fps graph to become steady

  Add this to your file to run:

  const performanceTest = new PerformanceTest();
  performanceTest.render();

*/

import * as THREE from 'three';

// Accepts a Mesh as an arguement.
export default class PerformanceTest {

  constructor(scene) {
    this.objects = [];

    this.object = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    this.scene = scene;
  }

  static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '0x';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setObject(object) {
    this.object = object;
  }

  // Add randomly positioned and colored objects
  addObject() {
    // A new copy of the material has to be created everytime for different color meshes
    const objectCopy = new THREE.Mesh(this.object.geometry,
      new THREE.MeshBasicMaterial(this.object.material));
    objectCopy.material.color.setHex(PerformanceTest.getRandomColor());

    // Translates object positions randomly
    // The spread value determines how far objects can be randomly spread
    const spread = 20;

    objectCopy.translateX(
      Math.floor((Math.random() * (spread - 1)) - (spread / 2))
    );
    objectCopy.translateY(
      Math.floor((Math.random() * (spread - 1)) - (spread / 2))
    );
    objectCopy.translateZ(
      Math.floor((Math.random() * (spread - 1)) - (spread / 2))
    );

    this.objects.push(objectCopy);
    this.scene.add(objectCopy);
  }

  checkFPS(stats) {
    if (stats.fps) {
      this.fps = stats.fps;
    }
    if (this.fps > 15) {
      this.addObject();
      console.log(this.objects.length);
    }
    this.renderFunction();
  }

  renderFunction() {
    // Rotates objects in space
    for (let i = 0; i < this.objects.length; i += 1) {
      this.objects[i].rotation.x += 0.1;
      this.objects[i].rotation.y += 0.1;
      this.objects[i].rotation.z += 0.1;
    }
  }

  setRenderFunction(customRenderFunction) {
    this.renderFunction = () => customRenderFunction;
  }

  render() {
    this.renderFunction();
    this.checkFPS();
  }
}
