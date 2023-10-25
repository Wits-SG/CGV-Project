import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';


export class DesksConstruct extends Construct {

    table!: THREE.Group;
    tables!: Array<THREE.Group>;
    Lamp!: THREE.Group;
    TableGeometry!: THREE.BufferGeometry;
    TableMaterial!: THREE.MeshLambertMaterial;
    LampGeometry!: THREE.BufferGeometry;
    LampMaterial!: THREE.MeshLambertMaterial;
    lights!: Array<THREE.PointLight>;
    lightStates!: Array<boolean>;
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
    }

    drawTables(TableGeometry:THREE.BufferGeometry){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( TableGeometry, this.TableMaterial, 4);
        let deskz = -60;
        position.z = deskz;
        for ( let i = 0; i < 4; i ++ ) {
                if(i==3){
                    deskz+=20;
                }
                position.x = -2.15;
                position.y = 0;
                position.z = deskz;
                scale.y = scale.x = scale.z = 0.025;
                //quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0),Math.PI);
                quaternion.setFromEuler(new THREE.Euler( 0, Math.PI/2, Math.PI, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                deskz = deskz + 20;
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);
    }


    drawLamps(LampGeometry:THREE.BufferGeometry){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( LampGeometry, this.LampMaterial, 4);
        let lampz = -60;
        position.z = lampz;
        for ( let i = 0; i < 4; i ++ ) {
                if(i==3){
                    lampz+=20;
                }
                position.x = 0;
                position.y = 1;
                position.z = lampz;
                scale.x = scale.y = scale.z = 0.0025;
                quaternion.setFromEuler(new THREE.Euler( -Math.PI/2, 0, 0, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                lampz = lampz + 20;
        }
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.add(mesh);
    }


    create(): void {
    }


    async load(): Promise<void> {
        try {
            var glTFGeometry = new THREE.BufferGeometry();
            var gltfMaterial = new THREE.MeshLambertMaterial();
            const gltfData: any = await this.graphics.loadModel('assets/Desk_Lamp/desk_lamp.glb');
            this.Lamp = gltfData.scene;
            gltfData.scene.traverse(function (child:any){
                if( child.isMesh){
                    gltfMaterial = child.material
                    glTFGeometry = child.geometry;
                }
            })
            this.LampGeometry=glTFGeometry;
            this.LampMaterial = gltfMaterial;
        } catch(e: any) {
            console.error(e);
        }


        try {
            var glTFGeometry = new THREE.BufferGeometry();
            var gltfMaterial = new THREE.MeshLambertMaterial();
            const gltfData: any = await this.graphics.loadModel('assets/wooden_table/wooden_desk.glb');
            this.table = gltfData.scene;
            gltfData.scene.traverse(function (child:any){
                if( child.isMesh){
                    gltfMaterial = child.material
                    glTFGeometry = child.geometry;
                }
            })
            this.TableGeometry =glTFGeometry;
            this.TableMaterial = gltfMaterial;
        } catch(e: any) {
                console.error(e);
        }
    } 


    build(): void {
        this.drawTables(this.TableGeometry);
        this.drawLamps(this.LampGeometry);
        let deskz = -60;
        for ( let i = 0; i < 4; i ++ ) {
                if(i==3){
                    deskz+=20;
                }
                const geometry = new THREE.BoxGeometry(5,2,2.5);
                const deskBox = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
                deskBox.position.set(0,-0.25,deskz);
                deskz = deskz + 20;
                this.add(deskBox);
                this.physics.addStatic(deskBox,PhysicsColliderFactory.box(5/2,1, 1));
                this.root.remove(deskBox);
        }

    }


    update(): void {
    }


    destroy(): void {
    }

}