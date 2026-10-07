/* Geography Mega Tools: case statistics, knowledge gaps, AO3 and OS-map skills. */
(function(){
"use strict";
if(document.getElementById("geo-mega-launch"))return;

var KEY="aqa-geo-mega-tools-v1";
var state={gapRuns:0,gaps:0,secure:0,statCorrect:0,statTotal:0,osCorrect:0,osTotal:0};
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&typeof saved==="object")Object.assign(state,saved);}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];});}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function norm(s){return String(s||"").toLowerCase().replace(/,/g,"").replace(/\s+/g," ").trim();}
function allCases(){
 if(typeof CASES==="undefined"||!Array.isArray(CASES))return[];
 return CASES.map(function(c,i){
  if(Array.isArray(c))return{id:"case-"+i,tags:String(c[0]||"").split(/\s+/),name:c[1]||"Case study",location:c[2]||"",stats:c[3]||"",factors:c[4]||"",evaluation:c[5]||"",sourceLabel:c[6]||"",sourceURL:c[7]||""};
  return{id:c.id||("case-"+i),tags:Array.isArray(c.tags)?c.tags:String(c.tags||"").split(/\s+/),name:c.name||"Case study",location:c.location||"",stats:c.stats||"",factors:c.factors||"",evaluation:c.evaluation||"",sourceLabel:c.sourceLabel||"",sourceURL:c.sourceURL||""};
 });
}
function smartCards(){try{return window.__aqaSmart&&typeof window.__aqaSmart.cards==="function"?window.__aqaSmart.cards():[];}catch(e){return[];}}
function topicOptions(){
 var out=[{id:"all",title:"All topics"}];
 try{if(typeof U!=="undefined")Object.keys(U).forEach(function(id){out.push({id:id,title:U[id].title||id});});}catch(e){}
 return out;
}

var css=document.createElement("style");
css.textContent=[
"#geo-mega-launch{position:fixed;left:1rem;bottom:1rem;z-index:49;background:var(--teal,#5eead4);color:#092522;border:0;border-radius:999px;padding:.8rem 1rem;font-weight:800;box-shadow:0 8px 28px #0008}",
"#geo-mega-dialog{width:min(1120px,97vw);max-height:94vh;background:var(--panel,#171d21);color:var(--text,#eef6f4);border:1px solid var(--line,#33434a);border-radius:16px;padding:1rem}",
"#geo-mega-dialog::backdrop{background:#000c}.gm-head,.gm-row,.gm-spread{display:flex;gap:.7rem;align-items:center;justify-content:space-between}.gm-tabs{display:flex;gap:.4rem;overflow:auto;border-bottom:1px solid var(--line,#33434a);padding:.7rem 0;margin-bottom:1rem}.gm-tabs button{white-space:nowrap}.gm-tabs button[aria-pressed=true]{border-color:var(--teal,#5eead4);color:var(--teal,#5eead4)}",
".gm-box{border:1px solid var(--line,#33434a);border-radius:14px;padding:1rem;background:#20292f;margin:.75rem 0}.gm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}.gm-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}.gm-big{font-size:1.25rem;font-weight:800}.gm-kpi{font-size:1.8rem;font-weight:900;color:var(--teal,#5eead4)}.gm-muted{color:var(--muted,#a7b6b4)}",
".gm-answer{border-left:3px solid var(--teal,#5eead4);padding:.8rem 1rem;background:#182326;margin:.8rem 0}.gm-good{border-color:#4ade80!important}.gm-bad{border-color:#fb7185!important}.gm-actions{display:flex;gap:.5rem;flex-wrap:wrap}.gm-actions button{min-height:42px}",
".gm-os svg{max-width:520px;width:100%;height:auto;background:#f7f4e8;border-radius:10px}.gm-os input,.gm-box input,.gm-box select,.gm-box textarea{width:100%;margin:.35rem 0 .7rem}.gm-box textarea{min-height:90px}.gm-chip{display:inline-block;border:1px solid var(--line,#33434a);border-radius:999px;padding:.2rem .55rem;margin:.15rem;font-size:.82rem}.gm-progress{height:8px;width:100%;accent-color:var(--teal,#5eead4)}",
"@media(max-width:720px){#geo-mega-launch{left:.7rem;bottom:.7rem}.gm-grid,.gm-grid3{grid-template-columns:1fr}.gm-head{align-items:flex-start}.gm-row{display:block}}"
].join("");
document.head.appendChild(css);

