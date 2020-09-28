let scene, camera, renderer;
let earth;
let light;

const createEarth = function () {
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const material = new THREE.MeshPhongMaterial();

  material.map = THREE.ImageUtils.loadTexture("./images/css_globe_diffuse.jpg");

  earth = new THREE.Mesh(geometry, material);

  scene.add(earth);
};
///////////////////////////////////////////////

// set up the environment -
// initialize scene, camera, objects and renderer
const init = function () {
  // create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfffff);

  // create an locate the camera

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 5;

  // light
  light = new THREE.PointLight(0xfffff, 1, 500);

  light.position.set(10, 0, 25);

  scene.add(light);

  // axes helper 坐标辅助线
  let axes = new THREE.AxesHelper(10);
  scene.add(axes);

  // do something rendering

  createEarth();

  // create the renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  // resize
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
};

// main animation loop - calls 50-60 in a second.
const mainLoop = function () {
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();
