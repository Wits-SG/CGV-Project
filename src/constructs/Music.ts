import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, 
    PhysicsColliderFactory } from '../lib/index';
    
export class MusicConstruct extends Construct{
    floor!: THREE.Mesh
    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        super(graphics, physics);
    }

    create() {}

    async load():Promise<void>{ //

    }

    build() {
        const geometry = new THREE.BoxGeometry(60,60,1);
       
        this.floor = new THREE.Mesh(geometry);
        this.floor.rotation.set(Math.PI/2,0,0);
        this.floor.position.set(0,0,0);
        this.graphics.add(this.floor)
    } //all geometry (where place objects)

    update() {}

    destroy() {}

}