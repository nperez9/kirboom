import { KaboomCtx } from 'kaboom';

import { scale, levelsFolders } from '../constants';
import { SpawnPoints, Level } from '../types';

export async function makeMap(k: KaboomCtx, name: string): Promise<{ map: any; spawnPoints: SpawnPoints }> {
  const mapData = await fetch(`./${levelsFolders}${name}.json`).then((respose) => respose.json() as Promise<Level>);
  const map = k.make([k.sprite(name), k.scale(scale), k.pos(0)]);

  const spawnPoints: SpawnPoints = {};

  for (const layer of mapData.layers) {
    // Here some collition
    if (layer.name === 'colliders') {
      for (const collider of layer.objects) {
        // add stuff to map obbject
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ['platform', 'exit'],
          }),
          collider.name !== 'exit' ? k.body({ isStatic: true }) : null,
          k.pos(collider.x, collider.y),
          // adding tags
          collider.name !== 'exit' ? 'platform' : 'exit',
        ]);
      }
    }

    if (layer.name === 'spawnpoints') {
      for (const { name, x, y } of layer.objects) {
        if (!spawnPoints[name]) {
          spawnPoints[name] = [];
        }
        spawnPoints[name].push({ x, y });
      }
    }
  }

  return { map, spawnPoints };
}
