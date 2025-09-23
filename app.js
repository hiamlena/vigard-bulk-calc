// ===== Helpers =====
function $(id){ return document.getElementById(id); }
function num(v,def=0){ const n=parseFloat(v); return isFinite(n)?n:def; }
function fmtL(n){ return isFinite(n)? Math.round(n).toLocaleString('ru-RU')+' л':'—'; }
function fmtKg(n){ return isFinite(n)? Math.round(n).toLocaleString('ru-RU')+' кг':'—'; }

// ===== Data =====
const DENSITIES = [
  { key: "diesel", label: "Дизельное топливо (ДТ)", rho: 0.84, adr: "3" },
  { key: "gas92", label: "Бензин АИ-92", rho: 0.74, adr: "3" },
  { key: "gas95", label: "Бензин АИ-95", rho:  0.75, adr: "3" },

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

function densityOptionsHtml(selectedKey){
  return DENSITIES.map(d=>`<option value="${d.key}" ${d.key===selectedKey?'selected':''}>${d.label}</option>`).join('');
}
function buildTankRows(state){
  const tb=$('tankBody'); tb.innerHTML='';
  const caps=state.caps||[]; $('capsLine').textContent=caps.map((c,i)=>`#${i+1}: ${c} л`).join(', ');
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
  const need=state.caps.length;
  while(state.rows.length<need) state.rows.push({typeKey:'diesel', adr:'3', rho:0.84, liters:0, kg:0});
  while(state.rows.length>need) state.rows.pop();
}
function tankerFromPreset(compartments){
  return { caps:[...compartments], rows: compartments.map(()=>({typeKey:'diesel', adr:'3', rho:0.84, liters:0, kg:0})) };
}

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
  distanceMode:'manual',
  distanceKm:0,
  ratePerKm:0,
  trips:1,
  routeFrom:'',
  routeTo:''
};
function loadState(){ try{ const s=JSON.parse(localStorage.getItem(LS_KEYS.state)||'null'); if(s) app=s; }catch(e){} }
function saveState(){ localStorage.setItem(LS_KEYS.state, JSON.stringify(app)); }

function selectTrailer(id){
  const t=getAllTrailers().find(x=>x.id===id) || getAllTrailers()[0];
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
  const storedAx=getTruckAxles(app.tractorPlate); app.tractorAxles=storedAx||app.tractorAxles||2; $('tractorAxles').value=String(app.tractorAxles||2);

  $('distanceMode').value=app.distanceMode||'manual';
  $('distanceKm').value=app.distanceKm||''; $('ratePerKm').value=app.ratePerKm||''; $('trips').value=app.trips||1; $('routeFrom').value=app.routeFrom||''; $('routeTo').value=app.routeTo||''; $('gmapsRow').style.display=(app.distanceMode==='gmaps')?'grid':'none';
  $('gmapsNote').style.display=(app.distanceMode==='gmaps')?'block':'none';

  if(app.trailerState.type==='tanker'){ $('tankSection').style.display='block'; $('platformSection').style.display='none'; ensureRowsMatchCaps(app.trailerState); buildTankRows(app.trailerState); }
  else { $('tankSection').style.display='none'; $('platformSection').style.display='block'; buildPlatRows(app.trailerState); }
  recalc();
}

