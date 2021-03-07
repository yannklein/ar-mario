import * as THREE from 'three';

const createGamePlane = scene => {
  var geometry  = new THREE.PlaneGeometry(1,1);
  var material  = new THREE.MeshNormalMaterial({
    transparent : true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  var mesh  = new THREE.Mesh( geometry, material );
  mesh.position.y = geometry.parameters.height/2
  scene.add( mesh );

  scene.animationQueue.push(function(delta){
    // mesh.rotation.x += Math.PI*delta
  })
};

export default createGamePlane;
