// ===== Global State =====
let studentData = null;
let assessmentResult = null;
let radarChartInstance = null;
let currentPlanWeeks = 1;
let chatHistory = [];

// ===== Sports Data =====
const sportsData = {
    '50m': { name:'50米跑',icon:'🏃',color:'bg-blue-100',desc:'测试速度素质的短跑项目',intro:'50米跑是体育中考和体质测试的重要项目之一，主要测试学生的速度素质和爆发力。',phases:[{name:'起跑',desc:'采用站立式起跑，前脚距起跑线约一脚掌距离，后脚距前脚约一脚半。身体前倾，重心前移。'},{name:'加速跑',desc:'起跑后迅速蹬地发力，前3-5步逐渐加速，步频快步幅逐渐增大。'},{name:'途中跑',desc:'保持最高速度跑进，前脚掌着地，摆臂有力，身体微前倾。'},{name:'冲刺',desc:'接近终点时全力冲刺，不减速，胸部前倾压线跑过终点。'}],keyPoints:['前脚掌着地，步频要快','摆臂有力，前后摆动','身体微前倾，重心稳定','全力冲刺过终点'],mistakes:['起跑时跳步或踉跄','跑动时身体后仰','摆臂幅度不够','接近终点时减速'],corrections:['练习反应起跑，听信号快速蹬地','加强核心力量训练，保持正确跑姿','对镜练习摆臂动作','练习冲刺跑，养成压线习惯'],tips:'训练前充分热身，特别是腿部肌肉。跑后做拉伸放松。',safety:'跑步时注意跑道平整，避免湿滑地面。有心脏疾病时不要剧烈运动。' },
    'longjump': { name:'立定跳远',icon:'🦘',color:'bg-green-100',desc:'测试下肢爆发力的跳跃项目',intro:'立定跳远是测试学生下肢爆发力和身体协调能力的重要项目。',phases:[{name:'预备姿势',desc:'两脚自然分开与肩同宽，两臂上举或前摆，屈膝半蹲，身体重心前移。'},{name:'起跳',desc:'两臂快速由后向前上方摆动，同时两脚用力蹬地，向前上方跳出。'},{name:'腾空',desc:'起跳后身体充分伸展，收腹举腿，两腿前伸。'},{name:'落地',desc:'脚跟先着地，迅速过渡到全脚掌，屈膝缓冲，身体前倾。'}],keyPoints:['蹬地有力，爆发式起跳','摆臂与蹬地协调配合','腾空时收腹举腿','落地时前伸小腿，屈膝缓冲'],mistakes:['起跳前两脚移动','蹬地不充分','腾空时不收腹','落地时后坐'],corrections:['练习原地起跳，注意脚不移动','加强腿部力量训练（深蹲、蛙跳）','练习收腹跳','练习落地缓冲动作'],tips:'重点练习下肢爆发力，可以做蛙跳、深蹲跳等辅助练习。',safety:'确保落地面平整安全，落地时注意屈膝缓冲保护膝关节。' },
    'shotput': { name:'实心球',icon:'🏐',color:'bg-orange-100',desc:'测试上肢力量和协调用力的投掷项目',intro:'实心球投掷是测试学生上肢、腰腹力量和身体协调用力的项目。',phases:[{name:'持球准备',desc:'双手自然张开持球两侧，两脚前后开立，两臂屈肘持球于头后上方。'},{name:'预摆',desc:'身体后仰成弓形，球引至头后上方，重心落在后脚。'},{name:'发力',desc:'后脚蹬地→送髋→收腹→挥臂→拨球，力量从下肢经腰腹传递到上肢。'},{name:'出手',desc:'球从头顶前上方约40-42度角出手，出手后身体随惯性前移。'}],keyPoints:['全身协调用力，从下到上','身体充分后仰成弓形','出手角度约40-42度','最后拨球出手'],mistakes:['只用手臂力量','出手角度过高或过低','身体没有形成弓形','出手后踩线'],corrections:['练习完整动作链','设置目标高度标志','加强腰腹力量','练习出手后制动'],tips:'重点加强上肢和腰腹力量，可以做俯卧撑、仰卧起坐等辅助练习。',safety:'投掷时确保前方无人，捡球时确认所有人都已停止投掷。' },
    'rope': { name:'3分钟跳绳',icon:'🪢',color:'bg-purple-100',desc:'测试协调性和耐力的综合项目',intro:'3分钟跳绳是测试学生身体协调性、灵敏性和耐力的综合项目。',phases:[{name:'准备',desc:'调整绳长，双脚踩绳中间，两手握柄，绳柄末端至腋下位置为宜。'},{name:'起跳',desc:'听到信号后先做1-2次试跳调整节奏，然后快速进入稳定状态。'},{name:'持续跳',desc:'保持匀速节奏，前脚掌着地，跳起高度约3-5厘米，手腕发力转绳。'},{name:'冲刺',desc:'最后10-15秒加速冲刺，提高跳绳频率。'}],keyPoints:['手腕发力转绳','前脚掌着地，跳起高度小','保持匀速节奏','身体自然直立'],mistakes:['跳得太高浪费体力','用手臂甩绳','节奏不稳定','身体前倾弯腰'],corrections:['练习原地小跳控制高度','夹肘练习手腕转绳','先慢后快建立节奏','对镜练习保持体态'],tips:'每天坚持练习，循序渐进增加数量。',safety:'选择平整地面，穿运动鞋。跳绳前检查绳子是否完好。' },
    'pullup': { name:'引体向上',icon:'🤸',color:'bg-red-100',desc:'测试上肢力量的男生项目',intro:'引体向上是测试男生上肢肌肉力量和耐力的重要项目。',phases:[{name:'悬垂准备',desc:'正握单杠，两手与肩同宽，身体自然悬垂。'},{name:'拉起',desc:'背阔肌发力，屈臂将身体拉起至下颌超过横杠。'},{name:'下降',desc:'控制速度缓慢下降至手臂完全伸直。'},{name:'连续完成',desc:'按标准动作连续完成，每次都完全伸直手臂。'}],keyPoints:['正握单杠，握距与肩同宽','背阔肌发力','拉起时下颌过杠','下降时完全伸直手臂'],mistakes:['身体摆动借力','拉起不够高度','没有完全伸直手臂','耸肩缩脖子'],corrections:['练习静止悬垂增强握力','做弹力带辅助引体向上','加强背部力量','练习离心收缩'],tips:'从悬垂和辅助引体开始，逐步增加次数。每周练习3-4次。',safety:'确保单杠稳固，手上有汗时擦干防滑。' },
    'situp': { name:'仰卧起坐',icon:'🧘',color:'bg-pink-100',desc:'测试腰腹力量的女生项目',intro:'一分钟仰卧起坐是测试女生腰腹肌肉力量和耐力的项目。',phases:[{name:'准备姿势',desc:'仰卧在垫上，两腿屈膝约90度，两手交叉放在耳侧。'},{name:'起身',desc:'收腹发力，上体抬起至两肘触及或超过双膝。'},{name:'回落',desc:'控制速度缓慢回落，两肩胛骨触垫后立即做下一个。'},{name:'节奏控制',desc:'保持均匀节奏，前30秒稳定速度，后30秒尽力坚持。'}],keyPoints:['收腹发力，不要用手拉头','肘关节触膝或超过膝','肩胛骨触垫后立刻起来','保持均匀呼吸'],mistakes:['双手抱头用力拉脖子','起身不够高度','利用惯性猛起猛落','臀部离开垫子'],corrections:['手放耳侧体会收腹发力','放慢速度确保动作到位','练习平板支撑增强核心','注意呼吸配合'],tips:'每天坚持练习，从每组10-15个开始逐步增加。',safety:'在软垫上练习保护脊柱。腰部有伤病的同学请谨慎练习。' },
    '1000m': { name:'男生1000米跑',icon:'🏃‍♂️',color:'bg-teal-100',desc:'测试男生耐力素质的长跑项目',intro:'1000米跑是测试男生心肺功能和耐力素质的重要项目。',phases:[{name:'起跑',desc:'采用站立式起跑，起跑后不要急于冲刺，迅速进入自己的节奏。'},{name:'前400米',desc:'以较快速度但不过于激烈的速度跑进，找到适合自己的节奏。'},{name:'中间400米',desc:'保持匀速跑进，注意呼吸节奏（两步一呼两步一吸）。'},{name:'最后200米',desc:'加大摆臂幅度，加快步频，全力冲刺到终点。'}],keyPoints:['合理分配体力','保持稳定的呼吸节奏','摆臂有力，步频均匀','最后200米全力冲刺'],mistakes:['起跑就全力冲刺','呼吸紊乱时放弃','身体后仰或晃动','最后冲刺时减速'],corrections:['练习匀速跑感受配速','极点时加深呼吸坚持跑进','加强核心力量','练习冲刺意志力'],tips:'长跑需要循序渐进，先增加跑量再提高速度。每周练习2-3次。',safety:'有心脏疾病或哮喘的同学请提前告知老师。出现胸闷头晕应立即减速停止。' },
    '800m': { name:'女生800米跑',icon:'🏃‍♀️',color:'bg-cyan-100',desc:'测试女生耐力素质的长跑项目',intro:'800米跑是测试女生心肺功能和耐力素质的重要项目。',phases:[{name:'起跑',desc:'采用站立式起跑，起跑后迅速进入自己的节奏。'},{name:'前300米',desc:'以较快速度但可持续的速度跑进。'},{name:'中间300米',desc:'保持匀速跑进，注意呼吸节奏。'},{name:'最后200米',desc:'加大摆臂幅度，全力冲刺到终点。'}],keyPoints:['合理分配体力','保持稳定的呼吸节奏','摆臂有力','最后200米全力冲刺'],mistakes:['起跑过快导致后程乏力','呼吸紊乱时停下走路','跑姿变形','冲刺不坚决'],corrections:['制定配速计划分段控制','极点时加深呼吸坚持','加强核心力量训练','练习冲刺意志力'],tips:'长跑训练循序渐进，先增加跑量再提高速度。',safety:'有心脏疾病或身体不适时不要勉强。出现不适请立即停止。' }
};

// ===== Scoring Standards =====
const scoringStandards = {
    '50m': { unit:'秒',lowerBetter:true,male:{'7':[[7.2,'优秀'],[7.5,'良好'],[8.0,'及格']],'8':[[7.0,'优秀'],[7.3,'良好'],[7.8,'及格']],'9':[[6.8,'优秀'],[7.1,'良好'],[7.6,'及格']]},female:{'7':[[8.2,'优秀'],[8.5,'良好'],[9.0,'及格']],'8':[[8.0,'优秀'],[8.3,'良好'],[8.8,'及格']],'9':[[7.8,'优秀'],[8.1,'良好'],[8.6,'及格']]} },
    'longjump': { unit:'厘米',lowerBetter:false,male:{'7':[[225,'优秀'],[195,'良好'],[160,'及格']],'8':[[235,'优秀'],[205,'良好'],[170,'及格']],'9':[[245,'优秀'],[215,'良好'],[180,'及格']]},female:{'7':[[190,'优秀'],[165,'良好'],[140,'及格']],'8':[[198,'优秀'],[172,'良好'],[148,'及格']],'9':[[205,'优秀'],[178,'良好'],[155,'及格']]} },
    'shotput': { unit:'米',lowerBetter:false,male:{'7':[[9.0,'优秀'],[7.0,'良好'],[5.0,'及格']],'8':[[10.0,'优秀'],[7.8,'良好'],[5.5,'及格']],'9':[[11.0,'优秀'],[8.5,'良好'],[6.0,'及格']]},female:{'7':[[7.0,'优秀'],[5.5,'良好'],[4.0,'及格']],'8':[[7.5,'优秀'],[6.0,'良好'],[4.5,'及格']],'9':[[8.0,'优秀'],[6.5,'良好'],[5.0,'及格']]} },
    'rope': { unit:'次',lowerBetter:false,male:{'7':[[150,'优秀'],[120,'良好'],[80,'及格']],'8':[[155,'优秀'],[125,'良好'],[85,'及格']],'9':[[160,'优秀'],[130,'良好'],[90,'及格']]},female:{'7':[[145,'优秀'],[115,'良好'],[75,'及格']],'8':[[150,'优秀'],[120,'良好'],[80,'及格']],'9':[[155,'优秀'],[125,'良好'],[85,'及格']]} },
    'pullup': { unit:'次',lowerBetter:false,male:{'7':[[10,'优秀'],[7,'良好'],[4,'及格']],'8':[[12,'优秀'],[9,'良好'],[5,'及格']],'9':[[14,'优秀'],[10,'良好'],[6,'及格']]} },
    'situp': { unit:'次',lowerBetter:false,female:{'7':[[42,'优秀'],[32,'良好'],[22,'及格']],'8':[[45,'优秀'],[35,'良好'],[24,'及格']],'9':[[48,'优秀'],[38,'良好'],[26,'及格']]} },
    '1000m': { unit:'秒',lowerBetter:true,male:{'7':[[250,'优秀'],[280,'良好'],[320,'及格']],'8':[[240,'优秀'],[270,'良好'],[310,'及格']],'9':[[230,'优秀'],[260,'良好'],[300,'及格']]} },
    '800m': { unit:'秒',lowerBetter:true,female:{'7':[[210,'优秀'],[240,'良好'],[280,'及格']],'8':[[205,'优秀'],[235,'良好'],[275,'及格']],'9':[[200,'优秀'],[230,'良好'],[270,'及格']]} }
};

