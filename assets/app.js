(() => {
  const carousel=document.querySelector('.lifestyle-carousel');
  if(carousel){
    const slides=[...carousel.querySelectorAll('.hero-slide')],dots=[...carousel.querySelectorAll('[data-slide]')],pause=carousel.querySelector('.carousel-pause');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let index=0,paused=reduced.matches,timer=null;
    function show(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
    function schedule(){clearInterval(timer);if(!paused&&!document.hidden&&!carousel.matches(':hover')&&!carousel.contains(document.activeElement))timer=setInterval(()=>show(index+1),5500);}
    function label(){pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');}
    carousel.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{show(index+Number(b.dataset.step));schedule();}));
    dots.forEach(b=>b.addEventListener('click',()=>{show(Number(b.dataset.slide));schedule();}));
    pause.addEventListener('click',()=>{paused=!paused;label();schedule();});
    carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',schedule);
    carousel.addEventListener('focusin',()=>clearInterval(timer));carousel.addEventListener('focusout',()=>setTimeout(schedule,0));
    document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{paused=reduced.matches;label();schedule();});
    label();schedule();
  }
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav?.classList.contains('open')) {nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus();} });
  const params = new URLSearchParams(location.search);
  const filters = [...document.querySelectorAll('[data-filter]')];
  function filter(value) {
    if(!['all','everyday','cozy','together'].includes(value)) value='all';
    let count=0;
    document.querySelectorAll('#product-grid [data-collection]').forEach(card=>{card.hidden=value!=='all'&&card.dataset.collection!==value;if(!card.hidden)count++;});
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===value)));
    const output=document.querySelector('#result-count');if(output)output.textContent=count+' designs';
  }
  if(filters.length){filter(params.get('collection')||'all');filters.forEach(b=>b.addEventListener('click',()=>{filter(b.dataset.filter);const url=new URL(location.href);url.searchParams.set('collection',b.dataset.filter);try{history.replaceState(null,'',url);}catch(e){} }));}
  const form=document.querySelector('#contact-form');
  if(form){
    form.elements.product.value=params.get('product')||'';
    if([...form.elements.type.options].some(o=>o.value===params.get('type')))form.elements.type.value=params.get('type');
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form);const text='petslove enquiry draft\nNOT SENT\n\n'+[...data].map(([k,v])=>k+': '+v).join('\n\n');
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='petslove-enquiry.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      document.querySelector('#form-status').textContent='Your draft download has started. It has not been sent to petslove.';
    });
  }
})();
