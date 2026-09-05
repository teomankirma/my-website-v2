import test from 'node:test';
import assert from 'node:assert/strict';
import {MACBOOK, KEYBOARD, MODEL_SCALE} from '../src/lib/macbook.ts';
import {getLaptopPose, getStoryChapter} from '../src/lib/scroll-story.ts';
import {makeContactSchema} from '../src/schemas/contact.ts';

test('14-inch panel and chassis follow Apple’s published dimensions', () => {
  assert.deepEqual(MACBOOK.pixels, [3024, 1964]);
  assert.equal(MACBOOK.width, 312.6);
  assert.equal(MACBOOK.depth, 221.2);
  assert.equal(MACBOOK.height, 15.5);
  assert.ok(Math.abs(MACBOOK.screenWidth / MACBOOK.screenHeight - 1512 / 982) < 1e-12);
  assert.ok(MACBOOK.screenWidth < MACBOOK.width && MACBOOK.screenHeight < MACBOOK.depth);
  assert.equal(MACBOOK.width * MODEL_SCALE, 6.8);
});
test('ANSI layout has 78 keys, twelve function keys, Touch ID, and an inverted-T arrow cluster', () => {
  assert.equal(KEYBOARD.length, 78);
  assert.equal(KEYBOARD.filter((k) => k.row === 0 && /F\d+$/.test(k.label)).length, 12);
  assert.equal(KEYBOARD.filter((k) => k.label === '◎').length, 1);
  assert.equal(KEYBOARD.filter((k) => k.half).length, 4);
  for (const key of KEYBOARD) {
    assert.ok(key.start >= 0);
    assert.ok(key.start + key.units <= 15);
  }
  const rows = new Map();
  for (const key of KEYBOARD) {
    const id = `${key.row}:${key.start}:${key.half ?? 'full'}`;
    assert.ok(!rows.has(id));
    rows.set(id, key);
  }
  assert.ok(KEYBOARD.find((k) => k.label === '').units > 5);
});
test('scroll story opens, shows work, and closes without invalid poses', () => {
  for (const mobile of [false, true]) {
    assert.ok(Math.abs(getLaptopPose(0, mobile).lid) < 1e-12);
    assert.ok(getLaptopPose(0.28, mobile).lid < -Math.PI / 2);
    assert.ok(Math.abs(getLaptopPose(0.9, mobile).lid) < 1e-12);
    assert.equal(getLaptopPose(1, mobile).visible, false);
    for (let i = 0; i <= 100; i++) {
      const pose = getLaptopPose(i / 100, mobile);
      for (const value of Object.values(pose)) {
        if (typeof value === 'number') assert.ok(Number.isFinite(value));
      }
      assert.ok(pose.scale > 0);
    }
  }
  assert.equal(getStoryChapter(0), 0);
  assert.equal(getStoryChapter(0.5), 2);
  assert.equal(getStoryChapter(1), 3);
});
test('contact validation rejects malformed and oversized messages and accepts valid data', () => {
  const keys = [
    'name_required',
    'name_min',
    'name_max',
    'email_required',
    'email_invalid',
    'email_max',
    'message_required',
    'message_min',
    'message_max',
  ];
  const schema = makeContactSchema(Object.fromEntries(keys.map((key) => [key, key])));
  const valid = {
    name: 'Preview Test',
    email: 'preview@example.com',
    message: 'This is a local validation test.',
  };
  assert.ok(schema.safeParse(valid).success);
  assert.equal(schema.safeParse({...valid, email: 'invalid'}).success, false);
  assert.equal(schema.safeParse({...valid, name: 'A'}).success, false);
  assert.equal(schema.safeParse({...valid, message: 'short'}).success, false);
  assert.equal(schema.safeParse({...valid, message: 'x'.repeat(2001)}).success, false);
});
