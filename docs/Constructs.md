# Constructs

## What is a Construct?

A Construct is the building blocks of the larger scene graph. They provide an interface to package complex Game Objects into batches of code
through a virtual scene tree on top of the ThreeJS scene graph.

For example - Assuming the following world environment:

* A character
* A desk
* A door

The ThreeJS Scene Graph might look like:

```text
Scene
-- Camera
---- Sphere (head)
---- Box (body)
---- Oval (arm Left)
---- Oval (arm Right)
---- Oval (leg Left)
---- Oval (leg Right)
-- Box (Desk top) 
---- Box (leg Top Right)
---- Box (leg Bottom Right)
---- Box (leg Top Left)
---- Box (leg Bottom Left)
-- Box (Door Frame)
---- Sphere (Doorknob)
---- Box (Actual Door)
```

Where as the Construct Graph will look like

```text
CGV-Scene
-- Construct (Character)
-- Construct (Desk)
-- Construct (Door)
```

The simplified constructs can also localize behaviour to themselves i.e. the scene is not handling behavioural logic for the door.

A result of this graph encapsulation is that cross-graph-node communication becomes difficult. How exactly do you let the door know to open
when the character is within a specific range and presses a key. The solution to this is [Construct Signals](Signals.md).

### Further Reading

The Construct is a heavily borrowed idea of Godot's Scene System with the Signals System being an almost direct rip.

Interesting reading can be found here:

* [Godot Scenes](https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html)
* [Godot Signals](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html)

## Creating a new construct

To create a new construct, extend and implement the abstract class found in `./src/lib/types/construct.type.ts`.

An example implementation is provided:

```js
export class ExampleConstruct extends Construct {
    // Construct Tree
    plane!: THREE.Mesh;
    subconstruct!: ExampleSubConstruct;

    constructor() {
        this.subconstruct = new ExampleSubConstruct();
    }

    build(): void {
        const geometryPlane = new THREE.PlaneGeometry(2, 2);
        const materialPlane = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.plane = new THREE.Mesh( geometryPlane, materialPlane );

        this.subconstruct.load();

        this.root.add( this.plane );
        this.root.add( this.subconstruct.root );
    }

    update(deltaTime: TimeS): void {
        this.plane.rotation.y += 1 * deltaTime;
        this.subconstruct.update();
    }

}
```

### Construct Tree

The variables of the objects used the by the construct.

All objects should be listed here for the construct to function correctly.

### Constructor

Any subconstructs should have their constructor called here.

### Build

This constructs the initial layout / objects of a construct. It is only called once, when the Construct is loaded. Therefore all necessary resources should be built / placed here.

Any subconstructs should have their load methods called here.

### Update

This function gets called every frame. It is used to animate any dynamic elements used by the construct.

Any subconstructs should have their update method called here.
