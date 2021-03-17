import * as THREE from 'three';
import { startMario } from '../mario/main';

const createGamePlane = scene => {

  const ctx = document.createElement('canvas').getContext('2d');
  // ctx.canvas.width = 256;
  // ctx.canvas.height = 256;
  ctx.canvas.height = 256;
  ctx.canvas.width = 256;
  window.ctx = ctx;
  // ctx.fillStyle = '#F00';
  // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  startMario(window.ctx);
  const texture = new THREE.CanvasTexture(window.ctx.canvas);

  var geometry  = new THREE.PlaneGeometry(2,2);
  var material  = new THREE.MeshBasicMaterial({
    transparent : true,
    map: texture,
    side: THREE.DoubleSide
  });
  var mesh  = new THREE.Mesh( geometry, material );
  mesh.position.y = geometry.parameters.height/2
  scene.add( mesh );

  scene.animationQueue.push(function(delta){
    // mesh.rotation.x += Math.PI*delta
    if (window.ctx) {
      const updatedTexture = new THREE.CanvasTexture(window.ctx.canvas);
      var material  = new THREE.MeshBasicMaterial({
        transparent : true,
        map: updatedTexture,
        side: THREE.DoubleSide,

      });
      mesh.material = material;
    }
  })
};

export default createGamePlane;
