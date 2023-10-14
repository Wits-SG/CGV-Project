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

        const mesh = new THREE.InstancedMesh( this.ChandelierGeometry, this.ChandelierMaterial, 9);
        let chandelierZ = -90;
        position.z = chandelierZ;
        for ( let i = 0; i < 9; i ++ ) {
            position.x = 0;
            position.y = 0;
            position.z = chandelierZ;
            scale.x = scale.y = scale.z = 3;
            quaternion.setFromEuler(new THREE.Euler( 0, 0, 0, 'XYZ' ));
            matrix.compose( position, quaternion, scale );
            mesh.setMatrixAt( i, matrix );
            chandelierZ = chandelierZ + 22.5;
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
        let center = -90;
        for ( let i = 0; i < 9; i ++ ) {
            for(let w = 0; w< 12; w++){
                if(w<6){
                    const sphere = new THREE.SphereGeometry(0.015);
                    const light = new THREE.PointLight( 0xffecf02, 35, 600);
                    light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffecf02 } ) ) );
                    const x = 2.15 * Math.sin(w * (2*Math.PI)/6);
                    const z = 2.15 * Math.cos(w * (2*Math.PI)/6);
                    light.position.set(x,0.05,center+z);
                    this.lights.push(light);
                    this.add( light );
                }
                if(w>=6){
                    const sphere = new THREE.SphereGeometry(0.015);
                    const light = new THREE.PointLight( 0xffecf02, 35, 600 );
                    light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffecf02 } ) ) );
                    const x = 1.2 * Math.sin(w * (2*Math.PI)/6);
                    const z = 1.2 * Math.cos(w * (2*Math.PI)/6);
                    light.position.set(x,0.65,center+z);
                    this.lights.push(light);
                    this.add( light );
                }
            }
            center+=22.5;
        }

    }


    update(): void {
    }


    destroy(): void {
    }

}