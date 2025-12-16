import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

export class Enemy {
  constructor(scene, x, z) {
    const geo = new THREE.BoxGeometry(1, 2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, 1, z);
    scene.add(this.mesh);

    this.speed = 4;
    this.alive = true;
  }

  update(dt, player) {
    if (!this.alive) return;

    const p = player.getPosition();
    const dx = p.x - this.mesh.position.x;
    const dz = p.z - this.mesh.position.z;
    const dist = Math.hypot(dx, dz);

    if (dist > 0.1) {
      const nx = dx / dist;
      const nz = dz / dist;
      this.mesh.position.x += nx * this.speed * dt;
      this.mesh.position.z += nz * this.speed * dt;
      this.mesh.rotation.y = Math.atan2(nx, nz);
    }

    if (player.isAttacking) {
      const swordWorldPos = this.mesh.parent.localToWorld(
        player.sword.getWorldPosition(new THREE.Vector3())
      );
      const ex = this.mesh.position.x;
      const ez = this.mesh.position.z;
      const sdx = swordWorldPos.x - ex;
      const sdz = swordWorldPos.z - ez;
      const sdist = Math.hypot(sdx, sdz);
      if (sdist < 2) {
        this.alive = false;
      }
    }
  }
}
