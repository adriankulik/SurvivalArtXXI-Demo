import { AsciiEffect } from "../three.js build/AsciiEffect.js";

function main() {
  // microphoneInput.js
  const microphone = new Microphone();

  // three.js
  const bgColor = 0xffffff;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(bgColor, 30, 100);
  scene.background = new THREE.Color(bgColor);
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0, 0, 40);
  scene.add(camera);

  // renderer
  let canvas = document.getElementById("three.js");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // we have to enable xr in order to allow for VR session
  document.body.appendChild(renderer.domElement);
  addEventListener("resize", (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // icosahedron mesh
  const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 3);
  const icosahedronMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 0.9,
    emissive: 0x000000,
    flatShading: 1,
  });
  const icosahedron1 = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
  icosahedron1.position.z = -20;
  scene.add(icosahedron1);

  // torus knot mesh
  const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const torusKnotmaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 0.9,
    emissive: 0x000000,
    flatShading: 1,
  });
  const torusKnot1 = new THREE.Mesh(torusKnotGeometry, torusKnotmaterial);
  scene.add(torusKnot1);

  // light
  const light = new THREE.PointLight(0xffffff, 2, 10000);
  light.position.set(10, 0, 16);
  scene.add(light);

  //ASCII
  let effect = new AsciiEffect(renderer, " .:-=+*%@#", { invert: false });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = "white";
  effect.domElement.style.backgroundColor = "black";
  document.body.appendChild(effect.domElement);

  //clock
  let clock = new THREE.Clock();

  // gameloop
  function animate() {
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
      gameLoop();
    });
  }

  const gameLoop = () => {
    effect.render(scene, camera);
    elapsedTime = clock.getElapsedTime();
    elapsedTimeDelta = clock.getDelta();
    const volume = microphone.getVolume();
    if (volume) {
      if (torusKnot1 !== null) {
        torusKnot1.rotation.z += 0.01;
        torusKnot1.rotation.y += 0.005;
        torusKnot1.scale.x = 1 + volume * 1.5;
        torusKnot1.scale.y = 1 + volume * 1.5;
        torusKnot1.scale.z = 1 + volume * 1.5;
      }
      if (icosahedron1 !== null) {
        // TODO: Get the sphere to animate
        icosahedron1.position.x = Math.sin(elapsedTimeDelta * 10);
        icosahedron1.position.y = Math.sin(elapsedTimeDelta * 10);
      }
    }
    renderer.render(scene, camera);
  };

  animate();

  // make the experience more responsive by recalculating the aspect ratio
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
  }
}

main();
