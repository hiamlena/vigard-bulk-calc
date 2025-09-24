// ====== Vigard Full Calculator — app.js (for provided index.html) ======
(function(){
  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);
  const el = (sel) => document.querySelector(sel);
  const els = (sel) => Array.from(document.querySelectorAll(sel));
  const num = (v, def=0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : def; };
  const fmtL  = n => Number.isFinite(n) ? Math.round(n).toLocaleString('ru-RU') + ' л' : '—';
  const fmtKg = n => Number.isFinite(n) ? Math.round(n).toLocaleString('ru-RU') + ' кг' : '—';
  const fmtT  = n => Number.isFinite(n) ? (n/1000).toFixed(3) + ' т' : '—';
  const fmtM3 = n => Number.isFinite(n) ? (n/1000).toFixed(3) + ' м³' : '—';

  const LS = {
    trucks: 'vigard_trucks_v1',
    axlesMap: 'vigard_truck_axles_v1',
    trailers: 'vigard_trailers_v1',
    state: 'vigard_state_v5',
    gkey: 'vigard_gmaps_key_v1'
  };

  // ---------- Data ----------
  const DENSITIES = [
    { key:'molasses', label:'Патока', rho:1.40, adr:'—' },
    { key:'syrup', label:'Сироп сахарный', rho:1.30, adr:'—' },
    { key:'vinyl_acetate', label:'Винилацетат мономер (VAM)', rho:0.934, adr:'3' },
    { key:'butyl_acetate', label:'Бутилацетат', rho:0.882, adr:'3' },
    { key:'methyl_acetate', label:'Метилацетат', rho:0.932, adr:'3' },
    { key:'ethyl_acetate', label:'Этил ацетат', rho:0.902, adr:'3' },
    { key:'n_butanol', label:'н-Бутанол', rho:0.810, adr:'3' },
    { key:'acetic_acid_glacial', label:'Уксусная кислота (ледяная)', rho:1.049, adr:'8' },
    { key:'sulfuric_acid_96', label:'Серная кислота (96–98%)', rho:1.830, adr:'8' },
    { key:'heavy_oil', label:'Тяжёлые масла', rho:0.93, adr:'3/—' },
    { key:'formalin37', label:'Формалин 37%', rho:1.09, adr:'8' },
    { key:'diesel', label:'Дизельное топливо', rho:0.84, adr:'3' },
    { key:'gas95', label:'Бензин АИ‑95', rho:0.75, adr:'3' }
  ];

  const BASE_TRUCKS = [
    'В 010 СЕ 123','М 020 АМ 123','Е 030 ВК 123','Е 040 ВК 123','Т 050 ВТ 93','Н 060 ВТ 123','С 070 УА 93',
    'Р 100 СА 93','Н 200 НУ 23','У 300 ХА 93','Х 400 СХ 93','О 600 РВ 93','В 800 ТУ 93','В 900 ТУ 93'
  ];

  const BASE_TRAILERS = [
    { id:'ER8977_23', name:'ЕР 8977 23', type:'platform', axles:3, tareKg:5900, positions:4 },
    { id:'EU2938_23', name:'ЕУ 2938 23', type:'tanker', axles:3, tareKg:7300, compartmentsLiters:[12000,6500,12500] },
    { id:'MO0882_23', name:'МО 0882 23', type:'tanker', axles:4, tareKg:7800, compartmentsLiters:[10365,6925,10450] },
    { id:'MK6180_23', name:'МК 6180 23', type:'tanker', axles:4, tareKg:7800, compartmentsLiters:[13500,7500,7500,9350] },
    { id:'EU8672_23', name:'ЕУ 8672 23', type:'tanker', axles:4, tareKg:7800, compartmentsLiters:[12500,7500,7500,12500] }
  ];

  // ---------- Storage ----------
  const readLS = (k, fb)=>{ try{ const v=localStorage.getItem(k); return v? JSON.parse(v) : fb; }catch(_){ return fb; } };
  const writeLS= (k, v)=> localStorage.setItem(k, JSON.stringify(v));

  // ---------- State ----------
  const state = readLS(LS.state, {
    tractorPlate: null,
    tractorAxles: 2,
    selectedTrailerId: null,
    trailerState: null, // {type:'tanker', caps:[], rows:[]} or {type:'platform', positions, masses:[]}
    distanceMode: 'manual',
    distanceKm: 0,
    ratePerKm: 0,
    trips: 1,
    routeFrom: '',
    routeTo: ''
  });

  // ---------- Trucks ----------
  function getAllTrucks(){ return readLS(LS.trucks, BASE_TRUCKS); }
  function setAllTrucks(arr){ writeLS(LS.trucks, arr); }
  function getTruckAxles(plate){ const map=readLS(LS.axlesMap, {}); return map[plate]||null; }
  function setTruckAxles(plate, ax){ const map=readLS(LS.axlesMap, {}); map[plate]=ax; writeLS(LS.axlesMap, map); }

  // Add "Добавить тягач" button next to tractorSelect
  function ensureAddTruckButton(){
    if ($('addTruck')) return;
    const select = $('tractorSelect');
    const btn = document.createElement('button');
    btn.id = 'addTruck';
    btn.className = 'btn';
    btn.textContent = 'Добавить тягач';
    // place button after select
    select.parentElement.appendChild(btn);
    btn.addEventListener('click', ()=>{
      const plate = prompt('Госномер тягача'); if(!plate) return;
      const ax = parseInt(prompt('Оси (2 или 3)','2'))||2;
      const all = getAllTrucks(); if(!all.includes(plate)) all.push(plate);
      setAllTrucks(all); setTruckAxles(plate, ax);
      state.tractorPlate = plate; state.tractorAxles = ax; persist();
      renderTractorSelect(); // re-render and select
      $('tractorAxles').value = String(ax);
    });
  }

  function renderTractorSelect(){
    const sel=$('tractorSelect'); sel.innerHTML='';
    getAllTrucks().forEach(num=>{ const opt=document.createElement('option'); opt.value=num; opt.textContent=num; sel.appendChild(opt); });
    if(state.tractorPlate){ sel.value=state.tractorPlate; }
    else if(sel.options.length){ state.tractorPlate=sel.value=sel.options[0].value; }
  }

  // ---------- Trailers ----------
  function getAllTrailers(){ return readLS(LS.trailers, BASE_TRAILERS); }
  function setAllTrailers(arr){ writeLS(LS.trailers, arr); }
  function renderTrailerSelect(selectedId){
    const sel=$('trailerSelect'); sel.innerHTML='';
    getAllTrailers().forEach(t=>{ const opt=document.createElement('option'); opt.value=t.id; opt.textContent=t.name; if(t.id===selectedId) opt.selected=true; sel.appendChild(opt); });
    if(!sel.value && sel.options.length) sel.value=sel.options[0].value;
  }
  function setTrailerInfo(t){
    const info=$('trailerInfo'); if(!t){ info.textContent=''; return; }
    if(t.type==='tanker') info.innerHTML=`Тип: цистерна · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Отсеки: ${t.compartmentsLiters.join(' / ')} л (∑ ${t.compartmentsLiters.reduce((a,b)=>a+b,0)} л)`;
    else info.innerHTML=`Тип: площадка · Оси: ${t.axles} · Тара: ${t.tareKg||'—'} кг · Позиции: ${t.positions||4}`;
  }

  // ---------- Tank table ----------
  function densityOptionsHtml(selectedKey){
    return DENSITIES.map(d=>`<option value="${d.key}" ${d.key===selectedKey?'selected':''}>${d.label}</option>`).join('');
  }
  function buildTankRows(tstate){
    const tb=$('tankBody'); tb.innerHTML='';
    const caps=tstate.caps||[]; $('capsLine').textContent=caps.map((c,i)=>`#${i+1}: ${c} л`).join(', ');
    tstate.rows.forEach((row,idx)=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `
        <td><span class="pill">#${idx+1}</span><div class="cap">лимит ${caps[idx]??'—'} л</div></td>
        <td><select class="selType">${densityOptionsHtml(row.typeKey||'diesel')}</select></td>
        <td><select class="selAdr"><option>Не знаю</option><option>3</option><option>8</option><option>—</option></select></td>
        <td><input class="inpRho" type="number" step="0.001" value="${row.rho??0.84}"></td>
        <td><input class="inpL" type="number" value="${row.liters??0}"></td>
        <td><input class="inpKg" type="number" value="${row.kg??0}"></td>`;
      tb.appendChild(tr);
    });
  }
  function ensureRowsMatchCaps(tstate){
    const need=tstate.caps.length;
    while(tstate.rows.length<need) tstate.rows.push({typeKey:'diesel', adr:'3', rho:0.84, liters:0, kg:0, t:0, m3:0});
    while(tstate.rows.length>need) tstate.rows.pop();
  }
  function tankerFromPreset(compartments){
    return { type:'tanker', caps:[...compartments], rows: compartments.map(()=>({typeKey:'diesel', adr:'3', rho:0.84, liters:0, kg:0, t:0, m3:0})) };
  }

  // ---------- Platform table ----------
  function buildPlatRows(tstate){
    const tb=$('platBody'); tb.innerHTML='';
    const n=tstate.positions||4; for(let i=0;i<n;i++){
      const tr=document.createElement('tr'); const m=tstate.masses?.[i]||0;
      tr.innerHTML=`<td><span class="pill">#${i+1}</span></td><td><input class="inpMass" type="number" value="${m}"></td>`; tb.appendChild(tr);
    }
  }

  // ---------- Render current ----------
  function selectTrailer(id){
    const t=getAllTrailers().find(x=>x.id===id) || getAllTrailers()[0];
    state.selectedTrailerId=t.id;
    if(t.type==='tanker'){ state.trailerState=tankerFromPreset(t.compartmentsLiters); }
    else { state.trailerState={type:'platform', positions:t.positions||4, masses:Array(t.positions||4).fill(0)}; }
    renderCurrent(); persist();
  }
  function renderCurrent(){
    const t=getAllTrailers().find(x=>x.id===state.selectedTrailerId);
    setTrailerInfo(t);
    renderTrailerSelect(state.selectedTrailerId);
    renderTractorSelect();
    ensureAddTruckButton();
    const storedAx=getTruckAxles(state.tractorPlate); state.tractorAxles=storedAx||state.tractorAxles||2; $('tractorAxles').value=String(state.tractorAxles||2);

    $('distanceMode').value=state.distanceMode||'manual';
    $('distanceKm').value=state.distanceKm||''; $('ratePerKm').value=state.ratePerKm||''; $('trips').value=state.trips||1; $('routeFrom').value=state.routeFrom||''; $('routeTo').value=state.routeTo||''; $('gmapsRow').style.display=(state.distanceMode==='gmaps')?'grid':'none';

    if(state.trailerState.type==='tanker'){ $('tankSection').style.display='block'; $('platformSection').style.display='none'; ensureRowsMatchCaps(state.trailerState); buildTankRows(state.trailerState); }
    else { $('tankSection').style.display='none'; $('platformSection').style.display='block'; buildPlatRows(state.trailerState); }
    recalc();
  }

  // ---------- Recalc ----------
  function recalc(){
    const tstate=state.trailerState; const warns=[]; let sumL=0, sumKg=0;
    if($('tractorSelect')) state.tractorPlate=$('tractorSelect').value||state.tractorPlate;

    if(tstate.type==='tanker'){
      const tb=$('tankBody'); const rows=[...tb.querySelectorAll('tr')];
      rows.forEach((tr,i)=>{
        const typeKey=tr.querySelector('.selType').value;
        const dict=DENSITIES.find(d=>d.key===typeKey) || DENSITIES[0];
        const adr=tr.querySelector('.selAdr').value;
        const rho=num(tr.querySelector('.inpRho').value, dict.rho);

        let liters=num(tr.querySelector('.inpL').value, NaN);
        let kg=num(tr.querySelector('.inpKg').value, NaN);

        // bi-directional conversion
        if(!Number.isFinite(liters) && Number.isFinite(kg)) liters = rho>0? kg/rho : 0;
        if(!Number.isFinite(kg) && Number.isFinite(liters)) kg = liters*rho;
        if(!Number.isFinite(liters)) liters=0; if(!Number.isFinite(kg)) kg=0;

        // compute derived units
        const t = kg/1000;
        const m3 = liters/1000;

        if(liters<0||kg<0) warns.push(`Отсек #${i+1}: отрицательные значения`);
        const cap=tstate.caps[i]??Infinity; if(liters>cap) warns.push(`Переполнение отсека #${i+1}: ${Math.round(liters)} л > лимита ${cap} л`);

        tr.querySelector('.inpL').value = liters || 0; tr.querySelector('.inpKg').value = kg || 0;
        tstate.rows[i]={typeKey, adr, rho, liters, kg, t, m3};

        sumL+=liters; sumKg+=kg;
      });
      $('ethanolBanner').style.display='none'; // спирт убран
    } else {
      const tb=$('platBody'); const rows=[...tb.querySelectorAll('tr')];
      let masses=[]; rows.forEach((tr,i)=>{ let m=num(tr.querySelector('.inpMass').value,0); if(m<0){warns.push(`Позиция #${i+1}: отрицательная масса`); m=0;} masses[i]=m; sumKg+=m; });
      tstate.masses=masses; sumL=NaN;
    }

    $('sumL').textContent = isNaN(sumL)? '—' : fmtL(sumL);
    $('sumKg').textContent = fmtKg(sumKg);

    const ul=$('warnList'); ul.innerHTML=''; if(warns.length===0){ const li=document.createElement('li'); li.textContent='Ошибок не обнаружено.'; ul.appendChild(li);} else { warns.forEach(w=>{ const li=document.createElement('li'); li.innerHTML=`<span class="warn">⚠</span> ${w}`; ul.appendChild(li); }); }

    // маршрут/стоимость
    state.distanceKm=num($('distanceKm').value, state.distanceKm||0);
    state.ratePerKm=num($('ratePerKm').value, state.ratePerKm||0);
    state.trips=parseInt($('trips').value)||state.trips||1;
    const cost=state.distanceKm*state.ratePerKm*state.trips;
    $('kpiDistance').textContent = (Number.isFinite(state.distanceKm)&&state.distanceKm>0)? (Math.round(state.distanceKm).toLocaleString('ru-RU')+' км'):'—';
    $('kpiRate').textContent = (Number.isFinite(state.ratePerKm)&&state.ratePerKm>0)? (state.ratePerKm.toLocaleString('ru-RU')+' ₽/км'):'—';
    $('kpiTrips').textContent = String(state.trips);
    $('kpiCost').textContent = (Number.isFinite(cost)&&cost>0)? cost.toLocaleString('ru-RU')+' ₽' : '—';

    // brief
    const t=getAllTrailers().find(x=>x.id===state.selectedTrailerId);
    const header = `Прицеп: ${t?.name||''} (${t?.type==='tanker'?'цистерна':'площадка'})\nТягач: ${state.tractorPlate||'—'} (${state.tractorAxles} оси)`;
    const totals = `Итоги: ${(isNaN(sumL)?'-':Math.round(sumL)+' л')} / ${fmtKg(sumKg)} / ${fmtT(sumKg)} / ${fmtM3(sumL)}`;
    let lines=[header, totals];
    if(state.trailerState.type==='tanker'){
      state.trailerState.rows.forEach((r,i)=>{
        const d=DENSITIES.find(x=>x.key===r.typeKey);
        lines.push(`#${i+1}: ${(d?.label)||r.typeKey}, ADR ${r.adr}, ρ=${r.rho}; ${Math.round(r.liters)} л / ${Math.round(r.kg)} кг / ${(r.kg/1000).toFixed(3)} т / ${(r.liters/1000).toFixed(3)} м³`);
      });
    } else {
      (state.trailerState.masses||[]).forEach((kg,i)=>{ lines.push(`#${i+1}: ${Math.round(kg)} кг`); });
    }
    const routeStr=(state.routeFrom||state.routeTo)? `Маршрут: ${state.routeFrom||'?'} → ${state.routeTo||'?'}`:'';
    const costStr=(Number.isFinite(cost)&&cost>0)? `Стоимость: ${cost.toLocaleString('ru-RU')} ₽ (${state.distanceKm} км × ${state.ratePerKm} ₽/км × ${state.trips} рейс.)`:'';
    if(routeStr) lines.push(routeStr); if(costStr) lines.push(costStr);
    $('brief').value = lines.join('\n');

    persist();
  }

  function persist(){ writeLS(LS.state, state); }

  // ---------- Events ----------
  function bind(){
    $('trailerSelect').addEventListener('change', e=>selectTrailer(e.target.value));
    $('tractorSelect').addEventListener('change', e=>{ state.tractorPlate=e.target.value; const ax=getTruckAxles(state.tractorPlate)||2; state.tractorAxles=ax; $('tractorAxles').value=String(ax); persist(); recalc(); });
    $('tractorAxles').addEventListener('change', e=>{ const ax=parseInt(e.target.value)||2; state.tractorAxles=ax; setTruckAxles(state.tractorPlate, ax); persist(); recalc(); });
    $('resetPreset').addEventListener('click', ()=>selectTrailer(state.selectedTrailerId));
    $('copyBrief').addEventListener('click', ()=>navigator.clipboard.writeText($('brief').value));

    // таблицы
    ['tankBody','platBody'].forEach(id=>{ $(id).addEventListener('input', recalc); });

    // модалка прицепа
    $('addTrailer').addEventListener('click', openModal);
    $('m_type').addEventListener('change', e=>{ const isPlat=e.target.value==='platform'; $('m_positions_wrap').style.display=isPlat?'block':'none'; $('m_caps_wrap').style.display=isPlat?'none':'block'; });
    $('m_cancel').addEventListener('click', closeModal);
    $('m_save').addEventListener('click', saveModalTrailer);

    // маршрут/стоимость
    $('distanceMode').addEventListener('change', e=>{ state.distanceMode=e.target.value; $('gmapsRow').style.display=(state.distanceMode==='gmaps')?'grid':'none'; $('gmapsNote').style.display=(state.distanceMode==='gmaps')?'block':'none'; persist(); });
    ['distanceKm','ratePerKm','trips','routeFrom','routeTo'].forEach(id=>{ $(id).addEventListener('input', ()=>{ state.distanceKm=num($('distanceKm').value,0); state.ratePerKm=num($('ratePerKm').value,0); state.trips=parseInt($('trips').value)||1; state.routeFrom=$('routeFrom').value; state.routeTo=$('routeTo').value; persist(); recalc(); }); });
    $('btnGmaps').addEventListener('click', gmapsDistance);

    // осевые — бинды
    $('recalcAxles').addEventListener('click', calcAxles);
    ['LT_ax','l2_ax','NT10_ax','NT20_ax','mp_ax','LA_ax','LB_ax','LC_ax','NTpp_ax','axTr_axle'].forEach(id=>{ $(id).addEventListener('input', calcAxles); });
  }

  // ---------- Modal logic ----------
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
    const list=getAllTrailers(); list.push(obj); setAllTrailers(list);
    renderTrailerSelect(state.selectedTrailerId); closeModal();
  }

  // ---------- Axle math (simplified) ----------
  function syncAxleParamsFromTrailer(){
    const t = getAllTrailers().find(x=>x.id===state.selectedTrailerId);
    if(!t) return;
    $('axTl_ax').value = t.axles || 3;
    $('mp_ax').value   = t.tareKg || (t.axles===3?7300:7800);
    $('LA_ax').value = t.axles===3 ? 11800 : 12000;
    $('LB_ax').value = t.axles===3 ? 7400  : 7600;
    $('LC_ax').value = 4400;
    $('NTpp_ax').value = 2000;
  }
  function collectMassesAndPositions(){
    const LA = num($('LA_ax').value,12000);
    const tstate = state.trailerState; let kg=[], xs=[];
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

  // ---------- Google Maps distance ----------
  let _gmapsLoading=false, _gmapsLoaded=false;
  function loadGoogleMaps(key){
    return new Promise((resolve,reject)=>{
      if(_gmapsLoaded){ resolve(); return; }
      if(_gmapsLoading){ const iv=setInterval(()=>{ if(_gmapsLoaded){ clearInterval(iv); resolve(); } }, 200); return; }
      _gmapsLoading=true; const s=document.createElement('script'); s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`; s.async=true; s.defer=true;
      s.onload=()=>{ _gmapsLoaded=true; resolve(); };
      s.onerror=()=>reject(new Error('Не удалось загрузить Google Maps')); document.head.appendChild(s);
    });
  }
  async function gmapsDistance(){
    try{
      let key = localStorage.getItem(LS.gkey) || $('gmapsKey').value.trim();
      if(!key){ alert('Укажи Google API key'); return; }
      localStorage.setItem(LS.gkey, key);
      await loadGoogleMaps(key);
      const from=$('routeFrom').value.trim(), to=$('routeTo').value.trim();
      if(!from||!to){ alert('Укажи города'); return; }
      const svc=new google.maps.DistanceMatrixService();
      const req={origins:[from],destinations:[to],travelMode:'DRIVING',avoidTolls:$('avoidTolls').checked};
      svc.getDistanceMatrix(req,(res,status)=>{
        if(status!=='OK'){ alert('Ошибка API: '+status); return; }
        try{
          const km=res.rows[0].elements[0].distance.value/1000;
          $('distanceKm').value = String(Math.round(km));
          state.distanceKm = Math.round(km);
          recalc();
        }catch(_){ alert('Не удалось разобрать ответ карт'); }
      });
    }catch(e){ alert(e.message); }
  }

  // ---------- Boot ----------
  function boot(){
    renderTrailerSelect(state.selectedTrailerId);
    renderTractorSelect();
    if(!state.selectedTrailerId){ const all=getAllTrailers(); state.selectedTrailerId=all[0].id; state.tractorAxles=2; }
    renderTrailerSelect(state.selectedTrailerId); selectTrailer(state.selectedTrailerId); bind();
    // run initial axle calc
    syncAxleParamsFromTrailer(); calcAxles();
  }

  boot();
})();
