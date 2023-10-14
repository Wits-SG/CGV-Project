import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';


export class BookShelvesConstructLeft extends Construct {

    BookShelfGeometry!: THREE.BufferGeometry;
    BookShelfMaterial!: THREE.MeshLambertMaterial;
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
    }

    drawBookShelves(){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( this.BookShelfGeometry, this.BookShelfMaterial, 8);
        let bookshelfZ = -60;
        position.z = bookshelfZ;
        for ( let i = 0; i < 8; i ++ ) {
            if(i<4){
                if(i==3){
                    bookshelfZ+=20;
                }
                position.x = 0;
                position.y =0;
                position.z = bookshelfZ;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2, Math.PI, 0, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 20;
            }
            if(i>=4){
                if(i==4){bookshelfZ = -60;}
                if(i==7){
                    bookshelfZ+=20;
                }
                position.x = 0;
                position.y =0;
                position.z = bookshelfZ+1.25;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2, Math.PI, Math.PI, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 20;
            }
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);
    }




    create(): void {
    }


    async load(): Promise<void> {

        try {
            var glTFGeometry = new THREE.BufferGeometry();
            var gltfMaterial = new THREE.MeshLambertMaterial();
            const gltfData: any = await this.graphics.loadModel('assets/BookShelf/EditedBookshelf.glb');
            gltfData.scene.traverse(function (child:any){
                if( child.isMesh){
                    gltfMaterial = child.material
                    glTFGeometry = child.geometry;
                }
            })
            this.BookShelfGeometry =glTFGeometry;
            this.BookShelfMaterial = gltfMaterial;
        } catch(e: any) {
                console.error(e);
        }
    } 


    build(): void {
        this.drawBookShelves();
        let bookshelfZ = -60;
        for ( let i = 0; i < 4; i ++ ) {
                if(i==3){
                    bookshelfZ+=20;
                }
                const geometry = new THREE.BoxGeometry(6.75,14,2.75);
                const bookshelfBox = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
                bookshelfBox.position.set(0,0,bookshelfZ+0.625);
                bookshelfZ = bookshelfZ + 20;
                this.add(bookshelfBox);
                this.physics.addStatic(bookshelfBox,PhysicsColliderFactory.box(6.75/2,14/2, 2.75/2));
                this.root.remove(bookshelfBox);
        }

    }


    update(): void {
    }


    destroy(): void {
    }

}