var launch=document.createElement("button");
launch.id="geo-mega-launch";launch.type="button";launch.textContent="Geo Mega Tools";
document.body.appendChild(launch);

var dialog=document.createElement("dialog");
dialog.id="geo-mega-dialog";
dialog.innerHTML='<div class="gm-head"><div><p class="gm-muted" style="margin:0">Exam training suite</p><h2 style="margin:.15rem 0">Geography Mega Tools</h2></div><button id="gm-close" type="button">Close</button></div>'+
'<nav class="gm-tabs" aria-label="Geography mega tools">'+
'<button type="button" data-gm-tab="stats" aria-pressed="true">Case-study statistics</button>'+
'<button type="button" data-gm-tab="gaps">Knowledge Gap Test</button>'+
'<button type="button" data-gm-tab="ao3">AO3 Mega Bank</button>'+
'<button type="button" data-gm-tab="os">OS Map Skills</button></nav>'+
'<div id="gm-content"></div>';
document.body.appendChild(dialog);
var content=dialog.querySelector("#gm-content"),active="stats";

function setTab(t){active=t;dialog.querySelectorAll("[data-gm-tab]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.gmTab===t));});render();}
launch.addEventListener("click",function(){render();dialog.showModal();});
dialog.querySelector("#gm-close").addEventListener("click",function(){dialog.close();});
dialog.querySelector(".gm-tabs").addEventListener("click",function(e){var b=e.target.closest("[data-gm-tab]");if(b)setTab(b.dataset.gmTab);});

/* ---------- Case-study statistics trainer ---------- */
var statQueue=[],statIndex=0,statRevealed=false;
function extractAnswer(c,kind){
 var s=c.stats||"",m;
 if(kind==="holderness"){m=s.match(/up to\s*([\d.]+\s*m\/year)/i);return m?m[1]:"up to 4.5 m/year";}
 if(kind==="haiyan"){m=s.match(/([\d,]+)\s+people were reported dead/i);return m?m[1]+" deaths":"6,201 deaths";}
 if(kind==="derwent"){m=s.match(/([\d.]+\s*mm)\s+in 24 hours/i);return m?m[1]:"341.4 mm in 24 hours";}
 if(kind==="amazon"){m=s.match(/([\d,]+\s*km²)/i);return m?m[1]:"67,764 km²";}
 if(kind==="battersea"){m=s.match(/(\d+)-acre/i);return m?m[1]+" acres":"42 acres";}
 if(kind==="haiyanwind"){m=s.match(/about\s*([\d,]+\s*km\/h)/i);return m?m[1]:"275 km/h";}
 if(kind==="costarica"){m=s.match(/nearly\s*(\d+%)/i);return m?"nearly "+m[1]:"nearly 60%";}
 if(kind==="suez"){m=s.match(/seven days/i);return m?"7 days":"7 days";}
 return s;
}
function curatedStats(){
 var cs=allCases(),out=[];
 function add(re,q,kind,needle){var c=cs.find(function(x){return re.test(x.name);});if(c)out.push({case:c,q:q,a:extractAnswer(c,kind),needle:needle||null});}
 add(/Holderness|Mappleton/i,"What maximum erosion rate does the site's source give for Holderness?","holderness","4.5");
 add(/Haiyan/i,"How many people were reported dead after Typhoon Haiyan by January 2014?","haiyan","6201");
 add(/Haiyan/i,"What maximum 10-minute sustained wind speed is recorded for Typhoon Haiyan?","haiyanwind","275");
 add(/Derwent|Storm Desmond/i,"How much rain fell at Honister Pass in 24 hours during Storm Desmond?","derwent","341.4");
 add(/Amazon|Rondônia/i,"How much forest had been cleared in Rondônia by 2003 in the site's NASA statistic?","amazon","67764");
 add(/Battersea Power Station/i,"What is the developer's stated masterplan site size at Battersea Power Station?","battersea","42");
 add(/Costa Rica/i,"Roughly what share of Costa Rica was forest-covered in the cited 2022 figure?","costarica","60");
 add(/Suez|Ever Given/i,"For how many days did Ever Given block the Suez Canal in March 2021?","suez","7");
 cs.forEach(function(c){
  if(c.stats&&out.length<24&&!out.some(function(x){return x.case.id===c.id;}))out.push({case:c,q:"Recall one precise statistic for "+c.name+".",a:c.stats,needle:null,self:true});
 });
 return out;
}
function resetStats(){statQueue=shuffle(curatedStats()).slice(0,Math.min(12,curatedStats().length));statIndex=0;statRevealed=false;}
function statsView(){
 if(!statQueue.length)resetStats();
 var q=statQueue[statIndex];
 if(!q)return'<section class="gm-box"><h3>No case statistics found</h3><p>The trainer will populate when the case-study bank is available.</p></section>';
 return'<div class="gm-grid3"><section class="gm-box"><div class="gm-kpi">'+state.statCorrect+'/'+state.statTotal+'</div><div class="gm-muted">all-time checked answers</div></section><section class="gm-box"><div class="gm-kpi">'+(statIndex+1)+'/'+statQueue.length+'</div><div class="gm-muted">current run</div></section><section class="gm-box"><strong>'+esc(q.case.name)+'</strong><div class="gm-muted">'+esc((q.case.tags||[]).join(" · "))+'</div></section></div>'+
 '<section class="gm-box"><p class="gm-muted">Case-study Statistics Trainer</p><h3>'+esc(q.q)+'</h3>'+
 '<input id="gm-stat-input" autocomplete="off" placeholder="'+(q.self?"Write a statistic from memory":"Type the number / value")+'">'+
 '<div class="gm-actions"><button id="gm-stat-check" type="button">Check / reveal</button><button id="gm-stat-skip" type="button">Skip</button><button id="gm-stat-reset" type="button">New set</button></div>'+
 (statRevealed?'<div class="gm-answer"><strong>Answer:</strong> '+esc(q.a)+(q.case.sourceLabel?'<br><span class="gm-muted">Source in case bank: '+esc(q.case.sourceLabel)+'</span>':"")+'</div>':"")+
 '</section>';
}
function nextStat(){statIndex++;statRevealed=false;if(statIndex>=statQueue.length)resetStats();render();}
function checkStat(){
 var q=statQueue[statIndex],input=dialog.querySelector("#gm-stat-input"),v=norm(input&&input.value);
 if(!statRevealed){statRevealed=true;if(q.needle){state.statTotal++;var ok=norm(v).indexOf(norm(q.needle))>=0;if(ok)state.statCorrect++;save();}render();return;}
 nextStat();
}

/* ---------- Knowledge Gap Test ---------- */
var gap={cards:[],i:0,reveal:false,runSecure:0,runGaps:0,topic:"all"};
function startGap(topic){
 var cards=smartCards().filter(function(c){return topic==="all"||c.topic===topic;});
 gap={cards:shuffle(cards).slice(0,Math.min(12,cards.length)),i:0,reveal:false,runSecure:0,runGaps:0,topic:topic||"all"};
}
function gapView(){
 var tops=topicOptions();
 if(!gap.cards.length)return'<section class="gm-box"><h3>Knowledge Gap Test</h3><p>Choose a topic and run a fast 12-card diagnostic. Marking “Gap” also feeds the item into Smart Revision mistakes.</p>'+
 '<label>Topic<select id="gm-gap-topic">'+tops.map(function(t){return'<option value="'+esc(t.id)+'">'+esc(t.title)+'</option>';}).join("")+'</select></label><button id="gm-gap-start" type="button">Start test</button></section>'+
 '<div class="gm-grid3"><section class="gm-box"><div class="gm-kpi">'+state.gaps+'</div><div class="gm-muted">gaps found</div></section><section class="gm-box"><div class="gm-kpi">'+state.secure+'</div><div class="gm-muted">secure recalls</div></section><section class="gm-box"><div class="gm-kpi">'+state.gapRuns+'</div><div class="gm-muted">completed runs</div></section></div>';
 if(gap.i>=gap.cards.length){
  return'<section class="gm-box"><h3>Diagnostic complete</h3><div class="gm-grid"><div><div class="gm-kpi">'+gap.runSecure+'</div><p>Secure</p></div><div><div class="gm-kpi">'+gap.runGaps+'</div><p>Knowledge gaps</p></div></div><p class="gm-muted">Anything marked as a gap has also been sent to the Smart Revision mistake system where available.</p><button id="gm-gap-again" type="button">Run another test</button></section>';
 }
 var c=gap.cards[gap.i];
 return'<section class="gm-box"><div class="gm-spread"><span class="gm-chip">'+(gap.i+1)+' / '+gap.cards.length+'</span><span class="gm-muted">'+esc(c.title||c.topic||"")+'</span></div><h3>'+esc(c.q)+'</h3>'+
 '<textarea id="gm-gap-draft" placeholder="Answer from memory before revealing..."></textarea>'+
 (gap.reveal?'<div class="gm-answer"><strong>Model answer</strong><p>'+esc(c.a)+'</p></div><div class="gm-actions"><button class="gm-good" data-gap-rate="secure" type="button">Secure</button><button class="gm-bad" data-gap-rate="gap" type="button">Gap</button></div>':'<button id="gm-gap-reveal" type="button">Reveal model answer</button>')+
 '</section>';
}
function rateGap(rate){
 var c=gap.cards[gap.i];
 if(rate==="gap"){gap.runGaps++;state.gaps++;try{if(window.__aqaSmart&&window.__aqaSmart.addMistake)window.__aqaSmart.addMistake(c.topic||"general",c.q,c.a,"Knowledge Gap Test","Knowledge");}catch(e){}}
 else{gap.runSecure++;state.secure++;}
 gap.i++;gap.reveal=false;
 if(gap.i>=gap.cards.length)state.gapRuns++;
 save();render();
}

/* ---------- AO3 Mega Bank ---------- */
var ao3Query="",ao3Topic="all",ao3Pick=null;
function ao3Entries(){
 var out=[];
 try{
  if(typeof U!=="undefined")Object.keys(U).forEach(function(id){
   var u=U[id];
   (u.notes||[]).forEach(function(n,i){if(n[2])out.push({topic:id,type:"Concept evaluation",title:n[0],text:n[2],context:u.title});});
   (u.prompts||[]).forEach(function(p,i){if(p[4])out.push({topic:id,type:"Essay judgement",title:p[0],text:p[4],context:u.title});});
  });
 }catch(e){}
 allCases().forEach(function(c){if(c.evaluation)out.push({topic:(c.tags||[])[0]||"general",tags:c.tags||[],type:"Case-study evaluation",title:c.name,text:c.evaluation,context:c.location});});
 try{(window.GEO_THEORIES||[]).forEach(function(x){out.push({topic:(String(x[3]||"").split(/\s+/)[0]||"general"),tags:String(x[3]||"").split(/\s+/),type:"Theory / model",title:x[0],text:x[2]+" "+x[1],context:"Theory bank"});});}catch(e){}
 try{(window.SYNOPTIC_CARDS||[]).forEach(function(x){out.push({topic:(String(x[3]||"").split(/\s+/)[0]||"general"),tags:String(x[3]||"").split(/\s+/),type:"Synoptic link",title:x[0],text:x[2]+" "+x[1],context:"Synoptic bank"});});}catch(e){}
 return out;
}
function ao3Filtered(){
 var q=norm(ao3Query);
 return ao3Entries().filter(function(x){
  var topicOK=ao3Topic==="all"||x.topic===ao3Topic||(x.tags||[]).indexOf(ao3Topic)>=0;
  var text=norm([x.title,x.text,x.context,(x.tags||[]).join(" ")].join(" "));
  return topicOK&&(!q||text.indexOf(q)>=0);
 });
}
function ao3View(){
 var list=ao3Filtered(),tops=topicOptions();
 if(!ao3Pick||list.indexOf(ao3Pick)<0)ao3Pick=list.length?pick(list):null;
 return'<section class="gm-box"><h3>AO3 Mega Bank</h3><p class="gm-muted">Pulls evaluation from topic notes, essay judgements, case-study limitations, theories and synoptic links already in the site.</p><div class="gm-grid"><label>Filter by topic<select id="gm-ao3-topic">'+tops.map(function(t){return'<option value="'+esc(t.id)+'" '+(t.id===ao3Topic?"selected":"")+'>'+esc(t.title)+'</option>';}).join("")+'</select></label><label>Search<input id="gm-ao3-search" value="'+esc(ao3Query)+'" placeholder="e.g. scale, inequality, climate, governance"></label></div><div class="gm-spread"><strong>'+list.length+' evaluation moves available</strong><button id="gm-ao3-random" type="button">Random AO3 move</button></div></section>'+
 (ao3Pick?'<section class="gm-box"><span class="gm-chip">'+esc(ao3Pick.type)+'</span><h3>'+esc(ao3Pick.title)+'</h3><p class="gm-muted">'+esc(ao3Pick.context||"")+'</p><div class="gm-answer">'+esc(ao3Pick.text)+'</div><p><strong>Turn it into AO3:</strong> make the criterion explicit, apply it to the named evidence, compare importance/scale/timescale, then finish with a conditional judgement.</p></section>':'<section class="gm-box"><p>No matching AO3 entries.</p></section>');
}

/* ---------- OS Map Skills ---------- */
var osQ=null,osFeedback="";
function svgGrid(e,n,xd,yd){
 var x=55+xd*35,y=405-yd*35,s='<svg viewBox="0 0 460 460" role="img" aria-label="Practice grid square with point X">';
 for(var i=0;i<=10;i++){var p=55+i*35;s+='<line x1="'+p+'" y1="55" x2="'+p+'" y2="405" stroke="#9a9a86" stroke-width="'+(i===0||i===10?2:1)+'"/><line x1="55" y1="'+p+'" x2="405" y2="'+p+'" stroke="#9a9a86" stroke-width="'+(i===0||i===10?2:1)+'"/>';}
 s+='<text x="52" y="435" fill="#222" font-size="20">'+e+'</text><text x="388" y="435" fill="#222" font-size="20">'+(e+1)+'</text><text x="18" y="410" fill="#222" font-size="20">'+n+'</text><text x="18" y="72" fill="#222" font-size="20">'+(n+1)+'</text>';
 s+='<circle cx="'+x+'" cy="'+y+'" r="10" fill="#b91c1c"/><text x="'+(x+13)+'" y="'+(y-10)+'" fill="#111" font-size="22" font-weight="700">X</text></svg>';
 return s;
}
function newOS(mode){
 mode=mode||pick(["grid","scale","bearing","gradient"]);
 if(mode==="grid"){var e=30+Math.floor(Math.random()*20),n=40+Math.floor(Math.random()*30),xd=1+Math.floor(Math.random()*8),yd=1+Math.floor(Math.random()*8);osQ={mode:mode,title:"Six-figure grid reference",q:"Give the six-figure grid reference for X. Read eastings first, then northings.",answer:""+e+xd+n+yd,display:svgGrid(e,n,xd,yd),explain:"Eastings first: "+e+" and "+xd+" tenths; northings second: "+n+" and "+yd+" tenths."};}
 if(mode==="scale"){var cm=2+Math.floor(Math.random()*13)/2,km=cm*.25;osQ={mode:mode,title:"1:25,000 scale",q:"Two points are "+cm+" cm apart on a 1:25,000 map. What is the straight-line ground distance in km?",answer:String(Number(km.toFixed(3))),display:"",explain:"At 1:25,000, 1 cm = 250 m = 0.25 km. "+cm+" × 0.25 = "+Number(km.toFixed(3))+" km."};}
 if(mode==="bearing"){var vals=[0,45,90,135,180,225,270,315],a=pick(vals);osQ={mode:mode,title:"Bearings",q:"A line from A to B points "+({0:"due north",45:"north-east",90:"due east",135:"south-east",180:"due south",225:"south-west",270:"due west",315:"north-west"}[a])+". Give the three-figure bearing.",answer:String(a).padStart(3,"0"),display:'<div style="font-size:5rem;text-align:center;transform:rotate('+a+'deg)">↑</div>',explain:"Bearings are measured clockwise from north and written with three figures: "+String(a).padStart(3,"0")+"°."};}
 if(mode==="gradient"){var rise=40+Math.floor(Math.random()*9)*10,dist=(1+Math.floor(Math.random()*5))*500,ratio=Math.round(dist/rise);osQ={mode:mode,title:"Contour gradient",q:"Point B is "+rise+" m higher than point A. Their horizontal ground distance is "+dist+" m. Express the average gradient approximately as 1:n.",answer:String(ratio),display:"",explain:"Gradient = vertical change : horizontal distance = "+rise+":"+dist+". Divide both by "+rise+" ≈ 1:"+ratio+"."};}
 osFeedback="";
}
function osView(){
 if(!osQ)newOS();
 return'<div class="gm-grid"><section class="gm-box gm-os"><span class="gm-chip">'+esc(osQ.title)+'</span><h3>'+esc(osQ.q)+'</h3>'+osQ.display+'<input id="gm-os-input" autocomplete="off" placeholder="'+(osQ.mode==="grid"?"6 digits":osQ.mode==="bearing"?"e.g. 045":"Type your answer")+'"><div class="gm-actions"><button id="gm-os-check" type="button">Check</button><button id="gm-os-new" type="button">New question</button></div>'+(osFeedback?'<div class="gm-answer '+(osFeedback==="Correct"?"gm-good":"gm-bad")+'"><strong>'+esc(osFeedback)+'</strong><br>'+esc(osQ.explain)+'</div>':"")+'</section>'+
 '<section class="gm-box"><h3>OS map checklist</h3><ul><li>Grid references: along the corridor, then up the stairs.</li><li>Six figures: estimate tenths inside the 1 km square.</li><li>Bearings: clockwise from north, three figures.</li><li>1:25,000 scale: 4 cm = 1 km.</li><li>Use contour spacing to infer slope; close contours are steeper.</li><li>For gradient, keep vertical and horizontal distances in the same units.</li></ul><div class="gm-kpi">'+state.osCorrect+'/'+state.osTotal+'</div><div class="gm-muted">all-time OS questions correct</div></section></div>';
}
function checkOS(){
 var inp=dialog.querySelector("#gm-os-input"),v=norm(inp&&inp.value).replace(/°/g,"");
 var a=norm(osQ.answer);
 if(osQ.mode==="scale")v=v.replace(/km/g,"").trim();
 if(osQ.mode==="gradient")v=v.replace(/^1\s*:\s*/,"");
 var ok=v===a||Number(v)===Number(a);
 state.osTotal++;if(ok)state.osCorrect++;save();osFeedback=ok?"Correct":"Not quite — answer: "+osQ.answer+(osQ.mode==="bearing"?"°":"");render();
}

function render(){
 if(active==="stats")content.innerHTML=statsView();
 if(active==="gaps")content.innerHTML=gapView();
 if(active==="ao3")content.innerHTML=ao3View();
 if(active==="os")content.innerHTML=osView();
}
content.addEventListener("click",function(e){
 var b=e.target.closest("button");if(!b)return;
 if(b.id==="gm-stat-check")checkStat();
 if(b.id==="gm-stat-skip")nextStat();
 if(b.id==="gm-stat-reset"){resetStats();render();}
 if(b.id==="gm-gap-start"){var s=dialog.querySelector("#gm-gap-topic");startGap(s?s.value:"all");render();}
 if(b.id==="gm-gap-reveal"){gap.reveal=true;render();}
 if(b.dataset.gapRate)rateGap(b.dataset.gapRate);
 if(b.id==="gm-gap-again"){gap.cards=[];render();}
 if(b.id==="gm-ao3-random"){var list=ao3Filtered();ao3Pick=list.length?pick(list):null;render();}
 if(b.id==="gm-os-check")checkOS();
 if(b.id==="gm-os-new"){newOS();render();}
});
content.addEventListener("change",function(e){
 if(e.target.id==="gm-ao3-topic"){ao3Topic=e.target.value;ao3Pick=null;render();}
});
content.addEventListener("input",function(e){
 if(e.target.id==="gm-ao3-search"){ao3Query=e.target.value;ao3Pick=null;}
});
content.addEventListener("keydown",function(e){
 if(e.key==="Enter"&&e.target.id==="gm-stat-input"){e.preventDefault();checkStat();}
 if(e.key==="Enter"&&e.target.id==="gm-os-input"){e.preventDefault();checkOS();}
 if(e.key==="Enter"&&e.target.id==="gm-ao3-search"){e.preventDefault();render();}
});
})();
