/* BMI evaluation, progressive training plans, and selectable home assignments. */
(function (root) {
  'use strict';

  const SPORT_NAMES = {
    '50m': '50米跑',
    longjump: '立定跳远',
    shotput: '投掷实心球',
    rope: '3分钟跳绳',
    pullup: '引体向上',
    situp: '一分钟仰卧起坐',
    '1000m': '男生1000米跑',
    '800m': '女生800米跑',
    sitforward: '坐位体前屈'
  };

  const TRAINING_DETAILS = {
    '50m': {tech: '站立式起跑5次、摆臂20秒x3组', main: '30米加速跑4组，组间休息2分钟'},
    longjump: {tech: '预摆与收腿落地各6次', main: '完整立定跳远6-8次，每次确认落地稳定'},
    shotput: {tech: '徒手蹬地、送髋、挥臂动作链8次', main: '安全场地完成实心球投掷8-10次'},
    rope: {tech: '手腕摇绳与前脚掌小跳各3组', main: '匀速跳绳60秒x3组、快速跳绳30秒x3组'},
    pullup: {tech: '肩胛下沉和慢速离心5次x3组', main: '辅助引体6次x3组、静止悬垂20-30秒x3组'},
    situp: {tech: '慢速卷腹10次x2组，练习呼吸节奏', main: '规范仰卧起坐15-20次x3组、平板支撑30秒x3组'},
    '1000m': {tech: '200米匀速跑2组，练习两步一呼两步一吸', main: '400米匀速跑2组，组间慢走2分钟'},
    '800m': {tech: '200米匀速跑2组，练习稳定摆臂和呼吸', main: '300米匀速跑2组，组间慢走2分钟'}
  };

  const STAGES = [
    {name: '动作适应', adjustment: '以动作规范为主，保留充足组间休息'},
    {name: '稳定加量', adjustment: '动作稳定后，主要练习增加1组'},
    {name: '节奏提升', adjustment: '总训练量比第1周增加约10%，但不牺牲动作质量'},
    {name: '考试衔接', adjustment: '最后一组接近考试节奏，并记录成绩和训练感受'}
  ];

  const bmiEvaluation = value => {
    if (!Number.isFinite(value) || value <= 0) return null;
    if (value < 18.5) return {label: '偏瘦', color: 'text-cyan-700', background: 'bg-cyan-50', advice: '建议保持规律饮食和适量力量训练，关注均衡营养。'};
    if (value < 24) return {label: '正常', color: 'text-green-700', background: 'bg-green-50', advice: '当前处于文档提供的正常范围，继续保持规律运动和均衡饮食。'};
    if (value < 28) return {label: '过重', color: 'text-orange-700', background: 'bg-orange-50', advice: '建议通过规律运动和合理饮食逐步改善，不采用极端节食方式。'};
    return {label: '肥胖', color: 'text-red-700', background: 'bg-red-50', advice: '建议在家长陪同下咨询医生或专业人员，制定安全的运动与饮食方案。'};
  };

  const sportName = key => SPORT_NAMES[key] || key;
  const detail = (key, type) => TRAINING_DETAILS[key]?.[type] || `${sportName(key)}规范动作练习2-3组`;

  const buildPlan = (targetSports, weeks) => {
    const cycle = [1, 2, 4].includes(weeks) ? weeks : 1;
    const targets = [...new Set(targetSports)].filter(key => TRAINING_DETAILS[key]).slice(0, 2);
    const safeTargets = targets.length ? targets : ['50m', 'rope'];
    const daysPerWeek = cycle === 1 ? 3 : cycle === 2 ? 4 : 5;
    const dayTypes = ['专项技术', '专项能力', '基础体能', '组合模拟', '主动恢复'];
    const days = [];

    for (let day = 1; day <= cycle * daysPerWeek; day += 1) {
      const week = Math.ceil(day / daysPerWeek);
      const stage = STAGES[week - 1];
      const type = dayTypes[(day - 1) % daysPerWeek];
      const items = [{name: '热身准备', detail: '慢跑或原地小步跑3分钟，完成肩、髋、膝、踝动态活动5分钟'}];

      if (type === '专项技术') safeTargets.forEach(key => items.push({name: `${sportName(key)}技术练习`, detail: `${detail(key, 'tech')}；${stage.adjustment}`}));
      if (type === '专项能力') safeTargets.forEach(key => items.push({name: `${sportName(key)}专项练习`, detail: `${detail(key, 'main')}；${stage.adjustment}`}));
      if (type === '基础体能') {
        items.push({name: '有氧基础', detail: '轻松跑或跑走结合10-15分钟，保持能够正常说话的强度'});
        items.push({name: '核心与下肢', detail: `深蹲12次x3组、平板支撑30秒x3组、提踵15次x3组；${stage.adjustment}`});
      }
      if (type === '组合模拟') safeTargets.forEach(key => items.push({name: `${sportName(key)}分段模拟`, detail: `${detail(key, 'main')}；${stage.adjustment}`}));
      if (type === '主动恢复') {
        items.push({name: '低强度活动', detail: '快走或慢跑12分钟，运动强度以轻松为准'});
        items.push({name: '柔韧练习', detail: '坐位体前屈相关拉伸3组，每组保持20-30秒，不做弹震动作'});
      } else {
        items.push({name: '柔韧补充', detail: '腿后侧、髋部和肩背部静态拉伸，每个动作保持20秒x2组'});
      }
      items.push({name: '整理放松', detail: '慢走2分钟并完成全身拉伸3-5分钟，训练后适量补水'});
      days.push({day, week, type, goal: `第${week}周 - ${type} - ${stage.name}`, progression: stage.adjustment, items, time: type === '主动恢复' ? '25-30分钟' : type === '组合模拟' ? '40-45分钟' : '35-40分钟', note: '训练前确认场地安全；疼痛、头晕或胸闷时立即停止'});
    }
    return {weeks: cycle, daysPerWeek, targets: safeTargets, days};
  };

  const homeworkChoice = (key, gender) => {
    if (key === 'rope') return {key, title: '累计跳绳400个', goal: '提升节奏控制与持续跳跃能力', detail: '分4-6组累计完成400个，组间休息60秒；以动作稳定为先，不要求一次完成。', equipment: '跳绳', time: '15-20分钟'};
    if (key === '800m' || key === '1000m') return {key, title: gender === 'male' ? '1000米耐力跑' : '800米耐力跑', goal: '提升长跑耐力与配速能力', detail: gender === 'male' ? '先轻松跑800米，状态良好时再慢跑200米；全程保持均匀呼吸。' : '轻松完成800米，前600米匀速、后200米根据体力适度加速。', equipment: '运动鞋、计时工具', time: '15-20分钟'};
    if (key === 'sitforward') return {key, title: '柔韧性练习', goal: '改善腿后侧与腰背部柔韧性', detail: '坐位体前屈相关静态拉伸3-4组，每组保持20-30秒，严禁快速弹震。', equipment: '瑜伽垫', time: '10-15分钟'};
    return {key, title: `${sportName(key)}专项`, goal: `加强${sportName(key)}动作质量和专项能力`, detail: `${detail(key, 'main')}；根据体力完成2-3组，组间休息1-2分钟。`, equipment: key === 'shotput' ? '软式实心球或安全替代物' : '无或家用简易器材', time: '15-20分钟'};
  };

  const homeworkOptions = result => {
    const gender = result.student.gender;
    const runKey = gender === 'male' ? '1000m' : '800m';
    const weakKey = Object.entries(result.items).sort((a, b) => a[1].ratio - b[1].ratio)[0]?.[0];
    const candidates = [weakKey, runKey, 'rope', gender === 'male' ? 'pullup' : 'situp', 'sitforward', 'longjump'].filter(Boolean);
    return [...new Set(candidates)].slice(0, 3).map(key => homeworkChoice(key, gender));
  };

  const api = {SPORT_NAMES, STAGES, bmiEvaluation, buildPlan, homeworkChoice, homeworkOptions};
  if (typeof module !== 'undefined') module.exports = api;
  root.TrainingEngine = api;
})(typeof window === 'undefined' ? globalThis : window);
