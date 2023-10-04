import * as THREE from 'three';

// An object that can be interacted with
type InteractableObject = {
    object: THREE.Object3D,
    radius: number,
    onInteract: Function,
    canPickup: boolean
}

// An object that can interact / pick up other objects
type InteractingObject = {
    object: THREE.Object3D,
    onPickup: Function,
}

// An object that tracks possible places to place pickupable objects
type PickupSpot = {
    spot: THREE.Object3D,
    radius: number,
    onPlace: Function
}

export class InteractManager {
    public interactingObjects: Array<InteractingObject>;
    public interactableObjects: Array<InteractableObject>;
    public pickupSpots: Array<PickupSpot>;

    constructor() {
        this.interactableObjects = [];
        this.interactingObjects = [];
        this.pickupSpots = [];
    }

    addInteracting(object: THREE.Object3D, onPickup: Function) {
        this.interactingObjects.push({
            object, onPickup, 
        } satisfies InteractingObject);
    }

    addInteractable(object: THREE.Object3D, radius: number, onInteract: Function, canPickup: boolean | undefined = undefined) {
        this.interactableObjects.push({
            object, radius, onInteract, canPickup: canPickup != undefined ? canPickup : false
        } satisfies InteractableObject);
    }

    addPickupObject(object: THREE.Mesh, radius: number, inHandScale: number, onPickup: Function) {
        object.userData.inHandScale = inHandScale;
        this.addInteractable(object, radius, onPickup, true);
    }

    addPickupSpot(object: THREE.Object3D, radius: number, onPlace: Function) {
        this.pickupSpots.push({
            spot: object, radius, onPlace
        } satisfies PickupSpot)
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
            if (minDistanceSquared <= this.interactableObjects[minObj].radius**2) {
                if (!this.interactableObjects[minObj].canPickup) {
                    interacting.object.userData.canInteract = true;
                    interacting.object.userData.onInteract = this.interactableObjects[minObj].onInteract;
                } else {
                    interacting.object.userData.canInteract = true;
                    interacting.object.userData.onInteract = () => {
                        this.interactableObjects[minObj].onInteract();
                        interacting.onPickup(this.interactableObjects[minObj].object);
                    }
                }
            } else {
                interacting.object.userData.canInteract = false;
            }

            // Place object search
            let minSpot = 0;
            let minSpotDistanceSquared = Number.MAX_VALUE;
            for (let i = 0; i < this.pickupSpots.length; ++i) {
                const vals = {
                    x2: (
                        interacting.object.position.x - this.pickupSpots[i].spot.position.x
                    )**2,
                    y2: (
                        interacting.object.position.y - this.pickupSpots[i].spot.position.y
                    )**2,
                    z2: (
                        interacting.object.position.z - this.pickupSpots[i].spot.position.z
                    )**2,
                };
                const distanceSquared = vals.x2 + vals.y2 + vals.z2;

                if (distanceSquared < minSpotDistanceSquared) {
                    minSpot = i;
                    minSpotDistanceSquared = distanceSquared;
                }
            }

            if (minSpotDistanceSquared <= this.pickupSpots[minSpot].radius**2) {
                interacting.object.userData.canPlace = true;
                interacting.object.userData.onPlace = this.pickupSpots[minSpot].onPlace;
            } else {
                interacting.object.userData.canPlace = false;
            }

        }
    }
}