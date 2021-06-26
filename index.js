// import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import * as THREE from "./three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.127.0/examples/jsm/controls/OrbitControls.js";
// import * as dat from "./dat.gui.min.js";

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
const text_clouds = textureLoader.load("./images/fair_clouds_4k.png");
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
const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(10.03, 128, 128),
    new THREE.MeshPhongMaterial({
        map: text_clouds,
        transparent: true,
    })
);
scene.add(clouds);

const space = new THREE.Mesh(
    new THREE.SphereGeometry(90, 128, 128),
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
    1000
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

/**
 * Dat Gui Control
 */
const parameters = {
    x: 0,
    y: 11.68,
    z: 0,
    vx: 0,
    vy: 0,
    speed: 3000,
    earthRadius: 6371000, // meters
    newtonG: 6.67e-11, // grav. constant in SI units
    earthMass: 5.97e24, // kilograms
    earthDensity: 5515,
    dt: 5, // time step in seconds
    ratio: 0.0000015743211426777584,
};
projectile.position.set(parameters.x, parameters.y, parameters.z);
scene.add(projectile);
let keepLoop = false;
parameters.earthMassCalc =
    parameters.earthDensity *
    (4.0 / 3.0) *
    Math.PI *
    Math.pow(parameters.earthRadius, 3);
parameters.mountainHeight = parameters.earthRadius * 0.165; // chosen to match image
// parameters.ratio = 10.03 / parameters.earthRadius;
parameters.earthMeshScale = (parameters.ratio * parameters.earthRadius) / 10.03;
parameters.moveProjectile = () => {
    let r = Math.sqrt(
        parameters.x * parameters.x + parameters.y * parameters.y
    );
    let px = parameters.x;
    let py = parameters.y;
    if (r > parameters.earthRadius) {
        let accel = (parameters.newtonG * parameters.earthMassCalc) / (r * r);
        let ax = (-accel * parameters.x) / r;
        let ay = (-accel * parameters.y) / r;

        parameters.vx += ax * parameters.dt;
        parameters.vy += ay * parameters.dt;
        parameters.x += parameters.vx * parameters.dt;
        parameters.y += parameters.vy * parameters.dt;

        projectile.position.set(
            parameters.x * parameters.ratio,
            parameters.y * parameters.ratio,
            0
        );
    }
    console.log("now Entering drawProjectile function");
    console.log(
        "Current position is " +
            parameters.x * parameters.ratio +
            ", " +
            parameters.y * parameters.ratio
    );
    if (parameters.x != px && py != parameters.y && keepLoop) {
        window.setTimeout(parameters.moveProjectile, 1000 / 30);
    }
};
parameters.fireProjectile = () => {
    parameters.x = 0;
    parameters.y = parameters.earthRadius + parameters.mountainHeight;
    parameters.vx = parameters.speed;
    parameters.vy = 0;
    keepLoop = true;
    parameters.moveProjectile();
};
parameters.resetProjectile = () => {
    parameters.x = 0;
    parameters.y = parameters.earthRadius + parameters.mountainHeight;
    parameters.vx = parameters.speed;
    parameters.vy = 0;
    keepLoop = false;
    projectile.position.set(
        parameters.x * parameters.ratio,
        parameters.y * parameters.ratio,
        0
    );
};
parameters.earthSize = () => {
    earthMesh.scale.set(
        parameters.earthMeshScale,
        parameters.earthMeshScale,
        parameters.earthMeshScale
    );
    clouds.scale.set(
        parameters.earthMeshScale,
        parameters.earthMeshScale,
        parameters.earthMeshScale
    );
};

const gui = new dat.GUI({ width: 400 });
const projectileGui = gui.addFolder("Projectile");
projectileGui
    .add(parameters, "speed", 0, 10000)
    .setValue(3000)
    .name("Speed (m/s)");
projectileGui
    .add(
        parameters,
        "mountainHeight",
        parameters.earthRadius * 0.01,
        parameters.earthRadius * 0.5
    )
    .setValue(parameters.earthRadius * 0.165)
    .name("Launch Height (m)")
    .onChange(() => {
        parameters.resetProjectile();
    });

const planetGui = gui.addFolder("Planet");
planetGui
    .add(parameters, "earthRadius", 3185500, 12742000)
    .name("Planet Radius")
    .onChange(() => {
        parameters.earthMeshScale =
            (parameters.ratio * parameters.earthRadius) / 10.03;
        parameters.earthMassCalc =
            parameters.earthDensity *
            (4.0 / 3.0) *
            Math.PI *
            Math.pow(parameters.earthRadius, 3);
        console.log(parameters.earthMassCalc);
        parameters.earthSize();
        parameters.resetProjectile();
    });

planetGui
    .add(parameters, "earthDensity", 1000, 10000)
    .setValue(5515)
    .name("Planet Density")
    .onChange(() => {
        parameters.earthMassCalc =
            parameters.earthDensity *
            (4.0 / 3.0) *
            Math.PI *
            Math.pow(parameters.earthRadius, 3);
    });

gui.add(parameters, "fireProjectile").name("Fire! (click here)");
gui.add(parameters, "resetProjectile").name("Reset (click here)");

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    window.requestAnimationFrame(tick);
};
tick();
