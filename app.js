// ===== Helpers =====
function $(id){ return document.getElementById(id); }
function getTractorSelects(){
  const primary=$("tractorSelect");
  const fallback=$("truck");
  const set=[];
  if(primary) set.push(primary);
  if(fallback && fallback!==primary) set.push(fallback);
  return set;
}
function getTrailerSelects(){
  const primary=$("trailerSelect");
  const fallback=$("trailer");
  const set=[];
  if(primary) set.push(primary);
  if(fallback && fallback!==primary) set.push(fallback);
  return set;
}
function fillSelectOptions(selectEl, items, selectedValue){
  if(!selectEl) return;
  const prev=selectEl.value;
  selectEl.innerHTML='';
  if(!items.length){
    const opt=document.createElement('option');
    opt.value='';
    opt.textContent='—';
    selectEl.appendChild(opt);
    selectEl.value='';
    selectEl.disabled=true;
    return;
  }
  selectEl.disabled=false;
  items.forEach(item=>{
    const opt=document.createElement('option');
    opt.value=item.value;
    opt.textContent=item.label;
    selectEl.appendChild(opt);
  });
  let target=selectedValue;
  const hasTarget=items.some(item=>item.value===target);
  if(!hasTarget){
    if(items.some(item=>item.value===prev)) target=prev;
    else target=items[0]?.value||'';
  }
  if(typeof target==='string') selectEl.value=target;
}
function num(v,def=0){ const n=parseFloat(v); return isFinite(n)?n:def; }
function fmtL(n){ return isFinite(n)? Math.round(n).toLocaleString('ru-RU')+' л':'—'; }
function fmtKg(n){ return isFinite(n)? Math.round(n).toLocaleString('ru-RU')+' кг':'—'; }
function fmtT(n){
  if(!isFinite(n)) return '—';
  const val=Number(n.toFixed(3));
  return val.toLocaleString('ru-RU', { minimumFractionDigits:3, maximumFractionDigits:3 })+' т';
}
function fmtM3(n){
  if(!isFinite(n)) return '—';
  const val=Number(n.toFixed(3));
  return val.toLocaleString('ru-RU', { minimumFractionDigits:3, maximumFractionDigits:3 })+' м³';
}
function fmtT2(n){
  if(!isFinite(n)) return '—';
  const val=Number(n.toFixed(2));
  return val.toLocaleString('ru-RU', { minimumFractionDigits:2, maximumFractionDigits:2 })+' т';
}
function fmtM3_3(n){
  if(!isFinite(n)) return '—';
  const val=Number(n.toFixed(3));
  return val.toLocaleString('ru-RU', { minimumFractionDigits:3, maximumFractionDigits:3 })+' м³';
}

