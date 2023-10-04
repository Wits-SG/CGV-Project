# W3ad Physics Context

## Description

The physics context (pctx) class / object is created by a [scene](Scenes.md), 
and passed to all its [subconstructs](Constructs.md) The pctx maintains the 
physics components of a scene by providing methods that can couple ThreeJS 
objects to a physics collider.

The pctx will also apply any physics updates every frame, but only on specific
physics objects.

## Methods

* `addStatic` - add a physics object that objects can collide with, but
not move
* `addDynamic` - add a physics object that is affected by gravity and collisions.
* `addKinematic` - add a physics object with custom movement behaviour, that can 
affect dynamic objects, but is not affected by them.
* `addCharacter` - add a physics object that will collide with static objects 
but can be moved programmatically
* `addInteractable` - add an object that can be interacted with
    * Param: Object - the object that is interactable
    * Param: Radius - the distance around an object which is interactable
    * Param: onInteract - a callback that gets executed when the object is 
    interacted with
* `addInteracting` - add an object that when nearby to an interactable object, 
can interact with that object
    * Param: Object - add an object that can interact with others
