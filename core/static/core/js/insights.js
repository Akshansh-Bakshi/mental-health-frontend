window.addEventListener("load", () => {

  const scene = new THREE.Scene();

  let mouse = { x: 0, y: 0 };

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

  camera.position.z = 5;

  const emotionCounts = window.emotionCounts || {};

  console.log("Emotion Counts:", emotionCounts);

  const particlesCount = 1400;

  const particlesGeometry = new THREE.BufferGeometry();

  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);

  // 🎨 Emotion → RGB mapping (normalized 0–1)
  const emotionColors = {
    happy: [0.3, 0.7, 1.0],     // blue
    sad: [1.0, 0.3, 0.3],       // red
    angry: [0.6, 0.3, 1.0],     // teal
    fear: [0.2, 0.8, 0.7],      // purple
    neutral: [1.0, 0.8, 0.3]    // yellow
  };

  // 🔥 Build weighted pool
  let emotionPool = [];

  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    for (let i = 0; i < count; i++) {
      emotionPool.push(emotion);
    }
  });

  // fallback if empty
  if (emotionPool.length === 0) {
    emotionPool = ["neutral"];
  }

  for (let i = 0; i < particlesCount; i++) {

    // positions
    posArray[i * 3] = (Math.random() - 0.5) * 15;
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 15;
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 15;

    // 🎯 pick emotion randomly (weighted)
    const emotion = emotionPool[Math.floor(Math.random() * emotionPool.length)];

    const color = emotionColors[emotion] || emotionColors["neutral"];

    colorsArray[i * 3] = color[0];
    colorsArray[i * 3 + 1] = color[1];
    colorsArray[i * 3 + 2] = color[2];
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorsArray, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const particlesMesh = new THREE.Points(
    particlesGeometry,
    particlesMaterial
  );

  scene.add(particlesMesh);

  function animate() {
    requestAnimationFrame(animate);

    // rotation
    particlesMesh.rotation.y += 0.0022;
    particlesMesh.rotation.x += 0.0009;

    // floating motion
    particlesMesh.position.y = Math.sin(Date.now() * 0.0005) * 0.3;

    // mouse camera movement
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

});