const demoData = { nickname:'小健',grade:'9',gender:'male',age:15,height:170,weight:60,exerciseFreq:'2',exerciseDur:'30',improve:'1000米跑和引体向上',scores:{'50m':7.6,'longjump':220,'shotput':8.5,'rope':145,'pullup':6,'1000m':255} };

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('appFooter').classList.remove('hidden');
    }, 800);
    initSportsList();
    initPracticeSelect();
    updateGenderFields();
});

// ===== Navigation =====
function showView(v) {
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
    const t = document.getElementById('view-' + v);
    if (t) { t.classList.remove('hidden'); t.classList.add('fade-in'); }
    window.scrollTo(0, 0);
    if (v === 'results' && assessmentResult) renderResults();
    if (v === 'coach') setTimeout(() => { const i = document.getElementById('chatInput'); if(i) i.focus(); }, 300);
}
function navigateAfterData(v) {
    if (!assessmentResult) {
        if (confirm('你还没有完成体质测评，是否先进行测评？\n\n点击"确定"前往测评，点击"取消"使用示例数据快速体验。')) showView('assessment');
        else { loadDemoData(); submitAssessment(true); setTimeout(() => showView(v), 100); }
    } else showView(v);
}

// ===== Sports List =====
function initSportsList() {
    document.getElementById('sportsList').innerHTML = Object.entries(sportsData).map(([k,s]) => `
        <div class="sport-card" onclick="showLearningDetail('${k}')">
            <div class="sport-card-icon ${s.color}">${s.icon}</div>
            <div class="flex-1"><h3 class="font-semibold text-gray-800">${s.name}</h3><p class="text-xs text-gray-500 mt-1">${s.desc}</p></div>
            <span class="text-primary-500 text-sm">学习 →</span>
        </div>`).join('');
}
function showLearningDetail(key) {
    const s = sportsData[key];
    document.getElementById('learningDetailContent').innerHTML = `
        <div class="result-card mb-4"><div class="flex items-center gap-3 mb-3"><span class="text-3xl">${s.icon}</span><div><h2 class="text-xl font-bold text-gray-800">${s.name}</h2><p class="text-sm text-gray-500">${s.intro}</p></div></div></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="result-card"><h3 class="font-bold text-gray-800 mb-2">🎬 标准动作视频</h3><div class="video-placeholder"><div class="play-icon">▶️</div><p class="text-sm">标准动作视频</p><p class="text-xs mt-1">（视频待上传）</p></div></div>
            <div class="result-card"><h3 class="font-bold text-gray-800 mb-2">🎬 慢动作分解视频</h3><div class="video-placeholder"><div class="play-icon">▶️</div><p class="text-sm">慢动作分解视频</p><p class="text-xs mt-1">（视频待上传）</p></div></div>
        </div>
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-3">📋 动作阶段讲解</h3><div class="space-y-3">${s.phases.map((p,i)=>`<div class="flex gap-3"><div class="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">${i+1}</div><div><div class="font-semibold text-gray-800 text-sm">${p.name}</div><div class="text-sm text-gray-600 mt-1">${p.desc}</div></div></div>`).join('')}</div></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="result-card"><h3 class="font-bold text-gray-800 mb-3">✅ 动作要领</h3><ul class="space-y-2">${s.keyPoints.map(k=>`<li class="text-sm text-gray-600 flex gap-2"><span class="text-green-500">✓</span>${k}</li>`).join('')}</ul></div>
            <div class="result-card"><h3 class="font-bold text-gray-800 mb-3">⚠️ 常见错误</h3><ul class="space-y-2">${s.mistakes.map(m=>`<li class="text-sm text-gray-600 flex gap-2"><span class="text-red-400">✗</span>${m}</li>`).join('')}</ul></div>
        </div>
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-3">🔧 错误纠正方法</h3><ul class="space-y-2">${s.corrections.map(c=>`<li class="text-sm text-gray-600 flex gap-2"><span class="text-blue-500">→</span>${c}</li>`).join('')}</ul></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="result-card"><h3 class="font-bold text-gray-800 mb-2">💡 训练注意事项</h3><p class="text-sm text-gray-600">${s.tips}</p></div>
            <div class="result-card"><h3 class="font-bold text-gray-800 mb-2">🛡️ 安全提醒</h3><p class="text-sm text-gray-600">${s.safety}</p></div>
        </div>`;
    showView('learning-detail');
}

