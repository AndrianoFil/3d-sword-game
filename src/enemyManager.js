import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';
import { Enemy } from './enemy.js';

export class EnemyManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.enemies = [];
    this.spawnTimer = 0;
  }

  update(dt) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.enemies.length < 10) {
      this.spawn();
      this.spawnTimer = 1.5;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(dt, this.player);
      if (!e.alive) {
        this.scene.remove(e.mesh);
        this.enemies.splice(i, 1);
      }
    }
  }

  spawn() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 15 + Math.random() * 10;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const enemy = new Enemy(this.scene, x, z);
    this.enemies.push(enemy);
  }
}
