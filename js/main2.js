let scene, camera, renderer, _Fly, light, earthGroup;
let clock = new THREE.Clock();
const sceneBgColor = 0x000000,
  // flylineColor = `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(
  //   0,
  //   255
  // )},${THREE.Math.randInt(0, 255)},1)`,
  flylineColor = `rgba(255,255,255,1)`;

function getSphericalPositions(radius) {
  // Create a spherical object
  var spherical = new THREE.Spherical();
  // Set radius of spherical
  spherical.radius = radius;
  spherical.phi = THREE.Math.randFloat(0, Math.PI); // Phi is between 0 - PI
  spherical.theta = THREE.Math.randFloat(0, Math.PI * 2); // Phi is between 0 - 2 PI
  var vec3 = new THREE.Vector3().setFromSpherical(spherical);
  return vec3;
}

const getPoints2 = function () {
  return {
    pointA: getSphericalPositions(1),
    pointB: getSphericalPositions(1),
    pointZero: new THREE.Vector3(),
  };
};

///////////////////////////////////////////////

const getEarth = function () {
  const geometry = new THREE.SphereGeometry(1, 30, 20);

  // const material = new THREE.MeshPhongMaterial();

  // material.map = THREE.ImageUtils.loadTexture("./images/css_globe_diffuse.jpg");

  const material = new THREE.MeshLambertMaterial({
    wireframe: true,
  });

  return new THREE.Mesh(geometry, material);
};

// const getFly = function (points) {
//   const curve = new THREE.QuadraticBezierCurve3(
//     new THREE.Vector3().fromArray(points.pointA),
//     new THREE.Vector3().fromArray(points.pointExpected),
//     new THREE.Vector3().fromArray(points.pointB)
//   );

//   const flyPoints = curve.getPoints(500);

//   return _Fly.addFly({
//     color: flylineColor,
//     curve: flyPoints,
//     width: 0.05,
//     length: 400,
//     speed: 3,
//     repeat: Infinity,
//   });
// };

const getRouteHelper = function (points) {
  let geometry = new THREE.Geometry();

  geometry.vertices.push(points.pointZero);
  geometry.vertices.push(points.pointA);
  geometry.vertices.push(points.pointB);

  geometry.faces.push(new THREE.Face3(0, 1, 2));

  let material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    side: THREE.DoubleSide,
    wireframe: true,
  });

  return new THREE.Mesh(geometry, material);
};

const customRender = function () {
  earthGroup = new THREE.Object3D();

  const points = getPoints2();
  const earth = getEarth();
  // const flyline = getFly(points);
  const routeHelper = getRouteHelper(points);

  earthGroup.add(earth);
  // earthGroup.add(flyline);
  earthGroup.add(routeHelper);

  scene.add(earthGroup);
};

const animate = function () {
  if (_Fly) {
    const delta = clock.getDelta();
    // 更新线 必须
    _Fly.animation(delta);
  }
};

///////////////////////////////////////////////

// set up the environment -
// initialize scene, camera, objects and renderer
const init = function () {
  // create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(sceneBgColor);

  // init _Fly
  _Fly = new InitFly({
    texture: "../images/point.png",
  });

  // create an locate the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  // light
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 2, 1);
  scene.add(light);

  // axes helper 坐标辅助线
  let axes = new THREE.AxesHelper(10);
  scene.add(axes);

  // create the renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // do custom rendering
  customRender();

  // resize
  window.addEventListener("resize", resize, false);

  update();
};

///////////////////////////////////////////////
init();

function update() {
  animate();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
