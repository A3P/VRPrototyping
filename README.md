### Getting Started


```
npm install
bundle exec middleman server
```

### WebGL Support
[WebGL Support Document](https://github.com/A3P/threejs/blob/marc/documentation/webgl_support/WebGL_Support.md)


### Blender

#### Install
Follow install guide from blender [site](https://www.blender.org/download/)
Download threejs blender export [github](https://github.com/marclave/three.js/tree/dev/utils/exporters/blender)

Copy to `addons/scripts` directory
example: `/usr/share/blender/scripts/addons`

#### Addon
`Open Blender` -> `File` -> `User Preferences` -> `Addons`
Searh `three` then click checkbox.

#### Export
`File` -> `Export` -> `Three.js`
Ensure to check Geometry and not GeometryBuffer.
