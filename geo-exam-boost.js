/* Exam Boost: Knowledge Gap, Case Statistics, AO3 and fictional OS-style map skills. */
(function(){
"use strict";
if(typeof U==="undefined"||!window.__aqaSmart)return;
const KEY="aqa-geo-exam-boost-v1";
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")||{};}catch(e){return{};}};
let st=Object.assign({gapRuns:[],caseRight:0,caseWrong:0,ao3Done:{},mapDone:{}},read());
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function addMistake(topic,q,a,note,cat){try{window.__aqaSmart.addMistake(topic||"water",q,a,note||"Exam Boost gap",cat||"Knowledge");}catch(e){}}
function logQ(q,topic,source,marks,attempted,score){try{window.__aqaLogQuestion?.(q,topic,source,marks,attempted,score);}catch(e){}}
const css=`
.exam-boost-launch{font-weight:800}
.eb-dialog{width:min(1050px,96vw);max-height:92vh;background:var(--panel,#172027);color:var(--text,#eef5f4);border:1px solid var(--line,#41505a);border-radius:18px;padding:1rem}
.eb-dialog::backdrop{background:#000c}.eb-head,.eb-spread{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}.eb-tabs{display:flex;gap:.45rem;flex-wrap:wrap;margin:.8rem 0 1rem}.eb-tabs button[aria-pressed="true"]{border-color:var(--teal,#58d6c4);box-shadow:inset 0 0 0 1px var(--teal,#58d6c4)}.eb-box,.eb-card{border:1px solid var(--line,#41505a);border-radius:14px;background:var(--panel,#172027);padding:1rem;margin:.8rem 0}.eb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}.eb-actions{display:flex;gap:.55rem;flex-wrap:wrap;margin:.8rem 0}.eb-primary{background:var(--teal,#58d6c4)!important;color:#082522!important;border-color:var(--teal,#58d6c4)!important}.eb-score{font-size:2rem;font-weight:900}.eb-pill{display:inline-block;border:1px solid var(--line,#41505a);border-radius:999px;padding:.2rem .6rem;font-size:.8rem;color:var(--muted,#a9b5b3)}.eb-answer{white-space:pre-wrap;border-left:3px solid var(--teal,#58d6c4);padding:.75rem 1rem;background:rgba(255,255,255,.03);margin:.8rem 0}.eb-chart{width:100%;height:auto;max-height:330px;background:rgba(255,255,255,.02);border:1px solid var(--line,#41505a);border-radius:12px}.eb-table{width:100%;border-collapse:collapse}.eb-table th,.eb-table td{border:1px solid var(--line,#41505a);padding:.45rem;text-align:right}.eb-table th:first-child,.eb-table td:first-child{text-align:left}.eb-topic-row{display:grid;grid-template-columns:1fr 100px;gap:.7rem;align-items:center;margin:.35rem 0}.eb-topic-row progress{width:100%}.eb-map-wrap{overflow:auto;border:1px solid var(--line,#41505a);border-radius:12px;background:#f5f0dd;padding:.5rem}.eb-map{min-width:680px;width:100%;height:auto}.eb-map text{font-family:system-ui,sans-serif}.eb-map .grid{stroke:#879095;stroke-width:1}.eb-map .contour{fill:none;stroke:#9b6a42;stroke-width:2}.eb-map .river{fill:none;stroke:#4d90c7;stroke-width:6}.eb-map .road{fill:none;stroke:#d65b55;stroke-width:5}.eb-map .minor{fill:none;stroke:#777;stroke-width:2}.eb-map .wood{fill:#9fc58f;opacity:.75}.eb-map .water{fill:#9ccbe6}.eb-map .settle{fill:#444}.eb-map .label{fill:#222;font-size:15px;font-weight:700}.eb-map .small{fill:#333;font-size:11px}.eb-map .coord{fill:#333;font-size:12px}.eb-feedback-good{border-left:3px solid #69d18b;padding:.7rem}.eb-feedback-warn{border-left:3px solid #e8b85b;padding:.7rem}
@media(max-width:760px){.eb-grid{grid-template-columns:1fr}.eb-dialog{width:100vw;max-width:none;margin:0;border-radius:0}.eb-actions{display:grid;grid-template-columns:1fr}.eb-actions button{min-height:46px}}
`;
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
const launch=document.createElement("button");launch.id="exam-boost-launch";launch.type="button";launch.className="exam-boost-launch";launch.textContent="Exam Boost";
const perf=document.getElementById("performance-launch");perf?.parentNode?.insertBefore(launch,perf);
const dlg=document.createElement("dialog");dlg.id="exam-boost-dialog";dlg.className="eb-dialog no-print";dlg.innerHTML='<div class="eb-head"><div><p class="eyebrow">Exam-focused practice</p><h2>Exam Boost</h2></div><button type="button" id="eb-close">Close</button></div><nav class="eb-tabs" aria-label="Exam Boost tools"><button type="button" data-eb-tab="gap" aria-pressed="true">Knowledge Gap Test</button><button type="button" data-eb-tab="stats">Case Statistics</button><button type="button" data-eb-tab="ao3">AO3 Mega Bank</button><button type="button" data-eb-tab="map">OS Map Skills</button></nav><div id="eb-content"></div>';
document.body.appendChild(dlg);
let tab="gap",gap=null,statAt=0,statRevealed=false,ao3At=0,ao3Reveal=false,mapAt=0,mapReveal=false;

function geoTopicPaper(id){return ["water","coasts","deserts","glaciers","hazards","ecosystems"].includes(id)?1:2;}
function gapPool(scope){
 const cards=window.__aqaSmart.cards().filter(c=>U[c.topic]&&!c.custom&&(scope==="all"||geoTopicPaper(c.topic)===Number(scope)));
 const by={};cards.forEach(c=>(by[c.topic]||(by[c.topic]=[])).push(c));
 const ids=shuffle(Object.keys(by)),out=[];let round=0;
 while(out.length<30&&ids.some(id=>by[id].length>round)){for(const id of ids){if(by[id][round]&&out.length<30)out.push(by[id][round]);}round++;}
 return shuffle(out);
}
function startGap(scope){gap={items:gapPool(scope||"all"),at:0,reveal:false,results:[]};gap.items.forEach(c=>logQ(c.q,c.topic,"Knowledge Gap Test",null,false,null));render();}
function gapView(){
 if(!gap)return '<section class="eb-box"><h3>Knowledge Gap Test</h3><p class="muted">A 30-question retrieval diagnostic spread across the paper. Rate each answer after revealing it; Partial/Wrong answers are automatically added to your Mistakes Bank.</p><label>Coverage<select id="eb-gap-scope"><option value="all">Both papers</option><option value="1">Paper 1 · Physical</option><option value="2">Paper 2 · Human</option></select></label><button class="eb-primary" id="eb-gap-start" type="button">Start 30-question test</button></section>';
 if(gap.at>=gap.items.length){
   const c=gap.results.filter(x=>x==="correct").length,p=gap.results.filter(x=>x==="partial").length,w=gap.results.filter(x=>x==="wrong").length,score=Math.round((c+p*.5)/Math.max(1,gap.results.length)*100);
   const topic={};gap.items.forEach((x,i)=>{const r=gap.results[i];topic[x.topic]=topic[x.topic]||{n:0,s:0};topic[x.topic].n++;topic[x.topic].s+=r==="correct"?1:r==="partial"?.5:0;});
   st.gapRuns.unshift({at:Date.now(),score,correct:c,partial:p,wrong:w});st.gapRuns=st.gapRuns.slice(0,25);save();
   return '<section class="eb-box"><h3>Knowledge Gap result</h3><div class="eb-score">'+score+'%</div><p>'+c+' secure · '+p+' partial · '+w+' gaps</p>'+Object.keys(topic).sort((a,b)=>topic[a].s/topic[a].n-topic[b].s/topic[b].n).map(id=>'<div class="eb-topic-row"><div><strong>'+esc(U[id].title)+'</strong><progress max="100" value="'+Math.round(topic[id].s/topic[id].n*100)+'"></progress></div><span>'+Math.round(topic[id].s/topic[id].n*100)+'%</span></div>').join("")+'<div class="eb-actions"><button id="eb-gap-again" class="eb-primary">Run another test</button><button id="eb-open-mistakes">Open Mistakes Bank</button></div></section>';
 }
 const c=gap.items[gap.at];
 return '<section class="eb-box"><div class="eb-spread"><span class="eb-pill">Question '+(gap.at+1)+' / '+gap.items.length+'</span><span class="eb-pill">'+esc(U[c.topic].title)+'</span></div><h3>'+esc(c.q)+'</h3><textarea id="eb-gap-answer" placeholder="Answer from memory. Your typed answer is not auto-marked; reveal and self-assess accurately."></textarea>'+(!gap.reveal?'<button id="eb-gap-reveal" class="eb-primary">Reveal answer</button>':'<div class="eb-answer"><strong>Answer:</strong> '+esc(c.a)+'</div><div class="eb-actions"><button data-gap-rate="correct" class="eb-primary">Correct</button><button data-gap-rate="partial">Partial</button><button data-gap-rate="wrong">Wrong / did not know</button></div>')+'</section>';
}

const STATS=[
["coasts","Holderness / Mappleton","What maximum annual erosion rate does East Riding Council report for parts of the Holderness coast?",4.5,.25,"m/year","Up to 4.5 m/year; this is a maximum, not a uniform average."],
["coasts","Sundarbans","What is the area of the Bangladesh UNESCO Sundarbans World Heritage property?",139500,3000,"ha","About 139,500 ha; this is only part of the wider Sundarbans."],
["glaciers","Vatnajökull","Approximately what share of Iceland is covered by the Vatnajökull National Park UNESCO property?",14,1,"%","About 14% of Iceland; the property exceeds 1.4 million ha."],
["hazards","La Palma 2021","For approximately how many days did the 2021 La Palma eruption continue?",85,2,"days","IGN records 85 days and 8 hours."],
["hazards","Montserrat","How many people were killed by pyroclastic flows in Montserrat in June 1997?",19,0,"deaths","BGS records 19 deaths."],
["hazards","Gorkha earthquake","What was the magnitude of the 25 April 2015 Gorkha earthquake in Nepal?",7.8,.05,"Mw","USGS gives magnitude 7.8."],
["hazards","Typhoon Haiyan","How many deaths were reported by January 2014 after Typhoon Haiyan?",6201,100,"deaths","WMO guidance records 6,201 deaths."],
["hazards","Typhoon Haiyan","Approximately how many people were affected by Typhoon Haiyan?",16,1,"million people","More than 16 million people were affected."],
["hazards","Typhoon Haiyan","What maximum 10-minute sustained wind speed is recorded in the site for Haiyan?",275,10,"km/h","About 275 km/h."],
["ecosystems","Costa Rica","Approximately what percentage of Costa Rica was forest-covered in the World Bank case evidence?",60,3,"%","Nearly 60%."],
["global","Suez / Ever Given","For how many days was the Suez Canal blocked by Ever Given in March 2021?",7,0,"days","Seven days."],
["global","Suez / Ever Given","How many vessels were reported held up by the end of the Ever Given rescue phase?",367,10,"vessels","367 vessels."],
["water","Exmoor peat restoration","How many hectares of peatland does Exmoor National Park report restored through the Exmoor Mires Partnership?",2630,100,"ha","2,630 ha."],
["deserts","Niger FMNR","About how many hectares of degraded farmland were transformed through farmer-managed natural regeneration in southern Niger?",5,.5,"million ha","About 5 million ha."],
["urban","Curitiba BRT","In what year did Curitiba develop its pioneering Bus Rapid Transit system?",1974,0,"year","1974."],
["population","Niger population","What total fertility rate does UNFPA’s 2025 Niger profile give?",5.8,.2,"children per woman","5.8 children per woman."],
["population","Niger population","What percentage of Niger’s population was aged 0–14 in the 2025 UNFPA profile?",46,2,"%","46%."],
["resources","Iceland geothermal","Approximately what percentage of Icelandic domestic-heating energy comes from geothermal energy?",90,3,"%","About 90%."],
["urban","Mumbai","What was Mumbai municipal-area population in the 2011 Census case study?",12.44,.35,"million","12,442,373 — about 12.44 million."],
["urban","River Quaggy","Approximately how much river was restored at Sutcliffe Park?",500,30,"m","Approximately 500 m."],
["global","Rana Plaza","Approximately how many people were killed in the Rana Plaza collapse?",1100,75,"people","Over 1,100 people."],
["places","Battersea Power Station","How large is the developer’s Battersea Power Station masterplan site?",42,2,"acres","42 acres."],
["places","Eden Project","Approximately how many visitors does Eden report since opening in 2001?",25,2,"million visitors","More than 25 million visitors."],
["population","Niger population","Approximately how many years is Niger’s population doubling time in the UNFPA 2025 profile?",22,2,"years","About 22 years."]
];
function num(v){v=String(v||"").toLowerCase().replace(/,/g,"").trim();let m=v.match(/-?\d+(?:\.\d+)?/);if(!m)return NaN;let n=Number(m[0]);if(/billion|\bbn\b/.test(v))n*=1000;if(/million|\bmn\b/.test(v))n*=1;return n;}
function statView(){
 const q=STATS[statAt%STATS.length];
 return '<section class="eb-box"><div class="eb-spread"><div><h3>Case-Study Statistics Trainer</h3><p class="muted">Type the statistic you would use in an exam. Reasonable rounding is accepted.</p></div><span class="eb-pill">'+(statAt+1)+' / '+STATS.length+'</span></div><p class="eyebrow">'+esc(q[1])+'</p><h3>'+esc(q[2])+'</h3><label>Your answer<input id="eb-stat-answer" inputmode="decimal" placeholder="Number or rounded value"></label>'+(!statRevealed?'<button id="eb-stat-check" class="eb-primary">Check</button>':'<div class="eb-answer">'+esc(q[6])+'</div>')+'<div id="eb-stat-feedback"></div><div class="eb-actions"><button id="eb-stat-next">Next statistic</button><button id="eb-stat-shuffle">Shuffle question</button></div><p class="small muted">Score: '+st.caseRight+' correct · '+st.caseWrong+' to review</p></section>';
}
function checkStat(){
 const q=STATS[statAt%STATS.length],v=num(document.getElementById("eb-stat-answer")?.value),ok=Number.isFinite(v)&&Math.abs(v-q[3])<=q[4];
 statRevealed=true;if(ok)st.caseRight++;else{st.caseWrong++;addMistake(q[0],q[2],q[6],"Case-study statistic to relearn","Evidence");}save();render();
 setTimeout(()=>{const b=document.getElementById("eb-stat-feedback");if(b)b.innerHTML='<div class="'+(ok?"eb-feedback-good":"eb-feedback-warn")+'"><strong>'+(ok?"Correct":"Needs review")+'</strong> · accepted answer: '+q[3]+' '+esc(q[5])+'</div>';},0);
}

const DATASETS=[
{id:"hydro",title:"Storm hydrograph",type:"line",labels:["0","1","2","3","4","5","6","7","8"],series:[{name:"Discharge (m³/s)",values:[12,15,28,62,95,74,48,30,20]}],tasks:[
["Calculate the increase in discharge from hour 1 to peak discharge.",2,"80 m³/s (95 − 15)."],
["Describe the pattern of discharge after hour 2.",3,"Discharge rises rapidly from 28 m³/s at hour 2 to a peak of 95 m³/s at hour 4, then falls more gradually to 20 m³/s by hour 8."],
["Suggest two catchment conditions that could help create this relatively short lag response.",4,"Examples: saturated soils, impermeable geology/urban surfaces, steep slopes, sparse interception or efficient drainage. Link each factor to faster transfer to the channel."]
]},
{id:"coast",title:"Coastal retreat by frontage",type:"bar",labels:["A","B","C","D","E"],series:[{name:"Retreat (m/yr)",values:[0.4,1.2,3.8,4.5,2.1]}],tasks:[
["Calculate how many times greater retreat at D is than at A.",2,"4.5 ÷ 0.4 = 11.25 times."],
["Describe the spatial variation in retreat rates.",3,"Rates rise from 0.4 at A to a maximum of 4.5 m/yr at D before falling to 2.1 at E; D is an obvious high-retreat frontage."],
["Assess one limitation of using these five rates to justify a whole-coast management strategy.",4,"Five sites may not represent the whole coastline; rates also vary through time with storms, geology, sediment supply and defences. Management needs longer time series and asset/ecosystem evidence."]
]},
{id:"climate",title:"Monthly climate data",type:"table",headers:["Month","Jan","Mar","May","Jul","Sep","Nov"],rows:[["Rainfall mm",72,64,48,31,55,81],["Mean temp °C",5,8,14,19,16,9]],tasks:[
["Calculate the temperature range from the values shown.",2,"19 − 5 = 14°C."],
["Describe the relationship between temperature and rainfall across the sampled months.",3,"Rainfall generally falls as temperatures rise towards July, then rainfall rises as temperatures fall into autumn; the relationship is broadly inverse in these sampled months."],
["Explain why six sampled months are insufficient to classify the climate confidently.",4,"Half the months are missing, one year may be anomalous, and climate classification normally requires long-term averages plus full seasonality/extremes."]
]},
{id:"glacier",title:"Glacier annual mass balance",type:"line",labels:["2018","2019","2020","2021","2022","2023"],series:[{name:"m w.e.",values:[-0.4,-0.7,-0.2,-1.1,-0.9,-1.3]}],tasks:[
["In which year was mass loss least severe?",1,"2020, at −0.2 m water equivalent."],
["Describe the overall trend from 2018 to 2023.",3,"All years show negative mass balance. Despite fluctuations, loss becomes more negative overall, reaching −1.3 m w.e. in 2023."],
["Explain why this six-year record alone cannot prove long-term climate change caused the losses.",4,"A short time series can be affected by weather variability; attribution needs longer records and evidence about temperature, snowfall, radiation and glacier dynamics."]
]},
{id:"urban",title:"PM2.5 by urban site",type:"bar",labels:["Park","Residential","High street","Roadside","Industrial"],series:[{name:"PM2.5 µg/m³",values:[8,11,16,23,19]}],tasks:[
["Calculate the percentage difference between roadside and park PM2.5 using the park as the base.",3,"(23 − 8) ÷ 8 × 100 = 187.5% higher."],
["Describe the pattern across the sites.",3,"Park is lowest at 8, followed by residential 11; concentrations are higher at high street 16, industrial 19 and highest roadside 23 µg/m³."],
["Suggest why the roadside site may not represent pollution exposure across the whole city.",4,"Traffic emissions and street-canyon conditions can create a local hotspot; exposure also varies with time, wind, building form and where people spend time."]
]},
{id:"regen",title:"Regeneration indicators",type:"table",headers:["Indicator","Before","After"],rows:[["Median monthly rent (£)",850,1450],["Jobs in study area",4200,6100],["EQS score / 50",24,39],["Residents saying 'strong belonging' (%)",62,48]],tasks:[
["Calculate the percentage increase in median monthly rent.",3,"(1450 − 850) ÷ 850 × 100 ≈ 70.6%."],
["Give one piece of evidence that regeneration improved the area and one that suggests a social cost.",4,"Improvement: jobs rise 4,200→6,100 or EQS 24→39. Social cost: rent rises sharply and strong belonging falls 62%→48%."],
["Assess why these indicators cannot by themselves prove regeneration improved quality of life for existing residents.",6,"Area averages may reflect population replacement; causation is uncertain; indicators weight dimensions differently; resident subgroups may experience gains/losses unequally. Add longitudinal/resident-level evidence."]
]},
{id:"trade",title:"Container traffic index",type:"line",labels:["2019","2020","2021","2022","2023","2024"],series:[{name:"Index 2019=100",values:[100,92,111,106,115,121]}],tasks:[
["Calculate the percentage change in the index from 2019 to 2024.",2,"(121 − 100) ÷ 100 × 100 = 21%."],
["Describe the main anomaly in the series.",3,"The index drops to 92 in 2020, below the 2019 base, before rebounding to 111 in 2021 and then trending upward overall."],
["Suggest why an index is useful but also limited when comparing global trade.",4,"It shows relative change clearly, but hides absolute volumes, route differences, commodity value, regional variation and changes in the base measure."]
]},
{id:"population",title:"Age structure comparison",type:"table",headers:["Age group","Country X %","Country Y %"],rows:[["0–14",44,16],["15–64",53,62],["65+",3,22]],tasks:[
["Calculate the total dependency ratio for Country X per 100 working-age people.",3,"Dependants = 44 + 3 = 47. 47 ÷ 53 × 100 ≈ 88.7 dependants per 100 working-age people."],
["Compare the two age structures.",4,"X is much younger: 44% aged 0–14 and only 3% 65+. Y has 16% children but 22% aged 65+, with a larger working-age share."],
["Suggest one different planning pressure each country may face.",4,"X: schools, maternal/child health and future jobs. Y: pensions, healthcare, social care and labour shortages. Credit developed links."]
]}
];
function chartSVG(d){
 if(d.type==="table")return '<table class="eb-table"><thead><tr>'+d.headers.map(h=>'<th>'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+d.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join("")+'</tr>').join("")+'</tbody></table>';
 const vals=d.series[0].values,W=760,H=300,p=48,max=Math.max(...vals),min=Math.min(0,...vals),span=max-min||1,x=i=>p+i*(W-2*p)/Math.max(1,vals.length-1),y=v=>H-p-(v-min)/span*(H-2*p);
 let body='<svg class="eb-chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(d.title)+'">';
 body+='<line x1="'+p+'" y1="'+(H-p)+'" x2="'+(W-p)+'" y2="'+(H-p)+'" stroke="currentColor"/><line x1="'+p+'" y1="'+p+'" x2="'+p+'" y2="'+(H-p)+'" stroke="currentColor"/>';
 if(d.type==="bar"){const bw=(W-2*p)/vals.length*.65;vals.forEach((v,i)=>{const xx=p+(i+.5)*(W-2*p)/vals.length-bw/2,yy=y(v);body+='<rect x="'+xx+'" y="'+yy+'" width="'+bw+'" height="'+(H-p-yy)+'" fill="currentColor" opacity=".55"/>';});}
 else{body+='<polyline fill="none" stroke="currentColor" stroke-width="4" points="'+vals.map((v,i)=>x(i)+','+y(v)).join(" ")+'"/>';vals.forEach((v,i)=>body+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="5" fill="currentColor"/>');}
 d.labels.forEach((lab,i)=>{const xx=d.type==="bar"?p+(i+.5)*(W-2*p)/vals.length:x(i);body+='<text x="'+xx+'" y="'+(H-18)+'" text-anchor="middle" fill="currentColor" font-size="12">'+esc(lab)+'</text>';});
 vals.forEach((v,i)=>{const xx=d.type==="bar"?p+(i+.5)*(W-2*p)/vals.length:x(i);body+='<text x="'+xx+'" y="'+(y(v)-9)+'" text-anchor="middle" fill="currentColor" font-size="12">'+v+'</text>';});
 return body+'</svg>';
}
function ao3Tasks(){const out=[];DATASETS.forEach(d=>d.tasks.forEach((t,i)=>out.push({d,t,i})));return out;}
function ao3View(){
 const all=ao3Tasks(),x=all[ao3At%all.length],key=x.d.id+":"+x.i,done=!!st.ao3Done[key];
 return '<section class="eb-box"><div class="eb-spread"><div><h3>AO3 Mega Bank</h3><p class="muted">Original exam-style resources: calculations, description, inference and limitations.</p></div><span class="eb-pill">'+(ao3At+1)+' / '+all.length+' tasks</span></div><h3>'+esc(x.d.title)+'</h3>'+chartSVG(x.d)+'<p class="eyebrow">'+x.t[1]+' marks</p><h3>'+esc(x.t[0])+'</h3><textarea placeholder="Write your answer before revealing the model points."></textarea>'+(!ao3Reveal?'<button id="eb-ao3-reveal" class="eb-primary">Reveal model points</button>':'<div class="eb-answer">'+esc(x.t[2])+'</div><div class="eb-actions"><button data-ao3-rate="secure" class="eb-primary">Secure</button><button data-ao3-rate="review">Needs review</button></div>')+'<p class="small muted">'+(done?"Previously marked secure/reviewed.":"Not attempted yet.")+'</p><button id="eb-ao3-next">Next AO3 task</button></section>';
}

function mapSVG(){
 let g='<svg class="eb-map" viewBox="0 0 760 760" role="img" aria-label="Original fictional OS-style training map, scale 1 to 25,000">';
 g+='<rect width="760" height="760" fill="#f5f0dd"/>';
 for(let i=0;i<=10;i++){let p=55+i*65;g+='<line class="grid" x1="'+p+'" y1="55" x2="'+p+'" y2="705"/><line class="grid" x1="55" y1="'+p+'" x2="705" y2="'+p+'"/>';if(i<10){g+='<text class="coord" x="'+(p+5)+'" y="725">'+(30+i)+'</text><text class="coord" x="25" y="'+(700-i*65)+'">'+(60+i)+'</text>';}}
 g+='<path class="wood" d="M95 150 L230 120 L250 260 L120 285 Z"/><text class="label" x="120" y="205">Pine Wood</text>';
 g+='<path class="water" d="M520 505 q55 -35 110 5 q-25 70 -95 65 z"/><text class="small" x="545" y="535">Lake Mere</text>';
 g+='<path class="river" d="M415 70 C400 170 355 230 380 330 C400 420 335 500 300 700"/><text class="small" x="355" y="350">River Lune</text>';
 g+='<path class="road" d="M80 560 L250 500 L350 425 L470 360 L675 300"/><text class="small" x="505" y="335">A610</text>';
 g+='<path class="minor" d="M250 500 L185 620 L100 665"/><path class="minor" d="M350 425 L520 505"/>';
 [[360,190,70],[360,190,105],[360,190,140],[360,190,175]].forEach((c,i)=>g+='<ellipse class="contour" cx="'+c[0]+'" cy="'+c[1]+'" rx="'+(c[2]+i*5)+'" ry="'+(c[2]*.55+i*3)+'"/>');
 g+='<text class="small" x="330" y="95">220</text><text class="small" x="305" y="120">200</text><text class="small" x="280" y="145">180</text><text class="small" x="255" y="170">160</text>';
 g+='<circle cx="523" cy="425" r="9" class="settle"/><circle cx="540" cy="440" r="8" class="settle"/><circle cx="505" cy="445" r="8" class="settle"/><text class="label" x="545" y="420">Oakford</text>';
 g+='<polygon points="523,122 515,138 531,138" fill="#222"/><text class="label" x="538" y="132">▲ 240</text>';
 g+='<rect x="276" y="535" width="18" height="12" fill="#222"/><text class="small" x="300" y="545">Bridge</text>';
 g+='<polygon points="425,610 435,628 415,628" fill="#7b4f2d"/><text class="small" x="442" y="625">Camp</text>';
 g+='<text class="small" x="585" y="690">Scale 1:25,000</text><path d="M570 660 h100" stroke="#222" stroke-width="4"/><path d="M570 655 v10 M620 655 v10 M670 655 v10" stroke="#222" stroke-width="2"/><text class="small" x="568" y="650">0</text><text class="small" x="615" y="650">0.5</text><text class="small" x="662" y="650">1 km</text>';
 return g+'</svg>';
}
const MAPQ=[
["Give the four-figure grid reference for Oakford.","3764","Easting first, then northing: Oakford lies in square 3764.","urban"],
["Give the four-figure grid reference for the summit marked ▲240.","3768","The summit lies in grid square 3768.","glaciers"],
["What is the height of the marked summit?","240 m","The spot height shown is 240 m.","glaciers"],
["What is the contour interval on the hill?","20 m","The labelled contours increase 160, 180, 200, 220 m: interval 20 m.","glaciers"],
["In which general direction is the summit from Oakford?","north-west / NW","From Oakford the summit is mainly north-west.","glaciers"],
["What map distance does 6 cm represent at 1:25,000?","1.5 km","1 cm = 250 m, so 6 cm = 1,500 m = 1.5 km.","urban"],
["A route climbs 100 m over 2 km horizontally. Express the gradient as 1:n.","1:20","2 km = 2,000 m; 2,000 ÷ 100 = 20, so gradient = 1:20.","glaciers"],
["Give one piece of map evidence that the north-west of the map is wooded.","green woodland area / Pine Wood label","The shaded area is labelled Pine Wood; map symbols/colour indicate woodland.","ecosystems"],
["Give one piece of evidence for settlement near the A610.","Oakford / building symbols","Oakford and clustered building symbols lie close to the A610.","urban"],
["Why are close contour lines useful evidence of a steep slope?","height changes over a short horizontal distance","Closely spaced contours mean elevation changes rapidly over a short map distance.","glaciers"],
["Suggest one reason a campsite might be located near, but not directly beside, the river.","access to water but lower flood risk","A slightly set-back site retains access while reducing flood exposure; other sensible map-based reasons are valid.","water"],
["What is the correct order when reading a grid reference?","eastings then northings","Read along the corridor (eastings) first, then up the stairs (northings).","water"],
["At 1:25,000, what ground distance does 4 cm represent?","1 km","4 × 250 m = 1,000 m = 1 km.","urban"],
["If two points are 180 m and 60 m high, what is their relief?","120 m","Relief = highest − lowest = 120 m.","glaciers"],
["State one limitation of estimating land use from a map alone.","map may be outdated / symbols generalise reality","Maps are snapshots and generalise features; field observation or newer GIS imagery may show changes.","urban"]
];
function mapView(){
 const q=MAPQ[mapAt%MAPQ.length],key=String(mapAt%MAPQ.length);
 return '<section class="eb-box"><div class="eb-spread"><div><h3>OS Map Skills Trainer</h3><p class="muted">Uses an original fictional OS-style map, not Ordnance Survey copyrighted mapping.</p></div><span class="eb-pill">'+(mapAt+1)+' / '+MAPQ.length+'</span></div><div class="eb-map-wrap">'+mapSVG()+'</div><h3>'+esc(q[0])+'</h3><input id="eb-map-answer" placeholder="Enter your answer">'+(!mapReveal?'<button id="eb-map-reveal" class="eb-primary">Reveal answer</button>':'<div class="eb-answer"><strong>Answer:</strong> '+esc(q[1])+'<br>'+esc(q[2])+'</div><div class="eb-actions"><button data-map-rate="secure" class="eb-primary">Got it</button><button data-map-rate="review">Need to review</button></div>')+'<button id="eb-map-next">Next map question</button></section>';
}
function render(){
 document.querySelectorAll("[data-eb-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ebTab===tab)));
 const box=document.getElementById("eb-content");if(!box)return;
 box.innerHTML=tab==="gap"?gapView():tab==="stats"?statView():tab==="ao3"?ao3View():mapView();
}
function open(){render();dlg.showModal?dlg.showModal():dlg.setAttribute("open","");}
function close(){dlg.close?dlg.close():dlg.removeAttribute("open");}
launch.addEventListener("click",open);document.getElementById("eb-close").addEventListener("click",close);
dlg.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.ebTab){tab=b.dataset.ebTab;render();return;}
 if(b.id==="eb-gap-start"){startGap(document.getElementById("eb-gap-scope").value);return;}
 if(b.id==="eb-gap-reveal"){gap.reveal=true;render();return;}
 if(b.dataset.gapRate){const c=gap.items[gap.at],r=b.dataset.gapRate;gap.results.push(r);if(r!=="correct")addMistake(c.topic,c.q,c.a,"Knowledge Gap Test: "+r,"Knowledge");logQ(c.q,c.topic,"Knowledge Gap Test",null,true,r==="correct"?100:r==="partial"?50:0);gap.at++;gap.reveal=false;render();return;}
 if(b.id==="eb-gap-again"){gap=null;render();return;}
 if(b.id==="eb-open-mistakes"){close();document.getElementById("smart-launch")?.click();setTimeout(()=>document.querySelector('[data-sr-tab="mistakes"]')?.click(),50);return;}
 if(b.id==="eb-stat-check"){checkStat();return;}
 if(b.id==="eb-stat-next"){statAt=(statAt+1)%STATS.length;statRevealed=false;render();return;}
 if(b.id==="eb-stat-shuffle"){statAt=Math.floor(Math.random()*STATS.length);statRevealed=false;render();return;}
 if(b.id==="eb-ao3-reveal"){ao3Reveal=true;render();return;}
 if(b.dataset.ao3Rate){const x=ao3Tasks()[ao3At%ao3Tasks().length],key=x.d.id+":"+x.i;st.ao3Done[key]=b.dataset.ao3Rate;if(b.dataset.ao3Rate==="review")addMistake(x.d.id==="urban"?"urban":x.d.id==="coast"?"coasts":x.d.id==="glacier"?"glaciers":x.d.id==="population"?"population":x.d.id==="trade"?"global":"water",x.t[0],x.t[2],"AO3 resource question to revisit","Application");save();ao3At=(ao3At+1)%ao3Tasks().length;ao3Reveal=false;render();return;}
 if(b.id==="eb-ao3-next"){ao3At=(ao3At+1)%ao3Tasks().length;ao3Reveal=false;render();return;}
 if(b.id==="eb-map-reveal"){mapReveal=true;render();return;}
 if(b.dataset.mapRate){const q=MAPQ[mapAt%MAPQ.length];st.mapDone[String(mapAt%MAPQ.length)]=b.dataset.mapRate;if(b.dataset.mapRate==="review")addMistake(q[3],q[0],q[1]+" — "+q[2],"OS map skill to revisit","Application");save();mapAt=(mapAt+1)%MAPQ.length;mapReveal=false;render();return;}
 if(b.id==="eb-map-next"){mapAt=(mapAt+1)%MAPQ.length;mapReveal=false;render();return;}
});
})();