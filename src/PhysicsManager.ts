import { TimeS } from "./types/misc.type";

export let Ammo: any;
export let physicsWorld!: Ammo.btDiscreteDynamicsWorld;

let dynamicObjects: Array<any> = [];
let tempTransform: any;

export const initPhysics = (ammo: any) => {
    Ammo = ammo;
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    let overlappingPairCache: any = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

    tempTransform = new Ammo.btTransform();
}

export const physUpdate = (deltaTime: TimeS) => {
    physicsWorld.stepSimulation( deltaTime, 1 );

    for (let i = 0; i < dynamicObjects.length; ++i) {

        const objCurr = dynamicObjects[i];
        const objPhys = objCurr.userData.physicsBody;
        const objMS = objPhys.getMotionState();

        if (objMS) {
            objMS.getWorldTransform( tempTransform );
            const pos = tempTransform.getOrigin();
            const quat = tempTransform.getRotation();

            objCurr.position.set(pos.x(), pos.y(), pos.z());
            objCurr.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w() )
        }
    }
}

export const registerRigidObject = (tjsObject: THREE.Mesh, mass: number, margin: number, shape: any) => {
    shape.setMargin(margin);

    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( tjsObject.position.x, tjsObject.position.y, tjsObject.position.z ) );
    const motionState = new Ammo.btDefaultMotionState( transform );
    const rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
    const rigidBody = new Ammo.btRigidBody( rigidBodyInfo );

    tjsObject.userData.physicsBody = rigidBody;
    physicsWorld.addRigidBody( rigidBody );
}

export const registerDynamicRigidObject = (tjsObject: THREE.Mesh, mass: number, margin: number, shape: any) => {

    registerRigidObject(tjsObject, mass, margin, shape);
    dynamicObjects.push( tjsObject );
}