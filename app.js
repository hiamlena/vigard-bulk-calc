// ===== Helpers =====
function $(id){ return document.getElementById(id); }
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
function roundLiters(n){
  if(!isFinite(n)) return 0;
  return Math.round(n);
}
const pendingWarnings=[];
function pushPendingWarning(msg){
  if(!msg) return;
  if(!pendingWarnings.includes(msg)) pendingWarnings.push(msg);
}
function pullPendingWarnings(){
  const copy=[...pendingWarnings];
  pendingWarnings.length=0;
  return copy;
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
  state:  'vigard_state_v6'
};
const LEGACY_STATE_KEYS = ['vigard_state_v5', 'vigard_state_v4', 'vigard_state_v3', 'vigard_state_v2', 'vigard_state'];

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
function fillSelectOptions(selectEl, items, selectedValue){
  if(!selectEl) return;
  selectEl.innerHTML='';
  items.forEach(item=>{
    const opt=document.createElement('option');
    opt.value=item.value;
    opt.textContent=item.label;
    if(item.value===selectedValue) opt.selected=true;
    selectEl.appendChild(opt);
  });
  if(selectedValue) selectEl.value=selectedValue;
}
function renderTrailerSelect(selectedId){
  const options=getAllTrailers().map(t=>({ value:t.id, label:t.name }));
  fillSelectOptions($('trailerSelect'), options, selectedId);
  fillSelectOptions($('trailer'), options, selectedId);
}
function renderTractorSelect(selected){
  const options=getAllTrucks().map(num=>({ value:num, label:num }));
  fillSelectOptions($('tractorSelect'), options, selected);
  fillSelectOptions($('truck'), options, selected);
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
function adrValues(){
  const set=new Set(['Не знаю']);
  getAllProducts().forEach(d=>{
    const raw=(d?.adr??'').toString().trim();
    if(raw) set.add(raw);
  });
  return [...set];
}
function adrOptionsHtml(selected){
  const choice=selected||'Не знаю';
  return adrValues().map(v=>`<option value="${v}" ${v===choice?'selected':''}>${v}</option>`).join('');
}
function buildTankRows(state){
  const tb=$('tankBody'); tb.innerHTML='';
  const caps=state.caps||[];
  state.rows.forEach((row,idx)=>{
    const dict=getAllProducts().find(d=>d.key===row?.typeKey);
    const defaultRho=isFinite(dict?.rho)&&dict.rho>0?dict.rho:null;
    const rhoVal=isFinite(row?.rho)&&row.rho>0?row.rho:(defaultRho??'');
    const adrVal=row?.adr || dict?.adr || 'Не знаю';
    const tr=document.createElement('tr');
    tr.dataset.index=String(idx);
    tr.innerHTML=`
      <td>
        <span class="pill">#${idx+1}</span>
        <div class="cap">лимит ${caps[idx]??'—'} л</div>
        <div class="cap" data-fill="${idx}"></div>
      </td>
      <td class="colCargo"><select class="selType">${densityOptionsHtml(row?.typeKey||'diesel')}</select></td>
      <td class="colCargo"><select class="selAdr">${adrOptionsHtml(adrVal)}</select></td>
      <td class="colCargo"><input class="inpRho" type="number" step="0.001" min="0.001" value="${rhoVal!==''?rhoVal:''}"></td>`;
    tb.appendChild(tr);
  });
}
function fillCommonCargoSelect(selectedKey){
  const sel=$('commonType');
  if(!sel) return;
  sel.innerHTML=densityOptionsHtml(selectedKey||'diesel');
}

function fillCommonAdrSelect(selectedAdr){
  const sel=$('commonAdr');
  if(!sel) return;
  sel.innerHTML=adrOptionsHtml(selectedAdr||'Не знаю');
}

function syncCommonCargoInputs(){
  const rows=app?.trailerState?.rows||[];
  const row=rows[0]||defaultTankerRow();
  let typeKey=row.typeKey || app.commonTypeKey || 'diesel';
  let adrVal=row.adr || app.commonAdr || 'Не знаю';
  let rhoVal=isFinite(row.rho)&&row.rho>0?row.rho:NaN;
  if(!isFinite(rhoVal)){
    const dict=getAllProducts().find(d=>d.key===typeKey);
    if(isFinite(dict?.rho)&&dict.rho>0) rhoVal=dict.rho;
  }
  if(app.commonTypeKey) typeKey=app.commonTypeKey;
  if(app.commonAdr) adrVal=app.commonAdr;
  if(app.commonRho){
    const parsed=parseFloat(app.commonRho);
    if(isFinite(parsed)&&parsed>0) rhoVal=parsed;
  }
  fillCommonCargoSelect(typeKey);
  fillCommonAdrSelect(adrVal);
  if($('commonRho')) $('commonRho').value = rhoVal?String(rhoVal):'';
}

function setCargoColumnsVisible(visible){
  document.querySelectorAll('.colCargo').forEach(el=>{ el.style.display=''; });
}

function applyCommonCargoToRows(triggerRecalc=true){
  if(!$('chkAllSame')?.checked) return;
  const typeKey=$('commonType')?.value || 'diesel';
  const adr=$('commonAdr')?.value || 'Не знаю';
  const rhoRaw=$('commonRho')?.value ?? '';
  app.commonTypeKey=typeKey;
  app.commonAdr=adr;
  app.commonRho=rhoRaw||'';
  const rowsEls=[...document.querySelectorAll('#tankBody tr')];
  rowsEls.forEach(tr=>{
    const typeSel=tr.querySelector('.selType'); if(typeSel) typeSel.value=typeKey;
    const adrSel=tr.querySelector('.selAdr'); if(adrSel) adrSel.value=adr;
    const rhoInp=tr.querySelector('.inpRho'); if(rhoInp) rhoInp.value=rhoRaw;
  });
  (app.trailerState?.rows||[]).forEach(row=>{
    if(!row) return;
    row.typeKey=typeKey;
    row.adr=adr;
    const rhoVal=parseFloat(rhoRaw);
    row.rho=(isFinite(rhoVal)&&rhoVal>0)?rhoVal:null;
  });
  if(triggerRecalc) recalc();
}

function refreshSingleCargoUI(recalcAfter=true){
  const same=$('chkAllSame')?.checked;
  syncCommonCargoInputs();
  const commonRow=$('commonCargoRow');
  if(commonRow){
    commonRow.style.display='grid';
    commonRow.classList.toggle('readonly', !same);
  }
  if($('singleCargoNote')) $('singleCargoNote').style.display=same?'block':'none';
  ['commonType','commonAdr','commonRho'].forEach(id=>{ const el=$(id); if(el) el.disabled=!same; });
  document.querySelectorAll('#tankBody .selType, #tankBody .selAdr').forEach(el=>{
    el.disabled=same;
  });
  document.querySelectorAll('#tankBody .inpRho').forEach(el=>{
    el.readOnly=same;
    if(!same) el.removeAttribute('readonly');
    else el.setAttribute('readonly','readonly');
  });
  if(same){
    applyCommonCargoToRows(false);
  }
  if(recalcAfter) recalc();
}
function getRowEffectiveRhoByIndex(idx){
  const row=app?.trailerState?.rows?.[idx];
  if(!row) return NaN;
  let rho=parseFloat(row.rho);
  if(isFinite(rho) && rho>0) return rho;
  const dict=getAllProducts().find(d=>d.key===row.typeKey);
  if(isFinite(dict?.rho) && dict.rho>0) return dict.rho;
  return NaN;
}
function syncRowMetaFromDom(){
  if(app.trailerState?.type!=='tanker') return;
  const rowsEls=[...document.querySelectorAll('#tankBody tr')];
  rowsEls.forEach((tr,idx)=>{
    const row=app.trailerState.rows[idx];
    if(!row) return;
    const typeKey=tr.querySelector('.selType')?.value || row.typeKey || 'diesel';
    const dict=getAllProducts().find(d=>d.key===typeKey);
    const adrSel=tr.querySelector('.selAdr');
    let adr=adrSel?.value || row.adr || dict?.adr || 'Не знаю';
    if(!adr){ adr='Не знаю'; if(adrSel) adrSel.value='Не знаю'; }
    const rhoInp=tr.querySelector('.inpRho');
    let rho=parseFloat(rhoInp?.value);
    if(!isFinite(rho) || rho<=0){
      const fallback=isFinite(dict?.rho)&&dict.rho>0?dict.rho:NaN;
      if(isFinite(fallback)){ rho=fallback; if(rhoInp) rhoInp.value=fallback; }
      else rho=NaN;
    }
    row.typeKey=typeKey;
    row.adr=adr;
    row.rho=(isFinite(rho)&&rho>0)?rho:null;
  });
}
function defaultTankerRow(){
  return { typeKey:'diesel', adr:'3', rho:0.84, liters:0 };
}
function ensureRowsMatchCaps(state){
  const need=state.caps.length;
  while(state.rows.length<need) state.rows.push({...defaultTankerRow()});
  while(state.rows.length>need) state.rows.pop();
}
function tankerFromPreset(compartments){
  return { caps:[...compartments], rows: compartments.map(()=>({...defaultTankerRow()})), extraLeftover:{liters:0, kg:0} };
}

function getCommonEffectiveRho(){
  const raw=$('commonRho')?.value||'';
  let rho=parseFloat(raw);
  if(isFinite(rho) && rho>0){ app.commonRho=String(rho); return rho; }
  const typeKey=$('commonType')?.value;
  const dict=getAllProducts().find(d=>d.key===typeKey);
  if(isFinite(dict?.rho) && dict.rho>0){
    if($('commonRho')) $('commonRho').value=dict.rho;
    app.commonRho=String(dict.rho);
    return dict.rho;
  }
  return NaN;
}

function ensureExtraLeftover(){
  if(app.trailerState?.type!=='tanker') return {liters:0,kg:0};
  if(!app.trailerState.extraLeftover){ app.trailerState.extraLeftover={liters:0,kg:0}; }
  return app.trailerState.extraLeftover;
}
function setExtraLeftover(liters, kg){
  if(app.trailerState?.type!=='tanker') return;
  const litersNum=Number(liters);
  const kgNum=Number(kg);
  app.trailerState.extraLeftover={
    liters: isFinite(litersNum)? Math.max(0, litersNum) : NaN,
    kg: isFinite(kgNum)? Math.max(0, kgNum) : (isNaN(kgNum)?NaN:0)
  };
}

// === Platform table
function buildPlatRows(state){
  const tb=$('platBody'); tb.innerHTML='';
  const n=state.positions||4; for(let i=0;i<n;i++){
    const tr=document.createElement('tr'); const t=state.tons?.[i]||0;
    tr.innerHTML=`<td><span class="pill">#${i+1}</span></td><td><input class="inpMass" type="number" value="${t}"></td>`; tb.appendChild(tr);
  }
}

// ===== State =====
let app={
  tractorAxles:2,
  tractorPlate:null,
  selectedTrailerId:null,
  trailerState:null,
  singleCargo:true,
  commonTypeKey:'diesel',
  commonAdr:'3',
  commonRho:'0.84',
  panelMassT:'',
  panelVolM3:'',
  distanceMode:'manual',   // 'manual' | 'gmaps'
  provider:'google',       // 'google' | 'yandex'
  distanceKm:0,
  ratePerKm:0,
  trips:1,
  routeFrom:'',
  routeTo:'',
  totalCargoKg:0
};
if (app.distanceMode === 'maps') app.distanceMode = 'gmaps'; // миграция на новое имя
const DEFAULT_APP_STATE = JSON.parse(JSON.stringify(app));

function migrateState(raw){
  const result=JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if(!raw || typeof raw!=='object') return result;
  Object.assign(result, raw);
  result.singleCargo = raw.singleCargo!==false;
  result.commonTypeKey = raw.commonTypeKey || raw.commonType || result.commonTypeKey;
  result.commonAdr = raw.commonAdr || result.commonAdr || 'Не знаю';
  if(raw.commonRho!==undefined){ result.commonRho = String(raw.commonRho); }
  result.panelMassT = typeof raw.panelMassT==='string'? raw.panelMassT : (raw.panelMassT!=null? String(raw.panelMassT):'');
  result.panelVolM3 = typeof raw.panelVolM3==='string'? raw.panelVolM3 : (raw.panelVolM3!=null? String(raw.panelVolM3):'');
  result.distanceMode = (raw.distanceMode==='maps')?'gmaps':(raw.distanceMode||result.distanceMode);
  result.provider = raw.provider || result.provider;
  result.distanceKm = num(raw.distanceKm, result.distanceKm);
  result.ratePerKm = num(raw.ratePerKm, result.ratePerKm);
  result.trips = parseInt(raw.trips)||result.trips;
  result.routeFrom = raw.routeFrom||'';
  result.routeTo = raw.routeTo||'';
  result.tractorPlate = raw.tractorPlate||result.tractorPlate;
  result.tractorAxles = parseInt(raw.tractorAxles)||result.tractorAxles;
  result.selectedTrailerId = raw.selectedTrailerId||result.selectedTrailerId;
  result.totalCargoKg = num(raw.totalCargoKg, 0);

  if(raw.trailerState?.type==='tanker'){
    const src=raw.trailerState;
    const caps=Array.isArray(src.caps)? src.caps.slice() : (Array.isArray(src.compartmentsLiters)? src.compartmentsLiters.slice():[]);
    const rowsArray=Array.isArray(src.rows)? src.rows:[];
    const rows=rowsArray.map(row=>{
      const typeKey=row?.typeKey||'diesel';
      const adr=row?.adr||'Не знаю';
      let rho=parseFloat(row?.rho);
      if(!isFinite(rho) || rho<=0) rho=null;
      let liters=parseFloat(row?.liters);
      if(!isFinite(liters)){
        if(isFinite(row?.m3)) liters=row.m3*1000;
        else if(isFinite(row?.tons) && isFinite(rho) && rho>0) liters=row.tons*1000/rho;
        else liters=0;
      }
      liters=Math.max(0, liters||0);
      return { typeKey, adr, rho: (isFinite(rho)&&rho>0)?rho:null, liters };
    });
    const extraRaw=src.extraLeftover||{};
    const extraLit=Number(extraRaw.liters);
    const extraKg=Number(extraRaw.kg);
    const tanker={ type:'tanker', caps, rows, extraLeftover:{
      liters: isFinite(extraLit)? Math.max(0, extraLit) : NaN,
      kg: isFinite(extraKg)? Math.max(0, extraKg) : (isNaN(extraKg)?NaN:0)
    }};
    ensureRowsMatchCaps(tanker);
    result.trailerState=tanker;
  } else if(raw.trailerState?.type==='platform'){
    const positions=parseInt(raw.trailerState.positions)||4;
    const tonsSrc=Array.isArray(raw.trailerState.tons)? raw.trailerState.tons:[];
    const tons=Array.from({length:positions}, (_,i)=> num(tonsSrc[i],0));
    result.trailerState={ type:'platform', positions, tons };
  }

  return result;
}

function loadState(){
  let stored=null;
  try{ stored=JSON.parse(localStorage.getItem(LS_KEYS.state)||'null'); }catch(e){}
  if(!stored){
    for(const key of LEGACY_STATE_KEYS){
      try{ const raw=JSON.parse(localStorage.getItem(key)||'null'); if(raw){ stored=raw; break; } }catch(e){}
    }
  }
  app = migrateState(stored);
}
function saveState(){ localStorage.setItem(LS_KEYS.state, JSON.stringify(app)); }

// ===== Init / Render =====
function selectTrailer(id){
  const all=getAllTrailers();
  const t=all.find(x=>x.id===id) || all[0];
  app.selectedTrailerId=t.id;
  if(t.type==='tanker'){ app.trailerState={type:'tanker', ...tankerFromPreset(t.compartmentsLiters)}; }
  else { app.trailerState={type:'platform', positions:t.positions||4, tons:Array(t.positions||4).fill(0)}; }
  renderCurrent(); saveState();
}
function renderCurrent(){
  const t=getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  setTrailerInfo(t);
  renderTrailerSelect(app.selectedTrailerId);
  renderTractorSelect(app.tractorPlate);
  if(!app.tractorPlate){ const allTr=getAllTrucks(); app.tractorPlate=allTr[0]; }
  const storedAx=getTruckAxles(app.tractorPlate); app.tractorAxles=storedAx||app.tractorAxles||2;
  const axEl=$('tractorAxles'); if(axEl) axEl.value=String(app.tractorAxles||2);
  if($('tractorSelect')) $('tractorSelect').value=app.tractorPlate||'';
  if($('truck')) $('truck').value=app.tractorPlate||'';

  const provEl = $('provider'); if (provEl) provEl.value = app.provider||'google';

  // --- режим расстояния + поля маршрута ---
  const isMaps = (app.distanceMode === 'gmaps' || app.distanceMode === 'maps');
  const distanceModeEl=$('distanceMode'); if(distanceModeEl) distanceModeEl.value = isMaps ? 'gmaps' : 'manual';

  const distanceKmEl=$('distanceKm'); if(distanceKmEl) distanceKmEl.value = app.distanceKm || '';
  const ratePerKmEl=$('ratePerKm'); if(ratePerKmEl) ratePerKmEl.value  = app.ratePerKm || '';
  const tripsEl=$('trips'); if(tripsEl) tripsEl.value = app.trips || 1;

  const routeFromEl=$('routeFrom'); if(routeFromEl) routeFromEl.value  = app.routeFrom || '';
  const routeToEl=$('routeTo'); if(routeToEl) routeToEl.value    = app.routeTo   || '';

  if($('totalMassT')) $('totalMassT').value = app.panelMassT || '';
  if($('totalVolM3')) $('totalVolM3').value = app.panelVolM3 || '';

  const gmapsRow=$('gmapsRow'); if(gmapsRow) gmapsRow.style.display  = isMaps ? 'grid'  : 'none';
  const gmapsNote=$('gmapsNote'); if(gmapsNote) gmapsNote.style.display = isMaps ? 'block' : 'none';

  if(app.trailerState.type==='tanker'){
    const tankSection=$('tankSection'); if(tankSection) tankSection.style.display='block';
    const platSection=$('platformSection'); if(platSection) platSection.style.display='none';
    ensureExtraLeftover();
    ensureRowsMatchCaps(app.trailerState);
    buildTankRows(app.trailerState);
    const sameFlag = app.singleCargo!==false;
    if($('chkAllSame')) $('chkAllSame').checked = sameFlag;
    app.singleCargo = sameFlag;
    refreshSingleCargoUI(false);
  }
  else {
    const tankSection=$('tankSection'); if(tankSection) tankSection.style.display='none';
    const platSection=$('platformSection'); if(platSection) platSection.style.display='block';
    buildPlatRows(app.trailerState);
  }

  recalc();
}

// ===== Recalc =====
function recalc(){
  if(!app.trailerState){ return; }
  const tstate=app.trailerState; const warns=[];
  let totalLiters=NaN; let totalKg=NaN;
  let leftoverLitersTotal=0; let leftoverKgTotal=NaN;

  if($('tractorSelect')) app.tractorPlate=$('tractorSelect').value||app.tractorPlate;
  if($('truck')) $('truck').value=app.tractorPlate||'';

  if(tstate.type==='tanker'){
    syncRowMetaFromDom();
    const rows=[...document.querySelectorAll('#tankBody tr')];
    let sumL=0;
    let sumKg=0;
    let massKnown=true;
    let leftLiters=0;
    let leftKg=0;
    let leftKgKnown=true;

    rows.forEach((tr,i)=>{
      const row=tstate.rows[i]||defaultTankerRow();
      const cap=tstate.caps[i]??Infinity;
      let liters=parseFloat(row?.liters);
      if(!isFinite(liters)) liters=0;
      if(liters<0){ warns.push(`Отсек #${i+1}: отрицательный объём`); liters=0; }
      let overflowRow=0;
      if(isFinite(cap) && liters>cap+1e-6){
        overflowRow=liters-cap;
        liters=cap;
        warns.push(`Переполнение отсека #${i+1}: превышение на ${Math.round(overflowRow)} л`);
      }
      row.liters=liters;

      const rhoVal=getRowEffectiveRhoByIndex(i);
      const kgVal=(isFinite(rhoVal) && rhoVal>0)? liters*rhoVal : NaN;
      if(!isFinite(rhoVal) || rhoVal<=0){
        if(liters>0) massKnown=false;
        warns.push(`Отсек #${i+1}: укажите ρ > 0`);
      } else {
        sumKg+=kgVal;
      }
      sumL+=liters;

      if(overflowRow>0){
        leftLiters+=overflowRow;
        if(isFinite(rhoVal) && rhoVal>0){ leftKg+=overflowRow*rhoVal; }
        else { leftKgKnown=false; }
      }

      const fillEl=tr.querySelector('[data-fill]');
      if(fillEl){
        const litersText=fmtL(liters);
        const kgText=isFinite(kgVal)?fmtKg(kgVal):'—';
        const m3Text=fmtM3(liters/1000);
        fillEl.textContent=`заполнено: ${litersText} / ${kgText} / ${m3Text}`;
      }
    });

    if(!massKnown) sumKg=NaN;

    const extra=tstate.extraLeftover||{liters:0,kg:0};
    const extraLiters=Math.max(0, Number(extra.liters)||0);
    const extraKgRaw=Number(extra.kg);
    const totalLeftLiters=leftLiters+extraLiters;
    let totalLeftKgValue=leftKg;
    let totalLeftKgKnown=leftKgKnown;
    if(isFinite(extraKgRaw) && extraKgRaw>0){
      if(totalLeftKgKnown) totalLeftKgValue+=extraKgRaw;
      else totalLeftKgKnown=false;
    } else if(extraLiters>0 && !isFinite(extraKgRaw)){
      totalLeftKgKnown=false;
    }
    if(!totalLeftKgKnown) totalLeftKgValue=NaN;

    totalLiters=sumL;
    totalKg=sumKg;
    leftoverLitersTotal=totalLeftLiters;
    leftoverKgTotal=totalLeftKgValue;

    const fitBox=$('fitSummary');
    if(fitBox){
      const totalTons=isFinite(sumKg)?(sumKg/1000):NaN;
      const leftTons=isFinite(totalLeftKgValue)?(totalLeftKgValue/1000):NaN;
      fitBox.textContent=
        `Всего: ${fmtL(sumL)} / ${fmtKg(sumKg)} / ${fmtT(totalTons)} / ${fmtM3(sumL/1000)} · `+
        `Не поместилось: ${fmtL(totalLeftLiters)} / ${fmtKg(totalLeftKgValue)} / ${fmtT(leftTons)} / ${fmtM3(totalLeftLiters/1000)}`;
    }
  } else {
    const rows=[...document.querySelectorAll('#platBody tr')];
    let tons=[]; let sumTons=0;
    rows.forEach((tr,i)=>{
      let t=num(tr.querySelector('.inpMass')?.value,0);
      if(t<0){ warns.push(`Позиция #${i+1}: отрицательная масса`); t=0; }
      tons[i]=t; sumTons+=t;
    });
    tstate.tons=tons;
    totalKg=sumTons*1000;
    const fitBox=$('fitSummary'); if(fitBox) fitBox.textContent='—';
  }

  const extraWarnings=pullPendingWarnings();
  extraWarnings.forEach(msg=>{ if(!warns.includes(msg)) warns.push(msg); });

  $('sumL').textContent = isNaN(totalLiters)? '—' : fmtL(totalLiters);
  $('sumT').textContent = fmtT(isFinite(totalKg)? totalKg/1000 : NaN);

  const ul=$('warnList'); if (ul){
    ul.innerHTML='';
    if(warns.length===0){ const li=document.createElement('li'); li.textContent='Ошибок не обнаружено.'; ul.appendChild(li);} 
    else { warns.forEach(w=>{ const li=document.createElement('li'); li.innerHTML=`<span class="warn">⚠</span> ${w}`; ul.appendChild(li); }); }
  }

  app.distanceKm=num($('distanceKm')?.value, app.distanceKm||0);
  app.ratePerKm=num($('ratePerKm')?.value, app.ratePerKm||0);
  app.trips=parseInt($('trips')?.value)||app.trips||1;
  const cost=app.distanceKm*app.ratePerKm*app.trips;
  if($('kpiDistance')) $('kpiDistance').textContent = (isFinite(app.distanceKm)&&app.distanceKm>0)? (Math.round(app.distanceKm).toLocaleString('ru-RU')+' км'):'—';
  if($('kpiRate')) $('kpiRate').textContent = (isFinite(app.ratePerKm)&&app.ratePerKm>0)? (app.ratePerKm.toLocaleString('ru-RU')+' ₽/км'):'—';
  if($('kpiTrips')) $('kpiTrips').textContent = String(app.trips);
  if($('kpiCost')) $('kpiCost').textContent = (isFinite(cost)&&cost>0)? cost.toLocaleString('ru-RU')+' ₽' : '—';

  const t=getAllTrailers().find(x=>x.id===app.selectedTrailerId);
  const totalParts=[fmtL(totalLiters), fmtKg(totalKg), fmtT(isFinite(totalKg)?totalKg/1000:NaN), fmtM3(isNaN(totalLiters)?NaN:totalLiters/1000)];
  const totalLine=`Итоги: ${totalParts[0]} / ${totalParts[1]} / ${totalParts[2]} / ${totalParts[3]}`;
  let lines=[`Прицеп: ${t?.name||''} (${t?.type==='tanker'?'цистерна':'площадка'})`, `Тягач: ${app.tractorPlate||'—'} (${app.tractorAxles} оси)`, totalLine];
  if(tstate.type==='tanker'){
    tstate.rows.forEach((r,i)=>{
      const d=getAllProducts().find(x=>x.key===r.typeKey);
      const litersText=isFinite(r.liters)?fmtL(r.liters):'—';
      const m3Text=isFinite(r.liters)?fmtM3(r.liters/1000):'—';
      const rhoEffective=isFinite(r.rho)&&r.rho>0?r.rho:getRowEffectiveRhoByIndex(i);
      const rhoText=isFinite(rhoEffective)?String(rhoEffective):'—';
      lines.push(`#${i+1}: ${(d?.label)||r.typeKey||'—'}, ADR ${r.adr||'Не знаю'}, ρ=${rhoText}, ${litersText} / ${m3Text}`);
    });
    const leftoverLine=`Не поместилось: ${fmtL(leftoverLitersTotal)} / ${fmtKg(leftoverKgTotal)} / ${fmtT(isFinite(leftoverKgTotal)?leftoverKgTotal/1000:NaN)} / ${fmtM3(leftoverLitersTotal/1000)}`;
    lines.push(leftoverLine);
  } else {
    (tstate.tons||[]).forEach((ton,i)=>{ lines.push(`#${i+1}: ${Number(ton).toFixed(3)} т`); });
  }
  const routeStr=(app.routeFrom||app.routeTo)? `Маршрут: ${app.routeFrom||'?'} → ${app.routeTo||'?'}`:'';
  const costStr=(isFinite(cost)&&cost>0)? `Стоимость: ${cost.toLocaleString('ru-RU')} ₽ (${app.distanceKm} км × ${app.ratePerKm} ₽/км × ${app.trips} рейс.)`:'';
  if(routeStr) lines.push(routeStr); if(costStr) lines.push(costStr);
  if($('brief')) $('brief').value = lines.join('\n');

  if(app.trailerState.type==='tanker' && $('chkAllSame')?.checked){
    syncCommonCargoInputs();
  }

  app.totalCargoKg = isFinite(totalKg)?totalKg:0;

  saveState();
}

// ===== Events =====
function bind(){
  if($('trailerSelect')) $('trailerSelect').addEventListener('change', e=>selectTrailer(e.target.value));
  if($('trailer')) $('trailer').addEventListener('change', e=>selectTrailer(e.target.value));
  if($('tractorSelect')) $('tractorSelect').addEventListener('change', e=>{ app.tractorPlate=e.target.value; const ax=getTruckAxles(app.tractorPlate)||2; app.tractorAxles=ax; $('tractorAxles').value=String(ax); if($('truck')) $('truck').value=app.tractorPlate; saveState(); recalc(); });
  if($('truck')) $('truck').addEventListener('change', e=>{ app.tractorPlate=e.target.value; const ax=getTruckAxles(app.tractorPlate)||2; app.tractorAxles=ax; $('tractorAxles').value=String(ax); if($('tractorSelect')) $('tractorSelect').value=app.tractorPlate; saveState(); recalc(); });
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
  ['totalMassT','totalVolM3'].forEach(id=>{
    const el=$(id);
    if(!el) return;
    el.addEventListener('input', ()=>{
      app.panelMassT=$('totalMassT')?.value||'';
      app.panelVolM3=$('totalVolM3')?.value||'';
      saveState();
    });
  });

  // таблицы
  ['tankBody','platBody'].forEach(id=>{
    const el=$(id);
    if(!el) return;
    el.addEventListener('input', ()=>{ recalc(); });
  });
  const tankBodyEl = $('tankBody');
  if (tankBodyEl) tankBodyEl.addEventListener('change', (e)=>{
    const tr = e.target.closest('tr');
    if(!tr) return;
    if(e.target.classList.contains('selType')){
      const typeKey = e.target.value;
      const d = getAllProducts().find(x=>x.key===typeKey);
      if(d){
        const rhoInp = tr.querySelector('.inpRho'); if(rhoInp) rhoInp.value=d.rho;
        const adrSel = tr.querySelector('.selAdr'); if(adrSel) adrSel.value=d.adr||'Не знаю';
      }
      recalc();
    } else if(e.target.classList.contains('inpRho') || e.target.classList.contains('selAdr')){
      recalc();
    }
  });

  const chkAll = $('chkAllSame');
  if (chkAll) chkAll.addEventListener('change', (e)=>{
    app.singleCargo=!!e.target.checked;
    refreshSingleCargoUI();
  });

  const commonType=$('commonType');
  if(commonType) commonType.addEventListener('change', ()=>{
    const typeKey=commonType.value;
    const dict=getAllProducts().find(x=>x.key===typeKey);
    if(dict){
      if($('commonRho')) $('commonRho').value = (dict.rho??'');
      fillCommonAdrSelect(dict.adr||'Не знаю');
    }
    applyCommonCargoToRows();
  });
  const commonAdr=$('commonAdr');
  if(commonAdr) commonAdr.addEventListener('change', ()=>applyCommonCargoToRows());
  const commonRho=$('commonRho');
  if(commonRho) commonRho.addEventListener('input', ()=>applyCommonCargoToRows());

  if($('fillMax')) $('fillMax').addEventListener('click', ()=>{
    if(app.trailerState?.type!=='tanker') return;
    syncRowMetaFromDom();
    const caps=app.trailerState.caps||[];
    (app.trailerState.rows||[]).forEach((row,i)=>{
      row.liters=Math.max(0, caps[i]||0);
    });
    setExtraLeftover(0,0);
    recalc();
  });

  if($('clearAll')) $('clearAll').addEventListener('click', ()=>{
    if(app.trailerState?.type!=='tanker') return;
    (app.trailerState.rows||[]).forEach(row=>{ if(row) row.liters=0; });
    setExtraLeftover(0,0);
    recalc();
  });

  // модалка прицепа
  if($('m_type')) $('m_type').addEventListener('change', e=>{ const isPlat=e.target.value==='platform'; if($('m_positions_wrap')) $('m_positions_wrap').style.display=isPlat?'block':'none'; if($('m_caps_wrap')) $('m_caps_wrap').style.display=isPlat?'none':'block'; });
  if($('m_cancel')) $('m_cancel').addEventListener('click', closeModal);
  if($('m_save')) $('m_save').addEventListener('click', saveModalTrailer);

  // модалка тягача
  if($('mt_cancel')) $('mt_cancel').addEventListener('click', closeTruckModal);
  if($('mt_save')) $('mt_save').addEventListener('click', saveTruck);

  if($('mp_cancel')) $('mp_cancel').addEventListener('click', closeProductModal);
  if($('mp_save')) $('mp_save').addEventListener('click', saveProductModal);

  // продукты
  if($('btnAddProduct')) $('btnAddProduct').addEventListener('click', openProductModal);

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

function openProductModal(){
  const modal=$('modalProduct'); if(!modal) return;
  if($('mp_name')) $('mp_name').value='';
  if($('mp_rho')) $('mp_rho').value='';
  if($('mp_adr')) $('mp_adr').value='Не знаю';
  modal.classList.add('open');
  setTimeout(()=>{ $('mp_name')?.focus(); }, 0);
}
function closeProductModal(){ const modal=$('modalProduct'); if(modal) modal.classList.remove('open'); }
function saveProductModal(){
  const name=$('mp_name')?.value?.trim(); if(!name){ alert('Укажи название груза'); return; }
  const rhoRaw=$('mp_rho')?.value||'';
  const rho=parseFloat(rhoRaw);
  if(!Number.isFinite(rho) || rho<=0){ alert('Укажи корректную плотность (>0)'); return; }
  const adrRaw=$('mp_adr')?.value?.trim();
  const adr=adrRaw?adrRaw:'Не знаю';
  const key=addCustomProduct(name, rho, adr);
  closeProductModal();
  renderCurrent();
  if($('commonType')) $('commonType').value=key;
  if($('commonAdr')) $('commonAdr').value=adr;
  if($('commonRho')) $('commonRho').value=String(rho);
  if($('chkAllSame')?.checked){
    applyCommonCargoToRows();
  }
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
    const n=tstate.rows.length; for(let i=0;i<n;i++){ const row=tstate.rows[i]; const liters=num(row?.liters,0); const rho=getRowEffectiveRhoByIndex(i); const W=(isFinite(rho)&&rho>0)? liters*rho : 0; const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
  } else {
    const arr=tstate.tons||[]; const n=arr.length; for(let i=0;i<n;i++){ const W=num(arr[i],0)*1000; const x=LA*(i+1)/(n+1); kg.push(W); xs.push(x); }
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

function distributeByLiters(totalLiters){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  syncRowMetaFromDom();
  if($('chkAllSame')?.checked){ applyCommonCargoToRows(false); }
  const liters=Math.max(0, num(totalLiters, 0));
  const rows=app.trailerState.rows||[];
  const caps=app.trailerState.caps||[];
  let restL=liters;
  rows.forEach((row,i)=>{
    const cap=caps[i]||0;
    const put=Math.min(restL, cap);
    row.liters=put;
    restL-=put;
  });
  restL=Math.max(0, restL);
  let leftoverKg=0;
  if(restL>0){
    let rho=NaN;
    if($('chkAllSame')?.checked){
      rho=getCommonEffectiveRho();
    } else {
      for(let i=rows.length-1;i>=0;i--){
        const candidate=getRowEffectiveRhoByIndex(i);
        if(isFinite(candidate) && candidate>0){ rho=candidate; break; }
      }
    }
    if(isFinite(rho) && rho>0){ leftoverKg=restL*rho; }
    else leftoverKg=NaN;
  }
  setExtraLeftover(restL, restL>0?leftoverKg:0);
  recalc();
}

function distributeByM3(totalM3){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  const same=$('chkAllSame')?.checked;
  if(same){
    const rhoVal=getCommonEffectiveRho();
    if(!isFinite(rhoVal) || rhoVal<=0){ pushPendingWarning('Выберите тип груза'); recalc(); return; }
    applyCommonCargoToRows(false);
  }
  const liters=Math.max(0, num(totalM3,0))*1000;
  distributeByLiters(liters);
}

function distributeByTons(totalTons){
  if(!app.trailerState || app.trailerState.type!=='tanker') return;
  syncRowMetaFromDom();
  const rows=app.trailerState.rows||[];
  const caps=app.trailerState.caps||[];
  if(rows.length===0) return;
  let restKg=Math.max(0, num(totalTons,0))*1000;
  const same=$('chkAllSame')?.checked;
  if(same){
    const rhoVal=getCommonEffectiveRho();
    if(!isFinite(rhoVal) || rhoVal<=0){ pushPendingWarning('Выберите тип груза'); recalc(); return; }
    applyCommonCargoToRows(false);
    const liters=rhoVal>0? restKg/rhoVal : 0;
    distributeByLiters(liters);
    return;
  }
  let lastRhoUsed=NaN;
  rows.forEach((row,i)=>{
    const rho=getRowEffectiveRhoByIndex(i);
    if(!isFinite(rho) || rho<=0){
      pushPendingWarning(`Отсек #${i+1}: укажите ρ > 0`);
      row.liters=0;
      return;
    }
    const cap=caps[i]||0;
    const maxKg=cap*rho;
    const useKg=Math.min(restKg, maxKg);
    row.liters=useKg/rho;
    restKg-=useKg;
    if(useKg>0) lastRhoUsed=rho;
  });
  restKg=Math.max(0, restKg);
  let leftoverLiters=0;
  if(restKg>0 && isFinite(lastRhoUsed) && lastRhoUsed>0){
    leftoverLiters=restKg/lastRhoUsed;
  } else if(restKg>0) {
    leftoverLiters=NaN;
  }
  setExtraLeftover(leftoverLiters, restKg);
  recalc();
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
  const out=$('testResults'); const results=[]; const approx=(a,b,e=2)=>Math.abs(a-b)<=e; const pass=n=>results.push(`<div class='pass'>✔ ${n}</div>`); const fail=(n,m='')=>results.push(`<div class='fail'>✘ ${n}${m?': '+m:''}</div>`);
  const backup=JSON.stringify(app);
  const customBackup=localStorage.getItem(LS_KEYS.custom);
  try{
    selectTrailer('MO0882_23');
    if($('chkAllSame')) $('chkAllSame').checked=true;
    refreshSingleCargoUI(false);
    if($('commonType')) $('commonType').value='diesel';
    if($('commonAdr')) $('commonAdr').value='3';
    if($('commonRho')) $('commonRho').value='0.84';
    applyCommonCargoToRows(false);
    distributeByM3(1);
    const litersFirst=Math.round(app.trailerState.rows[0].liters||0);
    if(approx(litersFirst,1000,1)) pass('Распределение по объёму: 1 м³ → 1000 л в первом отсеке'); else fail('Распределение по объёму', String(litersFirst));
    if(approx(app.totalCargoKg,840,1)) pass('Масса после распределения 1 м³ ДТ ≈ 0.84 т'); else fail('Проверка массы 0.84 т', app.totalCargoKg.toFixed(1));

    selectTrailer('MO0310_23');
    if($('chkAllSame')) $('chkAllSame').checked=true;
    refreshSingleCargoUI(false);
    if($('commonType')) $('commonType').value='syrup';
    if($('commonRho')) $('commonRho').value='1.30';
    applyCommonCargoToRows(false);
    distributeByTons(15);
    const litersRow0=app.trailerState.rows[0].liters||0;
    const litersRow1=app.trailerState.rows[1].liters||0;
    if(approx(litersRow0,7500,1) && approx(litersRow1,4038,5)) pass('Распределение по массе: 15 т сиропа → 7500/≈4038 л'); else fail('Распределение по массе', `${litersRow0.toFixed(1)} / ${litersRow1.toFixed(1)}`);

    selectTrailer('ER8977_23');
    const platRows=[...$('platBody').querySelectorAll('tr')];
    platRows[0].querySelector('.inpMass').value='5';
    platRows[1].querySelector('.inpMass').value='2.5';
    recalc();
    const sumTons=(app.trailerState.tons||[]).reduce((a,b)=>a+Number(b||0),0);
    const sumDisplay=$('sumT').textContent||'';
    const normalized=sumDisplay.replace(/\s+/g,'');
    if(Math.abs(sumTons-7.5)<1e-6 && /7[,.]500/.test(normalized)) pass('Площадка: сумма тонн считается'); else fail('Площадка: сумма тонн', `${sumTons} / ${sumDisplay}`);

    selectTrailer('MO0882_23');
    tb=$('tankBody'); first=tb.querySelector('tr');
    first.querySelector('.selType').value='syrup';
    recalc();
    const adrVal=first.querySelector('.selAdr').value;
    if(adrVal==='Не знаю') pass('ADR остаётся «Не знаю» после смены груза'); else fail('ADR по умолчанию', adrVal);

    selectTrailer('ER8977_23');
    if($('platformSection').style.display==='block' && $('tankSection').style.display==='none') pass('Площадка рендерится'); else fail('Площадка рендер');

    localStorage.setItem(LS_KEYS.custom, JSON.stringify([]));
    $('m_name').value='МК 9999 23'; $('m_type').value='tanker'; $('m_axles').value='4'; $('m_tare').value='7800'; $('m_caps').value='10000/8000/7000';
    saveModalTrailer();
    const all=getAllTrailers(); if(all.find(x=>x.name==='МК 9999 23')) pass('Кастом добавлен'); else fail('Кастом не добавлен');

    selectTrailer('MO0882_23');
    const firstRow=$('tankBody')?.querySelector('tr');
    if(firstRow){
      const sel=firstRow.querySelector('.selType');
      if(sel){ sel.value='diesel'; sel.dispatchEvent(new Event('change')); }
      recalc();
      const adrVal=firstRow.querySelector('.selAdr')?.value;
      if(adrVal==='3') pass('ADR автоподставляется из продукта'); else fail('ADR автоподстановка', adrVal||'');
    }

    if($('distanceMode')) $('distanceMode').value='manual';
    if($('gmapsRow')) $('gmapsRow').style.display='none';
    if($('distanceKm')) $('distanceKm').value='100';
    if($('ratePerKm')) $('ratePerKm').value='50';
    if($('trips')) $('trips').value='2';
    recalc();

    const costText=$('kpiCost')?.textContent?.replace(/\D+/g,''); if(parseInt(costText)===10000) pass('Стоимость вручную считается'); else fail('Стоимость вручную', $('kpiCost')?.textContent||'');

    $('recalcAxles')?.click();
    const gtotal=$('G_total_ax')?.textContent; if(gtotal && gtotal!=='—') pass('Осевые: масса поезда рассчитана'); else fail('Осевые расчёты');
  }catch(e){ fail('Исключение тестов', e.message); }
  finally{
    if(customBackup===null) localStorage.removeItem(LS_KEYS.custom);
    else localStorage.setItem(LS_KEYS.custom, customBackup);
    try{ app=JSON.parse(backup); renderCurrent(); }catch(_){}
  }
  if(out) out.innerHTML=results.join('');
}

}

// ===== Boot =====
function boot(){
  renderTrailerSelect();
  loadState();
  if (app.distanceMode === 'maps') app.distanceMode = 'gmaps'; // страховка
  const all=getAllTrailers();
  let current=all.find(t=>t.id===app.selectedTrailerId);
  if(!current){
    const fallback=all[0];
    app.selectedTrailerId=fallback?.id || null;
    if(app.selectedTrailerId){ selectTrailer(app.selectedTrailerId); }
  } else {
    if(!app.trailerState){
      if(current.type==='tanker'){ app.trailerState={type:'tanker', ...tankerFromPreset(current.compartmentsLiters)}; }
      else { app.trailerState={type:'platform', positions:current.positions||4, tons:Array(current.positions||4).fill(0)}; }
    }
    renderCurrent();
    saveState();
  }
  bind();
  // распределение по инпутам
  const massBtn=$('btnDistributeMass');
  if(massBtn) massBtn.addEventListener('click', ()=>{
    const t=num($('totalMassT').value, NaN);
    if(!isFinite(t) || t<=0){ pushPendingWarning('Введите массу больше 0'); recalc(); return; }
    distributeByTons(t);
  });
  const m3Btn=$('btnDistributeM3');
  if(m3Btn) m3Btn.addEventListener('click', ()=>{
    const m3=num($('totalVolM3').value, NaN);
    if(!isFinite(m3) || m3<=0){ pushPendingWarning('Введите объём больше 0'); recalc(); return; }
    distributeByM3(m3);
  });
  const tbtn = $('runTests'); if (tbtn) tbtn.addEventListener('click', runTests);
  maybeInitMaps();
}
boot();
