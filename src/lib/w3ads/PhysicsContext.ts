import * as THREE from 'three';
import { TimeMS } from "./types/misc.type";

let Ammo: any;

type PhysicsConfig = {
    gravity: { x: number, y: number, z: number },
}

type BodyConditions = {
    mass: number,
    linearVelocity: { x: number, y: number, z: number },
    friction: number,
}

type InteractArea = {
    object: THREE.Object3D,
    radius: number,
    onInteract: Function,
}

// AMMO Defines
const STATE = { DISABLE_DEACTIVATION: 4 };
const FLAGS = { CF_KINEMAITC_OBJECT: 2};

export class PhysicsContext {
    public context: any;
    public config: PhysicsConfig;

    private tempTransform: any;
    private tempPosition: any;
    private tempQuaternion: any;

    private dynamicBodies: Array<any>;
    private kinematicBodies: Array<any>;
    private characterBodies: Array<any>;

    private interactableObjects: Array<InteractArea>;
    private interactingObjects: Array<THREE.Object3D>;

    constructor(AmmoLib: any, config: PhysicsConfig) {
        Ammo = AmmoLib;
        this.config = config;

        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        let overlappingPairCache: any = new Ammo.btDbvtBroadphase();
        let solver = new Ammo.btSequentialImpulseConstraintSolver();

        this.context = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration)
        this.context.setGravity(new Ammo.btVector3(
            this.config.gravity.x, this.config.gravity.y, this.config.gravity.z
        ));

        this.tempTransform = new Ammo.btTransform();
        this.tempPosition = new Ammo.btVector3();
        this.tempQuaternion = new Ammo.btQuaternion();

        this.dynamicBodies = [];
        this.kinematicBodies = [];
        this.characterBodies = [];

