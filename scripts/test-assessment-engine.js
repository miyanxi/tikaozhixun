const assert = require('assert');
const E = require('../public/js/assessment-engine.js');

// 每个项目的最高档、最低档、两个档位之间、超界，以及 0.5 分档。
for (const gender of ['male', 'female']) {
  for (const key of E.keysFor(gender)) {
    const item = E.STANDARDS[gender][key];
    const best = item.rows[0], worst = item.rows.at(-1);
    for (const row of item.rows) {
      assert.equal(E.score(gender, key, row.threshold), row.points, `${gender}/${key} threshold ${row.threshold}`);
    }
    for (let index = 0; index < item.rows.length - 1; index += 1) {
      const better = item.rows[index], reached = item.rows[index + 1];
      const between = (better.threshold + reached.threshold) / 2;
      assert.equal(E.score(gender, key, between), reached.points, `${gender}/${key} between bands ${index}`);
    }
    const aboveBest = item.direction === 'lower' ? best.threshold - 1 : best.threshold + 1;
    const belowWorst = item.direction === 'lower' ? worst.threshold + 1 : worst.threshold - 1;
    assert.equal(E.score(gender, key, aboveBest), best.points, `${gender}/${key} caps at maximum`);
    assert.equal(E.score(gender, key, belowWorst), 0, `${gender}/${key} below minimum`);
  }
}
assert.equal(E.score('male', 'pullup', 0), 0, 'male pull-up 0 is 0 points');
assert.equal(E.score('male', '50m', 7.5), 12.5, 'male 50m keeps 0.5 band');
const a = E.analyze({gender:'male',height:170,weight:60,scores:{rope:390,'1000m':255,'50m':7.7,longjump:2.21,shotput:7.8,pullup:5,sitforward:15}});
assert.equal(a.rawTotal, 38.5, 'group selection uses actual points');
assert.equal(a.finalTotal, 39, 'total rounds half up');
assert.equal(a.flex.points, undefined, 'sit-and-reach does not carry an exam score');
const tie = E.analyze({gender:'female',height:165,weight:52,scores:{rope:400,'800m':235,'50m':8.5,longjump:1.82,shotput:6.9,situp:45,sitforward:20}});
assert.ok(tie.groups.every(group=>group.tied), 'equal scores produce tied recommendations in all groups');
assert.equal(tie.rawTotal, 40, 'sit-and-reach is excluded from the 40-point total');
assert.equal(tie.balanced, true, 'equal item ratios do not invent a weakest item');
assert.equal(E.delta('50m', 8, 7.9).change, '进步', 'time direction is lower better');
assert.equal(E.delta('rope', 300, 301).change, '进步', 'count direction is higher better');
console.log('assessment engine: all assertions passed');
