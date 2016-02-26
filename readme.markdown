# voxel-player

Create a skinnable player with physics enabled.

# example

``` js
var createGame = require('voxel-engine');
var game = createGame({
    generate: require('voxel').generator['Valley'],
    texturePath: '/textures/'
});
window.game = game;
game.appendTo('#container');

var createPlayer = require('../')(game);
var substack = createPlayer('substack.png');
substack.position.y = 1000;
substack.possess();

window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) {
        substack.toggle();
    } else if (ev.keyCode === 'T'.charCodeAt(0)) {
        substack.toggleAnimation();
    }
});
```

# running the example

Create a `node_modules/` folder in the root of the `voxel-player/` directory, and use npm to install the dependencies. Assuming you've installed browserify globally, run `browserify main.js > static/bundle.js` in the `example/` directory, then run `node server.js` and visit `localhost:8085` in your browser. If you're using Chrome, make sure to clear cache after making any modifications to prevent it from caching `bundle.js`.

# methods

``` js
var voxelPlayer = require('voxel-player')
```

## var createPlayer = voxelPlayer(game)

Return a function `createPlayer` from a
[voxel-engine](https://github.com/maxogden/voxel-engine) `game` instance.

## var player = createPlayer(img, skinOpts, opts)

Return a new player from a image file src string `img`.
`skinOpts` are an options object passed through to the [minecraft-skin](https://github.com/maxogden/minecraft-skin) module.
`opts` are an options object used to control animation parameters:

* `animate`: Whether to animate the player object at all (default: true)
* `animationSpeed`: Time for one cycle of animation to complete, in seconds (default: 1 second)
* `animationAmount`: How far the body segments rotate, as a multiple of 180 degrees (default: 0.5 / 90 degrees)
* `legAmount`: How far the leg segments rotate, as a multiple of `animationAmount` (default: 1.0)
* `armAmount`: Similar, but for the arm segments (default: 1.0)
* `headAmount`: Also similar, but for the head segment (default: 0.25)

## player.position.set(x, y, z)

Set the player position.

## player.subjectTo(forceVector)

Subject the player to a force of gravity or some such. The default value is
a THREE.Vector3 with `{ x: 0, y: -0.00009, z: 0 }`.

## player.move(x, y, z) or player.move(vec)

Move a relative amount with `(x, y, z)` or a THREE.Vector3 `vec`.

## player.moveTo(x, y, z) or player.move(pos)

Move to an absolute position with `(x, y, z)` or a THREE.Vector3 `pos`.

## player.pov(view)

Set the player view type to `'first'` or `'third'` person perspective. You can
also use a number: `1` or `3`.

## player.toggle()

Toggle the player pov between 1st and 3rd.

## player.possess()

Set the player as the active camera view.

## player.startAnimation()

Starts the player walking animation. Does nothing if animation is disabled.

## player.stopAnimation()

Gracefully stops the player walking animation, by letting it run to completion. Does nothing if animation is disabled.

## player.toggleAnimation()

Depending on the current animation state, either starts or stops the animation. Does nothing if animation is disabled.

# install

With [npm](https://npmjs.org) do:

```
npm install voxel-player
```

# license

MIT
