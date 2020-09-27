const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const geometry = new THREE.SphereGeometry(0.5, 32, 32);

const material = new THREE.MeshPhongMaterial();
material.map = THREE.ImageUtils.loadTexture("css_globe_diffuse.jpg");

// material.map = THREE.ImageUtils.loadTexture("earthmap1k.jpg");
// material.bumpMap = THREE.ImageUtils.loadTexture("earthbump1k.jpg");
// material.bumpScale = 0.05;
// material.specularMap = THREE.ImageUtils.loadTexture("earthspec1k.jpg");
// material.specular = new THREE.Color("grey");

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(10, 0, 25);

scene.add(light);

const render = () => {
  requestAnimationFrame(render);

  // mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;

  renderer.render(scene, camera);
};

render();
