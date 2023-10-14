import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';


export class WallLights extends Construct {

    WallLightsGeometry!: THREE.BufferGeometry;
    WallLightsMaterial!: THREE.MeshLambertMaterial;
    lights!: Array<THREE.PointLight>;
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
    }

    drawWallLights(){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( this.WallLightsGeometry, this.WallLightsMaterial, 10);
        let wallLightsZ = -100;
        position.z = wallLightsZ;
        for ( let i = 0; i < 10; i ++ ) {
            if(i<5){
                position.x = 0;
                position.y = 0;
                position.z = wallLightsZ;
                scale.x = scale.y = scale.z = 4;
                quaternion.setFromEuler(new THREE.Euler( -Math.PI/2, 0, Math.PI/2, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                wallLightsZ = wallLightsZ + 20;
            }
            if(i>=5){
                if(i==5){wallLightsZ+=20;}
                position.x = 0;
                position.y = 0;
                position.z = wallLightsZ;
                scale.x = scale.y = scale.z = 4;
                quaternion.setFromEuler(new THREE.Euler(-Math.PI/2, 0, Math.PI/2, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                wallLightsZ = wallLightsZ + 20;
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
            const gltfData: any = await this.graphics.loadModel('assets/wall-lamp/EditedWallLamp.glb');
            gltfData.scene.traverse(function (child:any){
                if( child.isMesh){
                    gltfMaterial = child.material
                    glTFGeometry = child.geometry;
                }
            })
            this.WallLightsGeometry =glTFGeometry;
            this.WallLightsMaterial = gltfMaterial;
        } catch(e: any) {
                console.error(e);
        }
    } 


    build(): void {
        this.drawWallLights();

        this.lights = [];
        let lightZ = -100;
        for ( let i = 0; i < 10; i ++ ) {
            if(i<5){
                    const sphere = new THREE.SphereGeometry(0.015);
                    const light = new THREE.PointLight( 0xffecf02, 40, 400);
                    light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffecf02 } ) ) );
                    light.position.set(1.65, 0.35, lightZ);
                    this.add(light);
                    lightZ+=20;
            }
            if(i>=5){
                if(i==5){lightZ+=20;}
                const sphere = new THREE.SphereGeometry(0.015);
                const light = new THREE.PointLight( 0xffecf02, 40, 400);
                light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffecf02 } ) ) );
                light.position.set(1.65, 0.35, lightZ);
                this.add(light);
                lightZ+=20;
            }
        }

    }


    update(): void {
    }


    destroy(): void {
    }

}