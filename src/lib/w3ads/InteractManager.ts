import * as THREE from 'three';

// An object that can be interacted with
type InteractableObject = {
    object: THREE.Object3D,
    radius: number,
    onInteract: Function
}

// An object that can interact / pick up other objects
type InteractingObject = {
    object: THREE.Object3D,
    onPickup: Function,
}

// An object that can be picked up and placed down
type PickupObject = {
    object: THREE.Mesh,
    onPickup: Function,
}

// An object that tracks possible places to place pickupable objects
type PickupSpot = {
    spot: THREE.Object3D,
    currentObject: THREE.Object3D,
    radius: number
}

export class InteractManager {
    public interactingObjects: Array<InteractingObject>;
    public interactableObjects: Array<InteractableObject>;
    public pickupObjects: Array<PickupObject>;
    public pickupSpots: Array<PickupSpot>;

    constructor() {
        this.interactableObjects = [];
        this.interactingObjects = [];
        this.pickupObjects = [];
        this.pickupSpots = [];
    }

    addInteracting(object: THREE.Object3D, onPickup: Function) {
        this.interactingObjects.push({
            object, onPickup
        } satisfies InteractingObject);
    }

    addInteractable(object: THREE.Object3D, radius: number, onInteract: Function) {
        this.interactableObjects.push({
            object, radius, onInteract
        } satisfies InteractableObject);
    }

    update() {
        for (let interacting of this.interactingObjects) {

            // Interact Search to find closest object
            let minObj = 0;
            let minDistanceSquared = Number.MAX_VALUE;
            for (let i = 0; i < this.interactableObjects.length; ++i) {
                const vals = {
                    x2: (
                        interacting.object.position.x - this.interactableObjects[i].object.position.x
                    )**2,
                    y2: (
                        interacting.object.position.y - this.interactableObjects[i].object.position.y
                    )**2,
                    z2: (
                        interacting.object.position.z - this.interactableObjects[i].object.position.z
                    )**2,
                };
                const distanceSquared = vals.x2 + vals.y2 + vals.z2;

                if (distanceSquared < minDistanceSquared) {
                    minObj = i;
                    minDistanceSquared = distanceSquared;
                }
            }
            // i.e. if no in range object was found
            if (minDistanceSquared <= this.interactableObjects[minObj].radius**2 ) {
                interacting.object.userData.canInteract = true;
                interacting.object.userData.onInteract = this.interactableObjects[minObj].onInteract;
            } else {
                interacting.object.userData.canInteract = false;
            }

            // Pickup search to find closest object

        }
    }
}