import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';


export class FloorConstruct extends Construct {
  private floor: THREE.Mesh;

  constructor(graphics: GraphicsContext, physics: PhysicsContext) {
    super(graphics, physics);
    this.floor = new THREE.Mesh();
  }

  create(): void {
    this.floor = GraphicsPrimitiveFactory.box({
      position: { x: 0, y: -1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 10, y: 1, z: 10 },  // Adjust the scale to change the size
      colour: 0x98fb98,
      shadows: true,
    });
  }

  load(): void {
    // Load any resources if needed
  }

  build(): void {
    this.graphics.add(this.floor);
    this.physics.addStatic(this.floor, PhysicsColliderFactory.box(5, 0.05, 5));
  }

  update(): void {
    // Update logic if needed
  }

  destroy(): void {
    // Cleanup logic if needed
  }
}
