import test from 'ava';
import joke from './lib';

test('fetch jokes', t => {
  return joke.then(result => {
    t.is(typeof result, 'object');
    t.is(result.length, 3);
  });
});