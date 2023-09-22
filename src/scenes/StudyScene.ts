import * as THREE from 'three';
import { GraphicsPrimitiveFactory, PhysicsColliderFactory, Scene } from '../lib';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
//import { TimeS } from '../lib/w3ads/types/misc.type';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export class StudyScene extends Scene {
    floor!: THREE.Mesh;  
    wall!: THREE.Mesh;
    controls!: OrbitControls;  
    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    constructor(AmmoLib: any) {
        super('Study', AmmoLib);  // Call the parent constructor
    }

    create(): void {
        // Implement the abstract method, if needed
        //player to put sizes into perspective
        const geometry = new THREE.BoxGeometry(2, 3, 1);
            const material = new THREE.MeshBasicMaterial({ color: "#0000FF"  });
            const player = new THREE.Mesh(geometry, material);
            player.position.set(0, 1.5, 10);
            this.graphics.add(player);

    }

    load(): void {
        // load 3D models from sketchfab
        const loader = new GLTFLoader();
        
        loader.load('old_low-poly_cupboard/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.01,0.01,0.03); //make it slightly wider
            model.position.set(-14, 0.9, 0);
            this.graphics.add(model);
        });
        loader.load('iron_balcony_fence/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.023,0.01,0.01); 
            model.position.set(-6.5, 7, -7.1);
            model.rotateY(Math.PI);
            this.graphics.add(model);
        });
        loader.load('great_hall_window/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.scale.set(3,1,1); 
            model.position.set(0, 5.5, -15.35);
            this.graphics.add(model);
        });
    }

    //function to build balcony 
    buildBalcony(scene: THREE.Scene, texture: THREE.Texture): THREE.Mesh {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);  

        const geometry = new THREE.BoxGeometry(15, 0.5, 8.4);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const balcony = new THREE.Mesh(geometry, material);
        balcony.position.set(0,5.25,-11);
        scene.add(balcony);
        return balcony;
    }

    //function to build pillars 
    buildPillar(scene: THREE.Scene, x: number, z :number, texture: THREE.Texture): THREE.Mesh {
        const height = 5;
        const radius = 0.7;
        const segments = 6; // Number of segmented faces around the circumference of the cylinder
      
        
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);  // Repeat 2 times horizontally and 10 times vertically
        // Create geometry and material for the pillar
        const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
        const material = new THREE.MeshBasicMaterial({ map: texture });
      
        // Create the pillar mesh
        const pillar = new THREE.Mesh(geometry, material);

        pillar.position.set(x, 2.5, z);
      
        // Add the pillar to the scene
        scene.add(pillar);
      
        return pillar;
      }
      
    //function to build a staircase
    buildStaircase(steps: number, radius: number, scene: THREE.Scene, direction: number, xOffset: number, zOffset: number, rotation: boolean, texture: THREE.Texture) {
        const stepHeight = 0.5;
        const stepLength = 4;
        const stepWidth = 1;
        const angleIncrement = direction * Math.PI / 2 / (steps-1); // 90 degrees divided by the number of steps
        let currentAngle!: number;
        if(rotation){
        currentAngle = 0;
        }else{
        currentAngle = -Math.PI;
        }
        // Create a group to hold all the steps
        const staircaseGroup = new THREE.Group();
      
        for (let i = 0; i < steps; i++) {

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1,1);
            // Create geometry and material for the step
            const geometry = new THREE.BoxGeometry(stepLength, stepHeight, stepWidth);
            const material = new THREE.MeshBasicMaterial({ map: texture });
      
            // Create the step mesh
            const step = new THREE.Mesh(geometry, material);
      
            // Calculate the position of the step
            const x = radius * Math.cos(currentAngle) + xOffset;
            const z = radius * Math.sin(currentAngle) + zOffset;
            const y = i * stepHeight + 0.25; //box is centered at y 0  and extends downwards and upwards
      
            step.position.set(x, y, z);
      
            // Rotate the step to align with the curve
            step.rotation.y = -currentAngle;
      
            // Add the step to the group
            staircaseGroup.add(step);
      
            // Increment the angle for the next step
            currentAngle += angleIncrement;
        }
        
        // Finally, add the group to the scene
        scene.add(staircaseGroup);

        
    }
    
      
    build(): void {
        // Create the main camera
        this.graphics.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.graphics.mainCamera.position.set(0, 5, 10);
        this.graphics.mainCamera.lookAt(0, 0, 0);
        this.controls = new OrbitControls(this.graphics.mainCamera, this.graphics.renderer.domElement);

        // Create the floor
        //Load the texture
        const textureLoader = new THREE.TextureLoader();
        let pillarTexture, balconyTexture, stairTexture;
        textureLoader.load(
            '/woodFloor.jpeg',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10); // repeat 10 times in each direction
                
                //create the floor
                this.floor = GraphicsPrimitiveFactory.box({
                    position: { x: 0, y: -0.1, z: 0 }, //the floors origin , it extends up and down y
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 30, y: 0.2, z: 30 },
                    texture: texture, // use the loaded texture
                    shadows: true
                });
                this.graphics.add(this.floor);
                this.physics.addStatic(this.floor, PhysicsColliderFactory.box(15, 0.1, 15));

            },
            undefined,
            (error) => {
                console.error('An error occurred:', error);
            }
        );
        // Load all textures 

    // Load pillar texture
    textureLoader.load('/marble.jpeg', (texture) => {
        pillarTexture = texture;
        // Add the pillars
        this.buildPillar(this.graphics.root, 6.5, -8, texture);
        this.buildPillar(this.graphics.root, -6.5, -8, pillarTexture);
        this.buildPillar(this.graphics.root, 6.5, -14, pillarTexture);
        this.buildPillar(this.graphics.root, -6.5, -14, pillarTexture);
    },
    undefined,
    (error) => {
        console.error('An error occurred:', error);
    });

    // Load balcony texture
    textureLoader.load('/marble.jpeg', (texture) => {
        balconyTexture = texture;
        // Add the balcony
        this.buildBalcony(this.graphics.root, balconyTexture);
    },undefined,
    (error) => {
        console.error('An error occurred:', error);
    });

    // Load stair texture
    textureLoader.load('/blackFloor.jpeg', (texture) => {
        stairTexture = texture;
        // Add staircase
        this.buildStaircase(10, 3, this.graphics.root, 1, -7.5, -8.5, false, stairTexture); // left stairs, radius = 1?
        this.buildStaircase(10, 3, this.graphics.root, -1, 7.5, -8.5, true, stairTexture); // right stairs

    },undefined,
    (error) => {
        console.error('An error occurred:', error);
    });

    //walls


    // const geometry = new THREE.BoxGeometry(30, 20, 0.2);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // wallL = this.wall();

    //lighting
        this.lightHemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
        this.lightHemisphere.color.setHSL(0.6, 0.6, 0.6);
        this.lightHemisphere.groundColor.setHSL(0.1, 1, 0.4);
        this.lightHemisphere.position.set(0, 50, 0);
        
        this.lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
        this.lightDirectional.color.setHSL(0.1, 1, 0.95);
        this.lightDirectional.position.set(-1, 1.75, 1);
        this.lightDirectional.position.multiplyScalar(100);
        this.lightDirectional.castShadow = true;
        this.lightDirectional.shadow.mapSize.width = 2048;
        this.lightDirectional.shadow.mapSize.height = 2048;

        this.lightDirectional.shadow.camera.left = -50;
        this.lightDirectional.shadow.camera.right = 50;
        this.lightDirectional.shadow.camera.top = 50;
        this.lightDirectional.shadow.camera.bottom = -50;


        this.graphics.add(this.floor);
        this.graphics.add(this.lightHemisphere);
        this.graphics.add(this.lightDirectional);


    }

    update(): void {
        // Implement the abstract method, if needed
    }

    destroy(): void {
        // Implement the abstract method, if needed
    }
}
