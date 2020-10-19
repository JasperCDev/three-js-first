import * as THREE from 'three';
import Tile from './tile';

export default class TileGroup {
  tilesGroup: THREE.Group;
  tiles: { [key: string]: Tile; } = {};

  constructor(amount: number, seperationMultiplier: number) {
    this.tilesGroup = this.getBoxGroup(amount, seperationMultiplier);
    console.log(this.tilesGroup);
  }

  getBoxGroup(amount: number, seperationMulitiplier: number): THREE.Group {
    const group = new THREE.Group();

    for (let i = 0; i < amount; i++) {
      const tile = new Tile(1, 0.05, 1);
      this.tiles[tile.id] = tile;
      const obj = tile.mesh;
      obj.position.x = i * seperationMulitiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.name = 'tile';
      group.add(obj);
      for (let j = 1; j < amount; j++) {
        const tile = new Tile(1, 0.05, 1);
        this.tiles[tile.id] = tile;
        const obj = tile.mesh;
        obj.position.x = i * seperationMulitiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        obj.position.z = j * seperationMulitiplier;
        obj.name = 'tile';
        group.add(obj);
      }
    }
    group.position.x = -(seperationMulitiplier * (amount - 1)) / 2;
    group.position.z = -(seperationMulitiplier * (amount - 1)) / 2;
    group.name = 'tiles'
    return group;
  }
}