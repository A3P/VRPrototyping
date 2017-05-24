import * as THREE from 'three';

export const createStemboltPart = (referencePointX, referencePointY, shift, angleToRotate) => {
  const stem = [];
  stem.push(new THREE.Vector2(referencePointX - 1.0, 2 + referencePointY));
  stem.push(new THREE.Vector2(2.5 + shift + referencePointX, referencePointY - (shift / 2)));
  stem.push(new THREE.Vector2(1.0 + shift + referencePointX,
    (referencePointY - 1.0) - (shift * 0.5)));
  stem.push(new THREE.Vector2(referencePointX - 1.0, 0 + referencePointY));

  const stemShape = new THREE.Shape(stem);

  const extrudeSettings = {
    amount: 8,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1
  };
  const geometry = new THREE.ExtrudeGeometry(stemShape, extrudeSettings);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x41C0B9 }));
  mesh.position.z = -10; // Move a bit back
  mesh.rotation.z = (2 * -Math.PI * angleToRotate);

  return mesh;
};

// TODO add parameters for shifting around scene
export const createStemboltLogo = (group) => {
  const part1 = createStemboltPart(0, 3, 0.01, 1);
  group.add(part1);

  const part2 = createStemboltPart(0, -2.8, 5, 1);
  group.add(part2);

  const part3 = createStemboltPart(0, -8.6, 0.01, 1);
  group.add(part3);

  const part4 = createStemboltPart(3, -5, 5, 0.83);
  group.add(part4);

  const part5 = createStemboltPart(3, -10, 0.01, 0.83);
  group.add(part5);

  const part6 = createStemboltPart(-7, -11, 5, 0.83);
  group.add(part6);
};
