/* 南京市 2026 年中考体育评分。数据逐行录自项目根目录的《中考体育评分表.jpg》。 */
(function (root) {
  'use strict';
  const P14=[14,13.5,13,12,11,10,8,6,4,2,1];
  const P13=[13,12.5,12,11,10,9,8,6,4,2,1];
  const rows=(points, values)=>points.map((points,i)=>({points,threshold:values[i]}));
  const STANDARDS={
    male:{
      rope:{name:'3分钟跳绳',unit:'个',group:1,max:14,direction:'higher',rows:rows(P14,[400,390,380,360,340,320,300,280,260,240,200])},
      '1000m':{name:'1000米',unit:'分秒',group:1,max:14,direction:'lower',rows:rows(P14,[245,255,270,295,303,307,312,315,318,321,325])},
      '50m':{name:'50米跑',unit:'秒',group:2,max:13,direction:'lower',rows:rows(P13,[7.4,7.7,8.3,9.0,9.2,9.4,9.6,9.8,10.0,10.2,10.4])},
      longjump:{name:'立定跳远',unit:'米',group:2,max:13,direction:'higher',rows:rows(P13,[2.31,2.21,2.05,1.85,1.64,1.58,1.56,1.54,1.52,1.50,1.40])},
      shotput:{name:'投掷实心球',unit:'米',group:3,max:13,direction:'higher',rows:rows(P13,[8.6,7.8,7.0,6.2,5.4,5.0,4.5,4.0,3.0,2.0,1.0])},
      // 图片中的 8、6、4、2、1 分档为留空，未编造；仅有 6～1 次的明确档位。
      pullup:{name:'引体向上',unit:'次',group:3,max:13,direction:'higher',rows:rows([13,12.5,12,11,10,9],[6,5,4,3,2,1])}
    },
    female:{
      rope:{name:'3分钟跳绳',unit:'个',group:1,max:14,direction:'higher',rows:rows(P14,[400,390,380,360,340,320,300,280,260,240,200])},
      '800m':{name:'800米',unit:'分秒',group:1,max:14,direction:'lower',rows:rows(P14,[235,240,260,276,279,282,284,287,290,295,300])},
      '50m':{name:'50米跑',unit:'秒',group:2,max:13,direction:'lower',rows:rows(P13,[8.5,8.7,9.1,9.8,10.0,10.2,10.4,10.6,10.7,10.8,10.9])},
      longjump:{name:'立定跳远',unit:'米',group:2,max:13,direction:'higher',rows:rows(P13,[1.82,1.73,1.61,1.46,1.26,1.22,1.20,1.18,1.16,1.14,1.10])},
      shotput:{name:'投掷实心球',unit:'米',group:3,max:13,direction:'higher',rows:rows(P13,[6.9,6.5,6.2,5.6,5.3,5.0,4.5,4.0,3.0,2.0,1.0])},
      situp:{name:'一分钟仰卧起坐',unit:'次',group:3,max:13,direction:'higher',rows:rows(P13,[45,38,30,26,21,19,17,15,13,12,10])}
    }
  };
  const FLEX={name:'坐位体前屈',unit:'厘米',direction:'higher'};
  const keysFor=gender=>gender==='male'?['rope','1000m','50m','longjump','shotput','pullup']:['rope','800m','50m','longjump','shotput','situp'];
  const formatTime=seconds=>`${Math.floor(seconds/60)}分${String(Math.round(seconds%60)).padStart(2,'0')}秒`;
  const score=(gender,key,value)=>{
    const item=STANDARDS[gender]?.[key]; if(!item||!Number.isFinite(value)) return 0;
    const hit=item.rows.find(row=>item.direction==='lower'?value<=row.threshold:value>=row.threshold);
    return hit ? hit.points : 0;
  };
  const scoreLabel=p=>p>=12?'优势':p>=8?'良好':p>=4?'待提升':'需重点提高';
  const analyze=data=>{
    const gender=data.gender, items={};
    keysFor(gender).forEach(key=>{const s=STANDARDS[gender][key], value=data.scores[key], points=score(gender,key,value); items[key]={...s,value,points,ratio:Math.round(points/s.max*100),gradeClass:points>=s.max*.85?'excellent':points>=s.max*.6?'good':points>=s.max*.3?'fair':'poor'};});
    const flex={...FLEX,value:data.scores.sitforward,ratio:Math.max(0,Math.min(100,Math.round(data.scores.sitforward/40*100)))};
    const groups=[1,2,3].map(group=>{const inGroup=Object.entries(items).filter(([,x])=>x.group===group);const best=Math.max(...inGroup.map(([,x])=>x.points));const winners=inGroup.filter(([,x])=>x.points===best).map(([key,x])=>({key,name:x.name,points:x.points}));return {group,max:group===1?14:13,items:inGroup.map(([key,x])=>({key,...x})),best,winners,tied:winners.length>1};});
    const rawTotal=groups.reduce((sum,g)=>sum+g.best,0), finalTotal=Math.floor(rawTotal+.5);
    const ratios=Object.values(items).map(item=>item.ratio),strongest=Object.values(items).slice().sort((a,b)=>b.ratio-a.ratio)[0], weakest=Object.values(items).slice().sort((a,b)=>a.ratio-b.ratio)[0],balanced=Math.max(...ratios)===Math.min(...ratios);
    const abilities={speed:items['50m'].ratio,endurance:items[gender==='male'?'1000m':'800m'].ratio,strength:Math.round((items.shotput.ratio+items[gender==='male'?'pullup':'situp'].ratio)/2),explosiveness:items.longjump.ratio,coordination:items.rope.ratio,flexibility:flex.ratio};
    const h=data.height/100,bmi=Math.round(data.weight/(h*h)*10)/10;
    return {student:data,items,flex,groups,rawTotal,finalTotal,strongest,weakest,balanced,abilities,bmi};
  };
  const delta=(key,from,to)=>{
    const direction=key==='50m'||key==='800m'||key==='1000m'?'lower':'higher'; const d=+(to-from).toFixed(2); const good=direction==='lower'?d<0:d>0;
    return {difference:d,direction,change:d===0?'持平':good?'进步':'退步',good};
  };
  const api={STANDARDS,FLEX,keysFor,score,analyze,formatTime,scoreLabel,delta};
  if(typeof module!=='undefined') module.exports=api;
  root.AssessmentEngine=api;
})(typeof window==='undefined'?globalThis:window);
