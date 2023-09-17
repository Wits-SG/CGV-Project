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

export class PhysicsContext {
    public context: any;
    public config: PhysicsConfig;

    private transform: any;
    private dynamicBodies: Array<any>;

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

        this.transform = new Ammo.btTransform();

        this.dynamicBodies = [];
    }

    update(delta: TimeMS) {
        this.context.stepSimulation( delta / 1000, 1); // Pass Delta in as seconds
        for (let i = 0; i < this.dynamicBodies.length; ++i) {

            const objCurr = this.dynamicBodies[i];
            const objPhys = objCurr.userData.physicsBody;
            const objMS = objPhys.getMotionState();

            if (objMS) {
                objMS.getWorldTransform(this.transform);
                const pos = this.transform.getOrigin();
                const quat = this.transform.getRotation();

                objCurr.position.set(pos.x(), pos.y(), pos.z());
                objCurr.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w())
            }
        }
    }

    addStatic(tjsObject: THREE.Object3D, collider: any) {
        // A static body is a rigid body with mass zero

        const staticMass = 0;

        const localInertia = new Ammo.btVector3(0, 0, 0);
        const localTransform = new Ammo.btTransform();

        let tjsPosition: THREE.Vector3 = new THREE.Vector3();
        let tjsRotation: THREE.Quaternion = new THREE.Quaternion();
        tjsObject.getWorldPosition(tjsPosition);
        tjsObject.getWorldQuaternion(tjsRotation);
        const transformOrigin = new Ammo.btVector3(tjsPosition.x, tjsPosition.y, tjsPosition.z); 
        const transformRotation = new Ammo.btQuaternion(tjsRotation.x, tjsRotation.y, tjsRotation.z, tjsRotation.w);

        collider.calculateLocalInertia( staticMass, localInertia );
        localTransform.setIdentity();
        localTransform.setOrigin(transformOrigin);
        localTransform.setRotation(transformRotation);

        const localMotionState = new Ammo.btDefaultMotionState( localTransform );
        const staticBodyInfo = new Ammo.btRigidBodyConstructionInfo( staticMass, localMotionState, collider, localInertia );
        const staticBody = new Ammo.btRigidBody( staticBodyInfo );

        tjsObject.userData.physicsBody = staticBody;
        this.context.addRigidBody( staticBody );

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

        tjsObject.userData.physicsBody = dynamicBody;
        this.dynamicBodies.push( tjsObject );
        this.context.addRigidBody( dynamicBody );
    }

    applyCentralForceOn(tjsObject: THREE.Object3D, x: number, y: number, z: number) {
        tjsObject.userData.physicsBody.applyCentralForce( new Ammo.btVector3(x, y, z) );
    }

    setLinearVelocityOn(tjsObject: THREE.Object3D, x: number, y: number, z: number) {
        tjsObject.userData.physicsBody.setLinearVelocity( new Ammo.btVector3(x, y, z) );
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