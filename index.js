import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

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
mesh.position.set(1, 1, 0);
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 0, 6);
scene.add(camera);
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
mesh.rotation.reorder("YXZ");
mesh.rotation.z = Math.PI / 4;
mesh.rotation.y = Math.PI / 4;

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
    renderer.render(scene, camera);
};

var slider2 = document.getElementById("myRange-2");

slider2.oninput = function () {
    mesh.position.y = slider2.value;
    console.log(slider2.value);
    renderer.render(scene, camera);
};

const tick = () => {
    const elpasedTime = clock.getElapsedTime();

    // console.log(elpasedTime);
    mesh.rotation.z = elpasedTime;
    // mesh.position.y = Math.cos(1 * elpasedTime);
    // camera.position.x = Math.sin(1 * elpasedTime);
    // camera.lookAt(mesh.position);
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
