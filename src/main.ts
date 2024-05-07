import { gravity } from './constants';
import { k } from './kaboomCtx';
import { makeMap } from './utils';

async function gameSetup() {
  k.loadSprite('assets', './kirby-like.png', {
    sliceY: 10,
    sliceX: 9,
    anims: {
      kirbIdle: 0,
      kirbInhale: 1,
      kirbFull: 2,
      kirbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
      shootingStar: 9,
      flame: { from: 36, to: 37, speed: 4, loop: true },
      guyIdle: 18,
      guyWalk: { from: 18, to: 19, speed: 4, loop: true },
      bird: { from: 27, to: 28, speed: 4, loop: true },
    },
  });

  k.loadSprite('level-1', './level-1.png');
  k.loadSprite('level-2', './level-2.png');

  const { map: level1Map, spawnPoints: level1SpawnPoints } = await makeMap(k, 'level-1');

  k.scene('level-1', () => {
    k.setGravity(gravity);
    // bg, cool stuff
    k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex('#F7D7DB')), k.fixed()]);
    k.add(level1Map);
  });

  k.go('level-1');
}

gameSetup();
