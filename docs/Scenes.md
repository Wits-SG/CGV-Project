# W3ad Scenes

## Lifecycle

The Scene is composed of the following lifecycle, where each lifecycle method gets
called in the following order:

1. Create
2. Load
3. Build
4. Update
5. Destroy

The scene will do setup work, and anything else necessary in these lifecycle methods.
However to provide a way to execute additional code in these methods, each method
has a respective hook.

This hook will be executed by the lifecycle method at the following points:

* After scene normal lifecycle code:
    * Create
    * Load
    * Build
    * Update
* Before scene normal lifecycle code:
    * Destroy

These hooks must be overriden by the Child class to provide the additional behaviour
into the scene.

### Create

Any instantiation code like array initilization and other similar operation occur
in here. This is predominantly for any code that is executed once and does not 
rely on anything that needs to be loaded.

This method gets called once.

### Load

Load is an async hook that should be used to handle any async code required
to correctly construct a scene.

This includes the following:

* Model loading - Any models are fetched over the internet and thus need to be
handled asyncronously - See [GraphicsContext](GraphicsContext.md) for more details.

This method gets called once.

### Build

This hook handles the actual scene construction. Building the layout of the scene
needs to occur here, and any other code that relies on some resource being loaded.

This method gets called once.

### Update

This hook handles the frame-by-frame updates of the scene.

It has two parameters `time` and `delta`. Time is the number of seconds since the
game was started (This will change to number of seconds since scene was created
sometime in the future). Delta is the number of milliseconds that have occured
between the last frame and the current frame.

This method gets called repeatedly throughtout the scenes lifetime.

### Destroy

Any cleanup code needs to be added to this hook.

This method gets called once, when the [project](Projects.md) changes scenes.

## Example

```typescript
import { Scene } from './w3ad/index.ts';

export class ExampleScene extends Scene {

    // Add scene variables here

    constructor(AmmoLib: any) {
        super('Scene Key', AmmoLib);
        // Add constructs here
    }

    create() {
        // Pre-load creation code
    }

    async load() {
        // Async code
    }

    build() {
        // Post-load creation code
        // Create ThreeJS Objects here
    }
    
    update(time: TimeS, delta: TimeMS) {
        // Every frame call code
    }

    destroy() {
        // Clean up code here
    }

}
```
