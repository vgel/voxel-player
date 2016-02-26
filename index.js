var skin = require('minecraft-skin');

module.exports = function (game) {
    var mountPoint;
    var possessed;
    
    return function (img, skinOpts, opts) {
        if (!skinOpts) {
          skinOpts = {};
        }
        if (!opts) {
            opts = {animate: true};
        }
        if (opts.animate) {
            opts.animationSpeed = opts.animationSpeed !== undefined ? opts.animationSpeed : 1.0; // time for 1 cycle of animation, seconds
            opts.animationAmount = opts.animationAmount !== undefined ? opts.animationAmount : 0.5; // amount of rotation, 1.0 = 180 deg
            opts.legAmount = opts.legAmount !== undefined ? opts.legAmount : 1.0; // leg amount as multiple of overall animation amount
            opts.armAmount = opts.armAmount !== undefined ? opts.armAmount : 1.0; // arm amount as multiple of overall animation amount
            opts.headAmount = opts.headAmount !== undefined ? opts.headAmount : 0.25; // head amount as multiple of overall animation amount
        }
        skinOpts.scale = skinOpts.scale || new game.THREE.Vector3(0.04, 0.04, 0.04);
        var playerSkin = skin(game.THREE, img, skinOpts);
        var player = playerSkin.mesh;
        var physics = game.makePhysical(player);
        physics.playerSkin = playerSkin;
        
        player.position.set(0, 562, -20);
        game.scene.add(player);
        game.addItem(physics);
        
        physics.yaw = player;
        physics.pitch = player.head;
        physics.subjectTo(game.gravity);
        physics.blocksCreation = true;
        
        game.control(physics);

        if (opts.animate) {
            var leftArmBaseRotation = playerSkin.leftArm.rotation.z,
                rightArmBaseRotation = playerSkin.rightArm.rotation.z,
                leftLegBaseRotation = playerSkin.leftLeg.rotation.z,
                rightLegBaseRotation = playerSkin.rightLeg.rotation.z,
                headBaseRotation = playerSkin.head.rotation.z,
                timeInCycle = 0.0;
            physics.tick = function (dt) {
                timeInCycle = (timeInCycle + dt / 1000) % opts.animationSpeed;
                var rotation = Math.sin(timeInCycle / opts.animationSpeed * 2 * Math.PI) * Math.PI * opts.animationAmount;
                playerSkin.leftArm.rotation.z = leftArmBaseRotation + rotation * opts.armAmount;
                playerSkin.rightArm.rotation.z = rightArmBaseRotation - rotation * opts.armAmount;
                playerSkin.leftLeg.rotation.z = leftLegBaseRotation - rotation * opts.legAmount;
                playerSkin.rightLeg.rotation.z = rightLegBaseRotation + rotation * opts.legAmount;
                playerSkin.head.rotation.z = headBaseRotation + rotation * opts.headAmount;
            }
        }
        
        physics.move = function (x, y, z) {
            var xyz = parseXYZ(x, y, z);
            physics.yaw.position.x += xyz.x;
            physics.yaw.position.y += xyz.y;
            physics.yaw.position.z += xyz.z;
        };
        
        physics.moveTo = function (x, y, z) {
            var xyz = parseXYZ(x, y, z);
            physics.yaw.position.x = xyz.x;
            physics.yaw.position.y = xyz.y;
            physics.yaw.position.z = xyz.z;
        };
        
        var pov = 1;
        physics.pov = function (type) {
            if (type === 'first' || type === 1) {
                pov = 1;
            }
            else if (type === 'third' || type === 3) {
                pov = 3;
            }
            physics.possess();
        };
        
        physics.toggle = function () {
            physics.pov(pov === 1 ? 3 : 1);
        };
        
        physics.possess = function () {
            if (possessed) possessed.remove(game.camera);
            var key = pov === 1 ? 'cameraInside' : 'cameraOutside';
            player[key].add(game.camera);
            possessed = player[key];
        };
        
        physics.position = physics.yaw.position;
        
        return physics;
    }
};

function parseXYZ (x, y, z) {
    if (typeof x === 'object' && Array.isArray(x)) {
        return { x: x[0], y: x[1], z: x[2] };
    }
    else if (typeof x === 'object') {
        return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };
    }
    return { x: Number(x), y: Number(y), z: Number(z) };
}
