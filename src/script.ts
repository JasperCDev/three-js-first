import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TileGroup from './tileGroup';

function init() {
	const scene = new THREE.Scene();
	const gui = new dat.GUI();

	let enableFog = false;

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2);
	}

	const boxGrid = new TileGroup(45, 1.02);
	const plane = getPlane(50);
	const spotLight = getSpotLight(1);
	const sphere = getSphere(0.05);

	plane.name = 'plane-1';

	plane.rotation.x = Math.PI / 2;
	spotLight.position.y = 2;
	spotLight.intensity = 2;

	gui.add(spotLight, 'intensity', 0, 10);
	gui.add(spotLight.position, 'y', 0, 20);
	gui.add(spotLight.position, 'x', -5, 20);
	gui.add(spotLight.position, 'z', -5, 20);
	gui.add(spotLight, 'penumbra', 0, 1);

	scene.add(boxGrid.tilesGroup);
	scene.add(plane);
	scene.add(spotLight);
	spotLight.add(sphere);

	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);

	camera.position.x = 1;
	camera.position.y = 2;
	camera.position.z = 5;

	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.getElementById('webgl')!.appendChild(renderer.domElement);

	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	const controls = new OrbitControls(camera, renderer.domElement);

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	window.addEventListener('click', (e) => clickHandler(e, mouse, raycaster, camera, boxGrid), false);
  update(renderer, scene, camera, controls);

	return scene;
}

function clickHandler(e: MouseEvent, mouse: THREE.Vector2, raycaster: THREE.Raycaster, camera: THREE.PerspectiveCamera, boxGrid: TileGroup) {
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const [clickedObj] = raycaster.intersectObjects(scene.children, true);
	console.log(clickedObj.object);
	if (clickedObj.object.name === 'tile') {
		const tile = boxGrid.tiles[clickedObj.object.uuid];
		tile.isActive = !tile.active;
		tile.mesh.material.color.set(tile.active ? 0x00e366 : 0x634a32);
	};
}

function getPlane(size: number) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const material = new THREE.MeshPhongMaterial({
		color: 0x946f4d,
		side: THREE.DoubleSide
	});
	const mesh = new THREE.Mesh(
		geometry,
		material
	);

	mesh.receiveShadow = true;

	return mesh;
}

function getPointLight(intensity: number) {
	const light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;
	return light;
}

function getSpotLight(intensity: number) {
	const light = new THREE.SpotLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.position.x = 6;

	return light;
}

function getSphere(size: number) {
	const geometry = new THREE.SphereGeometry(size, 25, 25);
	const material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	});
	const mesh = new THREE.Mesh(
		geometry,
		material
	);
	return mesh;
}

function update(
	renderer: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.PerspectiveCamera,
	controls: OrbitControls,
) {
  renderer.render(
    scene,
    camera
	);


	controls.update();

	requestAnimationFrame(() => {
		update(renderer, scene, camera, controls);
	});
}


const scene = init();