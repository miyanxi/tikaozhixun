const assert = require('assert');
const T = require('../public/js/training-engine.js');

assert.equal(T.bmiEvaluation(18.4).label, '偏瘦');
assert.equal(T.bmiEvaluation(18.5).label, '正常');
assert.equal(T.bmiEvaluation(23.9).label, '正常');
assert.equal(T.bmiEvaluation(24).label, '过重');
assert.equal(T.bmiEvaluation(27.9).label, '过重');
assert.equal(T.bmiEvaluation(28).label, '肥胖');
assert.equal(T.bmiEvaluation(Number.NaN), null);

const oneWeek = T.buildPlan(['1000m', 'pullup'], 1);
assert.equal(oneWeek.days.length, 3, 'one-week plan has three concrete sessions');
assert.ok(oneWeek.days.every(day => day.items.length >= 4), 'every session has warmup, training, flexibility, and cooldown');

const fourWeeks = T.buildPlan(['1000m', 'pullup'], 4);
assert.equal(fourWeeks.days.length, 20, 'four-week plan has twenty concrete sessions');
assert.deepEqual([...new Set(fourWeeks.days.map(day => day.week))], [1, 2, 3, 4]);
assert.equal(new Set(fourWeeks.days.map(day => day.progression)).size, 4, 'each week has a distinct progression rule');
assert.ok(fourWeeks.days.some(day => day.type === '主动恢复'), 'long plan includes active recovery');

const maleOptions = T.homeworkOptions({student: {gender: 'male'}, items: {rope: {ratio: 90}, '1000m': {ratio: 30}, pullup: {ratio: 50}}});
assert.equal(maleOptions.length, 3);
assert.ok(maleOptions.some(option => option.key === '1000m'), 'male homework includes the exam-distance endurance option');
assert.ok(maleOptions.some(option => option.key === 'rope'), 'male homework includes the 400-jump option');

const femaleOptions = T.homeworkOptions({student: {gender: 'female'}, items: {rope: {ratio: 20}, '800m': {ratio: 70}, situp: {ratio: 60}}});
assert.ok(femaleOptions.some(option => option.key === '800m'), 'female homework includes the 800m option');
assert.ok(femaleOptions.some(option => option.title === '累计跳绳400个'));

console.log('training engine: all assertions passed');