// ===== Recalc =====
function recalc(){
  const tstate=app.trailerState; const warns=[]; let sumL=0, sumKg=0;
  if($('tractorSelect')) app.tractorPlate=$('tractorSelect').value||app.tractorPlate;

  if(tstate.type==='tanker'){
    const tb=$('tankBody'); const rows=[...tb.querySelectorAll('tr')];
    let ethanolDetected=false;
    rows.forEach((tr,i)=>{
      const typeKey=tr.querySelector('.selType').value;
      const dict=DENSITIES.find(d=>d.key===typeKey) || DENSITIES[0];
      const rho=num(tr.querySelector('.inpRho').value, dict.rho);
      const adr=tr.querySelector('.selAdr').value;
      let liters=num(tr.querySelector('.inpL').value, NaN);
      let kg=num(tr.querySelector('.inpKg').value, NaN);

      if(!isFinite(liters) && isFinite(kg)) liters = rho>0? kg/rho : 0;
      if(!isFinite(kg) && isFinite(liters)) kg = liters*rho;
      if(!isFinite(liters)) liters=0; if(!isFinite(kg)) kg=0;

      if(liters<0||kg<0) warns.push(`Отсек #${i+1}: отрицательные значения`);
      const cap=tstate.caps[i]??Infinity; if(liters>cap) warns.push(`Переполнение отсека #${i+1}: ${Math.round(liters)} л > лимита ${cap} л`);

      tr.querySelector('.inpL').value = liters || 0; tr.querySelector('.inpKg').value = kg || 0;
      tstate.rows[i]={typeKey, adr, rho, liters, kg};

      sumL+=liters; sumKg+=kg;
      if(typeKey==='ethanol96' && liters>0) ethanolDetected=true;
    });
    $('ethanolBanner').style.display = ethanolDetected? 'block':'none';
    const btn=$('submitBtn'); if(btn) btn.disabled = !!ethanolDetected;
  } else {
    const tb=$('platBody'); const rows=[...tb.querySelectorAll('tr')];
    let masses=[]; rows.forEach((tr,i)=>{ let m=num(tr.querySelector('.inpMass').value,0); if(m<0){warns.push(`Позиция #${i+1}: отрицательная масса`); m=0;} masses[i]=m; sumKg+=m; });
    tstate.masses=masses; sumL=NaN;
  }

  $('sumL').textContent = isNaN(sumL)? '—' : fmtL(sumL);
  $('sumKg').textContent = fmtKg(sumKg);

  const ul=$('warnList'); ul.innerHTML=''; if(warns.length===0){ const li=document.createElement('li'); li.textContent='Ошибок не обнаружено.'; ul.appendChild(li);} else { warns.forEach(w=>{ const li=document.createElement('li'); li.innerHTML=`<span class="warn">⚠</span> ${w}`; ul.appendChild(li); }); }

  app.distanceKm=num($('distanceKm').value, app.distanceKm||0);
  app.ratePerKm=num($('ratePerKm').value, app.ratePerKm||0);
  app.trips=parseInt($('trips').value)||app.trips||1;
  const cost=app.distanceKm*app.ratePerKm*app.trips;
  $('kpiDistance').textContent = (isFinite(app.distanceKm)&&app.distanceKm>0)? (Math.round(app.distanceKm).toLocaleString('ru-RU')+' км'):'—';
  $('kpiRate').textContent = (isFinite(app.ratePerKm)&&app.ratePerKm>0)? (app.ratePerKm.toLocaleString('ru-RU')+' ₽/км'):'—';
  $('kpiTrips').textContent = String(app.trips);
  $('kpiCost').textContent = (isFinite(cost)&&cost>0)? cost.toLocaleString('ru-RU')+' ₽' : '—';

  const t=getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  let lines=[`Прицеп: ${t?.name||''} (${t?.type==='tanker'?'цистерна':'площадка'})`, `Тягач: ${app.tractorPlate||'—'} (${app.tractorAxles} оси)`, `Итоги: ${(isNaN(sumL)?'-':Math.round(sumL)+' л')}, ${(sumKg/1000).toFixed(2)} т`];
  if(tstate.type==='tanker'){
    tstate.rows.forEach((r,i)=>{ const d=DENSITIES.find(x=>x.key===r.typeKey); lines.push(`#${i+1}: ${(d?.label)||r.typeKey}, ρ=${r.rho}, ${Math.round(r.liters)} л / ${Math.round(r.kg)} кг`); });
  } else {
    (tstate.masses||[]).forEach((kg,i)=>{ lines.push(`#${i+1}: ${Math.round(kg)} кг`); });
  }
  const routeStr=(app.routeFrom||app.routeTo)? `Маршрут: ${app.routeFrom||'?'} → ${app.routeTo||'?'}`:'';
  const costStr=(isFinite(cost)&&cost>0)? `Стоимость: ${cost.toLocaleString('ru-RU')} ₽ (${app.distanceKm} км × ${app.ratePerKm} ₽/км × ${app.trips} рейс.)`:'';
  if(routeStr) lines.push(routeStr); if(costStr) lines.push(costStr);
  $('brief').value = lines.join('\n');

  saveState();
}

