import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

export class Player {
  constructor(scene) {
    const bodyGeo = new THREE.BoxGeometry(1, 2, 1);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3399ff });
    this.mesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.mesh.position.y = 1;
    scene.add(this.mesh);

    const swordGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
    const swordMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    this.sword = new THREE.Mesh(swordGeo, swordMat);
    this.sword.position.set(0.7, 1.2, 0);
    this.mesh.add(this.sword);

    this.speed = 8;
    this.attackCooldown = 0;
    this.attackDuration = 0.25;
    this.isAttacking = false;
  }

  update(dt, keys, mouseDown) {
    let moveX = 0;
    let moveZ = 0;

    if (keys.has('KeyW')) moveZ -= 1;
    if (keys.has('KeyS')) moveZ += 1;
    if (keys.has('KeyA')) moveX -= 1;
    if (keys.has('KeyD')) moveX += 1;

    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
      this.mesh.position.x += moveX * this.speed * dt;
      this.mesh.position.z += moveZ * this.speed * dt;

      const angle = Math.atan2(moveX, moveZ);
      this.mesh.rotation.y = angle;
    }

    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    if (mouseDown && !this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;
      this.attackTime = 0;
      this.attackCooldown = 0.4;
    }

    if (this.isAttacking) {
      this.attackTime += dt;
      const t = this.attackTime / this.attackDuration;
      const swing = Math.sin(Math.min(t, 1) * Math.PI);
      this.sword.rotation.z = -swing * 1.2;

      if (this.attackTime >= this.attackDuration) {
        this.isAttacking = false;
        this.sword.rotation.z = 0;
      }
    }
  }

  getPosition() {
    return this.mesh.position;
  }
}