// ===== Practice =====
function initPracticeSelect() {
    const sel = document.getElementById('practiceSportSelect');
    Object.entries(sportsData).forEach(([k,s]) => { sel.innerHTML += `<option value="${k}">${s.icon} ${s.name}</option>`; });
}
function generatePractice() {
    const key = document.getElementById('practiceSportSelect').value;
    if (!key) { document.getElementById('practiceContent').innerHTML = ''; return; }
    const s = sportsData[key], p = getPracticePlan(key);
    document.getElementById('practiceContent').innerHTML = `
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-2">🎯 本次练习目标</h3><p class="text-sm text-gray-600">提高${s.name}的运动表现，重点加强${p.focus}。</p></div>
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-2">🔥 热身动作（5-8分钟）</h3><ul class="space-y-2">${p.warmup.map(w=>`<li class="text-sm text-gray-600 flex gap-2"><span>•</span>${w}</li>`).join('')}</ul></div>
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-3">💪 基础练习动作</h3><div class="space-y-4">${p.exercises.map((ex,i)=>`<div class="bg-gray-50 rounded-xl p-4"><div class="font-semibold text-gray-800 mb-1">动作${i+1}：${ex.name}</div><p class="text-sm text-gray-600 mb-2">${ex.desc}</p><div class="flex flex-wrap gap-3 text-xs"><span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📊 ${ex.reps}</span><span class="bg-green-100 text-green-700 px-2 py-1 rounded-full">🔄 ${ex.sets}</span><span class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">⏱️ 休息${ex.rest}</span></div></div>`).join('')}</div></div>
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-2">🧘 拉伸放松（5分钟）</h3><ul class="space-y-2">${p.cooldown.map(c=>`<li class="text-sm text-gray-600 flex gap-2"><span>•</span>${c}</li>`).join('')}</ul></div>
        <div class="result-card mb-4"><h3 class="font-bold text-gray-800 mb-2">⚠️ 注意事项</h3><ul class="space-y-2">${p.warnings.map(w=>`<li class="text-sm text-gray-600 flex gap-2"><span class="text-red-400">!</span>${w}</li>`).join('')}</ul></div>
        <div class="bg-green-50 rounded-xl p-4 text-center"><p class="text-green-700 font-medium">💪 加油！坚持训练就能进步！</p><p class="text-green-600 text-sm mt-1">预计完成时间：${p.totalTime}</p></div>`;
}
function getPracticePlan(key) {
    const P = {
        '50m':{focus:'起跑反应和加速能力',warmup:['慢跑200米','动态拉伸（高抬腿、踢臀跑各20米）','原地小跳20次','弓步走20米'],exercises:[{name:'原地高抬腿',desc:'快速原地高抬腿，前脚掌着地，摆臂有力。',reps:'30秒',sets:'3组',rest:'30秒'},{name:'30米加速跑',desc:'从静止开始加速跑到30米处。',reps:'1次',sets:'4组',rest:'2分钟'},{name:'反应起跑练习',desc:'听信号快速起跑，练习反应速度。',reps:'1次',sets:'5组',rest:'1.5分钟'}],cooldown:['慢走200米放松','腿部前侧拉伸（每侧30秒）','腿部后侧拉伸（每侧30秒）'],warnings:['充分热身后再进行快速跑','感觉不适立即停止','组间休息要充分'],totalTime:'约25-30分钟'},
        'longjump':{focus:'下肢爆发力和起跳技术',warmup:['慢跑200米','踝关节绕环','弓步走20米','原地纵跳10次'],exercises:[{name:'深蹲跳',desc:'深蹲后全力向上跳起，落地屈膝缓冲。',reps:'10次',sets:'3组',rest:'1分钟'},{name:'立定跳远完整练习',desc:'按标准动作进行完整练习。',reps:'5次',sets:'3组',rest:'2分钟'},{name:'台阶跳',desc:'从低处跳下后立即向前跳出。',reps:'6次',sets:'3组',rest:'1.5分钟'}],cooldown:['慢走放松','大腿前侧拉伸（每侧30秒）','小腿拉伸（每侧20秒）'],warnings:['确保落地面平整安全','落地时注意屈膝缓冲','膝关节有伤病减少跳跃量'],totalTime:'约25-30分钟'},
        'shotput':{focus:'上肢力量和全身协调用力',warmup:['慢跑200米','肩关节绕环','扩胸运动20次','腰部转体20次'],exercises:[{name:'俯卧撑',desc:'标准俯卧撑增强上肢推力。',reps:'10-15次',sets:'3组',rest:'1分钟'},{name:'实心球完整投掷',desc:'按标准动作进行完整投掷练习。',reps:'8-10次',sets:'3组',rest:'2分钟'},{name:'仰卧起坐',desc:'增强腰腹力量。',reps:'20次',sets:'3组',rest:'45秒'}],cooldown:['慢走放松','肩部拉伸','手臂拉伸','腰部转体放松'],warnings:['投掷前确认前方安全','充分活动肩关节','肩部不适时立即停止'],totalTime:'约25-30分钟'},
        'rope':{focus:'协调性和持续跳绳能力',warmup:['原地小跳30秒','踝关节绕环','手腕绕环','开合跳20次'],exercises:[{name:'匀速跳绳',desc:'保持匀速节奏连续跳绳。',reps:'1分钟',sets:'3组',rest:'1分钟'},{name:'快速跳绳冲刺',desc:'以最快速度跳绳。',reps:'30秒',sets:'4组',rest:'45秒'},{name:'交替脚跳绳',desc:'左右脚交替跳提高协调性。',reps:'1分钟',sets:'2组',rest:'1分钟'}],cooldown:['慢走放松','小腿拉伸（每侧30秒）','踝关节拉伸'],warnings:['选择平整地面','穿运动鞋保护踝关节','绊绳后调整呼吸继续'],totalTime:'约20-25分钟'},
        'pullup':{focus:'上肢拉力和背部力量',warmup:['慢跑200米','肩关节绕环','扩胸运动20次','悬垂静止10秒'],exercises:[{name:'静止悬垂',desc:'双手正握单杠自然悬垂。',reps:'15-30秒',sets:'3组',rest:'1分钟'},{name:'辅助引体向上',desc:'用弹力带辅助完成引体向上。',reps:'5-8次',sets:'3组',rest:'2分钟'},{name:'离心引体',desc:'跳起至最高点后缓慢下降。',reps:'5次',sets:'3组',rest:'1.5分钟'}],cooldown:['悬垂放松30秒','手臂拉伸','肩部拉伸'],warnings:['确保单杠稳固','手滑时及时休息','不要勉强超出能力'],totalTime:'约20-25分钟'},
        'situp':{focus:'腰腹力量和持续发力能力',warmup:['慢跑200米','腰部转体20次','猫式伸展10次','平板支撑20秒'],exercises:[{name:'仰卧起坐',desc:'标准仰卧起坐，手放耳侧。',reps:'15-20次',sets:'3组',rest:'1分钟'},{name:'平板支撑',desc:'身体成一条直线保持核心收紧。',reps:'30-45秒',sets:'3组',rest:'45秒'},{name:'仰卧举腿',desc:'仰卧双腿伸直抬起至90度。',reps:'12次',sets:'3组',rest:'1分钟'}],cooldown:['仰卧抱膝放松','猫式伸展10次','婴儿式放松1分钟'],warnings:['不要用手拉头部','在软垫上练习','腰部疼痛时立即停止'],totalTime:'约20-25分钟'},
        '1000m':{focus:'有氧耐力和配速能力',warmup:['慢跑400米','动态拉伸','加速跑20米×2次'],exercises:[{name:'匀速跑800米',desc:'以能说话但不能唱歌的速度匀速跑。',reps:'1次',sets:'2组',rest:'3分钟'},{name:'400米间歇跑',desc:'以较快但可持续的速度跑400米。',reps:'1次',sets:'3组',rest:'2-3分钟'},{name:'最后200米冲刺',desc:'先慢跑200米，最后200米全力冲刺。',reps:'1次',sets:'2组',rest:'3分钟'}],cooldown:['慢走400米','腿部全面拉伸','深呼吸放松'],warnings:['胸闷头晕立即减速停止','有心脏疾病史请遵医嘱','循序渐进不要突然增加量'],totalTime:'约30-35分钟'},
        '800m':{focus:'有氧耐力和配速能力',warmup:['慢跑400米','动态拉伸','加速跑20米×2次'],exercises:[{name:'匀速跑600米',desc:'以可持续的速度匀速跑。',reps:'1次',sets:'2组',rest:'3分钟'},{name:'300米间歇跑',desc:'以较快但可持续的速度跑300米。',reps:'1次',sets:'3组',rest:'2分钟'},{name:'最后200米冲刺',desc:'先慢跑，最后200米全力冲刺。',reps:'1次',sets:'2组',rest:'3分钟'}],cooldown:['慢走400米','腿部全面拉伸','深呼吸放松'],warnings:['出现不适立即停止','循序渐进增加训练量','训练前后适量补水'],totalTime:'约25-30分钟'}
    };
    return P[key] || P['50m'];
}

// ===== Assessment Form =====
function updateGenderFields() {
    const g = document.getElementById('f_gender').value;
    document.getElementById('f_pullup_wrap').style.display = g==='male'?'':'none';
    document.getElementById('f_situp_wrap').style.display = g==='female'?'':'none';
    document.getElementById('f_1000m_wrap').style.display = g==='male'?'':'none';
    document.getElementById('f_800m_wrap').style.display = g==='female'?'':'none';
}
function submitAssessment(isDemo) {
    const errDiv = document.getElementById('formError');
    errDiv.classList.add('hidden');
    const d = {
        nickname: document.getElementById('f_nickname').value||'同学',
        grade: document.getElementById('f_grade').value,
        gender: document.getElementById('f_gender').value,
        age: document.getElementById('f_age').value,
        height: parseFloat(document.getElementById('f_height').value),
        weight: parseFloat(document.getElementById('f_weight').value),
        exerciseFreq: document.getElementById('f_exerciseFreq').value,
        exerciseDur: document.getElementById('f_exerciseDur').value,
        improve: document.getElementById('f_improve').value,
        scores: {}
    };
    const errs = [];
    if (!d.grade) errs.push('请选择年级');
    if (!d.gender) errs.push('请选择性别');
    if (!d.age) errs.push('请填写年龄');
    if (!d.height||d.height<100||d.height>220) errs.push('请填写有效身高（100-220厘米）');
    if (!d.weight||d.weight<25||d.weight>120) errs.push('请填写有效体重（25-120千克）');
    if (errs.length>0&&!isDemo) { errDiv.innerHTML='⚠️ '+errs.join('；'); errDiv.classList.remove('hidden'); return; }
    const v50=parseFloat(document.getElementById('f_50m').value),vL=parseFloat(document.getElementById('f_longjump').value),vS=parseFloat(document.getElementById('f_shotput').value),vR=parseFloat(document.getElementById('f_rope').value),vP=parseFloat(document.getElementById('f_pullup').value),vSi=parseFloat(document.getElementById('f_situp').value),v1k=(parseFloat(document.getElementById('f_1000m_min').value||0))*60+parseFloat(document.getElementById('f_1000m_sec').value||0),v8=(parseFloat(document.getElementById('f_800m_min').value||0))*60+parseFloat(document.getElementById('f_800m_sec').value||0);
    if(v50)d.scores['50m']=v50; if(vL)d.scores['longjump']=vL; if(vS)d.scores['shotput']=vS; if(vR)d.scores['rope']=vR;
    if(vP&&d.gender==='male')d.scores['pullup']=vP; if(vSi&&d.gender==='female')d.scores['situp']=vSi;
    if(v1k>0&&d.gender==='male')d.scores['1000m']=v1k; if(v8>0&&d.gender==='female')d.scores['800m']=v8;
    if(Object.keys(d.scores).length===0&&!isDemo){errDiv.innerHTML='⚠️ 请至少填写一项体育成绩';errDiv.classList.remove('hidden');return;}
    studentData=d; assessmentResult=analyzeStudent(d); showView('results');
}
function loadDemoData() {
    const f=document.getElementById('f_nickname'); f.value=demoData.nickname;
    document.getElementById('f_grade').value=demoData.grade;
    document.getElementById('f_gender').value=demoData.gender;
    document.getElementById('f_age').value=demoData.age;
    document.getElementById('f_height').value=demoData.height;
    document.getElementById('f_weight').value=demoData.weight;
    document.getElementById('f_exerciseFreq').value=demoData.exerciseFreq;
    document.getElementById('f_exerciseDur').value=demoData.exerciseDur;
    document.getElementById('f_improve').value=demoData.improve;
    document.getElementById('f_50m').value=demoData.scores['50m'];
    document.getElementById('f_longjump').value=demoData.scores['longjump'];
    document.getElementById('f_shotput').value=demoData.scores['shotput'];
    document.getElementById('f_rope').value=demoData.scores['rope'];
    document.getElementById('f_pullup').value=demoData.scores['pullup'];
    document.getElementById('f_1000m_min').value=Math.floor(demoData.scores['1000m']/60);
    document.getElementById('f_1000m_sec').value=demoData.scores['1000m']%60;
    updateGenderFields();
}
function startDemoExperience() { loadDemoData(); submitAssessment(true); }
function resetAssessment() { studentData=null; assessmentResult=null; document.getElementById('assessmentForm').reset(); updateGenderFields(); showView('assessment'); }

// ===== Analysis Engine =====
function analyzeStudent(data) {
    const r = {student:data,bmi:{},scores:{},abilities:{},profileSummary:{},recommendation:{}};
    const hm=data.height/100, bmi=data.weight/(hm*hm);
    r.bmi.value=Math.round(bmi*10)/10;
    if(bmi<18.5){r.bmi.category='偏瘦';r.bmi.color='#3b82f6';r.bmi.advice='体重偏轻，建议适当增加营养摄入，配合力量训练增加肌肉量。';}
    else if(bmi<24){r.bmi.category='正常';r.bmi.color='#10b981';r.bmi.advice='体重在正常范围内，保持良好的饮食和运动习惯！';}
    else if(bmi<28){r.bmi.category='偏胖';r.bmi.color='#f59e0b';r.bmi.advice='体重略偏高，建议增加有氧运动，合理控制饮食。';}
    else{r.bmi.category='肥胖';r.bmi.color='#ef4444';r.bmi.advice='建议增加日常运动量，调整饮食结构，必要时请家长陪同咨询专业人员。';}
    const gs=data.gender==='male'?'male':'female';
    Object.entries(data.scores).forEach(([k,v])=>{
        const std=scoringStandards[k]; if(!std)return;
        const th=std[gs]?.[data.grade]||std[gs]?.['9']||[];
        let grade='待提高',gc='poor';
        if(th.length>0){if(std.lowerBetter){if(v<=th[0][0]){grade='优秀';gc='excellent';}else if(v<=th[1][0]){grade='良好';gc='good';}else if(v<=th[2][0]){grade='及格';gc='fair';}}else{if(v>=th[0][0]){grade='优秀';gc='excellent';}else if(v>=th[1][0]){grade='良好';gc='good';}else if(v>=th[2][0]){grade='及格';gc='fair';}}}
        r.scores[k]={value:v,unit:std.unit,grade,gradeClass:gc,sportName:sportsData[k]?.name||k};
    });
    const ab={speed:50,endurance:50,strength:50,explosiveness:50,coordination:50};
    const gv=g=>g==='优秀'?95:g==='良好'?80:g==='及格'?65:45;
    if(r.scores['50m'])ab.speed=gv(r.scores['50m'].grade);
    const ek=data.gender==='male'?'1000m':'800m';
    if(r.scores[ek])ab.endurance=gv(r.scores[ek].grade);
    const sv=[];['pullup','situp','shotput'].forEach(k=>{if(r.scores[k])sv.push(gv(r.scores[k].grade));});
    if(sv.length)ab.strength=Math.round(sv.reduce((a,b)=>a+b,0)/sv.length);
    if(r.scores['longjump'])ab.explosiveness=gv(r.scores['longjump'].grade);
    if(r.scores['rope'])ab.coordination=gv(r.scores['rope'].grade);
    r.abilities=ab;
    const sorted=Object.entries(ab).sort((a,b)=>b[1]-a[1]);
    const an={speed:'速度',endurance:'耐力',strength:'力量',explosiveness:'爆发力',coordination:'协调性'};
    const avg=Math.round(sorted.reduce((a,b)=>a+b[1],0)/sorted.length);
    r.profileSummary={best:an[sorted[0][0]],worst:an[sorted[sorted.length-1][0]],bestScore:sorted[0][1],worstScore:sorted[sorted.length-1][1],avg,level:avg>=85?'优秀':avg>=70?'良好':avg>=55?'及格':'待提高'};
    const se=Object.entries(r.scores).sort((a,b)=>({'优秀':4,'良好':3,'及格':2,'待提高':1})[b[1].grade]-({'优秀':4,'良好':3,'及格':2,'待提高':1})[a[1].grade]);
    r.profileSummary.bestSport=se.length?se[0][1].sportName:'--';
    r.profileSummary.worstSport=se.length?se[se.length-1][1].sportName:'--';
    r.recommendation=genRecommendation(data,r);
    return r;
}
function genRecommendation(data,r){
    const rec={primary:'',alternatives:[],reasons:[],strengths:[],weaknesses:[],suggestions:[]};
    const es=Object.entries(r.scores).map(([k,v])=>({key:k,name:v.sportName,score:v.grade==='优秀'?4:v.grade==='良好'?3:v.grade==='及格'?2:1,grade:v.grade})).sort((a,b)=>b.score-a.score);
    if(es.length>0){rec.primary=es[0].name;rec.alternatives=es.slice(1,3).map(e=>e.name);}
    es.filter(e=>e.score>=3).forEach(e=>rec.strengths.push(e.name+'成绩'+e.grade));
    es.filter(e=>e.score<=2).forEach(e=>rec.weaknesses.push(e.name+'还有提升空间'));
    if(rec.primary)rec.reasons.push('你的'+rec.primary+'成绩在所有项目中表现最为突出');
    if(data.improve)rec.reasons.push('你希望提高的'+data.improve+'可以通过针对性训练来提升');
    es.filter(e=>e.score<=2).forEach(e=>rec.suggestions.push('建议重点加强'+e.name+'的训练，每周练习3-4次'));
    if(!rec.suggestions.length)rec.suggestions.push('你的各项成绩都不错，继续保持并争取更大突破！');
    return rec;
}

// ===== Render Results =====
function renderResults() {
    if(!assessmentResult)return;
    const r=assessmentResult;
    document.getElementById('bmiValue').textContent=r.bmi.value;
    document.getElementById('bmiValue').style.color=r.bmi.color;
    document.getElementById('bmiCategory').textContent=r.bmi.category;
    document.getElementById('bmiCategory').style.color=r.bmi.color;
    document.getElementById('bmiAdvice').textContent=r.bmi.advice;
    document.getElementById('scoreAnalysisContent').innerHTML=Object.entries(r.scores).map(([k,s])=>`<div class="score-item ${s.gradeClass}"><div class="flex justify-between items-center mb-2"><span class="font-semibold text-gray-800">${s.sportName}</span><span class="grade-badge grade-${s.gradeClass}">${s.grade}</span></div><div class="text-sm text-gray-600">成绩：<span class="font-bold text-lg">${s.value}</span> ${s.unit}</div><div class="text-xs text-gray-500 mt-1">${getScoreComment(k,s)}</div></div>`).join('');
    renderRadarChart(r.abilities);
    const ps=r.profileSummary;
    document.getElementById('profileSummary').innerHTML=`<div class="space-y-3"><div class="flex items-center gap-2"><span class="text-2xl font-bold text-primary-600">${ps.avg}</span><span class="text-sm text-gray-500">综合运动水平：${ps.level}</span></div><div class="grid grid-cols-2 gap-2 text-sm"><div class="bg-green-50 rounded-lg p-2"><div class="text-green-600 font-medium">🏆 最强能力</div><div class="text-gray-700">${ps.best}（${ps.bestScore}分）</div></div><div class="bg-orange-50 rounded-lg p-2"><div class="text-orange-600 font-medium">📈 需提升</div><div class="text-gray-700">${ps.worst}（${ps.worstScore}分）</div></div><div class="bg-blue-50 rounded-lg p-2"><div class="text-blue-600 font-medium">💪 优势项目</div><div class="text-gray-700">${ps.bestSport}</div></div><div class="bg-red-50 rounded-lg p-2"><div class="text-red-600 font-medium">🎯 薄弱项目</div><div class="text-gray-700">${ps.worstSport}</div></div></div><p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">📝 你的综合运动能力评分为${ps.avg}分，属于${ps.level}水平。最强能力是${ps.best}，优势项目是${ps.bestSport}。建议重点加强${ps.worst}，薄弱项目${ps.worstSport}还有较大提升空间。坚持科学训练，你一定可以取得进步！</p></div>`;
    const rec=r.recommendation;
    const recHtml=`<div class="space-y-3"><div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4"><div class="text-sm text-gray-500 mb-1">🏆 首选推荐项目</div><div class="text-xl font-bold text-primary-600">${rec.primary||'--'}</div></div>${rec.alternatives.length?`<div class="bg-gray-50 rounded-xl p-4"><div class="text-sm text-gray-500 mb-1">📋 备选推荐</div><div class="flex gap-2 flex-wrap">${rec.alternatives.map(a=>`<span class="bg-white border rounded-full px-3 py-1 text-sm">${a}</span>`).join('')}</div></div>`:''}${rec.strengths.length?`<div class="bg-green-50 rounded-xl p-4"><div class="text-sm text-green-600 font-medium mb-1">✅ 当前优势</div><ul class="text-sm text-gray-600 space-y-1">${rec.strengths.map(s=>`<li>• ${s}</li>`).join('')}</ul></div>`:''}${rec.weaknesses.length?`<div class="bg-orange-50 rounded-xl p-4"><div class="text-sm text-orange-600 font-medium mb-1">📈 需要提高</div><ul class="text-sm text-gray-600 space-y-1">${rec.weaknesses.map(w=>`<li>• ${w}</li>`).join('')}</ul></div>`:''}<div class="bg-blue-50 rounded-xl p-4"><div class="text-sm text-blue-600 font-medium mb-1">💡 训练建议</div><ul class="text-sm text-gray-600 space-y-1">${rec.suggestions.map(s=>`<li>• ${s}</li>`).join('')}</ul></div></div>`;
    document.getElementById('recommendationContent').innerHTML=recHtml;
    document.getElementById('standaloneRecommendation').innerHTML=recHtml;
}
function getScoreComment(k,s){
    const c={'excellent':{'50m':'速度素质出色！','longjump':'爆发力很强！','shotput':'上肢力量优秀！','rope':'协调性很棒！','pullup':'上肢拉力出色！','situp':'腰腹力量优秀！','1000m':'耐力素质出色！','800m':'耐力素质出色！'},'good':{'50m':'速度不错，继续加油！','longjump':'爆发力良好，还有提升空间。','shotput':'力量不错！','rope':'协调性良好！','pullup':'拉力不错！','situp':'腰腹力量不错！','1000m':'耐力良好！','800m':'耐力良好！'},'fair':{'50m':'速度还可以，建议加强爆发力。','longjump':'基本达标，建议加强下肢力量。','shotput':'基本达标，建议加强上肢力量。','rope':'基本达标，多练习节奏感。','pullup':'基本达标，加强拉力训练。','situp':'基本达标，加强核心力量。','1000m':'基本达标，增加耐力训练。','800m':'基本达标，增加耐力训练。'},'poor':{'50m':'还有提升空间，建议重点练习起跑和加速。','longjump':'建议重点加强下肢爆发力训练。','shotput':'建议加强上肢和腰腹力量训练。','rope':'建议每天坚持练习跳绳。','pullup':'建议从悬垂和辅助引体开始。','situp':'建议每天练习仰卧起坐。','1000m':'建议增加跑步训练，循序渐进。','800m':'建议增加跑步训练，循序渐进。'}};
    return c[s.gradeClass]?.[k]||'';
}
function renderRadarChart(ab){
    const c=document.getElementById('radarChart'); if(!c)return;
    if(radarChartInstance)radarChartInstance.destroy();
    radarChartInstance=new Chart(c,{type:'radar',data:{labels:['速度','耐力','力量','爆发力','协调性'],datasets:[{label:'运动能力',data:[ab.speed,ab.endurance,ab.strength,ab.explosiveness,ab.coordination],backgroundColor:'rgba(59,130,246,0.15)',borderColor:'#3b82f6',borderWidth:2,pointBackgroundColor:'#3b82f6',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5}]},options:{responsive:true,scales:{r:{beginAtZero:true,max:100,min:0,ticks:{stepSize:20,font:{size:10},backdropColor:'transparent'},grid:{color:'#e5e7eb'},angleLines:{color:'#e5e7eb'},pointLabels:{font:{size:13,weight:'600'},color:'#374151'}}},plugins:{legend:{display:false}}}});
}

