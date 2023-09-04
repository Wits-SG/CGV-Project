# Scenes

## What are scenes?

Scenes are the base level world construct, an alternate name for them might be a 'level'. They are different to Constructs in that Scenes can be
thought of as top level Constructs. Each Scene is therfore responsible for managing it's sub-Constructs and building out an actual level within the game.

## Creating a new scene

To create a new scene, extend and implement the abstract class found in `./src/lib/types/scene.type.ts`.

An example implementation is provided:

```js
export class ExampleScene extends Scene {
    // Scene Tree
    cube!: THREE.Mesh;
    subconstruct!: ExampleConstruct;

    constructor() {
        super('<Example Scene Name>');
        this.subconstruct = new ExampleConstruct();
    }

    build(): void {
        const geometry = new THREE.BoxGeometry( 1, 2, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        this.cube = new THREE.Mesh( geometry, material );

        this.subconstruct.load();

        this.root.add( this.cube );
        this.root.add( this.subconstruct.root );
    }

    update(deltaTime: TimeMS): void {
        this.cube.rotation.x += 1 * deltaTime;
        this.cube.rotation.y += 1 * deltaTime;

        this.subconstruct.update();
    }
}
```

### Scene Tree

These are the actual variables and subobjects associatied with the scene.

You should list out all the objects required by the scene to function here.

### Constructor

This function needs to call super with the Scene name specified. This registers the scene with the SceneManager allowing for Scene Switching using the API in `SceneLoader.ts`. (It will in the future. For now you must go manually add the scene to the scene loader. Follow the currently existing code exactly and if there is any confusion contact Brendan Griffiths (@orwellian225))

The correct naming convention for Scene is SCREAMING-KEBAB-CASE
eg. `EXAMPLE-SCENE-1 EXAMPLE-SCENE-2`

However, the scene registration will follow the below steps to try convert any provided name to the required convention.

1. Replace all spaces with a dash(-).
2. Convert the string to uppercase.

Any Constructs used within a scene need to call the Constructs constructor method to be used correctly.

### Build

This function constructs the inital layout of a scene and is called only once, when the scene is first loaded. So this should add all the resources used by the scene and render them as necessary.

Any Constructs used within a scene need to call the Constructs load method to be used correctly.

### Update

This function gets called every frame. It is used to animate any dynamic elements used by the scene.

Any Constructs used within a Scene need to call the Construct's update method in the Scene update method.
