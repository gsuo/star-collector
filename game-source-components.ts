// Star Collector — the simplest possible game.
// You are the blue circle. Move with the arrow keys or WASD.
// Touch the gold star: it jumps to a new random spot and your score goes up.

import { defineBehavior, Transform } from 'esengine';

const BOUND_X = 370;
const BOUND_Y = 270;
const TOUCH_DISTANCE = 40;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export const Player = defineBehavior('Player', {
  state: { speed: 300, score: 0 },

  update(ctx, dt) {
    const right = ctx.input.isKeyDown('ArrowRight') || ctx.input.isKeyDown('KeyD') ? 1 : 0;
    const left = ctx.input.isKeyDown('ArrowLeft') || ctx.input.isKeyDown('KeyA') ? 1 : 0;
    const up = ctx.input.isKeyDown('ArrowUp') || ctx.input.isKeyDown('KeyW') ? 1 : 0;
    const down = ctx.input.isKeyDown('ArrowDown') || ctx.input.isKeyDown('KeyS') ? 1 : 0;
    const x = right - left;
    const y = up - down;

    const t = ctx.get(Transform);

    if (x !== 0 || y !== 0) {
      const length = Math.hypot(x, y);
      t.position.x += (x / length) * ctx.self.speed * dt;
      t.position.y += (y / length) * ctx.self.speed * dt;
      t.position.x = Math.max(-BOUND_X, Math.min(BOUND_X, t.position.x));
      t.position.y = Math.max(-BOUND_Y, Math.min(BOUND_Y, t.position.y));
      ctx.set(Transform, t);
    }

    // Collect the star: close enough counts as a touch.
    const star = ctx.world.findEntityByName('Star');
    if (star) {
      const starTransform = ctx.world.get(star, Transform);
      const dx = starTransform.position.x - t.position.x;
      const dy = starTransform.position.y - t.position.y;
      if (dx * dx + dy * dy < TOUCH_DISTANCE * TOUCH_DISTANCE) {
        ctx.self.score += 1;
        starTransform.position.x = randomBetween(-BOUND_X, BOUND_X);
        starTransform.position.y = randomBetween(-BOUND_Y, BOUND_Y);
        ctx.world.set(star, Transform, starTransform);
      }
    }
  },
});