// ===== Training Plan =====
function generateTrainingPlan() {
    if(!assessmentResult){alert('请先完成体质测评');showView('assessment');return;}
    currentPlanWeeks=1; showView('training'); renderTrainingPlan();
}
function switchPlan(w){currentPlanWeeks=w;document.querySelectorAll('.plan-tab').forEach(t=>t.classList.toggle('active',parseInt(t.dataset.plan)===w));renderTrainingPlan();}
function renderTrainingPlan(){
    const r=assessmentResult, d=r.student;
    const rankedSports=Object.entries(r.items).sort((a,b)=>a[1].ratio-b[1].ratio).map(([key])=>key);
    const targetSports=rankedSports.slice(0,2);
    const plan=buildPlanData(targetSports,currentPlanWeeks,d);
    document.getElementById('trainingPlanContent').innerHTML=`
        <div class="result-card mb-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
                <div class="bg-blue-50 rounded-lg p-3"><div class="text-blue-600 font-bold text-lg">${currentPlanWeeks}周</div><div class="text-gray-500">训练周期</div></div>
                <div class="bg-green-50 rounded-lg p-3"><div class="text-green-600 font-bold text-lg">${currentPlanWeeks<=1?'3-4':currentPlanWeeks<=2?'4-5':'5-6'}次</div><div class="text-gray-500">每周训练</div></div>
                <div class="bg-orange-50 rounded-lg p-3"><div class="text-orange-600 font-bold text-lg">30-45</div><div class="text-gray-500">每次分钟</div></div>
                <div class="bg-purple-50 rounded-lg p-3"><div class="text-purple-600 font-bold text-lg">${targetSports.map(k=>sportsData[k]?.name||k).join('、')}</div><div class="text-gray-500">重点提升</div></div>
            </div>
        </div>
        <div class="space-y-3">${plan.days.map(day=>`
            <div class="day-card">
                <div class="day-card-header"><span class="day-number">第${day.day}天</span><span class="day-goal">${day.goal}</span></div>
                <div class="space-y-2">${day.items.map(item=>`
                    <div class="flex items-start gap-2 text-sm">
                        <span class="text-primary-500 mt-0.5">●</span>
                        <div class="flex-1"><span class="font-medium text-gray-800">${item.name}</span><span class="text-gray-500 ml-2">${item.detail}</span></div>
                    </div>`).join('')}
                </div>
                <div class="mt-2 text-xs text-gray-400">⏱️ 预计${day.time} | ⚠️ ${day.note}</div>
            </div>`).join('')}
        </div>
        <div class="result-card mt-4 bg-yellow-50 border border-yellow-200">
            <h3 class="font-bold text-yellow-800 mb-2">🛡️ 安全注意事项</h3>
            <ul class="text-sm text-yellow-700 space-y-1">
                <li>• 每次训练前必须做5-10分钟热身</li>
                <li>• 训练后做5分钟拉伸放松</li>
                <li>• 出现疼痛、头晕或身体不适时立即停止训练</li>
                <li>• 训练强度要循序渐进，不要急于求成</li>
                <li>• 保证充足睡眠和营养摄入</li>
            </ul>
        </div>`;
}
function buildPlanData(targetSports,weeks,data){
    const daysPerWeek=weeks<=1?3:weeks<=2?4:5;
    const totalDays=weeks*daysPerWeek;
    const days=[];
    const sportNames=targetSports.map(k=>sportsData[k]?.name||k);
    for(let i=1;i<=Math.min(totalDays,weeks<=1?3:weeks<=2?4:5);i++){
        const items=[];
        items.push({name:'热身',detail:'慢跑200米+动态拉伸 5分钟'});
        if(i%2===1){
            targetSports.forEach(k=>{
                const s=sportsData[k]; if(!s)return;
                items.push({name:s.name+'专项训练',detail:getTrainingDetail(k,'main')});
            });
            items.push({name:'体能训练',detail:getTrainingDetail(targetSports[0]||'50m','fitness')});
        }else{
            items.push({name:'耐力训练',detail:'匀速跑800-1000米（根据体力调整）'});
            targetSports.forEach(k=>{
                const s=sportsData[k]; if(!s)return;
                items.push({name:s.name+'技术练习',detail:getTrainingDetail(k,'tech')});
            });
        }
        items.push({name:'拉伸放松',detail:'全身拉伸 5分钟'});
        const dayGoal=i%2===1?'重点提升'+sportNames.join('和'):'技术巩固与耐力提升';
        days.push({day:i,goal:dayGoal,items,time:i%2===1?'35-40分钟':'30-35分钟',note:'训练前充分热身，感觉不适立即停止'});
    }
    if(weeks>1){
        for(let w=2;w<=weeks;w++){
            days.push({day:`${(w-1)*daysPerWeek+1}-${w*daysPerWeek}`,goal:`第${w}周：在上周基础上增加训练量`,items:[{name:'训练安排',detail:`参照第1周训练内容，每项训练增加1-2组或增加10%训练量`}],time:'35-45分钟',note:'循序渐进，不要突然增加大量训练'});
        }
    }
    return {days};
}
function getTrainingDetail(sport,type){
    const details={
        '50m':{main:'30米加速跑×4组，组间休息2分钟',tech:'起跑姿势练习+摆臂练习',fitness:'高抬腿30秒×3组+开合跳20次×3组'},
        'longjump':{main:'立定跳远完整练习×8次，注意起跳和收腿',tech:'原地纵跳练习+起跳角度练习',fitness:'深蹲跳10次×3组+蛙跳10米×3组'},
        'shotput':{main:'实心球投掷×10次，体会全身协调用力',tech:'徒手模仿投掷动作+对墙投掷',fitness:'俯卧撑12次×3组+仰卧起坐20次×3组'},
        'rope':{main:'匀速跳绳1分钟×3组+快速跳绳30秒×4组',tech:'交替脚跳绳练习+节奏控制练习',fitness:'原地小跳1分钟+开合跳30次'},
        'pullup':{main:'辅助引体向上×6次×3组+静止悬垂30秒×3组',tech:'离心引体（慢速下降）×5次×3组',fitness:'弹力带划船12次×3组'},
        'situp':{main:'仰卧起坐20次×3组+平板支撑30秒×3组',tech:'仰卧举腿12次×3组',fitness:'平板支撑45秒×3组+俄罗斯转体15次×3组'},
        '1000m':{main:'匀速跑800米×2组，组间休息3分钟',tech:'400米间歇跑×3组，组间休息2分钟',fitness:'最后200米冲刺练习×2组'},
        '800m':{main:'匀速跑600米×2组，组间休息3分钟',tech:'300米间歇跑×3组，组间休息2分钟',fitness:'最后200米冲刺练习×2组'}
    };
    return details[sport]?.[type]||'专项练习';
}

