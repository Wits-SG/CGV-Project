import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';

export class MainLibraryConstruct extends Construct {

    walls!: Array<THREE.Mesh>;
    floors!: Array<THREE.Mesh>;
    ceilings!: Array<THREE.Mesh>;
    bookshelfObject!: THREE.Group;

    constructor(graphics: GraphicsContext, physics: PhysicsContext ) {
        super(graphics, physics);
    }

    create() {}

    load() {

    }

    build() {

        const vertices = [[0,0,112.5], [-40,0,-62.5],[-40,0,62.5], [40,0,-62.5], [40,0,62.5], [0,0,-112.5],[-60,0,12.5],[-60,0,-12.5],[60,0,12.5],[60,0,-12.5]];
        const scaleArr = [[80, 20, 0],[ 100, 20,0], [100, 20,0], [ 100, 20,0], [100, 20,0],[80, 20,0],[40, 20,0],[40, 20,0],[40, 20,0],[40, 20,0]];
        const rotation = [[0,0,0],[0,Math.PI /2,0],[0,Math.PI /2,0], [0,Math.PI /2,0],[0,Math.PI /2,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

        const floorVertices = [[0,-10,0],[60,-10,0],[-60,-10,0]];
        const floorScale = [[80, 225,0],[40, 25,0],[40, 25,0]];
    
        const ceilingVertices = [[0,10,0],[60,10,0],[-60,10,0]];
        const ceilingScale = [[80, 225,0],[40, 25,0],[40, 25,0]];

        this.walls = [];
       for(let i =0; i<10; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            const material = new THREE.MeshBasicMaterial( { color:  0xC0C0C0, side: THREE.DoubleSide } );
            const wall = new THREE.Mesh(geometry,material);
            wall.scale.set(scaleArr[i][0],scaleArr[i][1],scaleArr[i][2]);
            wall.position.set(vertices[i][0],vertices[i][1],vertices[i][2]);
            wall.rotation.set(rotation[i][0],rotation[i][1],rotation[i][2]);
            this.walls.push(wall);
            this.physics.addStatic(wall,PhysicsColliderFactory.box(scaleArr[i][0]/2, scaleArr[i][1]/2, 0.1));
            this.graphics.add(wall);
        }
        this.floors = [];
        for(let i = 0; i<3; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            const material = new THREE.MeshBasicMaterial( { color:  0xB8860B, side: THREE.DoubleSide } );
            const floor= new THREE.Mesh(geometry,material);
            floor.position.set(floorVertices[i][0],floorVertices[i][1],floorVertices[i][2]);
            floor.rotation.set(Math.PI/2,0,0);
            floor.scale.set(floorScale[i][0],floorScale[i][1],floorScale[i][2]);
            this.floors.push(floor);
            this.physics.addStatic(floor,PhysicsColliderFactory.box(floorScale[i][0]/2, floorScale[i][0]/2, 0.1));
            this.graphics.add( floor);
        }

        this.ceilings = [];
        for(let i = 0; i<3; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            const material = new THREE.MeshBasicMaterial( { color:  0xfff2cc, side: THREE.DoubleSide } );
            const ceiling = new THREE.Mesh(geometry,material);
            ceiling.position.set(ceilingVertices[i][0],ceilingVertices[i][1],ceilingVertices[i][2]);
            ceiling.rotation.set(Math.PI/2,0,0);
            ceiling.scale.set(ceilingScale[i][0],ceilingScale[i][1],ceilingScale[i][2]);
            this.floors.push(ceiling);
            this.physics.addStatic(ceiling,PhysicsColliderFactory.box(ceilingScale[i][0]/2, ceilingScale[i][0]/2, 0.1));
            this.graphics.add( ceiling);
        }
        
    }

    // Box collider dimensions are half the dimensions of the actual object
    // so a threejs box of { width: 20, height: 50, depth: 2} has a collider of { 10, 25, 1 }

    update() {}

    destroy() {}
}
