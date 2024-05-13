import {
  AreaComp,
  DoubleJumpComp,
  GameObj,
  HealthComp,
  KaboomCtx,
  OpacityComp,
  PosComp,
  ScaleComp,
  SpriteComp,
} from 'kaboom';

import { scale, deathOfY } from './constants';

export type PlayerGameObj = GameObj<
  SpriteComp &
    AreaComp &
    PosComp &
    ScaleComp &
    DoubleJumpComp &
    HealthComp &
    OpacityComp & {
      speed: number;
      direction: 'left' | 'right';
      isInhaling: boolean;
      isFull: boolean;
    }
>;

export function makePlayer(k: KaboomCtx, posX: number, posY: number): PlayerGameObj {
  const player = k.make([
    k.sprite('assets', { anim: 'kirbIdle' }),
    k.area({ shape: new k.Rect(k.vec2(4, 5.9), 8, 10) }),
    k.body(),
    k.pos(posX * scale, posY * scale),
    // how Many Jumps you can do
    k.doubleJump(10),
    k.health(3),
    k.opacity(1),
    k.scale(scale),
    // Custom that we will need
    {
      speed: 300,
      direction: 'right',
      isInhaling: false,
      isFull: false,
    },
    'player',
  ]);

  player.onCollide('enemy', async (enemy) => {
    if (player.isInhaling && enemy.isHalable) {
      player.isInhaling = false;
      k.destroy(enemy);
      player.isFull = true;
      return;
    }

    if (player.hp() === 0) {
      k.destroy(player);
      k.go('level-1');
      return;
    }

    player.hurt();
    // trancition of player for damage
    await k.tween(player.opacity, 0, 0.05, (val) => (player.opacity = val), k.easings.linear);
    await k.tween(player.opacity, 1, 0.05, (val) => (player.opacity = val), k.easings.linear);
  });

  player.onCollide('exit', () => {
    k.go('level-2');
  });

  const inhaleEffect = k.add([
    k.sprite('assets', { anim: 'kirbInhaleEffect' }),
    k.pos(),
    k.scale(scale),
    k.opacity(0),
    'inhaleEffect',
  ]);

  // this is a child of the player
  const inhaleZone = player.add([k.area({ shape: new k.Rect(k.vec2(0), 20, 40) }), k.pos(), 'inhaleZone']);
  inhaleZone.onUpdate(() => {
    if (player.direction === 'left') {
      inhaleZone.pos = k.vec2(-14, 8);
      inhaleEffect.pos = k.vec2(player.pos.x - 60, player.pos.y);
      inhaleEffect.flipX = true;
      return;
    }
    inhaleZone.pos = k.vec2(14, 8);
    inhaleEffect.pos = k.vec2(player.pos.x + 60, player.pos.y);
    inhaleEffect.flipX = false;
  });

  player.onUpdate(() => {
    // Death like greenwilds
    if (player.pos.y > deathOfY) {
      k.go('level-1');
    }
  });

  return player;
}

export function setControls(k: KaboomCtx, player: PlayerGameObj) {
  const inhaleEffect = k.get('inhaleEffect')[0];
  const jumpButtons = ['up', 'z'];

  k.onKeyDown((key) => {
    switch (key) {
      case 'left':
        player.direction = 'left';
        player.flipX = true;
        player.move(-player.speed, 0);
        break;
      case 'right':
        player.direction = 'right';
        player.flipX = false;
        player.move(player.speed, 0);
        break;
      case 'x':
      case 'space':
        if (player.isFull) {
          player.play('kirbFull');
          inhaleEffect.opacity = 0;
          break;
        }

        player.isInhaling = true;
        player.play('kirbInhale');
        inhaleEffect.opacity = 1;
        break;
    }
  });

  k.onKeyPress((key) => {
    if (jumpButtons.includes(key)) {
      player.doubleJump();
    }
  });

  k.onKeyRelease((key) => {
    if (key === 'x' || key === 'space') {
      if (player.isFull) {
        player.isFull = false;
        player.play('kirbInhaling');
        // Todo: refactor this in a different function
        const shootingStar = k.add([
          k.sprite('assets', { anim: 'shootingStar', flipX: player.direction === 'right' }),
          k.area({ shape: new k.Rect(k.vec2(5, 4), 6, 6) }),
          k.pos(player.direction === 'right' ? player.pos.x + 80 : player.pos.x - 80, player.pos.y + 5),
          k.scale(scale),
          player.direction === 'right' ? k.move(k.RIGHT, 800) : k.move(k.LEFT, 800),
          'shootingStar',
        ]);
        shootingStar.onCollide('platform', () => k.destroy(shootingStar));

        player.isFull = false;
        k.wait(1, () => player.play('kirbIdle'));
        return;
      }

      inhaleEffect.opacity = 0;
      player.isInhaling = false;
      player.play('kirbIdle');
    }
  });
}
