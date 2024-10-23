const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const ambientLight = new THREE.AmbientLight(0x404040, 2); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry('HackerFerb', {
        font: font,
        size: 2.5,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-10, 3, -10);
    scene.add(textMesh);
});

const planets = [
    { name: 'Mercury', size: 0.1, distance: 5, texture: 'Mercury.png' },
    { name: 'Venus', size: 0.3, distance: 6.5, texture: 'Venus.jpg' },
    { name: 'Earth', size: 0.35, distance: 8, texture: 'Earth.jpg' },
    { name: 'Mars', size: 0.2, distance: 9.5, texture: 'Mars.webp' },
    { name: 'Jupiter', size: 0.7, distance: 13, texture: 'Jupiter.jpg' },
    { name: 'Saturn', size: 0.6, distance: 16, texture: 'saturn.jpg' },
    { name: 'Uranus', size: 0.4, distance: 19, texture: 'Uranus.jpg' },
    { name: 'Neptune', size: 0.4, distance: 22, texture: 'Neptune.jpg' },
    { name: 'Pluto', size: 0.1, distance: 25, texture: 'pluto.jpg' }
];

const planetMeshes = [];
const textureLoader = new THREE.TextureLoader();
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load(planet.texture)
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(planet.distance, 0, 0);
    scene.add(mesh);
    planetMeshes.push({ mesh, distance: planet.distance });
});

const particleCount = 500;
const particles = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

const positions = [];
for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);
}
particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

camera.position.z = 40;

function animate() {
    requestAnimationFrame(animate);

    planetMeshes.forEach((planet, index) => {
        const speed = 0.00005 * (index + 1);
        planet.mesh.position.x = Math.cos(Date.now() * speed) * planet.distance;
        planet.mesh.position.z = Math.sin(Date.now() * speed) * planet.distance;
    });

    particleSystem.rotation.y += 0.001;

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
