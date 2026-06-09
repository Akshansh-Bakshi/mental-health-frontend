const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x020617, 20, 80);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
alpha: true,
antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "-1";

document.body.appendChild(renderer.domElement);

camera.position.set(0, 12, 22);
camera.rotation.x = -0.6;


const gridGeo = new THREE.PlaneGeometry(80, 80, 140, 140);

const gridMat = new THREE.MeshBasicMaterial({
color: 0x38bdf8,
wireframe: true,
transparent: true,
opacity: 0.6
});

const grid = new THREE.Mesh(gridGeo, gridMat);
grid.rotation.x = -Math.PI / 2;

scene.add(grid);


const particleCount = 1200;

const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {

positions[i] = (Math.random() - 0.5) * 80;
positions[i + 1] = Math.random() * 20;
positions[i + 2] = (Math.random() - 0.5) * 80;

}

particleGeo.setAttribute(
"position",
new THREE.BufferAttribute(positions, 3)
);

const particleMat = new THREE.PointsMaterial({
color: 0x7dd3fc,
size: 0.15,
transparent: true,
opacity: 0.8
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);



let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", e => {

mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

});



function animate(time) {

requestAnimationFrame(animate);


const verts = grid.geometry.attributes.position;

for (let i = 0; i < verts.count; i++) {

const x = verts.getX(i);
const y = verts.getY(i);

const wave =
Math.sin(x * 0.25 + time * 0.0015) +
Math.cos(y * 0.25 + time * 0.0015);

verts.setZ(i, wave * 1.2);

}

verts.needsUpdate = true;


/* PARTICLE FLOAT */

particles.rotation.y += 0.0020;
particles.rotation.x += 0.0005;

/* CAMERA PARALLAX */

camera.position.x += (mouseX * 6 - camera.position.x) * 0.02;
camera.position.y += (10 + -mouseY * 4 - camera.position.y) * 0.02;

camera.lookAt(0, 0, 0);

renderer.render(scene, camera);

}

animate();


window.addEventListener("resize", () => {

renderer.setSize(window.innerWidth, window.innerHeight);

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

});




// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
// 75,
// window.innerWidth/window.innerHeight,
// 0.1,
// 1000
// );

// const renderer = new THREE.WebGLRenderer({alpha:true});
// renderer.setSize(window.innerWidth,window.innerHeight);

// renderer.domElement.style.position="fixed";
// renderer.domElement.style.top="0";
// renderer.domElement.style.left="0";
// renderer.domElement.style.zIndex="-1";

// document.body.appendChild(renderer.domElement);

// camera.position.z = 8;


// /* PARTICLES */

// const count = 200;
// const particles = [];

// const geometry = new THREE.SphereGeometry(0.05,8,8);
// const material = new THREE.MeshBasicMaterial({
// color:0x38bdf8
// });

// for(let i=0;i<count;i++){

// const p = new THREE.Mesh(geometry,material);

// p.centerX = (Math.random()-0.5)*20;
// p.centerY = (Math.random()-0.5)*12;

// p.radius = Math.random()*0.6 + 0.2;
// p.angle = Math.random()*Math.PI*2;

// scene.add(p);
// particles.push(p);

// }


// /* CONNECTIONS */

// const lineMaterial = new THREE.LineBasicMaterial({
// color:0x6366f1,
// transparent:true,
// opacity:0.25
// });

// let lines;


// /* ANIMATION */

// function animate(){

// requestAnimationFrame(animate);

// const positions=[];

// /* orbit motion */

// particles.forEach(p=>{

// p.angle += 0.01;

// p.position.x = p.centerX + Math.cos(p.angle)*p.radius;
// p.position.y = p.centerY + Math.sin(p.angle)*p.radius;

// positions.push(
// p.position.x,
// p.position.y,
// p.position.z
// );

// });


// /* build connections */

// if(lines) scene.remove(lines);

// const linePositions=[];

// for(let i=0;i<particles.length;i++){

// for(let j=i+1;j<particles.length;j++){

// const dx=particles[i].position.x-particles[j].position.x;
// const dy=particles[i].position.y-particles[j].position.y;

// const dist=Math.sqrt(dx*dx+dy*dy);

// if(dist<1.2){

// linePositions.push(
// particles[i].position.x,
// particles[i].position.y,
// 0,

// particles[j].position.x,
// particles[j].position.y,
// 0
// );

// }

// }

// }

// const lineGeometry = new THREE.BufferGeometry();

// lineGeometry.setAttribute(
// "position",
// new THREE.Float32BufferAttribute(linePositions,3)
// );

// lines = new THREE.LineSegments(lineGeometry,lineMaterial);

// scene.add(lines);

// renderer.render(scene,camera);

// }

// animate();


// /* RESIZE */

// window.addEventListener("resize",()=>{

// renderer.setSize(window.innerWidth,window.innerHeight);

// camera.aspect = window.innerWidth/window.innerHeight;
// camera.updateProjectionMatrix();

// });

