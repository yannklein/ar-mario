import * as THREE from 'three';
import THREEx from 'ar';

import createTorusKnot from './three/three-torusKnot';
import createGamePlane from './three/three-gamePlane';

THREEx.ArToolkitContext.baseURL = 'assets/';

const initAr = () => {
  //////////////////////////////////////////////////////////////////////////////////
  //    Init
  //////////////////////////////////////////////////////////////////////////////////

  // init renderer

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    autoResize: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'
  document.body.appendChild(renderer.domElement);


  // init scene and camera
  var scene = new THREE.Scene();

  // array of functions for the rendering loop
  scene.animationQueue = [];

  //////////////////////////////////////////////////////////////////////////////////
  //    Initialize a basic camera
  //////////////////////////////////////////////////////////////////////////////////

  // Create a camera
  var camera = new THREE.Camera();
  scene.add(camera);

  ////////////////////////////////////////////////////////////////////////////////
  //          handle arToolkitSource
  ////////////////////////////////////////////////////////////////////////////////

  var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType : 'webcam',

    // // to read from an image
    // sourceType : 'image',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + './img.jpg',

    // to read from a video
    // sourceType : 'video',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
  })

  arToolkitSource.init(function onReady(){
    setTimeout(() => {
      onResize();
    }, 1000);
    onResize();
  })

  const onResize = () => {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if( arToolkitContext.arController !== null ){
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
  }

  // handle resize
  window.addEventListener('resize', onResize);

  ////////////////////////////////////////////////////////////////////////////////
  //          initialize arToolkitContext
  ////////////////////////////////////////////////////////////////////////////////


  // create atToolkitContext
  var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: THREEx.ArToolkitContext.baseURL + './camera_para.dat',
    detectionMode: 'mono'
  })
  // initialize it
  arToolkitContext.init(function onCompleted(){
    // copy projection matrix to camera
    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
  })


  // update artoolkit on every frame
  scene.animationQueue.push(function(){
    if( arToolkitSource.ready === false ) return

    // console.log(arToolkitSource.domElement);
    arToolkitContext.update( arToolkitSource.domElement )

    // update scene.visible if the marker is seen
    scene.visible = camera.visible
  })

  ////////////////////////////////////////////////////////////////////////////////
  //          Create a ArMarkerControls
  ////////////////////////////////////////////////////////////////////////////////

  // init controls for camera
  var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'pattern',
    patternUrl : THREEx.ArToolkitContext.baseURL + './patt.hiro',
    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    changeMatrixMode: 'cameraTransformMatrix'
  })
  // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
  scene.visible = false

  //////////////////////////////////////////////////////////////////////////////////
  //    add an object in the scene
  //////////////////////////////////////////////////////////////////////////////////

  // add a game plane
  createGamePlane(scene);

  //////////////////////////////////////////////////////////////////////////////////
  //    render the `whole thing on the page
  //////////////////////////////////////////////////////////////////////////////////

  // render the scene
  scene.animationQueue.push(function(){
    renderer.render( scene, camera );
  })

  // run the rendering loop
  var lastTimeMsec= null
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec
    // call each update function
    scene.animationQueue.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
  })
}

export default initAr;
