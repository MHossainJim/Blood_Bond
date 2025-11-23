// app.js — donor list, modal form handling, and simple login/session helpers
document.addEventListener('DOMContentLoaded', ()=>{
  // Ensure auth helpers loaded
  if(window.BBAuth){
    var session = BBAuth.requireLogin();
    if(!session) return; // requireLogin will redirect
  }
  // --- Sample form handler (kept from scaffold) ---
  const sampleForm = document.getElementById('sample-form');
  const sampleResult = document.getElementById('form-result');
  if(sampleForm){
    sampleForm.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(sampleForm);
      const name = fd.get('name') || '';
      const email = fd.get('email') || '';
      if(!name.trim()){
        sampleResult.textContent = 'Please enter a name.';
        sampleResult.style.color = '#ffb4b4';
        return;
      }
      sampleResult.style.color = '#9fe8c0';
      sampleResult.textContent = `Saved — ${name}${email? ' ('+email+')':''}`;
      sampleForm.reset();
    });
  }

  // --- Mock donor and recipient data (seeded if needed) ---
  const defaultDonors = [
    {id:1,name:'Md. Rahim',phone:'+8801711000001',address:'Dhaka, Bangladesh',blood:'A+',age:29,last:'2025-06-10'},
    {id:2,name:'Aisha Begum',phone:'+8801711000002',address:'Chittagong',blood:'O-',age:33,last:'2025-01-20'},
    {id:3,name:'Kamal Hasan',phone:'+8801711000003',address:'Sylhet',blood:'B+',age:25,last:'2024-11-15'},
    {id:4,name:'Fatima Noor',phone:'+8801711000004',address:'Khulna',blood:'AB+',age:30,last:'2024-09-01'},
    {id:5,name:'Rafiq Islam',phone:'+8801711000005',address:'Rajshahi',blood:'A-',age:41,last:'2025-03-18'}
  ];

  const defaultRecipients = [
    {id:101,name:'Patient: Hasan',phone:'+8801711222001',address:'Dhaka Medical',blood:'A+',age:45,neededBy:'2025-11-30'},
    {id:102,name:'Patient: Sultana',phone:'+8801711222002',address:'City Hospital',blood:'O-',age:56,neededBy:'2025-12-05'},
    {id:103,name:'Patient: Karim',phone:'+8801711222003',address:'Sylhet General',blood:'B+',age:30,neededBy:'2025-11-28'},
    {id:104,name:'Patient: Rina',phone:'+8801711222004',address:'Khulna Hospital',blood:'AB+',age:29,neededBy:'2025-12-12'},
    {id:105,name:'Patient: Jamil',phone:'+8801711222005',address:'Rajshahi Clinic',blood:'A-',age:65,neededBy:'2025-12-01'}
  ];

  // seed campaigns if none
  if(!localStorage.getItem('bb_campaigns')){
    const sampleCampaigns = [
      {id:1,title:'City Blood Drive',location:'Dhaka Central Park',date:'2025-12-10'},
      {id:2,title:'University Donation Camp',location:'Chittagong University',date:'2026-01-15'}
    ];
    localStorage.setItem('bb_campaigns', JSON.stringify(sampleCampaigns));
  }

  // Use in-memory arrays for browsing (could be loaded from an API)
  const donors = JSON.parse(localStorage.getItem('bb_demo_donors') || 'null') || defaultDonors;
  const recipients = JSON.parse(localStorage.getItem('bb_demo_recipients') || 'null') || defaultRecipients;

  const donorListEl = document.getElementById('donor-list');
  const filterBg = document.getElementById('filter-bg');
  const searchQ = document.getElementById('search-q');
  const viewDonorsBtn = document.getElementById('view-donors');
  const viewRecipientsBtn = document.getElementById('view-recipients');

  // default view: recipients for donors, donors for recipients/hospitals
  var currentView = (session && session.role === 'donor') ? 'recipients' : 'donors';

  function matchesQuery(item, q){
    if(!q) return true;
    q = q.toLowerCase();
    return (item.name && item.name.toLowerCase().includes(q)) || (item.phone && item.phone.toLowerCase().includes(q)) || (item.address && item.address.toLowerCase().includes(q)) || (item.blood && item.blood.toLowerCase().includes(q));
  }

  function renderList(){
    if(!donorListEl) return;
    donorListEl.innerHTML = '';
    const filter = filterBg ? filterBg.value : '';
    const q = searchQ ? searchQ.value.trim() : '';
    const source = (currentView === 'donors') ? donors : recipients;
    const list = source.filter(item => (!filter || (item.blood && item.blood === filter)) && matchesQuery(item,q));
    if(list.length === 0){
      donorListEl.innerHTML = '<p class="muted">No entries found for selected filter/search.</p>';
      return;
    }
    for(const d of list){
      const card = document.createElement('div');
      card.className = 'donor-card';
      const bloodLabel = d.blood || d.blood_group || '';
      const secondary = currentView === 'donors' ? (d.address||'') : (d.address||'');

      // avatar: prefer picture from matching registered users (Data URL or URL), otherwise use person.picture or generated initials avatar
      let avatarSrc = null;
      try{
        const users = JSON.parse(localStorage.getItem('bb_users')||'[]');
        // try match by phone first
        let matched = users.find(u=>u.phone && d.phone && u.phone === d.phone);
        if(!matched && d.email) matched = users.find(u=>u.email && u.email === d.email);
        if(!matched){
          matched = users.find(u=>u.name && d.name && u.name.toLowerCase() === d.name.toLowerCase());
        }
        if(matched && matched.picture) avatarSrc = matched.picture;
      }catch(e){ /* ignore */ }
      if(!avatarSrc) avatarSrc = d.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0AA6BF&color=ffffff&size=128`;
      const altText = `Avatar of ${d.name}`;

        card.innerHTML = `
          <div class="card-header">
            <img class="avatar" src="${avatarSrc}" alt="${escapeHtml(altText)}" />
            <div style="flex:1;display:flex;flex-direction:column;justify-content:space-start">
              <div class="card-top-row" style="display:flex;justify-content:space-between;align-items:center">
                <div class="card-name-main">${escapeHtml(d.name)}</div>
              </div>
              <ul class="meta-list">
                <li class="meta-item"><span class="blood-strong">${bloodLabel}</span></li>
                <li class="meta-item">${secondary}</li>
              </ul>
            </div>
          </div>
          <div class="actions">
            ${ currentView === 'recipients' ? `<div class="action-name">${escapeHtml(d.name)}</div>` : '' }
            ${ renderActionButtons(currentView, session, d) }
          </div>
        `;
      // store id on card buttons after creation
      donorListEl.appendChild(card);
      // attach data-id to buttons
      const btns = card.querySelectorAll('button[data-action]');
      btns.forEach(b=>b.setAttribute('data-id', d.id));
    }
  }

  function renderActionButtons(view, session, person){
    // Donor cards should only show a Request button
    if(view === 'donors'){
      return `<button class="btn-blood" data-action="receive" aria-label="Request blood from ${escapeHtml(person && person.name)}">Request</button>`;
    }
    // If viewing recipients and current user is donor -> show Donate
    if(view === 'recipients' && session && session.role === 'donor'){
      return `<button class="btn" data-action="donate" aria-label="Offer blood to ${escapeHtml(person && person.name)}">Donate</button>`;
    }
    // Otherwise show both contact options for other cases
    return `<button class="btn" data-action="donate" aria-label="Donate to ${escapeHtml(person && person.name)}">Donate</button><button class="btn-blood" data-action="receive" aria-label="Request from ${escapeHtml(person && person.name)}">Request</button>`;
  }

  // simple escape for inserting names into aria-labels
  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // initial render and UI state
  function setView(v){ currentView = v; if(viewDonorsBtn) viewDonorsBtn.classList.toggle('active', v==='donors'); if(viewRecipientsBtn) viewRecipientsBtn.classList.toggle('active', v==='recipients'); renderList(); }
  setView(currentView);

  if(viewDonorsBtn) viewDonorsBtn.addEventListener('click', ()=> setView('donors'));
  if(viewRecipientsBtn) viewRecipientsBtn.addEventListener('click', ()=> setView('recipients'));
  if(filterBg) filterBg.addEventListener('change', ()=> renderList());
  if(searchQ) searchQ.addEventListener('input', ()=> renderList());

  // --- Modal behavior ---
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const actionForm = document.getElementById('action-form');
  const modalResult = document.getElementById('modal-result');

  function openModal(actionType, donorId){
    // show modal and setup focus trap
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement;
    modal._previouslyFocused = previouslyFocused;

    document.getElementById('action-type').value = actionType;
    document.getElementById('target-donor').value = donorId || '';
    document.getElementById('modal-title').textContent = (actionType === 'donate')? 'Donate Blood' : 'Request Blood';
    modalResult.textContent = '';
    // If donorId present, you could prefill some fields
    // search donors then recipients to prefill
    let person = donors.find(d=>d.id == donorId) || recipients.find(r=>r.id == donorId);
    if(person){
      document.getElementById('blood_group').value = person.blood || person.blood_group || '';
      document.getElementById('fullname').value = person.name || '';
      document.getElementById('phone').value = person.phone || '';
      document.getElementById('address').value = person.address || '';
    }

    // focus first input in modal
    const firstInput = modal.querySelector('input,select,button,textarea');
    if(firstInput) firstInput.focus();
    // install key and focus trap handlers
    modal.addEventListener('keydown', trapTabKey);
    document.addEventListener('keydown', handleEscClose);
    modal._focusables = Array.from(modal.querySelectorAll('a[href], button, textarea, input, select')).filter(el=>!el.hasAttribute('disabled'));
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    actionForm.reset();
    modalResult.textContent = '';
    // remove handlers
    modal.removeEventListener('keydown', trapTabKey);
    document.removeEventListener('keydown', handleEscClose);
    // restore focus
    try{ if(modal._previouslyFocused) modal._previouslyFocused.focus(); }catch(e){}
  }

  function handleEscClose(e){ if(e.key === 'Escape' || e.key === 'Esc'){ closeModal(); } }

  function trapTabKey(e){
    if(e.key !== 'Tab') return;
    const focusables = modal._focusables && modal._focusables.length ? modal._focusables : Array.from(modal.querySelectorAll('a[href], button, textarea, input, select')).filter(el=>!el.hasAttribute('disabled'));
    if(!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length-1];
    if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
    else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
  }

  document.body.addEventListener('click', e=>{
    const btn = e.target.closest && e.target.closest('button[data-action]');
    if(btn){
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      openModal(action, id);
    }
  });

  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalCancel) modalCancel.addEventListener('click', closeModal);

  if(actionForm){
    actionForm.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(actionForm);
      const payload = {};
      for(const [k,v] of fd.entries()) payload[k]=v;
      // Basic validation: nid, fullname, phone, blood_group required
      if(!payload.nid || !payload.fullname || !payload.phone || !payload.blood_group){
        modalResult.style.color = '#ffb4b4';
        modalResult.textContent = 'Please fill required fields (NID, name, phone, blood group).';
        return;
      }

      // Simulate saving the request/donation
      const storageKey = payload.actionType === 'donate' ? 'bb_donations' : 'bb_requests';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push(Object.assign({id:Date.now()}, payload));
      localStorage.setItem(storageKey, JSON.stringify(existing));

      modalResult.style.color = '#9fe8c0';
      modalResult.textContent = 'Submitted successfully.';
      setTimeout(()=>{
        closeModal();
      },800);
    });
  }

  // expose a simple API for debugging
  window.bloodBond = {
    donors, renderDonors, openModal, closeModal
  };
});