// ===== Data =====
const defaultProducts=[
  { key: "diesel", label: "Дизельное топливо (ДТ)", rho: 0.84, adr: "3" },
  { key: "gas92", label: "Бензин АИ-92", rho: 0.74, adr: "3" },
  { key: "gas95", label: "Бензин АИ-95", rho: 0.75, adr: "3" },
  { key: "molasses", label: "Патока", rho: 1.40, adr: "—" },
  { key: "syrup", label: "Сироп сахарный", rho: 1.30, adr: "—" },
  { key: "wine", label: "Вино", rho: 0.99, adr: "—" },
  { key: "ethanol96", label: "Спирт этиловый (96%)", rho: 0.789, adr: "3" },
  { key: "methanol", label: "Метанол", rho: 0.792, adr: "3" },
  { key: "vinyl_acetate", label: "Винилацетат мономер (VAM)", rho: 0.934, adr: "3" },
  { key: "butyl_acetate", label: "Бутилацетат", rho: 0.882, adr: "3" },
  { key: "methyl_acetate", label: "Метилацетат", rho: 0.932, adr: "3" },
  { key: "ethyl_acetate", label: "Этил ацетат", rho: 0.902, adr: "3" },
  { key: "n_butanol", label: "н-Бутанол", rho: 0.810, adr: "3" },
  { key: "acetic_acid_glacial", label: "Уксусная кислота (ледяная)", rho: 1.049, adr: "8" },
  { key: "sulfuric_acid_96", label: "Серная кислота (96–98%)", rho: 1.830, adr: "8" },
  { key: "heavy_oil", label: "Тяжёлые масла", rho: 0.93, adr: "3/—" },
  { key: "formalin37", label: "Формалин 37%", rho: 1.09, adr: "8" }
];
const defaultTrucks=[
  "В 010 СЕ 123","М 020 АМ 123","Е 030 ВК 123","Е 040 ВК 123","Т 050 ВТ 93","Н 060 ВТ 123","С 070 УА 93",
  "Р 100 СА 93","Н 200 НУ 23","У 300 ХА 93","Х 400 СХ 93",
  "О 600 РВ 93",
  "В 800 ТУ 93","В 900 ТУ 93","С 101 ОХ 123","Е 202 УО 93","А 303 ЕР 123","Т 404 РС 123","Р 505 МВ 123","У 606 МВ 123","О 707 СУ 123","У 808 РУ 123","У 909 СН 123","Е 111 КС 123","Р 212 СН 23","Т 313 РУ 93","Н 414 РВ 93","Х 515 ТМ 93","У 616 СН 123","Х 717 РН 93","Р 919 ВК 93","У 616 СН 123",
  "С 999 РХ 123","А 444 АУ 23","О 555 КК 123",
  "Т 777 АК 123","Н 888 РС 123"
];
const defaultTrailers=[
  { id: "ER8977_23", name: "ЕР 8977 23", type: "platform", axles: 3, tareKg: 5900, positions: 4 },
  { id: "EU2938_23", name: "ЕУ 2938 23", type: "tanker", axles: 3, tareKg: 7300, compartmentsLiters: [12000, 6500, 12500] },
  { id: "MM8442_23", name: "ММ 8442 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [29340] },
  { id: "MM8041_23", name: "ММ 8041 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [29310] },
  { id: "MO7958_23", name: "МО 7958 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [13000, 7000, 13000] },
  { id: "MA2567_23", name: "МА 2567 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 8000, 10000] },
  { id: "MN9545_23", name: "МН 9545 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 8000, 10000] },
  { id: "MK6187_23", name: "МК 6187 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [11000, 6000, 13000] },
  { id: "MO0310_23", name: "МО 0310 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [7500, 11000, 7500, 6000] },
  { id: "MO1891_23", name: "МО 1891 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 8000, 13000] },
  { id: "MM8413_23", name: "ММ 8413 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [29340] },
  { id: "EU9285_23", name: "ЕУ 9285 23", type: "tanker", axles: 3, tareKg: 7300, compartmentsLiters: [3000, 13850, 11750] },
  { id: "EU2937_23", name: "ЕУ 2937 23", type: "tanker", axles: 3, tareKg: 7300, compartmentsLiters: [3000, 13850, 11750] },
  { id: "MR3376_23", name: "МР 3376 23", type: "tanker", axles: 3, tareKg: 7300, compartmentsLiters: [3000, 13850, 11750] },
  { id: "MA8877_23", name: "МА 8877 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 5000, 12000] },
  { id: "MN6880_23", name: "МН 6880 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [29130] },
  { id: "EU8672_23", name: "ЕУ 8672 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [12500, 7500, 7500, 12500] },
  { id: "MM8488_23", name: "ММ 8488 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [29130] },
  { id: "MM4239_23", name: "ММ 4239 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 4000, 6000, 11000] },
  { id: "MA8880_23", name: "МА 8880 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 4000, 6000, 11000] },
  { id: "MK6180_23", name: "МК 6180 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [13500, 7500, 7500, 9350] },
  { id: "EU5123_23", name: "ЕУ 5123 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [11000, 7500, 10000] },
  { id: "MK5737_23", name: "МК 5737 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [30000] },
  { id: "ET0683_23", name: "ЕТ 0683 23", type: "tanker", axles: 3, tareKg: 7300, compartmentsLiters: [22000] },
  { id: "MO0882_23", name: "МО 0882 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [10365, 6925, 10450] },
  { id: "MA2562_23", name: "МА 2562 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 8000, 9000] },
  { id: "MU5054_23", name: "МУ 5054 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [11422, 4556, 12653] },
  { id: "MK5702_23", name: "МК 5702 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9750, 7500, 7500, 7500] },
  { id: "EU5224_23", name: "ЕУ 5224 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [11000, 5500, 4500, 11000] },
  { id: "MM6410_23", name: "ММ 6410 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [10000, 7000, 5000, 10000] },
  { id: "ET3627_23", name: "ЕТ 3627 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [10500, 5000, 6500, 10000] },
  { id: "MA3650_23", name: "МА 3650 23", type: "tanker", axles: 4, tareKg: 7800, compartmentsLiters: [9000, 8000, 12000] }
];

const {
  BASE_PRODUCTS = defaultProducts,
  BASE_TRUCKS = defaultTrucks,
  BASE_TRAILERS = defaultTrailers
} = window.vigardData || {};

const LS_KEYS = {
  custom: 'vigard_custom_trailers_v1',
  products: 'vigard_custom_products_v1',
  trucks: 'vigard_custom_trucks_v1',
  truckAxlesMap: 'vigard_truck_axles_map_v1',
  state:  'vigard_state_v4'
};

// === Products
function getAllProducts(){
  const custom = JSON.parse(localStorage.getItem(LS_KEYS.products)||'[]');
  return [...BASE_PRODUCTS, ...custom];
}
function addCustomProduct(label, rho, adr){
  const key = ('custom_'+label).toLowerCase().replace(/\s+/g,'_').replace(/[^\wа-яё_-]/gi,'');
  const list = JSON.parse(localStorage.getItem(LS_KEYS.products)||'[]');
  const existingIndex=list.findIndex(item=>item.key===key);
  if(existingIndex>=0) list.splice(existingIndex,1);
  list.push({ key, label, rho, adr });
  localStorage.setItem(LS_KEYS.products, JSON.stringify(list));
  return key;
}

// === Trucks
function getAllTrucks(){
  const custom = JSON.parse(localStorage.getItem(LS_KEYS.trucks)||'[]');
  return [...BASE_TRUCKS, ...custom];
}
function getTruckAxles(plate){
  try{ const map = JSON.parse(localStorage.getItem(LS_KEYS.truckAxlesMap)||'{}'); return map[plate]||null; }catch(e){ return null; }
}
function setTruckAxles(plate, axles){
  if(!plate) return;
  let map={}; try{ map = JSON.parse(localStorage.getItem(LS_KEYS.truckAxlesMap)||'{}'); }catch(e){}
  map[plate]=axles; localStorage.setItem(LS_KEYS.truckAxlesMap, JSON.stringify(map));
}

// === Trailers
function getAllTrailers(){
  const custom = JSON.parse(localStorage.getItem(LS_KEYS.custom)||'[]');
  return [...BASE_TRAILERS, ...custom];
}
function renderTrailerSelect(selectedId){
  const selects=getTrailerSelects();
  if(!selects.length) return;
  const trailers=getAllTrailers();
  const options=trailers.map(t=>({ value:t.id, label:t.name }));
  let effective=selectedId;
  if(!effective || !trailers.some(t=>t.id===effective)){
    effective=trailers[0]?.id||'';
  }
  selects.forEach(sel=>fillSelectOptions(sel, options, effective));
  if(!trailers.length){
    app.selectedTrailerId=null;
  } else {
    app.selectedTrailerId = effective || null;
  }
}
function renderTractorSelect(selected){
  const selects=getTractorSelects();
  if(!selects.length) return;
  const trucks=getAllTrucks();
  const options=trucks.map(num=>({ value:num, label:num }));
  let effective=selected;
  if(!effective || !trucks.includes(effective)){
    effective=trucks[0]||'';
  }
  selects.forEach(sel=>fillSelectOptions(sel, options, effective));
  if(!trucks.length){ app.tractorPlate=''; }
  else app.tractorPlate = effective || '';
}
function setTrailerInfo(t){
  const info=$('trailerInfo'); if(!info) return;
  if(!t){ info.textContent=''; return; }
  if(t.type==='tanker') info.innerHTML=`Тип: цистерна · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Отсеки: ${t.compartmentsLiters.join(' / ')} л (∑ ${t.compartmentsLiters.reduce((a,b)=>a+b,0)} л)`;
  else info.innerHTML=`Тип: площадка · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Позиции: ${t.positions||4}`;
}

// === Tanker table
function densityOptionsHtml(selectedKey){
  const list=getAllProducts();
  if(!list.length) return '<option value="">—</option>';
  return list.map(d=>`<option value="${d.key}" ${d.key===selectedKey?'selected':''}>${d.label}</option>`).join('');
}
function buildTankRows(state){
  const tb=$('tankBody'); if(!tb) return;
  tb.innerHTML='';
  const caps=state.caps||[];
  state.rows.forEach((row,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td><span class="pill">#${idx+1}</span><div class="cap">лимит ${caps[idx]??'—'} л</div></td>
      <td><select class="selType">${densityOptionsHtml(row.typeKey||'diesel')}</select></td>
      <td><select class="selAdr"><option>Не знаю</option><option>3</option><option>8</option><option>—</option></select></td>
      <td><input class="inpRho" type="number" step="0.001" value="${row.rho??0.84}"></td>
      <td><input class="inpL" type="number" value="${row.liters??0}"></td>
      <td><input class="inpKg" type="number" value="${row.kg??0}"></td>`;
    tb.appendChild(tr);
  });
}
function ensureRowsMatchCaps(state){
  if(!Array.isArray(state.caps)) state.caps=[];
  const need=state.caps.length;
  while(state.rows.length<need) state.rows.push({typeKey:'diesel', adr:'3', rho:0.84, liters:0, kg:0});
  while(state.rows.length>need) state.rows.pop();
}
function tankerFromPreset(compartments){
  const caps=Array.isArray(compartments)?compartments:[0];
  return { caps:[...caps], rows: caps.map(()=>({typeKey:'diesel', adr:'3', rho:0.84, liters:0, kg:0})) };
}

// === Platform table
function buildPlatRows(state){
  const tb=$('platBody'); if(!tb) return;
  tb.innerHTML='';
  const n=state.positions||4; for(let i=0;i<n;i++){
    const tr=document.createElement('tr'); const m=state.masses?.[i]||0;
    tr.innerHTML=`<td><span class="pill">#${i+1}</span></td><td><input class="inpMass" type="number" value="${m}"></td>`; tb.appendChild(tr);
  }
}

// ===== State =====
let app={
  tractorAxles:2,
  tractorPlate:null,
  selectedTrailerId:null,
  trailerState:null,
  distanceMode:'manual',   // 'manual' | 'gmaps'
  provider:'google',       // 'google' | 'yandex'
  distanceKm:0,
  ratePerKm:0,
  trips:1,
  routeFrom:'',
  routeTo:''
};
if (app.distanceMode === 'maps') app.distanceMode = 'gmaps'; // миграция на новое имя

function loadState(){ try{ const s=JSON.parse(localStorage.getItem(LS_KEYS.state)||'null'); if(s) app=s; }catch(e){} }
function saveState(){ localStorage.setItem(LS_KEYS.state, JSON.stringify(app)); }

// ===== Bulk distribute helpers =====
function distributeByVolumeLiters(totalLiters){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  totalLiters = Math.max(0, num(totalLiters, 0));
  const tstate = app.trailerState;
  const rowsEl = $('tankBody') ? [...$('tankBody').querySelectorAll('tr')] : [];

  let restL = totalLiters;
  for(let i=0;i<tstate.caps.length;i++){
    const cap = tstate.caps[i] || 0;
    const tr  = rowsEl[i];
    if(!tr) continue;
    const putL = Math.min(restL, cap);
    tr.querySelector('.inpL').value = putL.toFixed(0);
    tr.querySelector('.inpKg').value = ''; // пересчёт по ρ сделает recalc()
    restL -= putL;
    if(restL<=0) break;
  }
  recalc();
}
function distributeByMassKg(totalKg){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  totalKg = Math.max(0, num(totalKg, 0));
  const tstate = app.trailerState;
  const rowsEl = $('tankBody') ? [...$('tankBody').querySelectorAll('tr')] : [];
  const same = $('chkAllSame')?.checked;

  let restKg = totalKg;
  for(let i=0;i<tstate.caps.length;i++){
    const capL = tstate.caps[i] || 0;
    const tr   = rowsEl[i];
    if(!tr) continue;

    // ρ: если все отсеки — один груз, берём из первой строки, иначе по строке
    let rho;
    if(same){
      const tr0 = rowsEl[0];
      rho = num(tr0.querySelector('.inpRho').value, 1);
    } else {
      rho = num(tr.querySelector('.inpRho').value, 1);
    }
    if(rho <= 0) rho = 1;

    const litersAvailableByMass = restKg / rho;
    const putL = Math.min(capL, litersAvailableByMass);

    tr.querySelector('.inpL').value = putL.toFixed(0);
    tr.querySelector('.inpKg').value = '';
    restKg -= putL * rho;

    if(restKg <= 0) break;
  }
  recalc();
}

function syncAllRowsToFirst(){
  const tb=$('tankBody');
  if(!tb) return;
  const rows=[...tb.querySelectorAll('tr')];
  const first=rows[0]; if(!first) return;
  const typeKey=first.querySelector('.selType')?.value;
  const rho=first.querySelector('.inpRho')?.value;
  const adr=first.querySelector('.selAdr')?.value;
  rows.forEach((tr,idx)=>{
    if(idx===0) return;
    if(typeKey!==undefined) tr.querySelector('.selType').value=typeKey;
    if(rho!==undefined) tr.querySelector('.inpRho').value=rho;
    if(adr!==undefined) tr.querySelector('.selAdr').value=adr;
  });
}

function fillCompartmentMax(){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const tb=$('tankBody'); if(!tb) return;
  if($('chkAllSame')?.checked) syncAllRowsToFirst();
  const rows=[...tb.querySelectorAll('tr')];
  rows.forEach((tr,i)=>{
    const capRaw=num(app.trailerState.caps[i],0);
    const cap=isFinite(capRaw)?Math.max(0,capRaw):0;
    const rho=num(tr.querySelector('.inpRho').value,1);
    tr.querySelector('.inpL').value = cap;
    const mass=cap*rho;
    tr.querySelector('.inpKg').value = isFinite(mass)? Math.round(mass) : 0;
  });
  recalc();
}

function clearCompartments(){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const tb=$('tankBody'); if(!tb) return;
  const rows=[...tb.querySelectorAll('tr')];
  rows.forEach(tr=>{ tr.querySelector('.inpL').value=''; tr.querySelector('.inpKg').value=''; });
  recalc();
}

function addCompartment(){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const caps=app.trailerState.caps;
  const last=caps[caps.length-1]||10000;
  caps.push(last);
  app.trailerState.rows.push({typeKey:app.trailerState.rows[0]?.typeKey||'diesel', adr:app.trailerState.rows[0]?.adr||'3', rho:app.trailerState.rows[0]?.rho||0.84, liters:0, kg:0});
  buildTankRows(app.trailerState);
  if($('chkAllSame')?.checked) syncAllRowsToFirst();
  recalc();
}

function removeCompartment(){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  if(app.trailerState.caps.length<=1) return;
  app.trailerState.caps.pop();
  app.trailerState.rows.pop();
  buildTankRows(app.trailerState);
  recalc();
}

// ===== Init / Render =====
function selectTrailer(id){
  const all=getAllTrailers();
  if(!all.length){
    app.selectedTrailerId=null;
    app.trailerState=null;
    renderCurrent();
    saveState();
    return;
  }
  const t=all.find(x=>x.id===id) || all[0];
  app.selectedTrailerId=t.id;
  if(t.type==='tanker'){ app.trailerState={type:'tanker', ...tankerFromPreset(t.compartmentsLiters)}; }
  else { app.trailerState={type:'platform', positions:t.positions||4, masses:Array(t.positions||4).fill(0)}; }
  renderCurrent(); saveState();
}
function renderCurrent(){
  const trailers=getAllTrailers();
  const t=trailers.find(x=>x.id===app.selectedTrailerId) || trailers[0] || null;
  if(t){ app.selectedTrailerId=t.id; }
  setTrailerInfo(t);
  renderTrailerSelect(app.selectedTrailerId);

  const trucks=getAllTrucks();
  if(!app.tractorPlate || !trucks.includes(app.tractorPlate)){
    app.tractorPlate=trucks[0]||'';
  }
  renderTractorSelect(app.tractorPlate);
  const storedAx=getTruckAxles(app.tractorPlate);
  app.tractorAxles=storedAx||app.tractorAxles||2;
  if($('tractorAxles')) $('tractorAxles').value=String(app.tractorAxles||2);

  const provEl = $('provider'); if (provEl) provEl.value = app.provider||'google';

  const isMaps = (app.distanceMode === 'gmaps' || app.distanceMode === 'maps');
  if($('distanceMode')) $('distanceMode').value = isMaps ? 'gmaps' : 'manual';

  if($('distanceKm')) $('distanceKm').value = app.distanceKm || '';
  if($('ratePerKm'))  $('ratePerKm').value  = app.ratePerKm || '';
  if($('trips'))      $('trips').value      = app.trips || 1;

  if($('routeFrom'))  $('routeFrom').value  = app.routeFrom || '';
  if($('routeTo'))    $('routeTo').value    = app.routeTo   || '';

  if($('gmapsRow'))  $('gmapsRow').style.display  = isMaps ? 'grid'  : 'none';
  if($('gmapsNote')) $('gmapsNote').style.display = isMaps ? 'block' : 'none';

  if(app.trailerState?.type==='tanker'){ if($('tankSection')) $('tankSection').style.display='block'; if($('platformSection')) $('platformSection').style.display='none'; ensureRowsMatchCaps(app.trailerState); buildTankRows(app.trailerState); }
  else if(app.trailerState?.type==='platform'){ if($('tankSection')) $('tankSection').style.display='none'; if($('platformSection')) $('platformSection').style.display='block'; buildPlatRows(app.trailerState); }
  else {
    if($('tankSection')) $('tankSection').style.display='none';
    if($('platformSection')) $('platformSection').style.display='none';
    if($('fitSummary')) $('fitSummary').textContent='';
  }

  recalc();
}

// ===== Recalc =====
function recalc(){
  if(!app.trailerState){ return; }
  const tstate=app.trailerState; const warns=[]; let sumL=0, sumKg=0;
  const tractorSelects=getTractorSelects();
  if(tractorSelects.length){
    const active=document.activeElement;
    let value='';
    if(active && tractorSelects.includes(active)){
      value=active.value;
    }
    if(!value) value=tractorSelects[0].value;
    if(value) app.tractorPlate=value;
    tractorSelects.forEach(sel=>{ if(sel.value!==app.tractorPlate) sel.value=app.tractorPlate; });
  }

  if(tstate.type==='tanker'){
    const tb=$('tankBody'); const rows=[...tb.querySelectorAll('tr')];
    const same=$('chkAllSame')?.checked;
    if(same) syncAllRowsToFirst();
    rows.forEach((tr,i)=>{
      const typeKey=tr.querySelector('.selType').value;
      const dict=getAllProducts().find(d=>d.key===typeKey) || getAllProducts()[0] || { rho:1, adr:'—' };

      const rhoInp=tr.querySelector('.inpRho');
      if(!rhoInp || !isFinite(parseFloat(rhoInp.value))) rhoInp.value = dict.rho;
      const adrSel=tr.querySelector('.selAdr');
      if(adrSel){
        const current=adrSel.value;
        if(!current || current==='Не знаю'){
          const opt=[...adrSel.options].find(o=>o.value===String(dict.adr));
          if(opt) adrSel.value=opt.value;
          else adrSel.value=String(dict.adr||'—');
        }
      }

      const rho=num(rhoInp?.value, dict.rho||1);
      const adr=adrSel?.value||String(dict.adr||'—');
      let liters=num(tr.querySelector('.inpL').value, NaN);
      let kg=num(tr.querySelector('.inpKg').value, NaN);

      if(!isFinite(liters) && isFinite(kg)) liters = rho>0? kg/rho : 0;
      if(!isFinite(kg) && isFinite(liters)) kg = liters*rho;
      if(!isFinite(liters)) liters=0; if(!isFinite(kg)) kg=0;

      if(liters<0||kg<0) warns.push(`Отсек #${i+1}: отрицательные значения`);
      const cap=num(tstate.caps[i], Infinity);
      if(isFinite(cap) && liters>cap){
        const over=Math.round(liters-cap);
        warns.push(`Переполнение отсека #${i+1}: +${over.toLocaleString('ru-RU')} л`);
      }

      tr.querySelector('.inpL').value = liters || 0;
      tr.querySelector('.inpKg').value = kg || 0;

      tstate.rows[i]={typeKey, adr, rho, liters, kg};

      sumL+=liters; sumKg+=kg;
    });

    let leftL=0, leftKg=0;
    (tstate.rows||[]).forEach((r,i)=>{
      const cap=num(tstate.caps[i], Infinity);
      if(!isFinite(cap)) return;
      const over=Math.max(0,(r.liters||0)-cap);
      leftL+=over; leftKg+=over*(r.rho||1);
    });
    const totalL=isFinite(sumL)?Math.max(0,sumL):0;
    const totalKg=isFinite(sumKg)?Math.max(0,sumKg):0;
    const totalTons=totalKg/1000;
    const totalM3=totalL/1000;
    const fitBox=$('fitSummary');
    if(fitBox){
      const leftoverText = leftL>0
        ? `Не поместилось: ${fmtL(leftL)} / ${fmtKg(leftKg)} / ${fmtT2(leftKg/1000)} / ${fmtM3_3(leftL/1000)}`
        : 'Не поместилось: —';
      fitBox.textContent = `Всего: ${fmtL(totalL)} / ${fmtKg(totalKg)} / ${fmtT2(totalTons)} / ${fmtM3_3(totalM3)} · ${leftoverText}`;
    }
    if(leftL>0){
      warns.push(`Не помещается по объёму: ${Math.round(leftL).toLocaleString('ru-RU')} л`);
    }

  } else {
    const tb=$('platBody'); const rows=[...tb.querySelectorAll('tr')];
    let masses=[]; rows.forEach((tr,i)=>{ let m=num(tr.querySelector('.inpMass').value,0); if(m<0){warns.push(`Позиция #${i+1}: отрицательная масса`); m=0;} masses[i]=m; sumKg+=m; });
    tstate.masses=masses; sumL=NaN;
    const fitBox=$('fitSummary'); if(fitBox) fitBox.textContent='';
  }

  if($('sumL')) $('sumL').textContent = isNaN(sumL)? '—' : fmtL(sumL);
  if($('sumKg')) $('sumKg').textContent = fmtKg(sumKg);

  const ul=$('warnList'); if (ul){
    ul.innerHTML=''; 
    if(warns.length===0){ const li=document.createElement('li'); li.textContent='Ошибок не обнаружено.'; ul.appendChild(li);} 
    else { warns.forEach(w=>{ const li=document.createElement('li'); li.innerHTML=`<span class="warn">⚠</span> ${w}`; ul.appendChild(li); }); }
  }

  // маршрут/стоимость
  app.distanceKm=num($('distanceKm')?.value, app.distanceKm||0);
  app.ratePerKm=num($('ratePerKm')?.value, app.ratePerKm||0);
  app.trips=parseInt($('trips')?.value)||app.trips||1;
  const cost=app.distanceKm*app.ratePerKm*app.trips;
  if($('kpiDistance')) $('kpiDistance').textContent = (isFinite(app.distanceKm)&&app.distanceKm>0)? (Math.round(app.distanceKm).toLocaleString('ru-RU')+' км'):'—';
  if($('kpiRate')) $('kpiRate').textContent = (isFinite(app.ratePerKm)&&app.ratePerKm>0)? (app.ratePerKm.toLocaleString('ru-RU')+' ₽/км'):'—';
  if($('kpiTrips')) $('kpiTrips').textContent = String(app.trips);
  if($('kpiCost')) $('kpiCost').textContent = (isFinite(cost)&&cost>0)? cost.toLocaleString('ru-RU')+' ₽' : '—';

  const t=getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  let lines=[`Прицеп: ${t?.name||''} (${t?.type==='tanker'?'цистерна':'площадка'})`, `Тягач: ${app.tractorPlate||'—'} (${app.tractorAxles} оси)`, `Итоги: ${(isNaN(sumL)?'-':Math.round(sumL)+' л')}, ${(sumKg/1000).toFixed(2)} т`];
  if(tstate.type==='tanker'){
    tstate.rows.forEach((r,i)=>{ const d=getAllProducts().find(x=>x.key===r.typeKey); lines.push(`#${i+1}: ${(d?.label)||r.typeKey}, ADR ${r.adr}, ρ=${r.rho}, ${Math.round(r.liters)} л / ${Math.round(r.kg)} кг / ${(r.kg/1000).toFixed(3)} т / ${(r.liters/1000).toFixed(3)} м³`); });
  } else {
    (tstate.masses||[]).forEach((kg,i)=>{ lines.push(`#${i+1}: ${Math.round(kg)} кг`); });
  }
  const routeStr=(app.routeFrom||app.routeTo)? `Маршрут: ${app.routeFrom||'?'} → ${app.routeTo||'?'}`:'';
  const costStr=(isFinite(cost)&&cost>0)? `Стоимость: ${cost.toLocaleString('ru-RU')} ₽ (${app.distanceKm} км × ${app.ratePerKm} ₽/км × ${app.trips} рейс.)`:'';
  if(routeStr) lines.push(routeStr); if(costStr) lines.push(costStr);
  if($('brief')) $('brief').value = lines.join('\n');

  saveState();
}

// ===== Events =====
function bind(){
  getTrailerSelects().forEach(sel=>{
    sel.addEventListener('change', e=>{
      selectTrailer(e.target.value);
      getTrailerSelects().forEach(other=>{ if(other!==sel) other.value=e.target.value; });
    });
  });
  getTractorSelects().forEach(sel=>{
    sel.addEventListener('change', e=>{
      app.tractorPlate=e.target.value;
      const ax=getTruckAxles(app.tractorPlate)||2;
      app.tractorAxles=ax;
      if($('tractorAxles')) $('tractorAxles').value=String(ax);
      saveState();
      renderTractorSelect(app.tractorPlate);
      recalc();
    });
  });
  if($('tractorAxles')) $('tractorAxles').addEventListener('change', e=>{ const ax=parseInt(e.target.value)||2; app.tractorAxles=ax; setTruckAxles(app.tractorPlate, ax); saveState(); recalc(); });

  const provEl = $('provider');
  if (provEl) provEl.addEventListener('change', e=>{ app.provider=e.target.value; saveState(); maybeInitMaps(); });

  const dmEl = $('distanceMode');
  if (dmEl) dmEl.addEventListener('change', e=>{
    app.distanceMode=e.target.value;
    const isMaps = (app.distanceMode==='gmaps' || app.distanceMode==='maps');
    if($('gmapsRow')) $('gmapsRow').style.display=(isMaps)?'grid':'none';
    if($('gmapsNote')) $('gmapsNote').style.display=(isMaps)?'block':'none';
    saveState(); maybeInitMaps();
  });

  if($('resetPreset')) $('resetPreset').addEventListener('click', ()=>selectTrailer(app.selectedTrailerId));
  if($('copyBrief')) $('copyBrief').addEventListener('click', ()=>navigator.clipboard.writeText($('brief').value));
  if($('addTrailer')) $('addTrailer').addEventListener('click', openModal);
  if($('addTruck')) $('addTruck').addEventListener('click', openTruckModal);

  ['distanceKm','ratePerKm','trips','routeFrom','routeTo'].forEach(id=>{
    const el=$(id);
    if(el) el.addEventListener('input', ()=>{
      app.distanceKm=num($('distanceKm')?.value,0);
      app.ratePerKm=num($('ratePerKm')?.value,0);
      app.trips=parseInt($('trips')?.value)||1;
      app.routeFrom=$('routeFrom')?.value||'';
      app.routeTo=$('routeTo')?.value||'';
      saveState(); recalc();
    });
  });

  // таблицы
  ['tankBody','platBody'].forEach(id=>{ const el=$(id); if(el) el.addEventListener('input', recalc); });
  const tankBodyEl = $('tankBody');
  if (tankBodyEl) tankBodyEl.addEventListener('change', (e)=>{
    const tr = e.target.closest('tr');
    if(!tr) return;
    if(e.target.classList.contains('selType')){
      const typeKey = e.target.value;
      const d = getAllProducts().find(x=>x.key===typeKey);
      if(d){
        const rhoInp = tr.querySelector('.inpRho');
        const adrSel = tr.querySelector('.selAdr');
        if(rhoInp) rhoInp.value = d.rho;
        if(adrSel){
          const opt=[...adrSel.options].find(o=>o.value===String(d.adr));
          if(opt) adrSel.value=opt.value;
          else adrSel.value=String(d.adr||'—');
        }
        if($('chkAllSame')?.checked) syncAllRowsToFirst();
        recalc();
      }
    }
  });

  const chkAll = $('chkAllSame');
  if (chkAll) chkAll.addEventListener('change', (e)=>{
    if(e.target.checked) syncAllRowsToFirst();
    recalc();
  });

  // модалка прицепа
  if($('m_type')) $('m_type').addEventListener('change', e=>{ const isPlat=e.target.value==='platform'; if($('m_positions_wrap')) $('m_positions_wrap').style.display=isPlat?'block':'none'; if($('m_caps_wrap')) $('m_caps_wrap').style.display=isPlat?'none':'block'; });
  if($('m_cancel')) $('m_cancel').addEventListener('click', closeModal);
  if($('m_save')) $('m_save').addEventListener('click', saveModalTrailer);

  // модалка тягача
  if($('mt_cancel')) $('mt_cancel').addEventListener('click', closeTruckModal);
  if($('mt_save')) $('mt_save').addEventListener('click', saveTruck);

  // продукты
  if($('btnAddProduct')) $('btnAddProduct').addEventListener('click', openProductModal);

  // карты
  if($('btnRoute')) $('btnRoute').addEventListener('click', buildRoute);
  if($('mapsKey')) $('mapsKey').addEventListener('input', ()=>maybeInitMaps());

  // пакетное распределение
  if($('btnDistributeMass')) $('btnDistributeMass').addEventListener('click', ()=>{
    const t = num($('totalMassT').value, NaN);
    if(!isFinite(t) || t <= 0){ alert('Укажи массу в тоннах (>0)'); return; }
    distributeByMassKg(t*1000);
  });
  if($('btnDistributeM3')) $('btnDistributeM3').addEventListener('click', ()=>{
    const m3 = num($('totalVolM3').value, NaN);
    if(!isFinite(m3) || m3 <= 0){ alert('Укажи объём в м³ (>0)'); return; }
    distributeByVolumeLiters(m3*1000);
  });

  if($('fillMax')) $('fillMax').addEventListener('click', fillCompartmentMax);
  if($('clearAll')) $('clearAll').addEventListener('click', clearCompartments);
  if($('addCompartment')) $('addCompartment').addEventListener('click', addCompartment);
  if($('removeCompartment')) $('removeCompartment').addEventListener('click', removeCompartment);

  if($('prod_save')) $('prod_save').addEventListener('click', saveProductFromModal);
  if($('prod_cancel')) $('prod_cancel').addEventListener('click', closeProductModal);

  // тесты
  if($('runTests')) $('runTests').addEventListener('click', runTests);
}

// ===== Modal logic (trailers)
function openModal(){ if($('modal')) $('modal').classList.add('open'); }
function closeModal(){ if($('modal')) $('modal').classList.remove('open'); }
function genId(name){ return name.replace(/\s+/g,'_'); }
function saveModalTrailer(){
  const name=$('m_name')?.value?.trim(); if(!name){ alert('Укажи номер прицепа'); return; }
  const type=$('m_type')?.value; const axles=parseInt($('m_axles')?.value)||4; const tare=num($('m_tare')?.value, type==='platform'?5900:(axles===3?7300:7800));
  let obj;
  if(type==='platform'){
    const positions=parseInt($('m_positions')?.value)||4;
    obj={ id: genId(name), name, type, axles, tareKg: tare, positions };
  } else {
    const capsStr=$('m_caps')?.value?.trim(); const caps=capsStr? capsStr.split('/').map(s=>parseInt(s.replace(/\s+/g,''))||0) : [10000,8000,9000];
    obj={ id: genId(name), name, type, axles, tareKg: tare, compartmentsLiters: caps };
  }
  const custom=JSON.parse(localStorage.getItem(LS_KEYS.custom)||'[]');
  if(BASE_TRAILERS.find(x=>x.id===obj.id)){ obj.id = obj.id+'_custom'; }
  custom.push(obj); localStorage.setItem(LS_KEYS.custom, JSON.stringify(custom));
  renderTrailerSelect(app.selectedTrailerId); closeModal(); recalc();
}

// ===== Modal logic (trucks)
function openTruckModal(){ if($('modalTruck')) $('modalTruck').classList.add('open'); }
function closeTruckModal(){ if($('modalTruck')) $('modalTruck').classList.remove('open'); }
function saveTruck(){
  const plate=$('mt_plate')?.value?.trim(); if(!plate){ alert('Введи госномер'); return; }
  const axles=parseInt($('mt_axles')?.value)||2;
  const list = JSON.parse(localStorage.getItem(LS_KEYS.trucks)||'[]');
  if(!list.includes(plate)) list.push(plate);
  localStorage.setItem(LS_KEYS.trucks, JSON.stringify(list));
  setTruckAxles(plate, axles);
  renderTractorSelect(plate);
  getTractorSelects().forEach(sel=>{ sel.value=plate; });
  if($('tractorAxles')) $('tractorAxles').value=String(axles);
  app.tractorPlate=plate; app.tractorAxles=axles; saveState();
  closeTruckModal();
}

// ===== Modal logic (products)
function openProductModal(){
  const modal=$('productModal');
  if(!modal) return;
  if($('prod_name')) $('prod_name').value='';
  if($('prod_rho')) $('prod_rho').value='';
  if($('prod_adr')) $('prod_adr').value='';
  modal.classList.add('open');
  setTimeout(()=>{ try{ $('prod_name')?.focus(); }catch(_){} }, 0);
}
function closeProductModal(){ const modal=$('productModal'); if(modal) modal.classList.remove('open'); }
function saveProductFromModal(){
  const name=$('prod_name')?.value?.trim(); if(!name){ alert('Укажите название груза'); return; }
  const rho=parseFloat($('prod_rho')?.value); if(!Number.isFinite(rho)||rho<=0){ alert('Укажите корректную плотность (>0)'); return; }
  const adr=$('prod_adr')?.value?.trim()||'—';
  const key=addCustomProduct(name, rho, adr);
  closeProductModal();
  renderCurrent();
  const tb=$('tankBody');
  const firstSel=tb?.querySelector('.selType');
  if(firstSel && key){ firstSel.value=key; firstSel.dispatchEvent(new Event('change', { bubbles:true })); }
}

// ===== Axle calc
function syncAxleParamsFromTrailer(){
  const t = getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  if(!t) return;
  if($('axTl_ax')) $('axTl_ax').value = t.axles || 3;
  if($('mp_ax'))   $('mp_ax').value   = t.tareKg || (t.axles===3?7300:7800);
  if($('LA_ax')) $('LA_ax').value = t.axles===3 ? 11800 : 12000;
  if($('LB_ax')) $('LB_ax').value = t.axles===3 ? 7400  : 7600;
  if($('LC_ax')) $('LC_ax').value = 4400;
  if($('NTpp_ax')) $('NTpp_ax').value = 2000;
}
function collectMassesAndPositions(){
  const LA = num($('LA_ax')?.value,12000);
  const tstate = app.trailerState; let kg=[], xs=[];
  if(!tstate) return {kg:[],xs:[]};
  if(tstate.type==='tanker'){
    const n=tstate.rows.length; for(let i=0;i<n;i++){ const row=tstate.rows[i]; const W=num(row.kg,0); const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
  } else {
    const n=tstate.masses.length; for(let i=0;i<n;i++){ const W=num(tstate.masses[i],0); const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
  }
  return {kg,xs};
}
function calcAxles(){
  const axTr=parseInt($('axTr_axle')?.value)||2; const axTl=parseInt($('axTl_ax')?.value)||3; const mT=8200;
  const LT=num($('LT_ax')?.value,3800), l2=num($('l2_ax')?.value,350), NT10=num($('NT10_ax')?.value,4200), NT20=num($('NT20_ax')?.value,4000);
  const mp=num($('mp_ax')?.value,7300), LA=num($('LA_ax')?.value,12000), LB=Math.max(1,num($('LB_ax')?.value,7600)), LC=num($('LC_ax')?.value,4400), NTpp=num($('NTpp_ax')?.value,2000);
  const {kg,xs}=collectMassesAndPositions();
  let Rk_sum=NTpp, Rb_sum=Math.max(0, mp-NTpp);
  for(let i=0;i<kg.length;i++){ const W=kg[i], x=xs[i]; const Rb=W*(x/LB); const Rk=W-Rb; Rk_sum+=Rk; Rb_sum+=Rb; }
  const R_front_from_pin=Rk_sum*(l2/LT), R_rear_from_pin=Rk_sum-R_front_from_pin;
  const Ax1=NT10+R_front_from_pin, Ax2_group=NT20+R_rear_from_pin;
  const perTrailerAxle=Rb_sum/axTl, perTractorRear=(axTr===3)?(Ax2_group/2):Ax2_group;
  const cargoSum=kg.reduce((a,b)=>a+b,0), G_total=mT+mp+cargoSum;
  if($('G_total_ax')) $('G_total_ax').textContent=(G_total/1000).toFixed(2)+' т';
  if($('Ax1_ax')) $('Ax1_ax').textContent=Math.round(Ax1).toLocaleString('ru-RU')+' кг';
  if($('Ax2_ax')) $('Ax2_ax').textContent=(axTr===3? `${Math.round(perTractorRear).toLocaleString('ru-RU')} кг × 2` : Math.round(Ax2_group).toLocaleString('ru-RU')+' кг');
  if($('AxTl_ax')) $('AxTl_ax').textContent=`${Math.round(Rb_sum).toLocaleString('ru-RU')} кг (≈ ${Math.round(perTrailerAxle).toLocaleString('ru-RU')} кг × ${axTl})`;
  const warn=[];
  if(Ax1>7500) warn.push('Передняя ось > 7.5 т');
  if(axTr===2 && Ax2_group>11500) warn.push('Задняя ось тягача > 11.5 т');
  if(axTr===3 && perTractorRear>11500) warn.push('Ось задней группы тягача > 11.5 т');
  if(perTrailerAxle>10000) warn.push('Ось тележки прицепа > 10 т');
  const w=$('axWarn_ax'); if(w){ if(warn.length){ w.style.display='block'; w.textContent='Проверь нормативы: '+warn.join('; ');} else { w.style.display='none'; } }
}
(function(){
  const ids=['LT_ax','l2_ax','NT10_ax','NT20_ax','mp_ax','LA_ax','LB_ax','LC_ax','NTpp_ax','axTr_axle'];
  ids.forEach(id=>{ const el=$(id); if(el) el.addEventListener('input', calcAxles); });
  const btn=$('recalcAxles'); if(btn) btn.addEventListener('click', calcAxles);
})();
const _recalc_orig=recalc; recalc=function(){ _recalc_orig(); calcAxles(); };
const _selectTrailer_orig=selectTrailer; selectTrailer=function(id){ _selectTrailer_orig(id); syncAxleParamsFromTrailer(); calcAxles(); };

// ===== Maps (Google / Yandex) =====
let _gmapsLoading=false, _gmapsLoaded=false, _ymapsLoading=false, _ymapsLoaded=false, _acFrom=null, _acTo=null, _fromPlaceId=null, _toPlaceId=null, _yaSuggestFrom=null, _yaSuggestTo=null;

function mapsApiKey(){
  return ($('mapsKey')?.value?.trim() || $('gmapsKey')?.value?.trim() || '');
}

function loadGoogleMaps(key){
  return new Promise((resolve,reject)=>{
    if(_gmapsLoaded){ resolve(); return; }
    if(_gmapsLoading){ const iv=setInterval(()=>{ if(_gmapsLoaded){ clearInterval(iv); resolve(); } }, 200); return; }
    if(!key) return reject(new Error('Укажите API key'));
    _gmapsLoading=true; const s=document.createElement('script'); s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`; s.async=true; s.defer=true; s.onload=()=>{ _gmapsLoaded=true; resolve(); }; s.onerror=()=>{ _gmapsLoading=false; reject(new Error('Не удалось загрузить Google Maps JS API')); }; document.head.appendChild(s);
  });
}
function ensureAutocompleteGoogle(){
  if(!_gmapsLoaded) return;
  if(!_acFrom){ _acFrom=new google.maps.places.Autocomplete($('routeFrom'), { types:['(cities)'] }); _acFrom.addListener('place_changed', ()=>{ const p=_acFrom.getPlace(); _fromPlaceId=p?.place_id||null; }); }
  if(!_acTo){ _acTo=new google.maps.places.Autocomplete($('routeTo'), { types:['(cities)'] }); _acTo.addListener('place_changed', ()=>{ const p=_acTo.getPlace(); _toPlaceId=p?.place_id||null; }); }
}
function routeGoogle(key, fromStr, toStr, avoidTolls, truckMode){
  return loadGoogleMaps(key).then(()=>{
    ensureAutocompleteGoogle();
    return new Promise((resolve,reject)=>{
      const svc=new google.maps.DirectionsService();
      const origin=_fromPlaceId? {placeId:_fromPlaceId} : fromStr;
      const destination=_toPlaceId? {placeId:_toPlaceId} : toStr;
      svc.route({ origin, destination, travelMode:google.maps.TravelMode.DRIVING, provideRouteAlternatives:false, avoidFerries:true, avoidTolls, avoidHighways:false }, (res,status)=>{
        if(status!=='OK') { reject(new Error('Directions error: '+status)); return; }
        try{
          const meters=res.routes[0].legs.reduce((s,leg)=>s+(leg.distance?.value||0),0); let km=meters/1000;
          if(truckMode) km *= 1.12; // поправка на грузовые ограничения (приблизительно)
          resolve(Math.round(km));
        }catch(e){ reject(new Error('Ошибка обработки маршрута')); }
      });
    });
  });
}

function loadYandexMaps(key){
  return new Promise((resolve,reject)=>{
    if(_ymapsLoaded){ resolve(); return; }
    if(_ymapsLoading){ const iv=setInterval(()=>{ if(_ymapsLoaded){ clearInterval(iv); resolve(); } }, 200); return; }
    if(!key) return reject(new Error('Укажите API key'));
    _ymapsLoading=true;
    const s=document.createElement('script');
    s.src=`https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(key)}&lang=ru_RU`;
    s.onload=()=>{ ymaps.ready(()=>{ _ymapsLoaded=true; resolve(); }); };
    s.onerror=()=>{ _ymapsLoading=false; reject(new Error('Не удалось загрузить Яндекс.Карты JS API')); };
    document.head.appendChild(s);
  });
}
function ensureSuggestYandex(){
  if(!_ymapsLoaded) return;
  if(!_yaSuggestFrom) _yaSuggestFrom = new ymaps.SuggestView('routeFrom');
  if(!_yaSuggestTo) _yaSuggestTo = new ymaps.SuggestView('routeTo');
}
function routeYandex(key, fromStr, toStr, avoidTolls, truckMode){
  return loadYandexMaps(key).then(()=>{
    ensureSuggestYandex();
    return ymaps.route([fromStr, toStr], { avoidTrafficJams: false }).then(route=>{
      const len = route.getLength(); let km = len/1000;
      if(truckMode) km *= 1.12; // приблизительная поправка
      return Math.round(km);
    });
  });
}

function maybeInitMaps(){
  const isMaps = (app.distanceMode==='gmaps' || app.distanceMode==='maps');
  if(!isMaps) return;
  const key = mapsApiKey(); if(!key) return;
  const provider=$('provider')?.value || app.provider;
  if(provider==='google') loadGoogleMaps(key).then(ensureAutocompleteGoogle).catch(()=>{});
  else loadYandexMaps(key).then(ensureSuggestYandex).catch(()=>{});
}

function buildRoute(){
  const key=mapsApiKey();
  const fromStr=$('routeFrom')?.value?.trim();
  const toStr=$('routeTo')?.value?.trim();
  const avoidTolls=$('avoidTolls')?.checked;
  const truckMode=$('truckMode')?.checked;
  if(!fromStr||!toStr){ alert('Заполните поля Откуда и Куда'); return; }
  const provider=$('provider')?.value || app.provider || 'google';
  const runner = provider==='google' ? routeGoogle : routeYandex;
  runner(key, fromStr, toStr, avoidTolls, truckMode)
    .then(km=>{ if($('distanceKm')) $('distanceKm').value=String(km); app.distanceKm=km; saveState(); recalc(); })
    .catch(err=>alert(err.message||String(err)));
}

// ===== Tests (subset) =====
function runTests(){
  const out=$('testResults'); const results=[]; const approx=(a,b,e=2)=>Math.abs(a-b)<=e; const pass=n=>results.push(`<div class='pass'>✔ ${n}</div>`); const fail=(n,m='')=>results.push(`<div class='fail'>✘ ${n}${m?': '+m:''}</div>`);
  const backup=JSON.stringify(app);
  try{
    selectTrailer('MO0882_23');
    let tb=$('tankBody'); let first=tb.querySelector('tr');
    first.querySelector('.selType').value='diesel'; first.querySelector('.inpRho').value='0.84';
    first.querySelector('.inpL').value='1000'; first.querySelector('.inpKg').value=''; recalc();
    let kg=parseInt(first.querySelector('.inpKg').value); if(kg===840) pass('ρ: 1000 л ДТ → 840 кг'); else fail('ρ прямой', `получили ${kg}`);
    first.querySelector('.inpKg').value='1200'; first.querySelector('.inpL').value=''; recalc();
    let l=parseInt(first.querySelector('.inpL').value); if(approx(l,1429,2)) pass('ρ: 1200 кг ДТ → ~1429 л'); else fail('ρ обратный', `получили ${l}`);

    selectTrailer('ER8977_23');
    if($('platformSection').style.display==='block' && $('tankSection').style.display==='none') pass('Площадка рендерится'); else fail('Площадка рендер');

    if($('distanceKm')) $('distanceKm').value='100';
    if($('ratePerKm')) $('ratePerKm').value='50';
    if($('trips')) $('trips').value='2'; 
    recalc();
    const costText=$('kpiCost')?.textContent?.replace(/\D+/g,''); if(parseInt(costText)===10000) pass('Стоимость вручную считается'); else fail('Стоимость вручную', $('kpiCost')?.textContent||'');
  }catch(e){ fail('Исключение тестов', e.message); }
  finally{ try{ app=JSON.parse(backup); renderCurrent(); }catch(_){} }
  if(out) out.innerHTML=results.join('');
}

// ===== Boot =====
function boot(){
  loadState();
  if (app.distanceMode === 'maps') app.distanceMode = 'gmaps'; // страховка

  const trailers=getAllTrailers();
  if(trailers.length){
    if(!app.selectedTrailerId || !trailers.some(t=>t.id===app.selectedTrailerId)){
      app.selectedTrailerId=trailers[0].id;
    }
  }

  const trucks=getAllTrucks();
  if(trucks.length){
    if(!app.tractorPlate || !trucks.includes(app.tractorPlate)){
      app.tractorPlate=trucks[0];
    }
  }

  selectTrailer(app.selectedTrailerId);
  bind();
  maybeInitMaps();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