        this.interactableObjects = [];
        this.interactingObjects = [];
    }

    updateKinematic() {
        let tjsPosition: THREE.Vector3 = new THREE.Vector3();
        let tjsQuaternion: THREE.Quaternion = new THREE.Quaternion();
        for (let objKin of this.kinematicBodies) {
            const objPhys = objKin.userData.physicsBody;
            const objMovement = objKin.userData.movement;
            
            objKin.translateX(objMovement.x); objKin.translateY(objMovement.y); objKin.translateZ(objMovement.z);

            objKin.getWorldPosition(tjsPosition);
            objKin.getWorldQuaternion(tjsQuaternion);

            let objMS = objPhys.getMotionState();
            if (objMS) {
                this.tempPosition.setValue(tjsPosition.x, tjsPosition.y, tjsPosition.z);
                this.tempQuaternion.setValue(tjsQuaternion.x, tjsQuaternion.y, tjsQuaternion.z, tjsQuaternion.w);

                this.tempTransform.setIdentity();
                this.tempTransform.setOrigin(this.tempPosition);
                this.tempTransform.setRotation(this.tempQuaternion);
                objMS.setWorldTransform(this.tempTransform);
            }

        }
    }

    updateDynamic() {
        for (let objDyn of this.dynamicBodies) {
            const objPhys = objDyn.userData.physicsBody;
            const objMS = objPhys.getMotionState();

            if (objMS) {
                objMS.getWorldTransform(this.tempTransform);
                const pos = this.tempTransform.getOrigin();
                const quat = this.tempTransform.getRotation();

                objDyn.position.set(pos.x(), pos.y(), pos.z());
                objDyn.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w())
            }
        }
    }

    updateCharacters() {
        for (let objChar of this.characterBodies) {
            const char = objChar.userData.physicsBody;

            const transform = char.getGhostObject().getWorldTransform();
            const pos = transform.getOrigin();

            objChar.position.set(pos.x(), pos.y(), pos.z());
        }
    }

    updateInteract() {
        for (let intObj of this.interactingObjects) {
            for (let area of this.interactableObjects) {
                const x2 = (intObj.position.x - area.object.position.x) ** 2;
                const y2 = (intObj.position.y - area.object.position.y) ** 2;
                const z2 = (intObj.position.z - area.object.position.z) ** 2;
                const distance2 = x2 + y2 + z2;

                if (distance2 < area.radius**2) {
                    intObj.userData.canInteract = true;
                    intObj.userData.onInteract = area.onInteract;
                    break; // Move to the next interacting object
                } else {
                    intObj.userData.canInteract = false;
                    intObj.userData.onInteract = null;
                }

            }
        }
    }

    update(delta: TimeMS) {
        this.context.stepSimulation( delta / 1000, 1); // Pass Delta in as seconds

        this.updateDynamic();
        this.updateKinematic();
        this.updateCharacters();
        this.updateInteract();
    }

    addFreeStatic(position: { x: number, y: number, z: number }, rotation: { x: number, y: number, z: number, w: number }, collider: any) {
        // A static body is a rigid body with mass zero
        const staticMass = 0;
        const localInertia = new Ammo.btVector3(0, 0, 0);
        const localTransform = new Ammo.btTransform();
        const transformOrigin = new Ammo.btVector3(position.x, position.y, position.z); 
        const transformRotation = new Ammo.btQuaternion(rotation.x, rotation.y, rotation.z, rotation.w);

        collider.calculateLocalInertia( staticMass, localInertia );
        localTransform.setIdentity();
        localTransform.setOrigin(transformOrigin);
        localTransform.setRotation(transformRotation);

        const localMotionState = new Ammo.btDefaultMotionState( localTransform );
        const staticBodyInfo = new Ammo.btRigidBodyConstructionInfo( staticMass, localMotionState, collider, localInertia );
        const staticBody = new Ammo.btRigidBody( staticBodyInfo );

        this.context.addRigidBody( staticBody );
        return staticBody;
    }

    addStatic(tjsObject: THREE.Object3D, collider: any) {
        let tjsPosition: THREE.Vector3 = new THREE.Vector3();
        let tjsRotation: THREE.Quaternion = new THREE.Quaternion();
        tjsObject.getWorldPosition(tjsPosition);
        tjsObject.getWorldQuaternion(tjsRotation);

        const staticBody = this.addFreeStatic(tjsPosition, tjsRotation, collider);
        tjsObject.userData.physicsBody = staticBody;
    }

    addDynamic(tjsObject: THREE.Object3D, collider: any, initial: BodyConditions) {
        const localInertia = new Ammo.btVector3(0, 0, 0);
        const localTransform = new Ammo.btTransform();

        let tjsPosition: THREE.Vector3 = new THREE.Vector3();
        let tjsRotation: THREE.Quaternion = new THREE.Quaternion();
        tjsObject.getWorldPosition(tjsPosition);
        tjsObject.getWorldQuaternion(tjsRotation);
        const transformOrigin = new Ammo.btVector3(tjsPosition.x, tjsPosition.y, tjsPosition.z); 
        const transformRotation = new Ammo.btQuaternion(tjsRotation.x, tjsRotation.y, tjsRotation.z, tjsRotation.w);

        collider.calculateLocalInertia( initial.mass, localInertia );
        localTransform.setIdentity();
        localTransform.setOrigin(transformOrigin);
        localTransform.setRotation(transformRotation);

        const localMotionState = new Ammo.btDefaultMotionState( localTransform );
        const dynamicBodyInfo = new Ammo.btRigidBodyConstructionInfo( initial.mass, localMotionState, collider, localInertia );
        dynamicBodyInfo.m_friction = initial.friction;

        const dynamicBody = new Ammo.btRigidBody( dynamicBodyInfo );

        dynamicBody.setLinearVelocity(new Ammo.btVector3(
            initial.linearVelocity.x, initial.linearVelocity.y, initial.linearVelocity.z
        ));

        dynamicBody.setActivationState( STATE.DISABLE_DEACTIVATION );
        tjsObject.userData.physicsBody = dynamicBody;
        this.dynamicBodies.push( tjsObject );
        this.context.addRigidBody( dynamicBody );
    }

    addKinematic(tjsObject: THREE.Object3D, collider: any, initial: BodyConditions) {
        const localInertia = new Ammo.btVector3(0, 0, 0);
        const localTransform = new Ammo.btTransform();

        let tjsPosition: THREE.Vector3 = new THREE.Vector3();
        let tjsRotation: THREE.Quaternion = new THREE.Quaternion();
        tjsObject.getWorldPosition(tjsPosition);
        tjsObject.getWorldQuaternion(tjsRotation);
        const transformOrigin = new Ammo.btVector3(tjsPosition.x, tjsPosition.y, tjsPosition.z); 
        const transformRotation = new Ammo.btQuaternion(tjsRotation.x, tjsRotation.y, tjsRotation.z, tjsRotation.w);

        collider.calculateLocalInertia( initial.mass, localInertia );
        localTransform.setIdentity();
        localTransform.setOrigin(transformOrigin);
        localTransform.setRotation(transformRotation);

        const localMotionState = new Ammo.btDefaultMotionState( localTransform );
        const kinematicBodyInfo = new Ammo.btRigidBodyConstructionInfo( initial.mass, localMotionState, collider, localInertia );
        kinematicBodyInfo.m_friction = initial.friction;

        const kinematicBody = new Ammo.btRigidBody( kinematicBodyInfo );

        kinematicBody.setLinearVelocity(new Ammo.btVector3(
            initial.linearVelocity.x, initial.linearVelocity.y, initial.linearVelocity.z
        ));

        kinematicBody.setActivationState( STATE.DISABLE_DEACTIVATION );
        kinematicBody.setCollisionFlags( FLAGS.CF_KINEMAITC_OBJECT );

        tjsObject.userData.physicsBody = kinematicBody;
        tjsObject.userData.movement = { x: 0, y: 0, z: 0 };
        this.kinematicBodies.push( tjsObject );
        this.context.addRigidBody( kinematicBody );
    }

    addCharacter(tjsObject: THREE.Object3D, collider: any, options: {
        jump: boolean, gravity: number, jumpHeight: number, jumpSpeed: number
    }) {
        
        // Politely borrowed from here
        // https://playground.babylonjs.com/#GI786N#24

        let localTransform = new Ammo.btTransform();

        let tjsPosition: THREE.Vector3 = new THREE.Vector3();
        let tjsRotation: THREE.Quaternion = new THREE.Quaternion();
        tjsObject.getWorldPosition(tjsPosition);
        tjsObject.getWorldQuaternion(tjsRotation);
        const transformOrigin = new Ammo.btVector3(tjsPosition.x, tjsPosition.y, tjsPosition.z); 
        const transformRotation = new Ammo.btQuaternion(tjsRotation.x, tjsRotation.y, tjsRotation.z, tjsRotation.w);

        localTransform.setIdentity();
        localTransform.setOrigin(transformOrigin);
        localTransform.setRotation(transformRotation);

        const ghost = new Ammo.btPairCachingGhostObject();
        ghost.setWorldTransform(localTransform);
        ghost.setCollisionShape(collider);
        ghost.setCollisionFlags(32);
        ghost.setActivationState(4);
        ghost.activate(true);

        const character = new Ammo.btKinematicCharacterController (
            ghost,
            collider,
            0.1,
            1
        );
        character.setGravity(options.gravity);
        character.setUseGhostSweepTest(false);
        if (options.jump) { 
            character.canJump();
            character.setMaxJumpHeight(options.jumpHeight);
            character.setJumpSpeed(options.jumpSpeed);
        }

        this.context.addCollisionObject(ghost, 32, 3);
        this.context.addAction(character);

        tjsObject.userData.physicsBody = character;
        tjsObject.userData.physicsGhost = ghost;
        this.characterBodies.push( tjsObject );
    }

    addInteractable(object: THREE.Object3D, radius: number, onInteract: Function) {
        this.interactableObjects.push({
            object, radius, onInteract
        } satisfies InteractArea);
    }

    addInteracting(tjsObject: THREE.Object3D) {
        this.interactingObjects.push(tjsObject);
    }

    applyCentralForceOnDynamic(tjsObject: THREE.Object3D, x: number, y: number, z: number) {
        tjsObject.userData.physicsBody.applyCentralForce( new Ammo.btVector3(x, y, z) );
    }

    setLinearVelocityOn(tjsObject: THREE.Object3D, x: number, y: number, z: number) {
        tjsObject.userData.physicsBody.setLinearVelocity( new Ammo.btVector3(x, y, z) );
    }

    moveKinematic(tjsObject: THREE.Object3D, x: number, y: number, z: number) {
        tjsObject.userData.movement = {
            x: x, y: y, z: z
        };
    } 

    moveCharacter(tjsObject: THREE.Object3D, x: number, y: number, z: number, speed: number) {
        const body = tjsObject.userData.physicsBody;
        body.setWalkDirection(new Ammo.btVector3(x * speed, y * speed, z * speed));
    }

    jumpCharacter(tjsObject: THREE.Object3D) {
        const body = tjsObject.userData.physicsBody;
        body.jump();
    }
}

export class PhysicsColliderFactory {
    static standardMargin = 0.05;

    static box(x: number, y: number, z: number): any {
        const box = new Ammo.btBoxShape(
            new Ammo.btVector3(x, y, z)
        );

        box.setMargin(this.standardMargin);

        return box;
    }

    static sphere(r: number) {
        const sphere = new Ammo.btSphereShape(r);
        sphere.setMargin(this.standardMargin);

        return sphere;
    }
}
