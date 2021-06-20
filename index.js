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
const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture("images/2_no_clouds_4k.jpg"),
        bumpMap: THREE.ImageUtils.loadTexture("images/elev_bump_4k.jpg"),
        bumpScale: 0.005,
        specularMap: THREE.ImageUtils.loadTexture("images/water_4k.png"),
        specular: new THREE.Color("grey"),
    })
);
scene.add(earthMesh);
const coulds = new THREE.Mesh(
    new THREE.SphereGeometry(10.03, 32, 32),
    new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture("images/fair_clouds_4k.png"),
        transparent: true,
    })
);
scene.add(coulds);

const space = new THREE.Mesh(
    new THREE.SphereGeometry(90, 64, 64),
    new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("images/galaxy_starfield.png"),
        side: THREE.BackSide,
    })
);
scene.add(space);

const projGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const projMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture("images/asteroid_texture.jpg"),
    transparent: true,
});
const projectile = new THREE.Mesh(projGeometry, projMaterial);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(5, 3, 10);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", (event) => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.set(0, 15, 15);
scene.add(camera);
const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

window.addEventListener("dblclick", () => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

const clock = new THREE.Clock();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

var x, y, vx, vy; // position and velocity
var earthRadius = 6371000; // meters
var mountainHeight = earthRadius * 0.165; // chosen to match image
var newtonG = 6.67e-11; // grav. constant in SI units
var earthMass = 5.97e24; // kilograms
var dt = 5; // time step in seconds
var ratio = 10.03 / earthRadius;
var speedSlider = document.getElementById("speedSlider");
var keepLoop = false;
projectile.position.set(0, 11.68, 0);
scene.add(projectile);
function fireProjectile() {
    x = 0;
    y = earthRadius + mountainHeight;
    vx = Number(speedSlider.value);
    vy = 0;
    keepLoop = true;
    moveProjectile();
}

function moveProjectile() {
    var r = Math.sqrt(x * x + y * y);
    let px = x;
    let py = y;
    if (r > earthRadius) {
        var accel = (newtonG * earthMass) / (r * r);
        var ax = (-accel * x) / r;
        var ay = (-accel * y) / r;

        vx += ax * dt;
        vy += ay * dt;
        x += vx * dt;
        y += vy * dt;

        projectile.position.set(x * ratio, y * ratio, 0);
    }
    console.log("Entering drawProjectile function");
    console.log("Current position is " + x * ratio + ", " + y * ratio);
    if (x != px && py != y && keepLoop) {
        window.setTimeout(moveProjectile, 1000 / 30);
    }
}
function resetProjectile() {
    x = 0;
    y = earthRadius + mountainHeight;
    vx = Number(speedSlider.value);
    vy = 0;
    keepLoop = false;
    projectile.position.set(x * ratio, y * ratio, 0);
}
document.getElementById("buttonfire").addEventListener("click", fireProjectile);
document
    .getElementById("buttonreset")
    .addEventListener("click", resetProjectile);

const tick = () => {
    const elpasedTime = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    window.requestAnimationFrame(tick);
};
tick();
