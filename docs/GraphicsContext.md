# W3ad Graphics Context

## Description

The graphics context (gctx) class / object is created by a [scene](Scenes.md), 
and passed to all its [subconstructs](Constructs.md) The gctx maintains the 
actual ThreeJS scene graph. It provides a few simple functions that are intended
to help maintain the W3ad scene consistency.

## Properties

* `renderer` - The ThreeJS webgl renderer
* `root` - The ThreeJS scene object
* `mainCamera` - tThe main camera being used to render to `renderer`
* `modelLoader` - The GLTF Model loading object

## Methods

* `add` - this adds a ThreeJS object to the scene root. Effectively its how you
actually add objects to be rendered
    * param: `newObj` - the object being added to the ThreeJS scene.

* `loadModel` - an async function that will download the specified model
* `loadTexture` - an async function that will download the specified texture

# W3ad GraphicsPrimitiveFactory

## Description

A static class to help quickly create simple geometric objects.

Can currently make the following objects:

* Box
* Sphere