// ===== Events =====
function bind(){
  $('trailerSelect').addEventListener('change', e=>selectTrailer(e.target.value));
  $('tractorSelect').addEventListener('change', e=>{ app.tractorPlate=e.target.value; const ax=getTruckAxles(app.tractorPlate)||2; app.tractorAxles=ax; $('tractorAxles').value=String(ax); saveState(); recalc(); });
  $('tractorAxles').addEventListener('change', e=>{ const ax=parseInt(e.target.value)||2; app.tractorAxles=ax; setTruckAxles(app.tractorPlate, ax); saveState(); recalc(); });
  $('resetPreset').addEventListener('click', ()=>selectTrailer(app.selectedTrailerId));
  $('copyBrief').addEventListener('click', ()=>navigator.clipboard.writeText($('brief').value));

  ['tankBody','platBody'].forEach(id=>{ $(id).addEventListener('input', recalc); });

  $('addTrailer').addEventListener('click', openModal);
  $('m_type').addEventListener('change', e=>{ const isPlat=e.target.value==='platform'; $('m_positions_wrap').style.display=isPlat?'block':'none'; $('m_caps_wrap').style.display=isPlat?'none':'block'; });
  $('m_cancel').addEventListener('click', closeModal);
  $('m_save').addEventListener('click', saveModalTrailer);

  $('distanceMode').addEventListener('change', e=>{ app.distanceMode=e.target.value; $('gmapsRow').style.display=(app.distanceMode==='gmaps')?'grid':'none'; $('gmapsNote').style.display=(app.distanceMode==='gmaps')?'block':'none'; saveState(); });
  ['distanceKm','ratePerKm','trips','routeFrom','routeTo'].forEach(id=>{ $(id).addEventListener('input', ()=>{ app.distanceKm=num($('distanceKm').value,0); app.ratePerKm=num($('ratePerKm').value,0); app.trips=parseInt($('trips').value)||1; app.routeFrom=$('routeFrom').value; app.routeTo=$('routeTo').value; saveState(); recalc(); }); });
  $('btnGmaps').addEventListener('click', gmapsDistance);
}

// ===== Modal logic =====
function openModal(){ $('modal').classList.add('open'); }
function closeModal(){ $('modal').classList.remove('open'); }
function genId(name){ return name.replace(/\s+/g,'_'); }
function saveModalTrailer(){
  const name=$('m_name').value.trim(); if(!name){ alert('Укажи номер прицепа'); return; }
  const type=$('m_type').value; const axles=parseInt($('m_axles').value)||4; const tare=num($('m_tare').value, type==='platform'?5900:(axles===3?7300:7800));
  let obj;
  if(type==='platform'){
    const positions=parseInt($('m_positions').value)||4;
    obj={ id: genId(name), name, type, axles, tareKg: tare, positions };
  } else {
    const capsStr=$('m_caps').value.trim(); const caps=capsStr? capsStr.split('/').map(s=>parseInt(s.replace(/\s+/g,''))||0) : [10000,8000,9000];
    obj={ id: genId(name), name, type, axles, tareKg: tare, compartmentsLiters: caps };
  }
  const custom=JSON.parse(localStorage.getItem(LS_KEYS.custom)||'[]'); custom.push(obj); localStorage.setItem(LS_KEYS.custom, JSON.stringify(custom));
  renderTrailerSelect(app.selectedTrailerId); closeModal();
}

