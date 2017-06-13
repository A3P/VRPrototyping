import * as THREE from 'three';
import 'webvr-polyfill';
import * as webvrui from 'webvr-ui';

import './VRControls';
import './VREffect';

// webvr config
const options = {
  color: 'white',
  background: false,
  corners: 'square'
};

export default class {
  constructor(renderer, camera) {
    this.camera = camera;
    this.renderer = renderer;
    this.enterVR = new webvrui.EnterVRButton(this.renderer.domElement, options);
    this.controls = new THREE.VRControls(camera);
    this.effect = new THREE.VREffect(renderer);
  }
  init() {
    this.enterVR.on('enter', () => {
      // hook for entering VR
    });
    this.enterVR.on('exit', () => {
      // hook for exiting VR
    });
    this.enterVR.on('error', (error) => {
      document.getElementById('learn-more').style.display = 'inline';
      console.error(error);
    });
    this.enterVR.on('hide', () => {
      document.getElementById('ui').style.display = 'none';
      // On iOS there is no button to close fullscreen mode, so we need to provide one
      if (this.enterVR.state === webvrui.State.PRESENTING_FULLSCREEN) document.getElementById('exit').style.display = 'initial';
    });
    this.enterVR.on('show', () => {
      document.getElementById('ui').style.display = 'inherit';
      document.getElementById('exit').style.display = 'none';
    });
  }

  getEffect() {
    return this.effect;
  }

  getControls() {
    return this.controls;
  }

  setStanding() {
    this.controls.standing = true;
  }

  setNotStanding() {
    this.controls.standing = false;
  }

  injectButtonsToDom() {
    // Add button to the #button element
    document.getElementById('button').appendChild(this.enterVR.domElement);
    document.getElementById('noVr').addEventListener('click', () => this.enterVR.requestEnterFullscreen());
  }
}
