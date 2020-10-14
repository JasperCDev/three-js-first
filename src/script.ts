import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function init() {
	const scene = new THREE.Scene();
	const gui = new dat.GUI();

	let enableFog = false;

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2);
	}

	const boxGrid = getBoxGrid(10, 2);
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

	scene.add(boxGrid);
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

	const controls = new OrbitControls(camera, renderer.domElement);
  update(renderer, scene, camera, controls);

	return scene;
}

function getBox(w: number, h: number, d: number) {
	const geometry = new THREE.BoxGeometry(w, h, d);
	const material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)'
	});
	const mesh = new THREE.Mesh(
		geometry,
		material
	);
	mesh.castShadow = true;

	return mesh;
}

function getBoxGrid(
	amount: number,
	seperationMulitiplier: number
): THREE.Group {
	const group = new THREE.Group();

	for (let i = 0; i < amount; i++) {
		const obj = getBox(1, 1, 1);
		obj.position.x = i * seperationMulitiplier;
		obj.position.y = obj.geometry.parameters.height / 2;
		group.add(obj);
		for (let j = 1; j < amount; j++) {
			const obj = getBox(1, 1, 1);
			obj.position.x = i * seperationMulitiplier;
			obj.position.y = obj.geometry.parameters.height / 2;
			obj.position.z = j * seperationMulitiplier;
			group.add(obj);
		}
	}

	group.position.x = -(seperationMulitiplier * (amount - 1)) / 2;
	group.position.z = -(seperationMulitiplier * (amount - 1)) / 2;

	return group;
}

function getPlane(size: number) {
	const geometry = new THREE.PlaneGeometry(size, size);
	const material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
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
	controls: OrbitControls
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