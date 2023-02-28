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
    10000
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
  const icosahedronGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16); // TODO: change it to icosahedron at some point. It's better as the protagonist of the story
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

  // light
  const light = new THREE.PointLight(0xffffff, 2, 10000);
  light.position.set(10, 0, 16);
  scene.add(light);

  //ASCII
  let effect = new AsciiEffect(
    renderer,
    ` .\'",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`,
    {
      invert: false,
    }
  );
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = "white";
  effect.domElement.style.backgroundColor = "black";
  document.body.appendChild(effect.domElement);

  // function to make a torusKnot
  function makeOneKnot(x, y, z, size) {
    const torusKnotGeometry = new THREE.TorusKnotGeometry(size, 3, 100, 16);
    const torusKnotmaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0.9,
      emissive: 0x000000,
      flatShading: 1,
    });
    const torusKnot1 = new THREE.Mesh(torusKnotGeometry, torusKnotmaterial);
    torusKnot1.position.set(x, y, z);
    return torusKnot1;
  }

  // Mesh Array
  function createMeshes(amount, distance) {
    for (let i = 0; i < amount; i++) {
      let x = getRandomInt(25) - 12.5 + distance;
      let y = getRandomInt(25) - 12.5;
      let z = getRandomInt(1000) * -1;
      let size = getRandomInt(10);
      let temp = makeOneKnot(x, y, z, size);
      console.log(temp);
      console.log(meshArray);
      meshArray.push(temp);
      scene.add(temp);
    }
  }
  createMeshes(howManyMeshesExistOnStart, 0);

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
      if (camera !== null) {
        camera.position.x += elapsedTimeDelta + volume;
      }
      if (light !== null) {
        light.position.x += elapsedTimeDelta + volume;
      }
      if (icosahedron1 !== null) {
        icosahedron1.rotation.x += 0.05 + volume;
        icosahedron1.rotation.y += 0.02 + volume;
        icosahedron1.position.y = 10 * Math.sin(elapsedTime * 3);
        icosahedron1.position.x += elapsedTimeDelta + volume;
        icosahedron1.scale.y = 1 + volume;
      }
      if (
        Math.ceil(elapsedTime) % howManySecoundsToAddMeshes === 0 &&
        !calledTimeTemp // we only get into this if block once, since we append new objects into the scene only once per the specified interval in the "howManySecoundsToAddMeshes" variable
      ) {
        calledTimeTemp = true; // we remember, that we've been in that if, so we won't call it on the new screen refrest
        for (let i = 0; i < howManyMeshesAreAddedAndRemoved; i++) {
          if (meshArray.length >= maxMeshesAmount) {
            // we start with a set amount of floral planes, but we add to that amount until we exceed a set threshold
            scene.remove(meshArray.shift());
          }
          createMeshes(1, camera.position.z);
          // console.log("time elapsed addition");
        }
      }
      if (Math.floor(elapsedTime) % howManySecoundsToAddMeshes === 0) {
        // HACK: we reset the calledTimeTemp variable, so we can add new objects when the new interval ends
        calledTimeTemp = false;
      }
      if (
        Math.ceil(camera.position.x) % howManyMetersToAddMeshes === 0 &&
        !calledTimeTemp
      ) {
        calledTimeTemp = true;
        for (let i = 0; i < howManyMeshesAreAddedAndRemoved; i++) {
          if (meshArray.length >= maxMeshesAmount) {
            // we start with a set amount of floral planes, but we add to that amount until we exceed a set threshold
            scene.remove(meshArray.shift());
          }
          createMeshes(1, camera.position.x);
          // console.log("distance elapsed addition");
        }
      }
      if (Math.floor(elapsedTime) % howManySecoundsToAddMeshes === 0) {
        // HACK: we reset the calledTimeTemp variable, so we can add new objects when the new interval ends
        calledTimeTemp = false;
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
