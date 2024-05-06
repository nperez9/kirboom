import { k } from './kaboomCtx';

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
}

gameSetup();
