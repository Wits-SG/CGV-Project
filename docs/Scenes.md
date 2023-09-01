# Scenes

## Creating a new scene

To create a new scene, extend and implement the abstract class found in `./src/lib/types/scene.type.ts`.

An example implementation is provided:

```js
export class ExampleScene extends Scene {
    // Scene Tree
    cube!: THREE.Mesh;

    constructor() {
        super('<Example Scene Name>');
    }

    build(): void {
        const geometry = new THREE.BoxGeometry( 1, 2, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        this.cube = new THREE.Mesh( geometry, material );

        this.root.add( this.cube );
    }

    update(deltaTime: TimeMS): void {
        this.cube.rotation.x += 1 * deltaTime;
        this.cube.rotation.y += 1 * deltaTime;
    }
}
```

### Scene Tree

These are the actual variables and subobjects associatied with the scene. Currently, complex subobjects are not supported outside of what ThreeJS provides, but a future expansion to the API is to allow Scenes to have Children that are also Scenes.

You should list out all the objects required by the scene to function here.

### Constructor

This function needs to call super with the Scene name specified. This registers the scene with the SceneManager allowing for Scene Switching using the API in `SceneLoader.ts`.

The correct naming convention for Scense is SCREAMING-KEBAB-CASE
eg.
```
EXAMPLE-SCENE-1
EXAMPLE-SCENE-2
```

However, the scene registration will follow the below steps to try convert any provided name to the required convention.

1. Replace all spaces with a dash(-).
2. Convert the string to uppercase.

### Build

This function constructs the inital layout of a scene and is called only once, when the scene is first loaded. So this should add all the resources used by the scene and render them as necessary.

### Update

This function gets called every frame. It is used to add an dynamic elements used by the scene.