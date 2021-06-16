// import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import * as THREE from "./three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.127.0/examples/jsm/controls/OrbitControls.js";
/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0,
};
window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
    // console.log(cursor);
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(1, 1, 0);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
// const aspectRatio = sizes.width / sizes.height;
// console.log(aspectRatio);
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     1,
//     -1,
//     0.1,
//     100
// );

camera.position.set(0, 0, 4);
scene.add(camera);
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
// mesh.rotation.reorder("YXZ");
// mesh.rotation.z = Math.PI / 4;
// mesh.rotation.y = Math.PI / 4;

mesh.scale.set(1, 1, 1);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
//Animation

// gsap.to(mesh.rotation, { duration: 100, delay: 0, x: 60 });
// gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

var slider1 = document.getElementById("myRange-1");

slider1.oninput = function () {
    mesh.position.x = slider1.value;
    console.log(slider1.value);
    // renderer.render(scene, camera);
};

var slider2 = document.getElementById("myRange-2");

slider2.oninput = function () {
    mesh.position.y = slider2.value;
    console.log(slider2.value);
    // renderer.render(scene, camera);
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const tick = () => {
    const elpasedTime = clock.getElapsedTime();

    // console.log(elpasedTime);
    // mesh.rotation.z = elpasedTime;
    // mesh.position.y = Math.cos(1 * elpasedTime);
    // camera.position.x = Math.sin(1 * elpasedTime);
    //Update camera
    // camera.position.x = -3 * Math.sin(cursor.x * 4);
    // camera.position.z = -3 * Math.cos(cursor.x * 4);
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position);
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
