const fragmentShader =
`
  #ifdef GL_ES
    precision mediump float;
  #endif

  uniform vec2 u_resolution;
  varying vec2 vUv;

  void main() {
    vec2 pixelLocation = vUv;

    vec2 boardLength = vec2(8.0, 8.0);

    vec2 pixelOnBoard = pixelLocation * vec2(boardLength.x, boardLength.y);

    float squareXLength = 1.0 / 8.0;
    float squareYLength = 1.0 / 8.0;

    int xIndex = int(pixelOnBoard.x);
    int yIndex = int(pixelOnBoard.y);

    int boardIndex = xIndex + yIndex;
    float colorValue = mod(float(boardIndex), 2.0);

    vec3 color = vec3(colorValue);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader =
`
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
    projectionMatrix * modelViewMatrix *
      vec4( position, 1.0 );
  }
`;

export { fragmentShader, vertexShader };
