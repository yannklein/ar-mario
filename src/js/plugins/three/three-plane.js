import * as THREE from 'three';

const createPlane = (scene, image) => {

  // instantiate a loader
  const loader = new THREE.TextureLoader();

  // load a resource
  loader.load(image, ( texture ) => {
      // in this example we create the material when the texture is loaded
      const material = new THREE.MeshBasicMaterial( {
        map: texture,
        side: THREE.DoubleSide
       } );
      const geometry  = new THREE.PlaneGeometry(2,2);
      const mesh  = new THREE.Mesh( geometry, material );
      mesh.rotation.x += Math.PI/2
      scene.add( mesh );
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
      console.error( `An error happened: ${err}` );
    }
  );


};

export default createPlane;
