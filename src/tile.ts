import * as THREE from 'three';

export default class Tile {
  active: boolean = false;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>;
  id: string;

  constructor(w: number, h: number, d: number) {
    this.mesh = this.getTile(w, h, d);
    this.id = this.mesh.uuid;
  }

  getTile(w: number, h: number, d: number) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshPhongMaterial({
      color: 0x634a32
    });
    const mesh = new THREE.Mesh(
      geometry,
      material
    );
    mesh.castShadow = true;
    mesh.position.y = h / 2;
    return mesh;
  }

  set isActive(act: boolean) {
    this.active = act;
  }
}