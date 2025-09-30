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

// ===== Data =====
const {
  BASE_PRODUCTS = [],
  BASE_TRUCKS = [],
  BASE_TRAILERS = []
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
  const normalizedAdr = (typeof adr==='string' && adr.trim()) ? adr.trim() : 'Не знаю';
  const existingIndex=list.findIndex(item=>item.key===key);
  if(existingIndex>=0) list.splice(existingIndex,1);
  list.push({ key, label, rho, adr: normalizedAdr });
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
  app.selectedTrailerId = effective || null;
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
  app.tractorPlate = effective || '';
}
function setTrailerInfo(t){
  const info=$('trailerInfo'); if(!info) return;
  if(!t){ info.textContent=''; return; }
  if(t.type==='tanker') info.innerHTML=`Тип: цистерна · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Отсеки: ${t.compartmentsLiters.join(' / ')} л (∑ ${t.compartmentsLiters.reduce((a,b)=>a+b,0)} л)`;
  else info.innerHTML=`Тип: площадка · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Позиции: ${t.positions||4}`;
}

// === Tanker table
function densityOptionsHtml(selectedKey){
  return getAllProducts().map(d=>`<option value="${d.key}" ${d.key===selectedKey?'selected':''}>${d.label}</option>`).join('');
}
function buildTankRows(state){
  const tb=$('tankBody'); if(!tb) return;
  tb.innerHTML='';
  const caps=state.caps||[];
  const capsLine=$('capsLine');
  if(capsLine){
    capsLine.textContent='';
    const wrapper=capsLine.closest('.small');
    if(wrapper) wrapper.style.display='none';
  }
  state.rows.forEach((row,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td><span class="pill">#${idx+1}</span><div class="cap">лимит ${caps[idx]??'—'} л</div></td>
      <td><select class="selType">${densityOptionsHtml(row.typeKey||'diesel')}</select></td>
      <td><input class="inpRho" type="number" step="0.001" value="${row.rho??0.84}"></td>
      <td><input class="inpL" type="number" value="${row.liters??0}"></td>
      <td><input class="inpKg" type="number" value="${row.kg??0}"></td>
      <td><input class="inpT" type="number" readonly value="${((row.kg??0)/1000)||0}"></td>
      <td><input class="inpM3" type="number" readonly value="${((row.liters??0)/1000)||0}"></td>`;
    tb.appendChild(tr);
  });
}
function ensureRowsMatchCaps(state){
  const need=state.caps.length;
  while(state.rows.length<need) state.rows.push({typeKey:'diesel', adr:'Не знаю', rho:0.84, liters:0, kg:0});
  while(state.rows.length>need) state.rows.pop();
}
function tankerFromPreset(compartments){
  return { caps:[...compartments], rows: compartments.map(()=>({typeKey:'diesel', adr:'Не знаю', rho:0.84, liters:0, kg:0})) };
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
  routeTo:'',
  cargoTypeKey:'diesel',
  cargoRho:0.84
};
if (app.distanceMode === 'maps') app.distanceMode = 'gmaps'; // миграция на новое имя

function loadState(){ try{ const s=JSON.parse(localStorage.getItem(LS_KEYS.state)||'null'); if(s) app={...app, ...s}; }catch(e){} }
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
  else { if($('tankSection')) $('tankSection').style.display='none'; if($('platformSection')) $('platformSection').style.display='none'; }

  renderCargoControls();
  applyCargoSelectionToRows();

  recalc();
}

function renderCargoControls(){
  const products=getAllProducts();
  const select=$('cargoTypeCommon');
  if(!products.length){
    if(select){
      select.innerHTML='<option value="">—</option>';
      select.value='';
      select.disabled=true;
    }
    const rhoInputEmpty=$('rhoCommon');
    if(rhoInputEmpty){
      rhoInputEmpty.value='';
      rhoInputEmpty.disabled=true;
    }
    const addBtnEmpty=$('btnAddProduct');
    if(addBtnEmpty) addBtnEmpty.disabled=true;
    return;
  }
  if(!products.some(p=>p.key===app.cargoTypeKey)) app.cargoTypeKey=products[0]?.key||'';
  const isTanker=app.trailerState?.type==='tanker';
  if(select){
    select.innerHTML=products.map(p=>`<option value="${p.key}">${p.label}</option>`).join('');
    if(app.cargoTypeKey) select.value=app.cargoTypeKey;
    select.disabled=!isTanker;
  }
  const rhoInput=$('rhoCommon');
  if(rhoInput){
    if(!rhoInput.matches(':focus')){
      rhoInput.value = Number.isFinite(app.cargoRho) ? app.cargoRho : '';
    }
    rhoInput.disabled=!isTanker;
  }
  const addBtn=$('btnAddProduct');
  if(addBtn){
    addBtn.disabled=!isTanker;
    addBtn.textContent='+';
    addBtn.setAttribute('aria-label','Добавить груз');
    addBtn.setAttribute('title','Добавить груз');
  }
}

function applyCargoSelectionToRows(forceAll=false){
  if(app.trailerState?.type!=='tanker') return;
  const rowsEl=$('tankBody') ? [...$('tankBody').querySelectorAll('tr')] : [];
  const products=getAllProducts();
  const product=products.find(p=>p.key===app.cargoTypeKey);
  const adr=product?String(product.adr||'Не знаю'):'Не знаю';
  const rhoVal=Number.isFinite(app.cargoRho)?app.cargoRho:product?.rho;
  const same=$('chkAllSame')?.checked;
  rowsEl.forEach((tr,i)=>{
    if(i===0 || same || forceAll){
      const sel=tr.querySelector('.selType');
      if(sel && app.cargoTypeKey) sel.value=app.cargoTypeKey;
      const rhoInp=tr.querySelector('.inpRho');
      if(rhoInp && Number.isFinite(rhoVal)) rhoInp.value=rhoVal;
      if(app.trailerState.rows?.[i]){
        if(app.cargoTypeKey) app.trailerState.rows[i].typeKey=app.cargoTypeKey;
        if(Number.isFinite(rhoVal)) app.trailerState.rows[i].rho=rhoVal;
        app.trailerState.rows[i].adr=adr;
      }
    }
  });
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
    rows.forEach((tr,i)=>{
      const typeKey=tr.querySelector('.selType').value;
      const dict=getAllProducts().find(d=>d.key===typeKey) || getAllProducts()[0];

      const rhoInp=tr.querySelector('.inpRho');
      if(!rhoInp.value && dict) rhoInp.value = dict.rho;

      const rho=num(rhoInp.value, dict?.rho);
      const adr=String(dict?.adr||app.trailerState?.rows?.[i]?.adr||'Не знаю');
      let liters=num(tr.querySelector('.inpL').value, NaN);
      let kg=num(tr.querySelector('.inpKg').value, NaN);

      if(!isFinite(liters) && isFinite(kg)) liters = rho>0? kg/rho : 0;
      if(!isFinite(kg) && isFinite(liters)) kg = liters*rho;
      if(!isFinite(liters)) liters=0; if(!isFinite(kg)) kg=0;

      if(liters<0||kg<0) warns.push(`Отсек #${i+1}: отрицательные значения`);
      const cap=tstate.caps[i]??Infinity; if(liters>cap) warns.push(`Переполнение отсека #${i+1}: ${Math.round(liters)} л > лимита ${cap} л`);

      tr.querySelector('.inpL').value = liters || 0; tr.querySelector('.inpKg').value = kg || 0;
      const tVal = kg/1000, m3 = liters/1000;
      tr.querySelector('.inpT').value = isFinite(tVal)? tVal.toFixed(3) : 0;
      tr.querySelector('.inpM3').value = isFinite(m3)? m3.toFixed(3) : 0;

      tstate.rows[i]={typeKey, adr, rho, liters, kg, t:tVal, m3};

      sumL+=liters; sumKg+=kg;
    });

    // --- Итог по влезанию ---
    let leftL=0, leftKg=0;
    (tstate.rows||[]).forEach((r,i)=>{
      const capL=tstate.caps[i]??0;
      const askL=r.liters||0;
      const overL=Math.max(0,askL-capL);
      leftL+=overL; leftKg+=overL*(r.rho||1);
    });
    const totalL=isFinite(sumL)?Math.max(0,sumL):0;
    const totalKg=isFinite(sumKg)?Math.max(0,sumKg):0;
    const totalT=totalKg/1000;
    const totalM3=totalL/1000;
    const safeLeftL=isFinite(leftL)?Math.max(0,leftL):0;
    const safeLeftKg=isFinite(leftKg)?Math.max(0,leftKg):0;
    const fitBox = $('fitSummary');
    if (fitBox){
      fitBox.textContent =
        `Всего: ${fmtL(totalL)} / ${fmtKg(totalKg)} / ${fmtT(totalT)} / ${fmtM3(totalM3)} · `+
        `Не поместилось: ${fmtL(safeLeftL)} / ${fmtKg(safeLeftKg)} / ${fmtT(safeLeftKg/1000)} / ${fmtM3(safeLeftL/1000)}`;
    }

  } else {
    const tb=$('platBody'); const rows=[...tb.querySelectorAll('tr')];
    let masses=[]; rows.forEach((tr,i)=>{ let m=num(tr.querySelector('.inpMass').value,0); if(m<0){warns.push(`Позиция #${i+1}: отрицательная масса`); m=0;} masses[i]=m; sumKg+=m; });
    tstate.masses=masses; sumL=NaN;
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
        if(rhoInp && !rhoInp.value) rhoInp.value = d.rho;
        const rows=[...tankBodyEl.querySelectorAll('tr')];
        const idx=rows.indexOf(tr);
        if(idx===0){
          app.cargoTypeKey=typeKey;
          if(Number.isFinite(d.rho)) app.cargoRho=d.rho;
          renderCargoControls();
        }
        if($('chkAllSame')?.checked){
          applyCargoSelectionToRows(true);
        } else if(idx>=0 && app.trailerState?.rows?.[idx]){
          app.trailerState.rows[idx].adr=String(d.adr||'Не знаю');
        }
        recalc();
      }
    }
  });

  const chkAll = $('chkAllSame');
  if (chkAll) chkAll.addEventListener('change', (e)=>{
    if(e.target.checked){
      applyCargoSelectionToRows(true);
      recalc();
    }
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
  if($('prod_cancel')) $('prod_cancel').addEventListener('click', closeProductModal);
  if($('prod_save')) $('prod_save').addEventListener('click', saveProductFromModal);

  const cargoSelect=$('cargoTypeCommon');
  if(cargoSelect) cargoSelect.addEventListener('change', e=>{
    app.cargoTypeKey=e.target.value;
    const dict=getAllProducts().find(p=>p.key===app.cargoTypeKey);
    if(dict && Number.isFinite(dict.rho)) app.cargoRho=dict.rho;
    renderCargoControls();
    const forceAll=$('chkAllSame')?.checked;
    applyCargoSelectionToRows(forceAll);
    recalc();
    saveState();
  });
  const rhoCommon=$('rhoCommon');
  if(rhoCommon){
    rhoCommon.addEventListener('input', e=>{
      const val=parseFloat(e.target.value);
      app.cargoRho=Number.isFinite(val)?val:NaN;
      if(Number.isFinite(val) && val>0){
        const forceAll=$('chkAllSame')?.checked;
        applyCargoSelectionToRows(forceAll);
        recalc();
        saveState();
      }
    });
    rhoCommon.addEventListener('blur', e=>{
      const val=parseFloat(e.target.value);
      if(!(Number.isFinite(val) && val>0)){
        alert('Введите корректную плотность (>0)');
      }
    });
  }

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
  if($('btnDistributeL')) $('btnDistributeL').addEventListener('click', ()=>{
    const L = num($('totalVolL').value, NaN);
    if(!isFinite(L) || L <= 0){ alert('Укажи объём в литрах (>0)'); return; }
    distributeByVolumeLiters(L);
  });

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
let productModalHandler=null;
function openProductModal(){
  const modal=$('productModal');
  if(!modal) return;
  const name=$('prod_name');
  const rho=$('prod_rho');
  if(name) name.value='';
  if(rho) rho.value='';
  modal.classList.add('open');
  if(productModalHandler){
    document.removeEventListener('keydown', productModalHandler);
    productModalHandler=null;
  }
  productModalHandler=(e)=>{
    if(e.key==='Escape'){
      e.preventDefault();
      closeProductModal();
    }
  };
  document.addEventListener('keydown', productModalHandler);
  setTimeout(()=>{ try{ name?.focus(); }catch(_){} }, 0);
}
function closeProductModal(){
  const modal=$('productModal');
  if(modal) modal.classList.remove('open');
  if(productModalHandler){
    document.removeEventListener('keydown', productModalHandler);
    productModalHandler=null;
  }
}
function saveProductFromModal(e){
  if(e) e.preventDefault();
  const nameInput=$('prod_name');
  const rhoInput=$('prod_rho');
  const rawName=(nameInput?.value||'').trim();
  if(!rawName){ alert('Укажите название груза'); nameInput?.focus(); return; }
  const normalizedName=rawName.replace(/\s+/g,' ');
  const rho=parseFloat((rhoInput?.value||'').trim());
  if(!Number.isFinite(rho) || rho<=0){ alert('Плотность должна быть > 0'); rhoInput?.focus(); return; }
  const rhoRounded=Number(rho.toFixed(3));
  const key=addCustomProduct(normalizedName, rhoRounded, 'Не знаю');
  app.cargoTypeKey=key;
  app.cargoRho=rhoRounded;
  closeProductModal();
  renderCargoControls();
  applyCargoSelectionToRows(true);
  recalc();
  saveState();
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
