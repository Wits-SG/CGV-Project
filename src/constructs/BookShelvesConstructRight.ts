import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';


export class BookShelvesConstructRight extends Construct {

    BookShelfGeometry!: THREE.BufferGeometry;
    BookShelfMaterial!: THREE.MeshLambertMaterial
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
    }

    drawBookShelves(){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( this.BookShelfGeometry, this.BookShelfMaterial, 48);
        let bookshelfZ = -100;
        position.z = bookshelfZ;
        for ( let i = 0; i < 48; i ++ ) {
            if(i<8){
                if(i==5){
                    bookshelfZ+=20;
                }
                position.x = 3.25;
                position.y =0;
                position.z = bookshelfZ;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2, Math.PI, 0, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 20;
            }
            if(i>=8 && i<16){
                if(i==8){bookshelfZ = -100;}
                if(i==13){
                    bookshelfZ+=20;
                }
                position.x =-3.25;
                position.y = 0;
                position.z = bookshelfZ;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2, Math.PI, 0, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 20;
            }
            if(i>=16 && i<24){
                if(i==16){bookshelfZ = -100;}
                if(i==21){
                    bookshelfZ+=20;
                }
                position.x = 3.25;
                position.y =0;
                position.z = bookshelfZ+1.25;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2, Math.PI, Math.PI, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 20;
            }
            if(i>=24 && i<32){
                if(i==24){bookshelfZ = -100;}
                if(i==29){
                    bookshelfZ+=20;
                }
                position.x = -3.25;
                position.y = 0;
                position.z = bookshelfZ + 1.25;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2,Math.PI, Math.PI, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 20;
            }

            if(i>=32){
                if(i==32){bookshelfZ = -92.5;}
                if(i!=32 && i%2==0){
                    bookshelfZ += 7;
                }
                if(i==40){
                    bookshelfZ+= 40;
                }
                position.x = 19;
                position.y =0;
                position.z = bookshelfZ;
                scale.x = scale.y = scale.z = 0.085;
                quaternion.setFromEuler(new THREE.Euler( Math.PI/2, Math.PI, Math.PI/2, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                bookshelfZ = bookshelfZ + 6.5;
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
        let bookshelfZ = -100;
        for ( let i = 0; i < 8; i ++ ) {
                if(i==5){
                    bookshelfZ+=20;
                }
                const geometry = new THREE.BoxGeometry(13.5,14,2.75);
                const bookshelfBox = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
                bookshelfBox.position.set(0,0,bookshelfZ+0.625);
                bookshelfZ = bookshelfZ + 20;
                this.add(bookshelfBox);
                this.physics.addStatic(bookshelfBox,PhysicsColliderFactory.box(13.5/2,14/2, 2.75/2));
                this.root.remove(bookshelfBox);
        }
        bookshelfZ=-89.25;
        for ( let i = 0; i < 8; i ++ ) {
            if(i==4){
                bookshelfZ+=40;
            }
            const geometry = new THREE.BoxGeometry(13.5,14,1.225);
            const bookshelfBox = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
            bookshelfBox.position.set(19,0,bookshelfZ);
            bookshelfBox.rotation.set(0,Math.PI/2,0);
            this.add(bookshelfBox);
            this.physics.addStatic(bookshelfBox,PhysicsColliderFactory.box(13.5/2,14/2, 1.225/2));
            this.root.remove(bookshelfBox);
            bookshelfZ = bookshelfZ + 20;
    }


    }


    update(): void {
    }


    destroy(): void {
    }

}