// ===== Homework =====
function generateHomework(){
    if(!assessmentResult){alert('请先完成体质测评');showView('assessment');return;}
    showView('homework');
    const r=assessmentResult;
    const weakSports=Object.entries(r.scores).filter(([k,v])=>v.gradeClass==='poor'||v.gradeClass==='fair').map(([k])=>k);
    const focusSport=weakSports[0]||Object.keys(r.scores)[0]||'50m';
    const sportName=sportsData[focusSport]?.name||focusSport;
    document.getElementById('homeworkContent').innerHTML=`
        <div class="homework-card">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-gray-800">📅 今日家庭体育作业</h3>
                <span class="text-sm text-gray-500">重点：${sportName}</span>
            </div>
            <div class="bg-blue-50 rounded-xl p-3 mb-4">
                <div class="text-sm font-medium text-blue-700">🎯 今日训练目标</div>
                <div class="text-sm text-gray-600 mt-1">加强${sportName}相关能力，提高${r.profileSummary.worst}素质</div>
            </div>
            <div class="space-y-3 mb-4">
                <div class="bg-gray-50 rounded-xl p-4">
                    <div class="font-semibold text-gray-800 mb-1">1. 热身活动</div>
                    <p class="text-sm text-gray-600">原地慢跑2分钟 + 关节绕环 + 动态拉伸</p>
                    <div class="text-xs text-gray-400 mt-1">预计用时：5分钟 | 器材：无</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <div class="font-semibold text-gray-800 mb-1">2. ${getHomeworkExercise1(focusSport)}</div>
                    <p class="text-sm text-gray-600">${getHomeworkDesc1(focusSport)}</p>
                    <div class="text-xs text-gray-400 mt-1">预计用时：10分钟 | 器材：${getHomeworkEquip1(focusSport)}</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <div class="font-semibold text-gray-800 mb-1">3. ${getHomeworkExercise2(focusSport)}</div>
                    <p class="text-sm text-gray-600">${getHomeworkDesc2(focusSport)}</p>
                    <div class="text-xs text-gray-400 mt-1">预计用时：8分钟 | 器材：${getHomeworkEquip2(focusSport)}</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <div class="font-semibold text-gray-800 mb-1">4. 拉伸放松</div>
                    <p class="text-sm text-gray-600">全身各部位拉伸，每个动作保持20-30秒</p>
                    <div class="text-xs text-gray-400 mt-1">预计用时：5分钟 | 器材：无</div>
                </div>
            </div>
            <div class="bg-red-50 rounded-xl p-3 mb-4">
                <div class="text-sm text-red-600 font-medium">⚠️ 安全提醒</div>
                <ul class="text-sm text-red-500 mt-1 space-y-1">
                    <li>• 训练前请家长确认场地安全</li>
                    <li>• 出现疼痛、头晕或身体不适时立即停止</li>
                    <li>• 训练后适量补水，不要立即大量饮水</li>
                </ul>
            </div>
            <div class="border-t pt-4">
                <div class="text-sm font-medium text-gray-700 mb-3">📋 训练打卡</div>
                <div class="flex gap-2 mb-4 flex-wrap" id="checkinBtns">
                    <button class="checkin-btn" onclick="selectCheckin(this,'completed')">✅ 已完成</button>
                    <button class="checkin-btn" onclick="selectCheckin(this,'partial')">🔶 部分完成</button>
                    <button class="checkin-btn" onclick="selectCheckin(this,'notdone')">❌ 未完成</button>
                </div>
                <div class="text-sm font-medium text-gray-700 mb-3">💭 训练感受</div>
                <div class="flex gap-2 flex-wrap mb-3" id="feelingBtns">
                    <button class="feeling-btn" onclick="selectFeeling(this,'easy')">😊 轻松</button>
                    <button class="feeling-btn" onclick="selectFeeling(this,'medium')">🙂 适中</button>
                    <button class="feeling-btn" onclick="selectFeeling(this,'hard')">😓 有点困难</button>
                    <button class="feeling-btn" onclick="selectFeeling(this,'unwell')">😰 身体不适</button>
                </div>
                <div id="unwellWarning" class="hidden bg-red-100 border border-red-300 rounded-xl p-4 text-red-700 text-sm font-medium">
                    ⚠️ 请立即停止训练，及时休息，并告知家长。必要时向医生或专业人员咨询。
                </div>
                <div id="checkinResult" class="hidden mt-3 bg-green-50 rounded-xl p-3 text-green-700 text-sm">
                    ✅ 打卡成功！坚持每天锻炼，你会越来越棒！
                </div>
            </div>
        </div>`;
}
function getHomeworkExercise1(k){const m={'50m':'高抬腿练习','longjump':'深蹲跳','shotput':'俯卧撑','rope':'跳绳练习','pullup':'悬垂练习','situp':'仰卧起坐','1000m':'慢跑练习','800m':'慢跑练习'};return m[k]||'专项练习';}
function getHomeworkDesc1(k){const m={'50m':'快速原地高抬腿，30秒×4组，组间休息30秒','longjump':'深蹲后全力跳起，10次×3组，组间休息1分钟','shotput':'标准俯卧撑，10次×3组，组间休息1分钟','rope':'匀速连续跳绳，1分钟×3组，组间休息1分钟','pullup':'双手正握单杠静止悬垂，20秒×3组','situp':'标准仰卧起坐，15次×3组，组间休息1分钟','1000m':'匀速慢跑800米，保持能说话的配速','800m':'匀速慢跑600米，保持能说话的配速'};return m[k]||'专项练习说明';}
function getHomeworkEquip1(k){const m={'50m':'无','longjump':'无','shotput':'无','rope':'跳绳','pullup':'单杠','situp':'瑜伽垫','1000m':'无','800m':'无'};return m[k]||'无';}
function getHomeworkExercise2(k){const m={'50m':'开合跳','longjump':'弓步跳','shotput':'仰卧起坐','rope':'交替脚跳绳','pullup':'弹力带划船','situp':'平板支撑','1000m':'快走放松','800m':'快走放松'};return m[k]||'辅助练习';}
function getHomeworkDesc2(k){const m={'50m':'开合跳20次×3组，组间休息30秒','longjump':'交替弓步跳，每侧8次×3组','shotput':'仰卧起坐20次×3组，增强核心力量','rope':'左右脚交替跳绳，1分钟×2组','pullup':'弹力带辅助划船，12次×3组','situp':'平板支撑30秒×3组，组间休息30秒','1000m':'快走后放松，调整呼吸','800m':'快走后放松，调整呼吸'};return m[k]||'辅助练习说明';}
function getHomeworkEquip2(k){const m={'50m':'无','longjump':'无','shotput':'瑜伽垫','rope':'跳绳','pullup':'弹力带','situp':'瑜伽垫','1000m':'无','800m':'无'};return m[k]||'无';}
function selectCheckin(btn,status){document.querySelectorAll('#checkinBtns .checkin-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');document.getElementById('checkinResult').classList.remove('hidden');}
function selectFeeling(btn,feeling){document.querySelectorAll('#feelingBtns .feeling-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');document.getElementById('unwellWarning').classList.toggle('hidden',feeling!=='unwell');}

// ===== AI Coach Chat =====
async function sendChat(){
    const input=document.getElementById('chatInput');
    const msg=input.value.trim(); if(!msg)return;
    input.value='';
    const chatDiv=document.getElementById('chatMessages');
    chatDiv.innerHTML+=`<div class="chat-msg user"><div class="chat-avatar">🧑</div><div class="chat-bubble">${escapeHtml(msg)}</div></div>`;
    chatDiv.innerHTML+=`<div class="chat-msg ai" id="typingMsg"><div class="chat-avatar">🤖</div><div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div></div>`;
    chatDiv.scrollTop=chatDiv.scrollHeight;
    try{
        const resp=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,history:chatHistory})});
        const data=await resp.json();
        document.getElementById('typingMsg')?.remove();
        const reply=data.reply||'抱歉，我暂时无法回答这个问题。请稍后再试。';
        chatHistory.push({role:'user',content:msg},{role:'assistant',content:reply});
        if(chatHistory.length>20)chatHistory=chatHistory.slice(-20);
        chatDiv.innerHTML+=`<div class="chat-msg ai"><div class="chat-avatar">🤖</div><div class="chat-bubble">${formatChatReply(reply)}</div></div>`;
    }catch(e){
        document.getElementById('typingMsg')?.remove();
        chatDiv.innerHTML+=`<div class="chat-msg ai"><div class="chat-avatar">🤖</div><div class="chat-bubble text-red-500">网络异常，请稍后再试。</div></div>`;
    }
    chatDiv.scrollTop=chatDiv.scrollHeight;
}
function escapeHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function formatChatReply(t){return escapeHtml(t).replace(/\n/g,'<br>');}

// ===== Full Report =====
function showFullReport(){
    if(!assessmentResult)return;
    showView('report');
    const r=assessmentResult,d=r.student;
    document.getElementById('fullReportContent').innerHTML=`
        <div class="result-card mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">👤 基本信息</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">昵称</span><div class="font-medium">${d.nickname}</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">年级</span><div class="font-medium">${d.grade}年级</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">性别</span><div class="font-medium">${d.gender==='male'?'男':'女'}</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">年龄</span><div class="font-medium">${d.age}岁</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">身高</span><div class="font-medium">${d.height}cm</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">体重</span><div class="font-medium">${d.weight}kg</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">BMI</span><div class="font-medium" style="color:${r.bmi.color}">${r.bmi.value}（${r.bmi.category}）</div></div>
                <div class="bg-gray-50 rounded-lg p-2"><span class="text-gray-500">运动频率</span><div class="font-medium">每周${d.exerciseFreq||'-'}次</div></div>
            </div>
        </div>
        <div class="result-card mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">🏅 各项目成绩</h3>
            <div class="space-y-2">${Object.entries(r.scores).map(([k,s])=>`<div class="flex justify-between items-center bg-gray-50 rounded-lg p-3"><span class="font-medium">${s.sportName}</span><div><span class="font-bold text-lg">${s.value}</span> <span class="text-gray-500 text-sm">${s.unit}</span> <span class="grade-badge grade-${s.gradeClass} ml-2">${s.grade}</span></div></div>`).join('')}</div>
        </div>
        <div class="result-card mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">🎯 运动能力画像</h3>
            <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="w-full md:w-1/2 max-w-[250px] mx-auto"><canvas id="reportRadar"></canvas></div>
                <div class="flex-1 text-sm">
                    <p>综合运动水平：<span class="font-bold text-primary-600">${r.profileSummary.level}（${r.profileSummary.avg}分）</span></p>
                    <p class="mt-1">最强能力：${r.profileSummary.best}（${r.profileSummary.bestScore}分）</p>
                    <p class="mt-1">需提升：${r.profileSummary.worst}（${r.profileSummary.worstScore}分）</p>
                    <p class="mt-1">优势项目：${r.profileSummary.bestSport}</p>
                    <p class="mt-1">薄弱项目：${r.profileSummary.worstSport}</p>
                </div>
            </div>
        </div>
        <div class="result-card mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">🏆 中考项目推荐</h3>
            <p>首选推荐：<span class="font-bold text-primary-600">${r.recommendation.primary}</span></p>
            ${r.recommendation.alternatives.length?`<p class="mt-1">备选：${r.recommendation.alternatives.join('、')}</p>`:''}
        </div>
        <div class="result-card mb-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">💡 训练建议</h3>
            <ul class="text-sm text-gray-600 space-y-1">${r.recommendation.suggestions.map(s=>`<li>• ${s}</li>`).join('')}</ul>
        </div>
        <div class="result-card bg-yellow-50 border border-yellow-200">
            <h3 class="font-bold text-yellow-800 mb-2">🛡️ 安全提示</h3>
            <ul class="text-sm text-yellow-700 space-y-1">
                <li>• 训练前充分热身，训练后拉伸放松</li>
                <li>• 出现疼痛、头晕、胸闷等不适时立即停止训练并告知家长</li>
                <li>• 训练强度循序渐进，不要急于求成</li>
                <li>• 保证充足睡眠和均衡营养</li>
            </ul>
        </div>`;
    setTimeout(()=>{const c=document.getElementById('reportRadar');if(c)new Chart(c,{type:'radar',data:{labels:['速度','耐力','力量','爆发力','协调性'],datasets:[{label:'运动能力',data:[r.abilities.speed,r.abilities.endurance,r.abilities.strength,r.abilities.explosiveness,r.abilities.coordination],backgroundColor:'rgba(59,130,246,0.15)',borderColor:'#3b82f6',borderWidth:2,pointBackgroundColor:'#3b82f6',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5}]},options:{responsive:true,scales:{r:{beginAtZero:true,max:100,min:0,ticks:{stepSize:20,font:{size:10},backdropColor:'transparent'},grid:{color:'#e5e7eb'},angleLines:{color:'#e5e7eb'},pointLabels:{font:{size:12,weight:'600'},color:'#374151'}}},plugins:{legend:{display:false}}}});},100);
}

/* ===== 南京中考测评、学生档案与历史记录（覆盖旧版演示逻辑） ===== */
const archiveDb={name:'tikaozhixun-assessment-v2',version:1,db:null};
let currentStudentId=localStorage.getItem('tikaozhixun-current-student')||'';
let archiveReady=false;
const videoMap={
  '50m':'/videos/50m-sprint.mp4',longjump:'/videos/standing-long-jump.mp4',shotput:'/videos/medicine-ball.mp4',rope:'/videos/three-minute-rope.mp4',
  '1000m':'/videos/boys-1000m.mp4','800m':'/videos/girls-800m.mp4',pullup:'/videos/pull-ups.mp4',situp:'/videos/one-minute-sit-ups.mp4',sitforward:'/videos/sit-and-reach.mp4'
};
sportsData.rope.name='3分钟跳绳'; sportsData.rope.desc='测试协调性与耐力的三分钟跳绳项目'; sportsData.rope.intro='3分钟跳绳测试协调性、节奏控制和持续耐力。';
sportsData.sitforward={name:'坐位体前屈',icon:'🤸‍♀️',color:'bg-indigo-100',desc:'测试柔韧性的体质测试项目',intro:'坐位体前屈用于了解腰背与腿后侧柔韧性，不计入南京中考体育总分。',phases:[{name:'准备',desc:'双腿伸直并拢，脚掌抵住测试板。'},{name:'前屈',desc:'双手平伸缓慢向前推，不要快速弹震。'}],keyPoints:['双腿保持伸直','动作匀速，不可猛压','以最远稳定位置读数'],mistakes:['屈膝借力','快速弹震','屏气憋劲'],corrections:['练习腘绳肌静态拉伸','缓慢呼气前屈','每次保持15—30秒'],tips:'每周进行3—5次柔韧训练，循序渐进。',safety:'腰背疼痛或急性拉伤时停止测试并咨询专业人员。'};
Object.entries(videoMap).forEach(([key,url])=>{if(sportsData[key])sportsData[key].videoUrl=url;});

