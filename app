// ===== Helpers =====
function $(id){ return document.getElementById(id); }
function num(v,def=0){ const n=parseFloat(v); return isFinite(n)?n:def; }
function fmtL(n){ return isFinite(n)? Math.round(n).toLocaleString('ru-RU')+' л':'—'; }
function fmtT(n){
  if(!isFinite(n)) return '—';
  const opts=n>=100?
    {maximumFractionDigits:2, minimumFractionDigits:0}:
    {maximumFractionDigits:3, minimumFractionDigits:0};
  return n.toLocaleString('ru-RU', opts)+' т';
}
function fmtLitersDetailed(n){
  if(!isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', {maximumFractionDigits:2, minimumFractionDigits:0});
}
function fmtM3(n){
  if(!isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', {maximumFractionDigits:3, minimumFractionDigits:3});
}
function fmtTonsDetailed(n){
  if(!isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', {maximumFractionDigits:3, minimumFractionDigits:3});
}

// ===== Data =====
const BASE_PRODUCTS = [
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

const BASE_TRUCKS = [
  "В 010 СЕ 123","М 020 АМ 123","Е 030 ВК 123","Е 040 ВК 123","Т 050 ВТ 93","Н 060 ВТ 123","С 070 УА 93",
  "Р 100 СА 93","Н 200 НУ 23","У 300 ХА 93","Х 400 СХ 93",
  "О 600 РВ 93",
  "В 800 ТУ 93","В 900 ТУ 93","С 101 ОХ 123","Е 202 УО 93","А 303 ЕР 123","Т 404 РС 123","Р 505 МВ 123","У 606 МВ 123","О 707 СУ 123","У 808 РУ 123","У 909 СН 123","Е 111 КС 123","Р 212 СН 23","Т 313 РУ 93","Н 414 РВ 93","Х 515 ТМ 93","У 616 СН 123","Х 717 РН 93","Р 919 ВК 93","У 616 СН 123",
  "С 999 РХ 123","А 444 АУ 23","О 555 КК 123",
  "Т 777 АК 123","Н 888 РС 123"
];

const BASE_TRAILERS = [
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
  list.push({ key, label, rho, adr });
  localStorage.setItem(LS_KEYS.products, JSON.stringify(list));
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
  const sel = $('trailerSelect'); sel.innerHTML='';
  getAllTrailers().forEach(t=>{ const opt=document.createElement('option'); opt.value=t.id; opt.textContent=t.name; if(t.id===selectedId) opt.selected=true; sel.appendChild(opt); });
}
function renderTractorSelect(selected){
  const sel=$('tractorSelect'); sel.innerHTML='';
  getAllTrucks().forEach(num=>{ const opt=document.createElement('option'); opt.value=num; opt.textContent=num; sel.appendChild(opt); });
  if(selected){ sel.value=selected; }
}
function setTrailerInfo(t){
  const info=$('trailerInfo'); if(!t){ info.textContent=''; return; }
  if(t.type==='tanker') info.innerHTML=`Тип: цистерна · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Отсеки: ${t.compartmentsLiters.join(' / ')} л (∑ ${t.compartmentsLiters.reduce((a,b)=>a+b,0)} л)`;
  else info.innerHTML=`Тип: площадка · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Позиции: ${t.positions||4}`;
}

// === Tanker table
function densityOptionsHtml(selectedKey){
  return getAllProducts().map(d=>`<option value="${d.key}" ${d.key===selectedKey?'selected':''}>${d.label}</option>`).join('');
}
function buildTankRows(state){
  const tb=$('tankBody'); tb.innerHTML='';
  const caps=state.caps||[];
  $('capsLine').textContent=caps.map((c,i)=>`#${i+1}: ${Number(c).toLocaleString('ru-RU')} л`).join(', ');
  state.rows.forEach((row,idx)=>{
    const tr=document.createElement('tr');
    const adrOptions=['Не знаю','3','8','—'];
    const currentAdr=row.adr||'Не знаю';
    if(!adrOptions.includes(String(currentAdr))) adrOptions.push(String(currentAdr));
    tr.dataset.index=String(idx);
    tr.innerHTML=`
      <td><span class="pill">#${idx+1}</span><div class="cap">лимит ${caps[idx]??'—'} л</div></td>
      <td><select class="selType">${densityOptionsHtml(row.typeKey||'diesel')}</select></td>
      <td><select class="selAdr">${adrOptions.map(o=>`<option value="${o}" ${String(currentAdr)===String(o)?'selected':''}>${o}</option>`).join('')}</select></td>
      <td><input class="inpRho" type="number" step="0.001" value="${row.rho??0.84}"></td>
      <td><input class="inpL" type="number" step="0.01" value="${row.liters??0}"></td>
      <td><input class="inpM3" type="number" readonly value="${(row.m3??(row.liters||0)/1000).toFixed(3)}"></td>
      <td><input class="inpT" type="number" readonly value="${(row.tons??((row.liters||0)*(row.rho||0)/1000)).toFixed(3)}"></td>`;
    tb.appendChild(tr);
  });
}
function ensureRowsMatchCaps(state){
  const need=state.caps.length;
  while(state.rows.length<need) state.rows.push({typeKey:'diesel', adr:'Не знаю', adrEdited:false, rho:0.84, liters:0, tons:0, m3:0});
  while(state.rows.length>need) state.rows.pop();
}
function tankerFromPreset(compartments){
  return {
    caps:[...compartments],
    rows: compartments.map(()=>({typeKey:'diesel', adr:'Не знаю', adrEdited:false, rho:0.84, liters:0, tons:0, m3:0})),
    sameCargo:false,
    lastDistribution:null
  };
}

// === Platform table
function buildPlatRows(state){
  const tb=$('platBody'); tb.innerHTML='';
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

function normalizeAppState(){
  const ts=app.trailerState;
  if(!ts) return;
  if(ts.type==='tanker'){
    ts.caps=Array.isArray(ts.caps)? ts.caps:[];
    ts.rows=(Array.isArray(ts.rows)? ts.rows:ts.caps.map(()=>({}))).map(row=>{
      const typeKey=row?.typeKey||'diesel';
      const rho=num(row?.rho,0.84)||0.84;
      const liters=num(row?.liters,0);
      const tons=isFinite(row?.tons)? Number(row.tons): (liters*rho)/1000;
      const m3=isFinite(row?.m3)? Number(row.m3): liters/1000;
      const adr=row?.adr||'Не знаю';
      const adrEdited=!!row?.adrEdited;
      return {typeKey, adr, adrEdited, rho, liters, tons, m3};
    });
    if(ts.sameCargo===undefined) ts.sameCargo=false;
    if(ts.lastDistribution===undefined) ts.lastDistribution=null;
  } else if(ts.type==='platform'){
    ts.masses=Array.isArray(ts.masses)? ts.masses:[];
  }
}
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem(LS_KEYS.state)||'null');
    if(s) app=s;
  }catch(e){}
  normalizeAppState();
}
function saveState(){ localStorage.setItem(LS_KEYS.state, JSON.stringify(app)); }

// ===== Init / Render =====
function selectTrailer(id){
  const all=getAllTrailers();
  const t=all.find(x=>x.id===id) || all[0];
  app.selectedTrailerId=t.id;
  if(t.type==='tanker'){ app.trailerState={type:'tanker', ...tankerFromPreset(t.compartmentsLiters)}; }
  else { app.trailerState={type:'platform', positions:t.positions||4, masses:Array(t.positions||4).fill(0)}; }
  renderCurrent(); saveState();
}
function renderCurrent(){
  const t=getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  setTrailerInfo(t);
  renderTrailerSelect(app.selectedTrailerId);
  renderTractorSelect(app.tractorPlate);
  if(!app.tractorPlate){ const allTr=getAllTrucks(); app.tractorPlate=allTr[0]; }
  const storedAx=getTruckAxles(app.tractorPlate); app.tractorAxles=storedAx||app.tractorAxles||2; $('tractorAxles').value=String(app.tractorAxles||2);
  $('tractorSelect').value=app.tractorPlate;

  const provEl = $('provider'); if (provEl) provEl.value = app.provider||'google';

  // --- режим расстояния + поля маршрута ---
  const isMaps = (app.distanceMode === 'gmaps' || app.distanceMode === 'maps');
  $('distanceMode').value = isMaps ? 'gmaps' : 'manual';

  $('distanceKm').value = app.distanceKm || '';
  $('ratePerKm').value  = app.ratePerKm || '';
  $('trips').value      = app.trips || 1;

  $('routeFrom').value  = app.routeFrom || '';
  $('routeTo').value    = app.routeTo   || '';

  const gmapsRowEl = $('gmapsRow');
  if(gmapsRowEl) gmapsRowEl.style.display = isMaps ? 'flex' : 'none';
  const gmapsNoteEl = $('gmapsNote');
  if(gmapsNoteEl) gmapsNoteEl.style.display = isMaps ? 'block' : 'none';

  if(app.trailerState.type==='tanker'){
    $('tankSection').style.display='block'; $('platformSection').style.display='none';
    ensureRowsMatchCaps(app.trailerState);
    buildTankRows(app.trailerState);
    if(app.trailerState.sameCargo===undefined) app.trailerState.sameCargo=false;
    const chk=$('chkAllSame'); if(chk) chk.checked=!!app.trailerState.sameCargo;
  }
  else { $('tankSection').style.display='none'; $('platformSection').style.display='block'; buildPlatRows(app.trailerState); }

  recalc();
}

// ===== Recalc =====
function recalc(){
  if(!app.trailerState){ return; }
  const tstate=app.trailerState; const warns=[]; let sumL=0, sumT=0;
  if($('tractorSelect')) app.tractorPlate=$('tractorSelect').value||app.tractorPlate;

  if(tstate.type==='tanker'){
    const tb=$('tankBody'); const rows=[...tb.querySelectorAll('tr')];
    ensureRowsMatchCaps(tstate);
    const same = $('chkAllSame')?.checked || false;
    tstate.sameCargo = same;

    let firstType=null, firstRho=1, firstAdr='Не знаю', firstAdrEdited=false;
    let manualOverflowLiters=0, manualOverflowTons=0;

    rows.forEach((tr,i)=>{
      const prev=tstate.rows[i]||{};
      const typeEl=tr.querySelector('.selType');
      let typeKey=typeEl?.value || prev.typeKey || 'diesel';
      let dict=getAllProducts().find(d=>d.key===typeKey);
      if(!dict){ dict=getAllProducts()[0]; if(dict){ typeKey=dict.key; if(typeEl) typeEl.value=dict.key; } }

      const rhoInp=tr.querySelector('.inpRho');
      const prevType=prev.typeKey;
      if(prevType!==typeKey && rhoInp) rhoInp.value=dict?.rho??rhoInp.value||1;
      let rho=num(rhoInp?.value, dict?.rho||1);
      if(!isFinite(rho) || rho<=0){ rho=dict?.rho||1; if(rhoInp) rhoInp.value=rho; }

      const adrSel=tr.querySelector('.selAdr');
      let adr=adrSel? adrSel.value : (prev.adr||'Не знаю');
      let adrEdited=!!prev.adrEdited;
      if(prevType!==typeKey && !adrEdited){
        adr='Не знаю';
      }
      if(adrSel && adrSel.value!==adr) adrSel.value=adr;

      if(i===0){
        firstType=typeKey; firstRho=rho; firstAdr=adr; firstAdrEdited=adrEdited;
      }else if(same){
        if(typeEl && typeEl.value!==firstType) typeEl.value=firstType;
        if(rhoInp) rhoInp.value=firstRho;
        if(adrSel) adrSel.value=firstAdr;
        typeKey=firstType; rho=firstRho; adr=firstAdr; adrEdited=firstAdrEdited;
      }

      const lInp=tr.querySelector('.inpL');
      let liters=num(lInp?.value,0);
      if(!isFinite(liters)) liters=0;
      if(liters<0){ warns.push(`Отсек #${i+1}: отрицательный объём, обнулил`); liters=0; if(lInp) lInp.value='0'; }
      const cap=tstate.caps[i]??Infinity;
      const over=Math.max(0, liters-cap);
      if(over>0){ warns.push(`Переполнение отсека #${i+1}: ${fmtLitersDetailed(liters)} л > лимита ${cap} л`); }

      const m3=liters/1000;
      const tons=(liters*rho)/1000;
      const m3Inp=tr.querySelector('.inpM3');
      const tInp=tr.querySelector('.inpT');
      if(m3Inp) m3Inp.value=isFinite(m3)? m3.toFixed(3):'0.000';
      if(tInp) tInp.value=isFinite(tons)? tons.toFixed(3):'0.000';

      tstate.rows[i]={typeKey, adr, adrEdited, rho, liters, tons, m3};
      sumL+=liters; sumT+=tons;
      manualOverflowLiters+=over;
      manualOverflowTons+=(over*rho)/1000;
    });

    if(manualOverflowLiters>0){ tstate.lastDistribution=null; }

    const capsLineEl=$('capsLine');
    if(capsLineEl){ capsLineEl.textContent=(tstate.caps||[]).map((capL,i)=>`#${i+1}: ${Number(capL).toLocaleString('ru-RU')} л`).join(', '); }

    let fitL=0, fitTons=0, fitM3=0;
    (tstate.rows||[]).forEach((r,i)=>{
      const cap=tstate.caps[i]??0;
      const liters=r.liters||0;
      const rho=r.rho||0;
      const put=Math.min(liters, cap);
      fitL+=put;
      fitM3+=put/1000;
      fitTons+=(put*rho)/1000;
    });

    let overflow={ liters: manualOverflowLiters, tons: manualOverflowTons, m3: manualOverflowLiters/1000 };
    if((overflow.liters||0) <= 0 && tstate.lastDistribution){ overflow={ ...tstate.lastDistribution }; }

    const parts=(tstate.caps||[]).map((capL,i)=>{
      const r=tstate.rows[i]||{};
      const maxM3=capL/1000;
      const maxT=(capL*(r.rho||0))/1000;
      return `#${i+1}: ${Number(capL).toLocaleString('ru-RU')} л (≈ ${fmtM3(maxM3)} м³ / ${fmtTonsDetailed(maxT)} т)`;
    });

    const fitBox=$('fitSummary');
    if(fitBox){
      let html=`Влезет по лимитам: <b>${fmtLitersDetailed(fitL)}</b> л / ${fmtM3(fitM3)} м³ / ${fmtTonsDetailed(fitTons)} т`;
      if((overflow.liters||0) > 0){
        html+=`<br>Не влезло: <b>${fmtLitersDetailed(overflow.liters)}</b> л / ${fmtM3(overflow.m3||0)} м³ / ${fmtTonsDetailed(overflow.tons||0)} т`;
      }
      if(parts.length) html+=`<br>${parts.join('; ')}`;
      fitBox.innerHTML=html;
    }

  } else {
    const tb=$('platBody'); const rows=[...tb.querySelectorAll('tr')];
    let masses=[]; rows.forEach((tr,i)=>{ let m=num(tr.querySelector('.inpMass').value,0); if(m<0){warns.push(`Позиция #${i+1}: отрицательная масса`); m=0;} masses[i]=m; sumT+=m/1000; });
    tstate.masses=masses; sumL=NaN;
  }

  $('sumL').textContent = isNaN(sumL)? '—' : fmtL(sumL);
  if($('sumT')) $('sumT').textContent = fmtT(sumT);

  const ul=$('warnList'); if (ul){
    ul.innerHTML='';
    if(warns.length===0){ const li=document.createElement('li'); li.textContent='Ошибок не обнаружено.'; ul.appendChild(li);} else { warns.forEach(w=>{ const li=document.createElement('li'); li.innerHTML=`<span class="warn">⚠</span> ${w}`; ul.appendChild(li); }); }
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
  let lines=[`Прицеп: ${t?.name||''} (${t?.type==='tanker'?'цистерна':'площадка'})`, `Тягач: ${app.tractorPlate||'—'} (${app.tractorAxles} оси)`, `Итоги: ${(isNaN(sumL)?'-':Math.round(sumL)+' л')}, ${sumT.toFixed(3)} т`];
  if(tstate.type==='tanker'){
    tstate.rows.forEach((r,i)=>{ const d=getAllProducts().find(x=>x.key===r.typeKey); lines.push(`#${i+1}: ${(d?.label)||r.typeKey}, ADR ${r.adr}, ρ=${r.rho}, ${fmtLitersDetailed(r.liters||0)} л / ${(r.m3||0).toFixed(3)} м³ / ${(r.tons||0).toFixed(3)} т`); });
  } else {
    (tstate.masses||[]).forEach((kg,i)=>{ lines.push(`#${i+1}: ${(kg/1000).toFixed(3)} т`); });
  }
  const routeStr=(app.routeFrom||app.routeTo)? `Маршрут: ${app.routeFrom||'?'} → ${app.routeTo||'?'}`:'';
  const costStr=(isFinite(cost)&&cost>0)? `Стоимость: ${cost.toLocaleString('ru-RU')} ₽ (${app.distanceKm} км × ${app.ratePerKm} ₽/км × ${app.trips} рейс.)`:'';
  if(routeStr) lines.push(routeStr); if(costStr) lines.push(costStr);
  if($('brief')) $('brief').value = lines.join('\n');

  saveState();
}

// ===== Events =====
function bind(){
  if($('trailerSelect')) $('trailerSelect').addEventListener('change', e=>selectTrailer(e.target.value));
  if($('tractorSelect')) $('tractorSelect').addEventListener('change', e=>{ app.tractorPlate=e.target.value; const ax=getTruckAxles(app.tractorPlate)||2; app.tractorAxles=ax; $('tractorAxles').value=String(ax); saveState(); recalc(); });
  if($('tractorAxles')) $('tractorAxles').addEventListener('change', e=>{ const ax=parseInt(e.target.value)||2; app.tractorAxles=ax; setTruckAxles(app.tractorPlate, ax); saveState(); recalc(); });

  const provEl = $('provider');
  if (provEl) provEl.addEventListener('change', e=>{ app.provider=e.target.value; saveState(); maybeInitMaps(); });

  const dmEl = $('distanceMode');
  if (dmEl) dmEl.addEventListener('change', e=>{
    app.distanceMode=e.target.value;
    const isMaps = (app.distanceMode==='gmaps' || app.distanceMode==='maps');
    const gmapsRowEl = $('gmapsRow');
    if(gmapsRowEl) gmapsRowEl.style.display = isMaps ? 'flex' : 'none';
    const gmapsNoteEl = $('gmapsNote');
    if(gmapsNoteEl) gmapsNoteEl.style.display = isMaps ? 'block' : 'none';
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
  const platBodyEl = $('platBody');
  if(platBodyEl) platBodyEl.addEventListener('input', recalc);

  const tankBodyEl = $('tankBody');
  if (tankBodyEl){
    tankBodyEl.addEventListener('input', (e)=>{
      if(app.trailerState?.type==='tanker'){
        const cls=e.target.classList;
        if(cls.contains('inpL') || cls.contains('inpRho')){
          app.trailerState.lastDistribution=null;
        }
      }
      recalc();
    });
    tankBodyEl.addEventListener('change', (e)=>{
      const tr = e.target.closest('tr');
      if(!tr || !app.trailerState || app.trailerState.type!=='tanker') return;
      const rows=[...tankBodyEl.querySelectorAll('tr')];
      const idx=rows.indexOf(tr);
      if(idx<0) return;
      const rowState=app.trailerState.rows[idx]||{};
      if(e.target.classList.contains('selType')){
        const typeKey = e.target.value;
        const d = getAllProducts().find(x=>x.key===typeKey);
        if(d){
          const rhoInp = tr.querySelector('.inpRho');
          if(rhoInp) rhoInp.value = d.rho;
        }
        rowState.typeKey=typeKey;
        rowState.adrEdited=false;
        rowState.adr='Не знаю';
        const adrSel=tr.querySelector('.selAdr');
        if(adrSel) adrSel.value='Не знаю';
        app.trailerState.rows[idx]=rowState;
        app.trailerState.lastDistribution=null;
        recalc();
      } else if(e.target.classList.contains('selAdr')){
        rowState.adr=e.target.value;
        rowState.adrEdited=true;
        app.trailerState.rows[idx]=rowState;
        app.trailerState.lastDistribution=null;
        recalc();
      } else if(e.target.classList.contains('inpRho')){
        rowState.rho=num(e.target.value, rowState.rho||1);
        app.trailerState.rows[idx]=rowState;
        app.trailerState.lastDistribution=null;
        recalc();
      }
    });
  }

  const chkAll = $('chkAllSame');
  if (chkAll) chkAll.addEventListener('change', (e)=>{
    if(!app.trailerState || app.trailerState.type!=='tanker') return;
    app.trailerState.sameCargo=!!e.target.checked;
    app.trailerState.lastDistribution=null;
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
  if($('btnAddProduct')) $('btnAddProduct').addEventListener('click', ()=>{
    const label = prompt('Название продукта:'); if(!label) return;
    const rho = parseFloat(prompt('Плотность ρ, кг/л:','1.00')); if(!Number.isFinite(rho)||rho<=0){ alert('Некорректная плотность'); return; }
    const adr = prompt('ADR (3 / 8 / —):','—') || '—';
    addCustomProduct(label.trim(), rho, adr);
    renderCurrent();
  });

  // карты
  if($('btnRoute')) $('btnRoute').addEventListener('click', buildRoute);
  if($('btnGmaps')) $('btnGmaps').addEventListener('click', buildRoute); // поддержка старой кнопки
  if($('mapsKey')) $('mapsKey').addEventListener('input', ()=>maybeInitMaps());
  if($('gmapsKey')) $('gmapsKey').addEventListener('input', ()=>maybeInitMaps()); // поддержка старого id
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
  if($('tractorSelect')) $('tractorSelect').value=plate;
  if($('tractorAxles')) $('tractorAxles').value=String(axles);
  app.tractorPlate=plate; app.tractorAxles=axles; saveState();
  closeTruckModal();
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
    const n=tstate.rows.length; for(let i=0;i<n;i++){ const row=tstate.rows[i]; const W=num(row.tons,0)*1000; const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
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
window.addEventListener('load', ()=>{ syncAxleParamsFromTrailer(); calcAxles(); });

// ===== Maps (Google / Yandex) =====
let _gmapsLoading=false, _gmapsLoaded=false, _ymapsLoading=false, _ymapsLoaded=false, _acFrom=null, _acTo=null, _fromPlaceId=null, _toPlaceId=null, _yaSuggestFrom=null, _yaSuggestTo=null;

function mapsApiKey(){
  // поддержка и нового (#mapsKey), и старого (#gmapsKey) поля
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

// ===== Tests (без проверки на блокировку спирта)
function runTests(){
  const out=$('testResults');
  const results=[];
  const approx=(a,b,e=0.01)=>Math.abs(a-b)<=e;
  const pass=n=>results.push(`<div class='pass'>✔ ${n}</div>`);
  const fail=(n,m='')=>results.push(`<div class='fail'>✘ ${n}${m?': '+m:''}</div>`);
  const backup=JSON.stringify(app);
  try{
    selectTrailer('MO0882_23');
    const tb=$('tankBody');
    const first=tb?.querySelector('tr');
    if(!first) throw new Error('Нет строки для теста');

    first.querySelector('.selType').value='syrup';
    first.querySelector('.selType').dispatchEvent(new Event('change',{bubbles:true}));
    recalc();
    const rhoVal=parseFloat(first.querySelector('.inpRho').value);
    if(approx(rhoVal,1.30,0.001)) pass('ρ берётся из справочника'); else fail('ρ из справочника', rhoVal);
    const adrVal=first.querySelector('.selAdr').value;
    if(adrVal==='Не знаю') pass('ADR сбрасывается на «Не знаю»'); else fail('ADR по умолчанию', adrVal);

    first.querySelector('.inpL').value='1000';
    recalc();
    const tonsVal=parseFloat(first.querySelector('.inpT').value);
    const m3Val=parseFloat(first.querySelector('.inpM3').value);
    if(approx(tonsVal,1.30,0.001)) pass('1000 л → 1.300 т'); else fail('Конверсия в т', tonsVal);
    if(approx(m3Val,1.00,0.001)) pass('1000 л → 1.000 м³'); else fail('Конверсия в м³', m3Val);

    const chk=$('chkAllSame'); if(chk){ chk.checked=true; chk.dispatchEvent(new Event('change',{bubbles:true})); }
    distributeByMassKg(12000);
    const litersAfter=parseFloat(first.querySelector('.inpL').value);
    if(approx(litersAfter,9230.77,0.2)) pass('Распределение по массе учитывает ρ'); else fail('Распределение по массе', litersAfter);

    distributeByLiters(28500);
    const totalLiters=app.trailerState.rows.reduce((s,r)=>s+(r.liters||0),0);
    if(approx(totalLiters,28500,0.5)) pass('Распределение по литрам учитывает лимиты'); else fail('Распределение по литрам', totalLiters);

    if($('distanceMode')) $('distanceMode').value='manual';
    if($('gmapsRow')) $('gmapsRow').style.display='none';
    if($('distanceKm')) $('distanceKm').value='100';
    if($('ratePerKm')) $('ratePerKm').value='50';
    if($('trips')) $('trips').value='2';
    recalc();
    const costText=$('kpiCost')?.textContent?.replace(/\D+/g,'');
    if(parseInt(costText)===10000) pass('Стоимость вручную считается'); else fail('Стоимость вручную', $('kpiCost')?.textContent||'');

    $('recalcAxles')?.click();
    const gtotal=$('G_total_ax')?.textContent;
    if(gtotal && gtotal!=='—') pass('Осевые: масса поезда рассчитана'); else fail('Осевые расчёты');
  }catch(e){ fail('Исключение тестов', e.message||String(e)); }
  finally{ try{ app=JSON.parse(backup); normalizeAppState(); renderCurrent(); }catch(_){} }
  if(out) out.innerHTML=results.join('');
}

function normalizeBulkUnit(unit){
  if(!unit) return null;
  const u=unit.toLowerCase().replace('.', '');
  const map={ t:['t','т','тонн','тонна','тонны'], kg:['kg','кг'], m3:['m3','м3','м³','куб','кубм','кубометр','кубометров'], l:['l','л','литр','литра','литров'] };
  for(const [norm,list] of Object.entries(map)){
    if(list.includes(u)) return norm;
  }
  return null;
}

function parseBulkValue(raw, fallbackUnit){
  if(raw==null) raw='';
  let str=String(raw).trim();
  if(!str) return null;
  str=str.replace(',', '.');
  const match=str.match(/^([\d.\s]+)([a-zа-яё³]*)$/i);
  let valuePart=str;
  let unitPart='';
  if(match){
    valuePart=match[1];
    unitPart=match[2];
  }
  const value=parseFloat(valuePart.replace(/\s+/g,''));
  if(!isFinite(value)) return null;
  let unit=unitPart.replace(/\s+/g,'');
  if(!unit) unit=fallbackUnit||'t';
  const normalized=normalizeBulkUnit(unit);
  if(!normalized) return null;
  return { value, unit: normalized };
}

function distributeByLiters(totalLiters){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const liters=Math.max(0, num(totalLiters,0));
  const tstate=app.trailerState;
  const rowsEl=$('tankBody')? [...$('tankBody').querySelectorAll('tr')]:[];
  rowsEl.forEach(tr=>{ const inp=tr.querySelector('.inpL'); if(inp) inp.value='0'; });
  let rest=liters;
  let lastRho=tstate.rows[0]?.rho||1;
  for(let i=0;i<tstate.caps.length;i++){
    const cap=tstate.caps[i]||0;
    const tr=rowsEl[i];
    if(!tr) continue;
    const rho=num(tr.querySelector('.inpRho')?.value, tstate.rows[i]?.rho||1) || 1;
    lastRho=rho;
    const put=Math.min(cap, rest);
    tr.querySelector('.inpL').value = put>0? String(Number(put.toFixed(2))):'0';
    rest-=put;
    if(rest<=0){ rest=0; break; }
  }
  const overflowLiters=Math.max(0, rest);
  let overflowTons=0;
  if(overflowLiters>0 && lastRho>0) overflowTons=(overflowLiters*lastRho)/1000;
  tstate.lastDistribution={ liters: overflowLiters, tons: overflowTons, m3: overflowLiters/1000 };
  recalc();
}

function distributeByMassKg(totalKg){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  let restKg=Math.max(0, num(totalKg,0));
  const tstate=app.trailerState;
  const rowsEl=$('tankBody')? [...$('tankBody').querySelectorAll('tr')]:[];
  rowsEl.forEach(tr=>{ const inp=tr.querySelector('.inpL'); if(inp) inp.value='0'; });
  const same=$('chkAllSame')?.checked || tstate.sameCargo;
  const firstRho=num(rowsEl[0]?.querySelector('.inpRho')?.value, tstate.rows[0]?.rho||1) || 1;
  let lastRhoUsed=firstRho;
  for(let i=0;i<tstate.caps.length;i++){
    const cap=tstate.caps[i]||0;
    const tr=rowsEl[i];
    if(!tr) continue;
    let rho=same ? firstRho : num(tr.querySelector('.inpRho')?.value, tstate.rows[i]?.rho||1);
    if(!isFinite(rho) || rho<=0) rho=1;
    lastRhoUsed=rho;
    const litersByMass=restKg/rho;
    const putL=Math.min(cap, litersByMass);
    tr.querySelector('.inpL').value = putL>0? String(Number(putL.toFixed(2))):'0';
    restKg-=putL*rho;
    if(restKg<=0){ restKg=0; break; }
  }
  restKg=Math.max(0, restKg);
  const overflowLiters=lastRhoUsed>0? restKg/lastRhoUsed:0;
  const overflowTons=restKg/1000;
  tstate.lastDistribution={ liters: overflowLiters, tons: overflowTons, m3: overflowLiters/1000 };
  recalc();
}

function applyBulkValue(rawInput, fallbackUnit){
  const parsed=parseBulkValue(rawInput, fallbackUnit);
  if(!parsed || parsed.value<=0) return false;
  if(parsed.unit==='l') distributeByLiters(parsed.value);
  else if(parsed.unit==='m3') distributeByLiters(parsed.value*1000);
  else if(parsed.unit==='kg') distributeByMassKg(parsed.value);
  else if(parsed.unit==='t') distributeByMassKg(parsed.value*1000);
  else return false;
  return true;
}

function fillAllByMax(){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const tstate=app.trailerState;
  const rowsEl=$('tankBody')? [...$('tankBody').querySelectorAll('tr')]:[];
  tstate.lastDistribution=null;
  rowsEl.forEach((tr,i)=>{ const cap=tstate.caps[i]||0; const inp=tr.querySelector('.inpL'); if(inp) inp.value=cap>0? String(cap):'0'; });
  recalc();
}

function clearAllCompartments(){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const rowsEl=$('tankBody')? [...$('tankBody').querySelectorAll('tr')]:[];
  app.trailerState.lastDistribution=null;
  rowsEl.forEach(tr=>{ const inp=tr.querySelector('.inpL'); if(inp) inp.value='0'; });
  recalc();
}

// ===== Boot =====
function boot(){
  renderTrailerSelect(); 
  loadState();
  if (app.distanceMode === 'maps') app.distanceMode = 'gmaps'; // страховка

  if(!app.selectedTrailerId){ const all=getAllTrailers(); app.selectedTrailerId=all[0].id; app.tractorAxles=2; }
  renderTrailerSelect(app.selectedTrailerId);
  selectTrailer(app.selectedTrailerId);
  bind();
  const bulkBtn=$('bulkApply');
  if(bulkBtn) bulkBtn.addEventListener('click', ()=>{
    const fallback=$('bulkUnit')?.value || 't';
    const raw=$('bulkValue')?.value || '';
    if(!applyBulkValue(raw, fallback)){
      alert('Укажите количество (>0)');
      return;
    }
  });
  const fillBtn=$('fillMax');
  if(fillBtn) fillBtn.addEventListener('click', (e)=>{ e?.preventDefault?.(); fillAllByMax(); });
  const clearBtn=$('clearAll');
  if(clearBtn) clearBtn.addEventListener('click', (e)=>{ e?.preventDefault?.(); clearAllCompartments(); });

  const tbtn = $('runTests'); if (tbtn) tbtn.addEventListener('click', runTests);
  maybeInitMaps();
}
boot();
