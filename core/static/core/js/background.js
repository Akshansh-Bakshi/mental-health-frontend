const scene = new THREE.Scene();

let mouse = {
  x: 0,
  y: 0
};

window.addEventListener("mousemove", (event) => {

  mouse.x = (event.clientX / window.innerWidth) - 0.5;
  mouse.y = (event.clientY / window.innerHeight) - 0.5;

});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "-1";

document.body.appendChild(renderer.domElement);


// particle system
const particlesCount = 1200;
const particlesGeometry = new THREE.BufferGeometry();

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);


const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  color: 0x38bdf8
});

const particlesMesh = new THREE.Points(
  particlesGeometry,
  particlesMaterial
);

scene.add(particlesMesh);

camera.position.z = 5;


// animation loop
function animate() {
  requestAnimationFrame(animate);

  particlesMesh.rotation.y += 0.0015;
  particlesMesh.rotation.x += 0.0005;

  // camera reacts to mouse

    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;

    camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();


// handle resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});