function openArchiveDb(){return new Promise((resolve,reject)=>{if(archiveDb.db)return resolve(archiveDb.db);const r=indexedDB.open(archiveDb.name,archiveDb.version);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('students'))db.createObjectStore('students',{keyPath:'id'});if(!db.objectStoreNames.contains('assessments')){const s=db.createObjectStore('assessments',{keyPath:'id'});s.createIndex('studentId','studentId',{unique:false});}};r.onsuccess=()=>{archiveDb.db=r.result;resolve(r.result)};r.onerror=()=>reject(r.error);});}
async function archiveRequest(store,mode,fn){const db=await openArchiveDb();return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode),req=fn(tx.objectStore(store));req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
const uid=prefix=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function pauseLearningVideos(){document.querySelectorAll('video').forEach(v=>v.pause());}
function assessmentGenderKey(){return document.getElementById('f_gender')?.value||'';}
function updateGenderFields(){const g=assessmentGenderKey();['f_pullup_wrap','f_1000m_wrap'].forEach(id=>document.getElementById(id)?.classList.toggle('hidden',g!=='male'));['f_situp_wrap','f_800m_wrap'].forEach(id=>document.getElementById(id)?.classList.toggle('hidden',g!=='female'));}
let standaloneProfileChartInstance=null;
function showView(v){pauseLearningVideos();document.querySelectorAll('.view').forEach(el=>el.classList.add('hidden'));const target=document.getElementById('view-'+v);if(target){target.classList.remove('hidden');target.classList.add('fade-in');}window.scrollTo(0,0);if(v==='assessment')renderStudentToolbar();if(v==='results'&&assessmentResult)renderResults();if(v==='profile'&&assessmentResult)renderStandaloneProfile();if(v==='recommendation'&&assessmentResult)renderStandaloneRecommendation();if(v==='coach')setTimeout(()=>document.getElementById('chatInput')?.focus(),300);}
function navigateAfterData(destination){
    if(!assessmentResult){alert('请先完成测评。');showView('assessment');return;}
    if(destination==='training'){generateTrainingPlan();return;}
    if(destination==='homework'){generateHomework();return;}
    showView(destination);
}
function renderStandaloneProfile(){
    const r=assessmentResult,student=r.student,abilityNames={speed:'速度',endurance:'耐力',strength:'力量',explosiveness:'爆发力',coordination:'协调性',flexibility:'柔韧性'};
    const sorted=Object.entries(r.abilities).sort((a,b)=>b[1]-a[1]);
    document.getElementById('standaloneProfile').innerHTML=`<div class="result-card mb-4"><h3 class="font-bold mb-3">👤 ${safe(student.name)}的运动画像</h3><p class="text-sm text-gray-600">${safe(student.grade)}年级 · ${safe(student.className)} · ${student.gender==='male'?'男生':'女生'} · 身高 ${student.height}厘米 · 体重 ${student.weight}千克 · BMI ${r.bmi}</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="result-card"><h3 class="font-bold mb-2">🎯 运动能力雷达图</h3><p class="text-xs text-gray-500 mb-3">0—100 仅为图形比例，不是南京中考实际分数。</p><canvas id="standaloneRadarChart"></canvas></div><div class="result-card"><h3 class="font-bold mb-3">📊 能力分析</h3><div class="space-y-3">${sorted.map(([key,value])=>`<div><div class="flex justify-between text-sm"><span>${abilityNames[key]}</span><b>${value}</b></div><div class="h-2 bg-gray-100 rounded"><div class="h-2 bg-primary-500 rounded" style="width:${value}%"></div></div></div>`).join('')}</div><div class="mt-4 bg-green-50 text-green-800 rounded-lg p-3 text-sm">当前突出能力：<b>${abilityNames[sorted[0][0]]}</b></div><div class="mt-2 bg-orange-50 text-orange-800 rounded-lg p-3 text-sm">建议重点关注：<b>${abilityNames[sorted.at(-1)[0]]}</b></div></div></div><div class="result-card mt-4"><h3 class="font-bold mb-2">🤸 坐位体前屈分析</h3><p class="text-sm">本次成绩：<b>${r.flex.value} 厘米</b>，已计入柔韧性画像和训练建议。</p><p class="text-xs text-blue-700 mt-2">坐位体前屈为体质测试项目，不计入南京中考总分。</p></div>`;
    const canvas=document.getElementById('standaloneRadarChart');if(!canvas||typeof Chart==='undefined')return;if(standaloneProfileChartInstance)standaloneProfileChartInstance.destroy();standaloneProfileChartInstance=new Chart(canvas,{type:'radar',data:{labels:Object.keys(r.abilities).map(key=>abilityNames[key]),datasets:[{label:'图形比例',data:Object.values(r.abilities),backgroundColor:'rgba(59,130,246,.15)',borderColor:'#2563eb',borderWidth:2,pointBackgroundColor:'#2563eb'}]},options:{plugins:{legend:{display:false}},scales:{r:{min:0,max:100,ticks:{display:false}}}}});
}
function renderStandaloneRecommendation(){
    const r=assessmentResult;
    document.getElementById('standaloneRecommendation').innerHTML=`<div class="result-card mb-4"><h3 class="font-bold mb-3">🏆 三组选项真实分值对比</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-3">${r.groups.map(g=>`<div class="rounded-xl border border-gray-200 p-4"><div class="flex justify-between mb-2"><b>选项${['一','二','三'][g.group-1]}</b><span class="text-sm text-gray-500">最高 ${g.max} 分</span></div>${g.items.map(item=>`<div class="flex justify-between text-sm py-1"><span>${item.name}</span><b>${item.points} 分</b></div>`).join('')}<div class="mt-2 rounded-lg ${g.tied?'bg-amber-50 text-amber-800':'bg-green-50 text-green-800'} p-2 text-sm">${g.tied?'并列推荐：':'推荐：'}<b>${g.winners.map(w=>w.name).join('、')}</b></div></div>`).join('')}</div></div><div class="result-card mb-4"><h3 class="font-bold mb-2">✅ 最终推荐组合</h3><p class="text-lg text-primary-700 font-bold">${r.groups.map(g=>g.winners.map(w=>w.name).join(' / ')).join(' ＋ ')}</p><div class="grid grid-cols-2 gap-3 mt-4 text-center"><div class="bg-blue-50 rounded-lg p-3"><div class="text-xs text-gray-500">四舍五入前</div><b class="text-2xl text-primary-600">${r.rawTotal}</b><span class="text-sm"> / 40</span></div><div class="bg-green-50 rounded-lg p-3"><div class="text-xs text-gray-500">预计总分</div><b class="text-2xl text-green-600">${r.finalTotal}</b><span class="text-sm"> / 40</span></div></div></div><div class="result-card"><h3 class="font-bold mb-2">💡 推荐说明</h3><p class="text-sm text-gray-600">每组选取真实中考分值较高的项目；同分时保留并列推荐，不添加额外评分。坐位体前屈不参与项目推荐和40分总分。</p></div>`;
}
function getBasicFromForm(){return {name:document.getElementById('f_nickname').value.trim(),grade:document.getElementById('f_grade').value,className:document.getElementById('f_class').value.trim(),gender:assessmentGenderKey(),height:Number(document.getElementById('f_height').value),weight:Number(document.getElementById('f_weight').value)};}
function validateBasic(d){const e=[];if(!d.name)e.push('请填写姓名');if(!d.grade)e.push('请选择年级');if(!d.className)e.push('请填写班级');if(!d.gender)e.push('请选择性别');if(!Number.isFinite(d.height)||d.height<100||d.height>230)e.push('请填写 100—230 厘米的身高');if(!Number.isFinite(d.weight)||d.weight<20||d.weight>200)e.push('请填写 20—200 千克的体重');return e;}
function showFormError(errors){const el=document.getElementById('formError');el.innerHTML='⚠️ '+errors.join('；');el.classList.remove('hidden');}
function clearFormError(){document.getElementById('formError')?.classList.add('hidden');}
function uniqueStudent(data){return {id:uid('student'),...data,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};}
async function saveStudentProfile(silent=false){const data=getBasicFromForm(),errors=validateBasic(data);clearFormError();if(errors.length){showFormError(errors);return false;}let existing=currentStudentId?await archiveRequest('students','readonly',s=>s.get(currentStudentId)):null;const student=existing?{...existing,...data,updatedAt:new Date().toISOString()}:uniqueStudent(data);await archiveRequest('students','readwrite',s=>s.put(student));currentStudentId=student.id;localStorage.setItem('tikaozhixun-current-student',student.id);studentData=student;renderStudentToolbar();if(!silent)alert(existing?'学生基本信息已更新。':'学生档案已保存，可以开始录入本次成绩。');return true;}
function numberValue(id,label,min,max,errors,allowZero){const raw=document.getElementById(id).value.trim(),n=Number(raw);if(raw===''||!Number.isFinite(n)||n<min||n>max||(!allowZero&&n===0))errors.push(`${label}填写不正确`);return n;}
function readAssessment(){const d=getBasicFromForm(),errors=validateBasic(d),g=d.gender;const scores={};scores.rope=numberValue('f_rope','3分钟跳绳',0,1000,errors,true);scores['50m']=numberValue('f_50m','50米跑',4,20,errors);scores.longjump=numberValue('f_longjump','立定跳远',0.5,4,errors);scores.shotput=numberValue('f_shotput','投掷实心球',0.1,30,errors);scores.sitforward=numberValue('f_sitforward','坐位体前屈',0,100,errors,true);if(g==='male'){scores.pullup=numberValue('f_pullup','引体向上',0,100,errors,true);const min=numberValue('f_1000m_min','1000米分钟',0,14,errors,true),sec=numberValue('f_1000m_sec','1000米秒',0,59,errors,true);if(min*60+sec<120)errors.push('1000米用时明显不合理');scores['1000m']=min*60+sec;}if(g==='female'){scores.situp=numberValue('f_situp','一分钟仰卧起坐',0,150,errors,true);const min=numberValue('f_800m_min','800米分钟',0,14,errors,true),sec=numberValue('f_800m_sec','800米秒',0,59,errors,true);if(min*60+sec<100)errors.push('800米用时明显不合理');scores['800m']=min*60+sec;}return {data:{...d,scores},errors};}
async function submitAssessment(){clearFormError();const {data,errors}=readAssessment();if(errors.length){showFormError(errors);return;}const saved=await saveStudentProfile(true);if(!saved)return;const profile=await archiveRequest('students','readonly',s=>s.get(currentStudentId));const now=new Date().toISOString(),analysis=AssessmentEngine.analyze(data);const record={id:uid('assessment'),studentId:currentStudentId,createdAt:now,student:{...profile,...data},scores:data.scores,rawTotal:analysis.rawTotal,finalTotal:analysis.finalTotal};await archiveRequest('assessments','readwrite',s=>s.put(record));const compatibleScores=Object.fromEntries(Object.entries(analysis.items).map(([key,item])=>[key,{...item,sportName:item.name,grade:AssessmentEngine.scoreLabel(item.points)}]));const abilityEntries=Object.entries(analysis.abilities).sort((a,b)=>b[1]-a[1]),abilityNames={speed:'速度',endurance:'耐力',strength:'力量',explosiveness:'爆发力',coordination:'协调性',flexibility:'柔韧性'};analysis.scores=compatibleScores;analysis.profileSummary={best:abilityNames[abilityEntries[0][0]],worst:abilityNames[abilityEntries.at(-1)[0]],bestScore:abilityEntries[0][1],worstScore:abilityEntries.at(-1)[1],avg:Math.round(abilityEntries.reduce((sum,x)=>sum+x[1],0)/abilityEntries.length),level:'图形比例',bestSport:analysis.strongest.name,worstSport:analysis.weakest.name};studentData=record.student;assessmentResult={...analysis,record};showView('results');}
function scoreDisplay(key,item){const value=item.value;return key==='800m'||key==='1000m'?AssessmentEngine.formatTime(value):`${value}${item.unit}`;}
function renderResults(){const r=assessmentResult;if(!r)return;const student=r.student;const visibleItems=Object.entries(r.items);const groupHtml=r.groups.map(g=>`<div class="rounded-xl border border-gray-200 p-4"><div class="flex justify-between gap-3 mb-2"><h4 class="font-bold">选项${['一','二','三'][g.group-1]}</h4><span class="text-sm text-gray-500">最高 ${g.max} 分</span></div>${g.items.map(x=>`<div class="flex justify-between text-sm py-1"><span>${x.name}：${scoreDisplay(x.key,x)}</span><b>${x.points} 分</b></div>`).join('')}<div class="mt-2 rounded-lg ${g.tied?'bg-amber-50 text-amber-800':'bg-green-50 text-green-800'} p-2 text-sm">${g.tied?'并列推荐：':'推荐：'}<b>${g.winners.map(w=>w.name).join('、')}</b>（${g.best} 分）</div></div>`).join('');
const comparison=historyComparisonMarkup(r.record);document.querySelector('#view-results .max-w-4xl').innerHTML=`<h2 class="text-2xl font-bold text-gray-800 mb-2">📊 南京中考体育测评结果</h2><p class="text-gray-500 mb-4">${safe(student.name)} · ${safe(student.grade)}年级 · ${safe(student.className)} · ${student.gender==='male'?'男生':'女生'}</p><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div class="result-card text-center"><div class="text-xs text-gray-500">四舍五入前总分</div><div class="text-3xl font-bold text-primary-600">${r.rawTotal}</div><div class="text-xs text-gray-500">三组最高分之和 / 40</div></div><div class="result-card text-center"><div class="text-xs text-gray-500">预计中考总分</div><div class="text-3xl font-bold text-green-600">${r.finalTotal}</div><div class="text-xs text-gray-500">按评分表备注四舍五入 / 40</div></div><div class="result-card text-center"><div class="text-xs text-gray-500">BMI（仅展示）</div><div class="text-3xl font-bold text-slate-700">${r.bmi}</div><div class="text-xs text-gray-500">身高 ${student.height}cm · 体重 ${student.weight}kg</div></div></div><div class="result-card mb-4"><h3 class="text-lg font-bold mb-3">🏅 7项原始成绩与6项真实中考分值</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${visibleItems.map(([key,x])=>`<div class="score-item ${x.gradeClass}"><div class="flex justify-between"><b>${x.name}</b><b>${x.points} / ${x.max} 分</b></div><div class="text-sm mt-1">原始成绩：${scoreDisplay(key,x)}</div></div>`).join('')}<div class="score-item good"><div class="flex justify-between"><b>坐位体前屈</b><span class="text-blue-700">不计分</span></div><div class="text-sm mt-1">原始成绩：${r.flex.value} 厘米</div></div></div><p class="mt-3 text-xs text-blue-700">坐位体前屈为体质测试项目，不计入南京中考总分。</p></div><div class="result-card mb-4"><h3 class="text-lg font-bold mb-3">🏆 三组选项对比与推荐组合</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-3">${groupHtml}</div></div><div class="result-card mb-4"><h3 class="text-lg font-bold mb-3">📈 能力图（仅作 0—100 图形比例）</h3><p class="text-xs text-gray-500 mb-3">图形比例不是中考分数；真实中考分值已在上方逐项展示。</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"><canvas id="radarChart"></canvas><div id="barChart" class="space-y-2">${Object.entries(r.items).map(([k,x])=>`<div><div class="flex justify-between text-xs"><span>${x.name}</span><span>${x.points}/${x.max} 分</span></div><div class="h-2 bg-gray-100 rounded"><div class="h-2 bg-primary-500 rounded" style="width:${x.ratio}%"></div></div></div>`).join('')}<div><div class="flex justify-between text-xs"><span>坐位体前屈</span><span>${r.flex.value}cm（体质测试）</span></div><div class="h-2 bg-gray-100 rounded"><div class="h-2 bg-indigo-500 rounded" style="width:${r.flex.ratio}%"></div></div></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="result-card"><h3 class="font-bold text-green-700 mb-2">✅ 当前优势</h3><p>${r.strongest.name}（${r.strongest.points}/${r.strongest.max} 分）</p><p class="mt-3 text-sm text-gray-600">保持优势项目的训练频率，并兼顾动作规范与恢复。</p></div><div class="result-card"><h3 class="font-bold text-orange-700 mb-2">🎯 需要提高</h3><p>${r.weakest.name}（${r.weakest.points}/${r.weakest.max} 分）</p><p class="mt-3 text-sm text-gray-600">建议优先进行 ${r.weakest.name} 的专项基础练习，每周 3 次并记录变化。</p></div></div>${comparison}<div class="mt-6 flex gap-3 flex-wrap"><button onclick="generateTrainingPlan()" class="btn-outline">📋 训练计划</button><button onclick="showHistory()" class="btn-outline">🕘 历史成绩</button><button onclick="showView('assessment')" class="btn-outline">✏️ 继续测评</button><button onclick="showView('coach')" class="btn-outline">🤖 咨询AI教练</button></div>`;renderRadarChart(r.abilities);}
function renderRadarChart(ab){const c=document.getElementById('radarChart');if(!c||typeof Chart==='undefined')return;if(radarChartInstance)radarChartInstance.destroy();radarChartInstance=new Chart(c,{type:'radar',data:{labels:['速度','耐力','力量','爆发力','协调性','柔韧性'],datasets:[{label:'图形比例',data:[ab.speed,ab.endurance,ab.strength,ab.explosiveness,ab.coordination,ab.flexibility],backgroundColor:'rgba(59,130,246,.15)',borderColor:'#2563eb',borderWidth:2,pointBackgroundColor:'#2563eb'}]},options:{plugins:{legend:{display:false}},scales:{r:{min:0,max:100,ticks:{display:false}}}}});}
async function recordsForCurrent(){if(!currentStudentId)return [];const db=await openArchiveDb();return new Promise((resolve,reject)=>{const req=db.transaction('assessments').objectStore('assessments').index('studentId').getAll(currentStudentId);req.onsuccess=()=>resolve(req.result.sort((a,b)=>a.createdAt.localeCompare(b.createdAt)));req.onerror=()=>reject(req.error);});}
function comparisonRows(current,base,label){if(!base)return `<p class="text-sm text-gray-500">暂无${label}可比较的记录。</p>`;const g=current.student.gender,keys=[...AssessmentEngine.keysFor(g),'sitforward'];return `<h4 class="font-semibold mb-2">${label}</h4><div class="space-y-1 text-sm">${keys.map(k=>{const a=base.scores[k],b=current.scores[k],change=AssessmentEngine.delta(k,a,b),name=k==='sitforward'?'坐位体前屈':AssessmentEngine.STANDARDS[g][k].name;const sign=change.difference>0?'+':'';return `<div class="flex justify-between gap-3"><span>${name}</span><span class="${change.change==='进步'?'text-green-600':change.change==='退步'?'text-red-600':'text-gray-500'}">${change.change} ${sign}${change.difference}${k==='800m'||k==='1000m'?'秒':''}</span></div>`}).join('')}</div>`;}
function historyComparisonMarkup(current){return `<div id="quickHistory" class="result-card mb-4"><h3 class="text-lg font-bold mb-3">🕘 历史对比</h3><p class="text-sm text-gray-500">正在读取本设备中的历史记录…</p></div>`;}
async function fillQuickHistory(record){const el=document.getElementById('quickHistory');if(!el)return;const all=await recordsForCurrent(),i=all.findIndex(x=>x.id===record.id),previous=all[i-1],first=all[0],best=all.reduce((best,x)=>x.finalTotal>best.finalTotal?x:best,all[0]);el.innerHTML=`<h3 class="text-lg font-bold mb-3">🕘 历史对比</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${comparisonRows(record,previous,'本次与上一次')}${comparisonRows(record,first?.id===record.id?null:first,'本次与第一次')}</div><p class="mt-3 text-sm bg-blue-50 rounded-lg p-3">历史最高预计总分：<b>${best?.finalTotal??'-'} / 40</b>；本次预计总分：<b>${record.finalTotal} / 40</b>。50米与长跑以用时更少为进步，其余项目以数值更大为进步；身高、体重和 BMI 仅显示变化。</p>`;}
function enhanceResultsDetails(r){const host=document.querySelector('#view-results .max-w-4xl'),student=r.student;if(!host)return;const intro=host.querySelector('h2 + p');intro?.insertAdjacentHTML('afterend',`<div class="result-card mb-4"><h3 class="font-bold mb-3">👤 学生基本信息</h3><div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm"><div>姓名：<b>${safe(student.name)}</b></div><div>年级：<b>${safe(student.grade)}年级</b></div><div>班级：<b>${safe(student.className)}</b></div><div>性别：<b>${student.gender==='male'?'男':'女'}</b></div><div>身高：<b>${student.height}厘米</b></div><div>体重：<b>${student.weight}千克</b></div></div></div>`);const recommendationHeading=[...host.querySelectorAll('h3')].find(x=>x.textContent.includes('三组选项对比'));recommendationHeading?.parentElement?.insertAdjacentHTML('beforeend',`<div class="mt-4 bg-blue-50 text-blue-800 rounded-lg p-3 text-sm"><b>最终推荐组合：</b>${r.groups.map(g=>g.winners.map(w=>w.name).join(' / ')).join(' ＋ ')}</div>`);const flexCard=[...host.querySelectorAll('.score-item')].find(x=>x.textContent.includes('坐位体前屈')),flexAdvice=r.flex.ratio<60?'建议加入腿后侧与腰背部的温和静态拉伸，每周3—5次。':'柔韧性表现较好，继续保持规律拉伸并避免弹震式前屈。';flexCard?.insertAdjacentHTML('beforeend',`<p class="text-xs text-gray-600 mt-2">当前成绩 ${r.flex.value} 厘米，用于柔韧性分析、雷达图、训练建议和历史比较。${flexAdvice}</p>`);if(r.balanced){const improve=[...host.querySelectorAll('h3')].find(x=>x.textContent.includes('需要提高'))?.parentElement;if(improve)improve.innerHTML='<h3 class="font-bold text-orange-700 mb-2">🎯 需要提高</h3><p>六个中考项目当前处于同一得分比例。</p><p class="mt-3 text-sm text-gray-600">暂无单独薄弱项，建议均衡保持，并结合坐位体前屈继续提升柔韧性。</p>';}}
const originalRenderResults=renderResults;const _renderResults=renderResults;renderResults=function(){_renderResults();enhanceResultsDetails(assessmentResult);enhanceBmiEvaluation(assessmentResult);removeResultsAbilityChart();setTimeout(()=>fillQuickHistory(assessmentResult.record),0);};
async function showHistory(){ensureHistoryView();const host=document.getElementById('historyContent');showView('history');if(!currentStudentId){host.innerHTML='<div class="result-card">还没有已保存的学生档案，请先保存基本信息。</div>';return;}const student=await archiveRequest('students','readonly',s=>s.get(currentStudentId));const records=await recordsForCurrent();host.innerHTML=`<div class="result-card mb-4"><div class="flex justify-between gap-3 flex-wrap"><div><h3 class="font-bold">${safe(student.name)}的历史成绩</h3><p class="text-sm text-gray-500">${safe(student.grade)}年级 · ${safe(student.className)} · ${student.gender==='male'?'男':'女'} · 共 ${records.length} 次测评</p></div><div class="flex gap-2"><button onclick="showView('assessment')" class="btn-outline">编辑基本信息</button><button onclick="showStudentManager()" class="btn-outline">切换学生</button></div></div></div>${records.length?`<div class="space-y-3">${records.slice().reverse().map((r,index)=>`<div class="result-card"><div class="flex justify-between gap-3 flex-wrap"><div><b>第 ${records.length-index} 次测评</b><span class="text-sm text-gray-500 ml-2">${new Date(r.createdAt).toLocaleString('zh-CN')}</span></div><div><b class="text-primary-600">${r.finalTotal} / 40 分</b><button onclick="deleteAssessment('${r.id}')" class="ml-3 text-sm text-red-500">删除本次记录</button></div></div><p class="text-sm mt-2">原始总分 ${r.rawTotal}；坐位体前屈 ${r.scores.sitforward} 厘米</p></div>`).join('')}</div>`:'<div class="result-card">尚无测评记录。</div>'}`;}
function ensureHistoryView(){if(document.getElementById('view-history'))return;document.getElementById('mainContent').insertAdjacentHTML('beforeend','<div id="view-history" class="view hidden"><div class="max-w-4xl mx-auto px-4 py-6"><h2 class="text-2xl font-bold text-gray-800 mb-4">🕘 学生成绩历史</h2><div id="historyContent"></div></div></div>');}
async function deleteAssessment(id){if(!confirm('确定删除这一次测评记录吗？删除后不能恢复。'))return;await archiveRequest('assessments','readwrite',s=>s.delete(id));await showHistory();}
async function showStudentManager(){ensureHistoryView();showView('history');const host=document.getElementById('historyContent'),students=await archiveRequest('students','readonly',s=>s.getAll());host.innerHTML=`<div class="result-card"><h3 class="font-bold mb-3">👥 学生档案</h3><div class="space-y-2">${students.map(s=>`<div class="flex justify-between items-center border rounded-lg p-3 gap-2"><div><b>${safe(s.name)}</b><span class="text-sm text-gray-500 ml-2">${safe(s.grade)}年级 · ${safe(s.className)} · ${s.gender==='male'?'男':'女'}</span></div><button onclick="switchStudent('${s.id}')" class="btn-outline">${s.id===currentStudentId?'当前学生':'切换'}</button></div>`).join('')||'<p class="text-gray-500">尚无学生档案。</p>'}</div><button onclick="newStudent()" class="btn-primary mt-4">＋ 新建学生</button></div>`;}
async function switchStudent(id){currentStudentId=id;localStorage.setItem('tikaozhixun-current-student',id);await loadCurrentStudent();showView('assessment');}
function newStudent(){currentStudentId='';localStorage.removeItem('tikaozhixun-current-student');document.getElementById('assessmentForm').reset();updateGenderFields();showView('assessment');}
async function loadCurrentStudent(){if(!currentStudentId)return;const s=await archiveRequest('students','readonly',x=>x.get(currentStudentId));if(!s)return;studentData=s;document.getElementById('f_nickname').value=s.name;document.getElementById('f_grade').value=s.grade;document.getElementById('f_class').value=s.className;document.getElementById('f_gender').value=s.gender;document.getElementById('f_height').value=s.height;document.getElementById('f_weight').value=s.weight;updateGenderFields();renderStudentToolbar();}
async function renderStudentToolbar(){const el=document.getElementById('studentProfileActions');if(!el)return;const s=currentStudentId?await archiveRequest('students','readonly',x=>x.get(currentStudentId)):null;const marker=s?`当前学生：<b>${safe(s.name)}</b>`:'尚未保存学生档案';el.querySelector?.('.current-student-marker')?.remove();el.insertAdjacentHTML('beforeend',`<span class="current-student-marker text-sm text-gray-500 self-center">${marker}</span>`);}
function loadDemoData(){newStudent();const values={f_nickname:'示例同学',f_grade:'9',f_class:'九（1）班',f_gender:'male',f_height:'170',f_weight:'60',f_50m:'7.7',f_longjump:'2.21',f_shotput:'7.8',f_rope:'390',f_pullup:'5',f_1000m_min:'4',f_1000m_sec:'15',f_sitforward:'16'};Object.entries(values).forEach(([id,v])=>document.getElementById(id).value=v);updateGenderFields();}
function startDemoExperience(){loadDemoData();submitAssessment();}
function resetAssessment(){showView('assessment');}
function showFullReport(){showView('results');}
function showLearningDetail(key){const s=sportsData[key];const media=s.videoUrl?`<video class="learning-video" controls playsinline preload="metadata" src="${s.videoUrl}" onerror="this.outerHTML='<div class=&quot;video-placeholder&quot;><p>教学视频加载失败，请稍后重试。</p></div>'"></video>`:`<div class="video-placeholder"><div class="play-icon">▶️</div><p>教学视频正在准备中</p></div>`;document.getElementById('learningDetailContent').innerHTML=`<div class="result-card mb-4"><div class="flex items-center gap-3 mb-3"><span class="text-3xl">${s.icon}</span><div><h2 class="text-xl font-bold">${s.name}</h2><p class="text-sm text-gray-500">${s.intro}</p></div></div></div><div class="result-card mb-4"><h3 class="font-bold mb-3">🎬 动作教学视频</h3>${media}</div><div class="result-card mb-4"><h3 class="font-bold mb-3">📋 动作阶段讲解</h3>${s.phases.map((p,i)=>`<div class="flex gap-3 mb-3"><b class="text-primary-600">${i+1}</b><div><b>${p.name}</b><p class="text-sm text-gray-600">${p.desc}</p></div></div>`).join('')}</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="result-card"><h3 class="font-bold mb-2">✅ 动作要领</h3>${s.keyPoints.map(x=>`<p class="text-sm">• ${x}</p>`).join('')}</div><div class="result-card"><h3 class="font-bold mb-2">⚠️ 常见错误与安全提示</h3>${s.mistakes.map(x=>`<p class="text-sm">• ${x}</p>`).join('')}<p class="text-sm mt-2 text-red-700">${s.safety}</p></div></div>`;showView('learning-detail');}
document.addEventListener('DOMContentLoaded',()=>{loadCurrentStudent().catch(()=>{});archiveReady=true;});