// ===== Axle calc =====
function syncAxleParamsFromTrailer(){
  const t = getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  if(!t) return;
  $('axTl_ax').value = t.axles || 3;
  $('mp_ax').value   = t.tareKg || (t.axles===3?7300:7800);
  $('LA_ax').value = t.axles===3 ? 11800 : 12000;
  $('LB_ax').value = t.axles===3 ? 7400  : 7600;
  $('LC_ax').value = t.axles===3 ? 4400  : 4400;
  $('NTpp_ax').value = 2000;
}
function collectMassesAndPositions(){
  const LA = num($('LA_ax').value,12000);
  const tstate = app.trailerState; let kg=[], xs=[];
  if(tstate.type==='tanker'){
    const n=tstate.rows.length; for(let i=0;i<n;i++){ const row=tstate.rows[i]; const W=num(row.kg,0); const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
  } else {
    const n=tstate.masses.length; for(let i=0;i<n;i++){ const W=num(tstate.masses[i],0); const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
  }
  return {kg,xs};
}
function calcAxles(){
  const axTr=parseInt($('axTr_axle').value)||2; const axTl=parseInt($('axTl_ax').value)||3; const mT=8200;
  const LT=num($('LT_ax').value,3800), l2=num($('l2_ax').value,350), NT10=num($('NT10_ax').value,4200), NT20=num($('NT20_ax').value,4000);
  const mp=num($('mp_ax').value,7300), LA=num($('LA_ax').value,12000), LB=Math.max(1,num($('LB_ax').value,7600)), LC=num($('LC_ax').value,4400), NTpp=num($('NTpp_ax').value,2000);
  const {kg,xs}=collectMassesAndPositions();
  let Rk_sum=NTpp, Rb_sum=Math.max(0, mp-NTpp);
  for(let i=0;i<kg.length;i++){ const W=kg[i], x=xs[i]; const Rb=W*(x/LB); const Rk=W-Rb; Rk_sum+=Rk; Rb_sum+=Rb; }
  const R_front_from_pin=Rk_sum*(l2/LT), R_rear_from_pin=Rk_sum-R_front_from_pin;
  const Ax1=NT10+R_front_from_pin, Ax2_group=NT20+R_rear_from_pin;
  const perTrailerAxle=Rb_sum/axTl, perTractorRear=(axTr===3)?(Ax2_group/2):Ax2_group;
  const cargoSum=kg.reduce((a,b)=>a+b,0), G_total=mT+mp+cargoSum;
  $('G_total_ax').textContent=(G_total/1000).toFixed(2)+' т';
  $('Ax1_ax').textContent=Math.round(Ax1).toLocaleString('ru-RU')+' кг';
  $('Ax2_ax').textContent=(axTr===3? `${Math.round(perTractorRear).toLocaleString('ru-RU')} кг × 2` : Math.round(Ax2_group).toLocaleString('ru-RU')+' кг');
  $('AxTl_ax').textContent=`${Math.round(Rb_sum).toLocaleString('ru-RU')} кг (≈ ${Math.round(perTrailerAxle).toLocaleString('ru-RU')} кг × ${axTl})`;
  const warn=[]; if(Ax1>7500) warn.push('Передняя ось > 7.5 т'); if(axTr===2 && Ax2_group>11500) warn.push('Задняя ось тягача > 11.5 т'); if(axTr===3 && perTractorRear>11500) warn.push('Ось задней группы тягача > 11.5 т'); if(perTrailerAxle>10000) warn.push('Ось тележки прицепа > 10 т'); const w=$('axWarn_ax'); if(warn.length){ w.style.display='block'; w.textContent='Проверь нормативы: '+warn.join('; ');} else { w.style.display='none'; }
}
(function(){ $('recalcAxles').addEventListener('click', calcAxles); ['LT_ax','l2_ax','NT10_ax','NT20_ax','mp_ax','LA_ax','LB_ax','LC_ax','NTpp_ax','axTr_axle'].forEach(id=>{ $(id).addEventListener('input', calcAxles); }); })();
const _recalc_orig=recalc; recalc=function(){ _recalc_orig(); calcAxles(); };
const _selectTrailer_orig=selectTrailer; selectTrailer=function(id){ _selectTrailer_orig(id); syncAxleParamsFromTrailer(); calcAxles(); };
window.addEventListener('load', ()=>{ syncAxleParamsFromTrailer(); calcAxles(); });

// ===== Google Maps distance =====
let _gmapsLoading=false, _gmapsLoaded=false, _acFrom=null, _acTo=null, _fromPlaceId=null, _toPlaceId=null;
function loadGoogleMaps(key){
  return new Promise((resolve,reject)=>{
    if(_gmapsLoaded){ resolve(); return; }
    if(_gmapsLoading){ const iv=setInterval(()=>{ if(_gmapsLoaded){ clearInterval(iv); resolve(); } }, 200); return; }
    _gmapsLoading=true; const s=document.createElement('script'); s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`; s.async=true; s.defer=true; s.onload=()=>{ _gmapsLoaded=true; resolve(); }; s.onerror=()=>{ _gmapsLoading=false; reject(new Error('Не удалось загрузить Google Maps JS API')); }; document.head.appendChild(s);
  });
}
function ensureAutocomplete(){
  if(!_gmapsLoaded) return;
  if(!_acFrom){ _acFrom=new google.maps.places.Autocomplete($('routeFrom'), { types:['(cities)'], componentRestrictions:{ country:['ru','by','kz','ge','az','am','kg'] } }); _acFrom.addListener('place_changed', ()=>{ const p=_acFrom.getPlace(); _fromPlaceId=p?.place_id||null; }); }
  if(!_acTo){ _acTo=new google.maps.places.Autocomplete($('routeTo'), { types:['(cities)'], componentRestrictions:{ country:['ru','by','kz','ge','az','am','kg'] } }); _acTo.addListener('place_changed', ()=>{ const p=_acTo.getPlace(); _toPlaceId=p?.place_id||null; }); }
  $('gmapsNote').style.display='block';
}
function gmapsDistance(){
  const key=$('gmapsKey').value.trim(); const fromStr=$('routeFrom').value.trim(); const toStr=$('routeTo').value.trim(); const avoidTolls=$('avoidTolls').checked;
  if(!key){ alert('Укажите Google API key'); return; }
  if(!fromStr||!toStr){ alert('Заполните поля Откуда и Куда'); return; }
  loadGoogleMaps(key).then(()=>{
    ensureAutocomplete();
    const svc=new google.maps.DirectionsService();
    const origin=_fromPlaceId? {placeId:_fromPlaceId} : fromStr;
    const destination=_toPlaceId? {placeId:_toPlaceId} : toStr;
    svc.route({ origin, destination, travelMode:google.maps.TravelMode.DRIVING, provideRouteAlternatives:false, avoidFerries:true, avoidHighways:false, avoidTolls }, (res,status)=>{
      if(status!=='OK'){ alert('Directions error: '+status); return; }
      try{ const route=res.routes[0]; const meters=route.legs.reduce((s,leg)=>s+(leg.distance?.value||0),0); const km=Math.round(meters/1000); $('distanceKm').value=String(km); app.distanceKm=km; saveState(); recalc(); }catch(e){ alert('Ошибка обработки маршрута'); }
    });
  }).catch(err=>alert(err.message||String(err)));
}

// ===== Tests =====
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

    const caps=[...$('capsLine').textContent.matchAll(/(\d+)/g)].map(m=>parseInt(m[1]));
    if(JSON.stringify(caps)===JSON.stringify([10365,6925,10450])) pass('Пресет МО 0882 23'); else fail('Пресет МО 0882 23');

    first.querySelector('.selType').value='ethanol96'; first.querySelector('.inpL').value='10000'; recalc();
    if($('ethanolBanner').style.display==='block' && $('submitBtn').disabled) pass('Спирт: баннер и disable'); else fail('Спирт');

    selectTrailer('ER8977_23');
    if($('platformSection').style.display==='block' && $('tankSection').style.display==='none') pass('Площадка рендерится'); else fail('Площадка рендер');

    localStorage.setItem(LS_KEYS.custom, JSON.stringify([]));
    $('m_name').value='МК 9999 23'; $('m_type').value='tanker'; $('m_axles').value='4'; $('m_tare').value='7800'; $('m_caps').value='10000/8000/7000';
    saveModalTrailer();
    const all=getAllTrailers(); if(all.find(x=>x.name==='МК 9999 23')) pass('Кастом добавлен'); else fail('Кастом не добавлен');

    $('distanceMode').value='manual'; $('gmapsRow').style.display='none'; $('distanceKm').value='100'; $('ratePerKm').value='50'; $('trips').value='2'; recalc();
    const costText=$('kpiCost').textContent.replace(/\D+/g,''); if(parseInt(costText)===10000) pass('Стоимость вручную считается'); else fail('Стоимость вручную', $('kpiCost').textContent);

    selectTrailer('MO0882_23'); tb=$('tankBody'); first=tb.querySelector('tr'); first.querySelector('.selType').value='diesel'; first.querySelector('.inpL').value='1000'; recalc();
    if($('ethanolBanner').style.display==='none' && !$('submitBtn').disabled) pass('Снятие бана по спирту'); else fail('Снятие бана по спирту');

    $('recalcAxles')?.click();
    const gtotal=$('G_total_ax').textContent; if(gtotal && gtotal!=='—') pass('Осевые: масса поезда рассчитана'); else fail('Осевые расчёты');
  }catch(e){ fail('Исключение тестов', e.message); }
  finally{ try{ app=JSON.parse(backup); renderCurrent(); }catch(_){} }
  out.innerHTML=results.join('');
}

// ===== Boot =====
function boot(){
  renderTrailerSelect(); loadState();
  if(!app.selectedTrailerId){ const all=getAllTrailers(); app.selectedTrailerId=all[0].id; app.tractorAxles=2; }
  renderTrailerSelect(app.selectedTrailerId); selectTrailer(app.selectedTrailerId); bind();
  $('runTests').addEventListener('click', runTests);
}
boot();
