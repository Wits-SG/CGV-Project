import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext } from '../lib/index';
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

        const mesh = new THREE.InstancedMesh( this.WallLightsGeometry, this.WallLightsMaterial, 4);
        let wallLightsZ = -45.25;
        position.z = wallLightsZ;
        for ( let i = 0; i < 4; i ++ ) {
            if(i<2){
                position.x = -37;
                position.y = 0;
                position.z = wallLightsZ;
                scale.x = scale.y = scale.z = 0.25;
                quaternion.setFromEuler(new THREE.Euler( 0, Math.PI,0, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                wallLightsZ = wallLightsZ + 95;
            }
            if(i>=2){
                if(i==2){wallLightsZ=-45.25;}
                position.x = 37;
                position.y = 0;
                position.z = wallLightsZ;
                scale.x = scale.y = scale.z = 0.25;
                quaternion.setFromEuler(new THREE.Euler(0,0, 0, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
                wallLightsZ = wallLightsZ +  95;
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
            const gltfData: any = await this.graphics.loadModel('assets/WallLamp/WallLight.glb');
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
        let lightZ = -45.25;
        for ( let i = 0; i < 4; i ++ ) {
            if(i<2){
                    const light = new THREE.PointLight( 0xffecf02, 100, 0.0, 1.65);
                    light.position.set(37.5, -1, lightZ);
                    this.add(light);
                    lightZ+=95;
            }
            if(i>=2){
                if(i==2){lightZ=-45.25;}
                const light = new THREE.PointLight( 0xffecf02, 100, 0.0,1.65);
                light.position.set(-37.5, -1, lightZ);
                this.add(light);
                lightZ+=95;
            }
        }

    }


    update(): void {
    }


    destroy(): void {
    }

}