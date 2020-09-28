let scene, camera, renderer, _Fly, flyline;
let earth;
let light;
let clock = new THREE.Clock();

const createEarth = function () {
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const material = new THREE.MeshPhongMaterial();

  material.map = THREE.ImageUtils.loadTexture("./images/css_globe_diffuse.jpg");

  earth = new THREE.Mesh(geometry, material);

  scene.add(earth);
};

const createFly = function () {
  _Fly = new InitFly({
    texture: "../images/point.png",
  });

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 5, 0),
    new THREE.Vector3(5, 0, 0)
  );
  const points = curve.getPoints(500);

  flyline = _Fly.addFly({
    color: `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(
      0,
      255
    )},${THREE.Math.randInt(0, 255)},1)`,
    curve: points,
    width: 0.05,
    length: 150,
    speed: 1,
    repeat: Infinity,
  });

  scene.add(flyline);
};

///////////////////////////////////////////////

// set up the environment -
// initialize scene, camera, objects and renderer
const init = function () {
  // create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

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

  // fly
  createFly();
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
  if (_Fly) {
    const delta = clock.getDelta();
    // 更新线 必须
    _Fly.animation(delta);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();
