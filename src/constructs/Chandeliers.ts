import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';


export class Chandeliers extends Construct {

    ChandelierGeometry!: THREE.BufferGeometry;
    ChandelierMaterial!: THREE.MeshLambertMaterial;
    lights!: Array<THREE.PointLight>;
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
    }

    drawChandeliers(){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( this.ChandelierGeometry, this.ChandelierMaterial, 7);
        let chandelierZ = -52.5;
        position.z = chandelierZ;
        for ( let i = 0; i < 5; i ++ ) {
            position.x = 0;
            position.y = 0;
            position.z = chandelierZ;
            scale.x = scale.y = scale.z = 3;
            quaternion.setFromEuler(new THREE.Euler( 0, 0, 0, 'XYZ' ));
            matrix.compose( position, quaternion, scale );
            mesh.setMatrixAt( i, matrix );
            chandelierZ = chandelierZ + 32.5;
        }
        let corridorLightX = 100;
        for ( let i = 0; i < 2; i ++ ) {
            position.x = corridorLightX;
            position.y = 0;
            position.z = 0;
            scale.x = scale.y = scale.z = 3;
            quaternion.setFromEuler(new THREE.Euler( 0, 0, 0, 'XYZ' ));
            matrix.compose( position, quaternion, scale );
            mesh.setMatrixAt( 5+i, matrix );
            corridorLightX = -60;
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
            const gltfData: any = await this.graphics.loadModel('assets/chandelier/EditedChandelier.glb');
            gltfData.scene.traverse(function (child:any){
                if( child.isMesh){
                    gltfMaterial = child.material
                    glTFGeometry = child.geometry;
                }
            })
            this.ChandelierGeometry =glTFGeometry;
            this.ChandelierMaterial = gltfMaterial;
        } catch(e: any) {
                console.error(e);
        }
    } 


    build(): void {
        this.drawChandeliers();

        this.lights = [];
        let center = -52.5;
        for ( let i = 0; i < 5; i ++ ) {
                const light = new THREE.PointLight( 0xffecf02, 400, 0, 1.525);
                light.position.set(0,0.5,center);
                this.lights.push(light);
                this.add( light );
            center+=32.5;
        }
        let corridorLightX = 100;
        for ( let i = 0; i < 2; i ++ ) {
            const light = new THREE.PointLight( 0xffecf02, 400, 0, 1.525);
            light.position.set(corridorLightX,0.5,0);
            this.lights.push(light);
            this.add( light );
            corridorLightX=-60;
        }


    }


    update(): void {
    }


    destroy(): void {
    }

}