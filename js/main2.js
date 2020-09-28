let scene, camera, renderer, _Fly, flyline, earth, light, shape;
let clock = new THREE.Clock();

/*
Returns a random point of a sphere, evenly distributed over the sphere.
The sphere is centered at (x0,y0,z0) with the passed in radius.
The returned point is returned as a three element array [x,y,z]. 
*/
function randomSpherePoint(x0, y0, z0, radius) {
  var u = Math.random();
  var v = Math.random();
  var theta = 2 * Math.PI * u;
  var phi = Math.acos(2 * v - 1);
  var x = x0 + radius * Math.sin(phi) * Math.cos(theta);
  var y = y0 + radius * Math.sin(phi) * Math.sin(theta);
  var z = z0 + radius * Math.cos(phi);
  return [x, y, z];
}

function getThetaPhiRadius(x, y, z) {
  const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  return {
    theta: Math.acos(z / r),
    phi: Math.atan(y / x),
    radius: r,
  };
}

function getXYZByThetaPhiRadius(theta, phi, radius) {
  var x = radius * Math.sin(theta) * Math.cos(phi);
  var y = radius * Math.sin(theta) * Math.sin(phi);
  var z = radius * Math.cos(theta);
  return [x, y, z];
}

function getThreePoints() {
  const pointA = randomSpherePoint(0, 0, 0, 1);
  const pointB = randomSpherePoint(0, 0, 0, 1);
  const pointZero = [0, 0, 0];
  // 中点
  const midX = (pointA[0] + pointB[0]) / 2;
  const midY = (pointA[1] + pointB[1]) / 2;
  const midZ = (pointA[2] + pointB[2]) / 2;
  const thetaPhiRadius = getThetaPhiRadius(midX, midY, midZ);
  const pointMid = [midX, midY, midZ];
  const pointSurface = getXYZByThetaPhiRadius(
    thetaPhiRadius.theta,
    thetaPhiRadius.phi,
    1
  );
  const pointExpected = getXYZByThetaPhiRadius(
    thetaPhiRadius.theta,
    thetaPhiRadius.phi,
    2
  );
  return {
    pointA: pointA,
    pointB: pointB,
    pointSurface: pointSurface,
    pointExpected: pointExpected,
    pointMid: pointMid,
    pointZero: pointZero,
  };
}

///////////////////////////////////////////////

const createEarth = function () {
  const geometry = new THREE.SphereGeometry(
    1,
    32,
    32
    // 0,
    // 2 * Math.PI,
    // 0,
    // Math.PI / 2
  );

  // const material = new THREE.MeshPhongMaterial();

  // material.map = THREE.ImageUtils.loadTexture("./images/css_globe_diffuse.jpg");

  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });

  earth = new THREE.Mesh(geometry, material);

  scene.add(earth);
};

const createGeometry = function (points) {
  let geometry = new THREE.Geometry();

  geometry.vertices.push(new THREE.Vector3().fromArray(points.pointA));
  geometry.vertices.push(new THREE.Vector3().fromArray(points.pointB));
  geometry.vertices.push(new THREE.Vector3().fromArray(points.pointZero));
  geometry.vertices.push(new THREE.Vector3().fromArray(points.pointMid));
  geometry.vertices.push(new THREE.Vector3().fromArray(points.pointSurface));
  geometry.vertices.push(new THREE.Vector3().fromArray(points.pointExpected));

  geometry.faces.push(new THREE.Face3(0, 1, 2));
  geometry.faces.push(new THREE.Face3(0, 1, 4));
  geometry.faces.push(new THREE.Face3(0, 1, 5));

  let material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  shape = new THREE.Mesh(geometry, material);
  scene.add(shape);
};

const createFly = function (points) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3().fromArray(points.pointA),
    new THREE.Vector3().fromArray(points.pointExpected),
    new THREE.Vector3().fromArray(points.pointB)
  );

  const flyPoints = curve.getPoints(500);

  flyline = _Fly.addFly({
    color: `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(
      0,
      255
    )},${THREE.Math.randInt(0, 255)},1)`,
    curve: flyPoints,
    width: 0.02,
    length: 100,
    speed: 3,
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
  scene.background = new THREE.Color(0xffffff);

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
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 5;

  // light
  light = new THREE.PointLight(0xffffff, 1, 100);

  light.position.set(10, 0, 25);

  scene.add(light);

  // axes helper 坐标辅助线
  let axes = new THREE.AxesHelper(10);
  scene.add(axes);

  // do something rendering

  const points = getThreePoints();

  // fly
  // Array.apply(null, { length: 100 }).map(function () {
  //   createFly();
  // });
  createEarth();
  createFly(points);
  createGeometry(points);

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
  // earth.rotation.y += 0.01;
  // shape.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();
