// Wrapper for loading a blender -> threejs json file
import * as THREE from 'three';

export default (jsonPath) =>
  new Promise((resolve, reject) => {
    let blendMesh = null;

    const loader = new THREE.JSONLoader();
    loader.load(jsonPath, (geo) => {
      blendMesh = new THREE.Mesh(geo);
      resolve(blendMesh);
    }, () => { }, (error) => {
      reject(error);
    });
  });
