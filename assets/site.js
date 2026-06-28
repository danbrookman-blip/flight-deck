  /* ============================================================
     VIDEO LIST - the only thing an owner edits to add a video.
     Record each clip in Loom, copy the share link, and paste the
     ID between the quotes below. The ID is the part of the link
     after  loom.com/share/  e.g.
       https://www.loom.com/share/ab12cd34ef56...  ->  "ab12cd34ef56..."
     Leave an ID blank and that step keeps its "coming soon" placeholder.
     ============================================================ */
  var VIDEOS = {
    why:   { id: "46f9100fbc69476f9e4069202035b4eb", title: "The why" },
    step1: { id: "", title: "Set up your profile" },
    step2: { id: "", title: "Find and use your Brain" },
    step3: { id: "", title: "Pick the right surface" },
    step4: { id: "", title: "The improvement loop" },
    step5: { id: "", title: "Make it stick" },
    craft:     { id: "", title: "The craft: context in, quality out" },
    styles:    { id: "", title: "Styles" },
    skills:    { id: "", title: "Skills" },
    artifacts: { id: "", title: "Artifacts" },
    cowork:    { id: "", title: "Cowork" }
  };

  document.querySelectorAll('.video').forEach(function(block){
    var key = block.getAttribute('data-video');
    var cfg = VIDEOS[key];
    if(!cfg || !cfg.id) return; /* keep the placeholder */
    var frame = block.querySelector('.vframe');
    if(!frame) return;
    var ifr = document.createElement('iframe');
    ifr.src = "https://www.loom.com/embed/" + cfg.id;
    ifr.title = cfg.title;
    ifr.setAttribute('frameborder','0');
    ifr.setAttribute('allow','fullscreen; picture-in-picture');
    ifr.setAttribute('allowfullscreen','');
    ifr.setAttribute('webkitallowfullscreen','');
    ifr.setAttribute('mozallowfullscreen','');
    frame.innerHTML = '';
    frame.appendChild(ifr);
  });

  document.querySelectorAll('.copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var pre = btn.closest('.promptbox').querySelector('pre');
      var text = pre ? pre.innerText : '';
      function done(){ var o=btn.textContent; btn.textContent='Copied'; btn.classList.add('done'); setTimeout(function(){btn.textContent=o; btn.classList.remove('done');},1600); }
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(done).catch(function(){ fallback(text, done); });
        } else { fallback(text, done); }
      }catch(e){ fallback(text, done); }
    });
  });
  function fallback(text, cb){
    try{
      var ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); cb();
    }catch(e){}
  }

  /* Mark the current page in the nav (robust to clean URLs and .html paths) */
  (function(){
    function norm(p){ return (String(p).split('?')[0].split('#')[0].split('/').pop() || 'index.html').replace(/\.html$/,'') || 'index'; }
    var here = norm(location.pathname);
    document.querySelectorAll('.nav a.navtop[href]').forEach(function(a){
      if(norm(a.getAttribute('href')) === here){ a.classList.add('active'); a.setAttribute('aria-current','page'); }
    });
    /* also light up a dropdown parent when one of its child pages is current.
       only consider same-folder page links: skip external (://) and subdir (/) hrefs
       so e.g. cheers/index.html does not collide with the home page. */
    document.querySelectorAll('.nav .navgroup').forEach(function(g){
      var top = g.querySelector('.navtop');
      var hit = [].slice.call(g.querySelectorAll('.navmenu a[href]')).some(function(a){
        var h = a.getAttribute('href');
        if(/:\/\//.test(h) || h.indexOf('/') !== -1) return false;
        return norm(h) === here;
      });
      if(top && hit){ top.classList.add('active'); }
    });
  })();