// 每项历史最佳成绩按项目方向计算，而非一律按数值最大。
async function fillQuickHistory(record){const el=document.getElementById('quickHistory');if(!el)return;const all=await recordsForCurrent(),i=all.findIndex(x=>x.id===record.id),previous=all[i-1],first=all[0],bestTotal=all.reduce((best,x)=>x.finalTotal>best.finalTotal?x:best,all[0]),gender=record.student.gender,keys=[...AssessmentEngine.keysFor(gender),'sitforward'];const bestItems=keys.map(key=>{const lower=key==='50m'||key==='800m'||key==='1000m';const winner=all.reduce((best,x)=>lower?x.scores[key]<best.scores[key]?x:best:x.scores[key]>best.scores[key]?x:best,all[0]);const name=key==='sitforward'?'坐位体前屈':AssessmentEngine.STANDARDS[gender][key].name;const value=key==='800m'||key==='1000m'?AssessmentEngine.formatTime(winner.scores[key]):`${winner.scores[key]}${key==='sitforward'?'厘米':''}`;return `<span class="inline-block bg-gray-50 rounded px-2 py-1 mr-1 mb-1">${name} ${value}</span>`;}).join('');el.innerHTML=`<h3 class="text-lg font-bold mb-3">🕘 历史对比</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${comparisonRows(record,previous,'本次与上一次')}${comparisonRows(record,first?.id===record.id?null:first,'本次与第一次')}</div><div class="mt-3 text-sm bg-blue-50 rounded-lg p-3"><p>历史最高预计总分：<b>${bestTotal?.finalTotal??'-'} / 40</b>；本次预计总分：<b>${record.finalTotal} / 40</b>。</p><p class="mt-2">历史各项目最佳：${bestItems}</p><p class="mt-2 text-gray-600">50米与长跑以用时更少为进步，其余项目以数值更大为进步；身高、体重和 BMI 仅显示变化。</p></div>`;}

