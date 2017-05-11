import * as THREE from 'three';

export const createStemboltPart = (referencePointX, referencePointY, shift, angleToRotate) => {

  const stem = [];
  stem.push( new THREE.Vector2(-1.0 + referencePointX,  2 + referencePointY));
  stem.push( new THREE.Vector2( 2.5 + shift + referencePointX,  0 - shift/2 + referencePointY));
  stem.push( new THREE.Vector2(1.0 + shift + referencePointX, -1.0 - shift/2 + referencePointY));
  stem.push( new THREE.Vector2( -1.0 + referencePointX, 0 + referencePointY));

  const stemShape = new THREE.Shape( stem );

  const extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  const geometry = new THREE.ExtrudeGeometry( stemShape, extrudeSettings );
  const mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x41C0B9 } ) );
  mesh.position.z = -10;//move a bit back - size of 500 is a bit big
  mesh.rotation.z = (2*-Math.PI * angleToRotate);


  return mesh;
}
