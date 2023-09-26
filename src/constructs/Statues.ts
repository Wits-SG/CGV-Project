import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';

export class StatuesConstruct extends Construct{

    floor!: THREE.Mesh
    floorTexture!: THREE.MeshBasicMaterial;
    textureFloorData!: any;
    board!: THREE.Mesh

    constructor(graphics: GraphicsContext, physics: PhysicsContext ) {
        super(graphics, physics);
    }

    create(){}

    async load(): Promise<void> { 
        try {
            this.textureFloorData = await this.graphics.loadTexture('public/asssets/Poured_Concrete/ConcretePoured001_COL_2K_METALNESS.png');
        } catch (e: any) {
            console.error(e);
        }
    }

    build(){

        // Floor plane
        const geometry = new THREE.BoxGeometry(50,60,1);
        this.floorTexture = new THREE.MeshBasicMaterial( { map: this.textureFloorData, side: THREE.DoubleSide } );
        this.floor = new THREE.Mesh(geometry, this.floorTexture);
        this.floor.rotation.set(Math.PI/2,0,0);
        this.graphics.add(this.floor);

        //Chess board
        const board_base = new THREE.BoxGeometry(30,30,0.4);
        const boardColour = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.board = new THREE.Mesh(board_base, boardColour);
        this.board.rotation.set(Math.PI/2,0,0);
        this.graphics.add(this.board);
    }

    update(){}

    destroy(){}
}