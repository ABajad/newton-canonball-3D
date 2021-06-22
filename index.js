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
 * texture
 */
const textureLoader = new THREE.TextureLoader();
const no_clouds = textureLoader.load("./images/2_no_clouds_4k.jpg");
const elev_bump = textureLoader.load("./images/elev_bump_4k.jpg");
const water = textureLoader.load("./images/water_4k.png");
const clouds = textureLoader.load("./images/fair_clouds_4k.png");
const stars = textureLoader.load("./images/galaxy_starfield.png");
const astroid = textureLoader.load("./images/asteroid_texture.jpg");

/**
 * Object
 */
const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshPhongMaterial({
        map: no_clouds,
        bumpMap: elev_bump,
        bumpScale: 0.005,
        specularMap: water,
        specular: new THREE.Color("grey"),
    })
);
scene.add(earthMesh);
const coulds = new THREE.Mesh(
    new THREE.SphereGeometry(10.03, 32, 32),
    new THREE.MeshPhongMaterial({
        map: clouds,
        transparent: true,
    })
);
scene.add(coulds);

const space = new THREE.Mesh(
    new THREE.SphereGeometry(90, 64, 64),
    new THREE.MeshBasicMaterial({
        map: stars,
        side: THREE.BackSide,
    })
);
scene.add(space);

const projGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const projMaterial = new THREE.MeshPhongMaterial({ map: astroid });
const projectile = new THREE.Mesh(projGeometry, projMaterial);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

let light = new THREE.DirectionalLight(0xffffff, 0.5);
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
    50,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.set(0, 20, 20);
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
/**
 * Control
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 12.0;
controls.maxDistance = 50.0;
controls.zoomSpeed = 1.0;
controls.rotateSpeed = 1.0;
controls.panSpeed = 1.0;
controls.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

let x, y, vx, vy; // position and velocity
const earthRadius = 6371000; // meters
const mountainHeight = earthRadius * 0.165; // chosen to match image
const newtonG = 6.67e-11; // grav. constant in SI units
const earthMass = 5.97e24; // kilograms
const dt = 5; // time step in seconds
const ratio = 10.03 / earthRadius;
let speedSlider = document.getElementById("speedSlider");
let keepLoop = false;
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
    let r = Math.sqrt(x * x + y * y);
    let px = x;
    let py = y;
    if (r > earthRadius) {
        let accel = (newtonG * earthMass) / (r * r);
        let ax = (-accel * x) / r;
        let ay = (-accel * y) / r;

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
    controls.update();
    renderer.render(scene, camera);
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    window.requestAnimationFrame(tick);
};
tick();