function physicalChanges(current,base){if(!base)return '';const bmi=x=>x.student.weight/Math.pow(x.student.height/100,2),fmt=n=>`${n>0?'+':''}${n.toFixed(1)}`;return `<div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"><div class="bg-gray-50 rounded p-2">身高变化 <b>${fmt(current.student.height-base.student.height)}cm</b></div><div class="bg-gray-50 rounded p-2">体重变化 <b>${fmt(current.student.weight-base.student.weight)}kg</b></div><div class="bg-gray-50 rounded p-2">BMI变化 <b>${fmt(bmi(current)-bmi(base))}</b></div><div class="bg-gray-50 rounded p-2">预计总分变化 <b>${fmt(current.finalTotal-base.finalTotal)}</b></div></div>`;}
const _historyWithBest=fillQuickHistory;fillQuickHistory=async function(record){await _historyWithBest(record);const el=document.getElementById('quickHistory');if(!el)return;const all=await recordsForCurrent(),i=all.findIndex(x=>x.id===record.id);el.insertAdjacentHTML('beforeend',physicalChanges(record,all[i-1]));};

function getBmiEvaluation(value){
    return TrainingEngine.bmiEvaluation(value);
}
function enhanceBmiEvaluation(r){
    const host=document.querySelector('#view-results .max-w-4xl');if(!host)return;
    const card=[...host.querySelectorAll('.result-card')].find(el=>el.textContent.includes('BMI（仅展示）'));if(!card)return;
    const evaluation=getBmiEvaluation(r.bmi);
    card.insertAdjacentHTML('beforeend',`<div class="mt-2 rounded-lg px-2 py-1 text-sm font-bold ${evaluation.background} ${evaluation.color}">${evaluation.label}</div><p class="mt-2 text-xs text-gray-500">${evaluation.advice}</p><p class="mt-1 text-[11px] text-gray-400">按文档提供标准：≤18.4偏瘦、18.5—23.9正常、24.0—27.9过重、≥28.0肥胖；青少年请结合年龄和性别综合判断。</p>`);
}
function removeResultsAbilityChart(){
    const host=document.querySelector('#view-results .max-w-4xl');if(!host)return;
    const heading=[...host.querySelectorAll('h3')].find(el=>el.textContent.includes('能力图（仅作'));
    heading?.parentElement?.remove();
}

function buildDetailedPlanData(targetSports,weeks,data){
    return TrainingEngine.buildPlan(targetSports,weeks);
}
const _renderTrainingPlan=renderTrainingPlan;renderTrainingPlan=function(){
    const originalBuilder=buildPlanData;buildPlanData=buildDetailedPlanData;
    try{_renderTrainingPlan();}finally{buildPlanData=originalBuilder;}
};

let currentHomeworkOption=0;
function homeworkChoiceData(key,gender){
    return TrainingEngine.homeworkChoice(key,gender);
}
function homeworkOptionsFor(r){
    return TrainingEngine.homeworkOptions(r);
}
function selectHomeworkOption(index){currentHomeworkOption=index;renderHomeworkChoices();}
function renderHomeworkChoices(){
    const r=assessmentResult,options=homeworkOptionsFor(r),selected=options[currentHomeworkOption]||options[0],host=document.getElementById('homeworkContent');
    host.innerHTML=`<div class="result-card mb-4"><h3 class="font-bold mb-2">📅 今日任选一项完成</h3><p class="text-sm text-gray-600 mb-3">根据场地、器材和身体状态选择一项，不要求把所有任务都做完。</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3">${options.map((option,index)=>`<button onclick="selectHomeworkOption(${index})" class="text-left rounded-xl border-2 p-4 transition ${index===currentHomeworkOption?'border-primary-500 bg-blue-50':'border-gray-200 bg-white'}"><span class="text-xs text-gray-500">选项${['一','二','三'][index]}</span><b class="block mt-1">${option.title}</b><span class="text-xs text-gray-500">${option.time}</span></button>`).join('')}</div></div><div class="homework-card"><div class="flex justify-between gap-3 flex-wrap mb-4"><div><h3 class="text-lg font-bold">🎯 ${selected.title}</h3><p class="text-sm text-gray-600 mt-1">${selected.goal}</p></div><span class="text-sm text-gray-500">预计 ${selected.time}</span></div><div class="space-y-3"><div class="bg-gray-50 rounded-xl p-4"><b>1. 热身活动</b><p class="text-sm text-gray-600 mt-1">原地慢跑2分钟，完成肩、髋、膝、踝动态活动。</p><span class="text-xs text-gray-400">约5分钟 · 无器材</span></div><div class="bg-blue-50 rounded-xl p-4"><b>2. 主要任务</b><p class="text-sm text-gray-700 mt-1">${selected.detail}</p><span class="text-xs text-gray-500">器材：${selected.equipment}</span></div><div class="bg-gray-50 rounded-xl p-4"><b>3. 补充练习</b><p class="text-sm text-gray-600 mt-1">平板支撑30秒x2组，加坐位体前屈相关拉伸20秒x3组。</p><span class="text-xs text-gray-400">约6-8分钟</span></div><div class="bg-gray-50 rounded-xl p-4"><b>4. 整理放松</b><p class="text-sm text-gray-600 mt-1">慢走2分钟，全身拉伸3-5分钟，训练后适量补水。</p></div></div><div class="bg-red-50 rounded-xl p-3 mt-4"><b class="text-sm text-red-700">⚠️ 安全提醒</b><p class="text-sm text-red-600 mt-1">请家长确认场地安全；出现疼痛、头晕、胸闷或身体不适时立即停止。</p></div><div class="mt-4 border-t pt-4"><div class="text-sm font-medium mb-2">📋 训练打卡</div><div id="checkinBtns" class="flex gap-2 flex-wrap"><button onclick="selectCheckin(this,'completed')" class="checkin-btn">✅ 已完成</button><button onclick="selectCheckin(this,'partial')" class="checkin-btn">🔶 部分完成</button><button onclick="selectCheckin(this,'notdone')" class="checkin-btn">❌ 未完成</button></div><p id="checkinResult" class="hidden text-sm text-green-700 mt-2">本次打卡状态已记录在当前页面。</p><div class="text-sm font-medium mt-4 mb-2">💭 训练感受</div><div id="feelingBtns" class="flex gap-2 flex-wrap"><button onclick="selectFeeling(this,'easy')" class="feeling-btn">😊 轻松</button><button onclick="selectFeeling(this,'normal')" class="feeling-btn">🙂 适中</button><button onclick="selectFeeling(this,'hard')" class="feeling-btn">😓 有点困难</button><button onclick="selectFeeling(this,'unwell')" class="feeling-btn">😰 身体不适</button></div><p id="unwellWarning" class="hidden text-sm text-red-600 mt-2">请立即停止训练并告知家长；如不适持续，请及时就医。</p></div></div>`;
}
function generateHomework(){if(!assessmentResult){alert('请先完成体质测评');showView('assessment');return;}currentHomeworkOption=0;showView('homework');renderHomeworkChoices();}

// 某些严格内容安全策略会禁用 HTML 内联事件。此白名单委托让现有页面在这类环境中仍可交互。
const safeUiActions={showView,startDemoExperience,navigateAfterData,showLearningDetail,generatePractice,updateGenderFields,submitAssessment,saveStudentProfile,showStudentManager,showHistory,generateTrainingPlan,generateHomework,selectHomeworkOption,showFullReport,resetAssessment,switchPlan,switchStudent,newStudent,deleteAssessment,sendChat,selectCheckin,selectFeeling};
function invokeSafeUiAction(element,source,event){const match=source.match(/^([A-Za-z0-9_]+)\((.*)\)$/);if(!match)return;const fn=safeUiActions[match[1]];if(!fn)return;const raw=match[2].trim();let args=[];if(raw){args=raw.split(',').map(x=>{const value=x.trim();if(value==='this')return element;if(/^['"].*['"]$/.test(value))return value.slice(1,-1);if(/^\d+$/.test(value))return Number(value);return value;});}event?.preventDefault();fn(...args);}
document.addEventListener('click',event=>{const target=event.target.closest?.('[onclick]');if(target&&typeof target.onclick!=='function')invokeSafeUiAction(target,target.getAttribute('onclick'),event);});
document.addEventListener('change',event=>{const source=event.target.getAttribute?.('onchange');if(source&&typeof event.target.onchange!=='function')invokeSafeUiAction(event.target,source,event);});
document.addEventListener('keydown',event=>{if(event.target.id==='chatInput'&&event.key==='Enter'&&typeof event.target.onkeydown!=='function'){event.preventDefault();sendChat();}});
