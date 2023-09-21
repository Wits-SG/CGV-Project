# W3ad Projects

## Description

The w3ad project class is the manager / overlord of the whole game. It provides
the main update loop and lifecycle calls for the projects scene.

It also provides some additional configuration properties to help build a game.

## Class

#### Scenes

Identifier: `scenes`
Type: `Map<string, typeof Scene>`

A list of all scenes that are used within the game. Each scene is uniquely identified
by a scene key string. This key is then used to change the currently loaded scene
by providing the new scene's key to the `changeScene()` method.

The list of scenes needs to be provided to the project constructor in the top level
javascript / typescript file (The file that gets imported and executed first).

## Example

```typescript

const sceneMap = new Map<string, typeof Scene>([
    'main-menu', MainMenuScene,
    'scene-1', ExampleScene1,
    'scene-2', ExampleScene2
])

const project = new Project(
    sceneMap,
    {
        physicsEngine: AmmoResult,
        shadows: true,
    }
);

```
