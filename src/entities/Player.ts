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

import { scale, deathOfY } from '../constants';

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
    k.doubleJump(10),
    k.health(3),
    k.opacity(1),
    k.scale(scale),
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

  const inhaleZone = player.add([k.area({ shape: new k.Rect(k.vec2(0, -1), 20, 8) }), k.pos(), 'inhaleZone']);
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
    if (player.pos.y > deathOfY) {
      k.go('level-1');
    }
  });

  return player as PlayerGameObj;
}
