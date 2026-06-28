  /* ============================================================
     VIDEO LIST - the only thing an owner edits to add a video.
     Record each clip in Loom, copy the share link, and paste the
     ID between the quotes below. The ID is the part of the link
     after  loom.com/share/  e.g.
       https://www.loom.com/share/ab12cd34ef56...  ->  "ab12cd34ef56..."
     Leave an ID blank and that step keeps its "coming soon" placeholder.
     ============================================================ */
  var VIDEOS = {
    why:   { id: "b8ba5486a76240efb83688019a4e1294", title: "The why" },
    step1: { id: "46f9100fbc69476f9e4069202035b4eb", title: "Set up your profile" },
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

  /* Mobile navigation: build a hamburger + slide-down panel from the existing .nav.
     Runs after the active-nav pass so it can mirror the active state. */
  (function(){
    var wrap = document.querySelector('.bar .wrap');
    var nav = document.querySelector('.nav');
    if(!wrap || !nav) return;

    var toggle = document.createElement('button');
    toggle.className = 'navtoggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="bars"><span></span><span></span><span></span></span>';
    wrap.appendChild(toggle);

    var panel = document.createElement('div');
    panel.className = 'navmobile';
    nav.querySelectorAll('.navgroup').forEach(function(g){
      var top = g.querySelector('.navtop');
      if(!top) return;
      var group = document.createElement('div'); group.className = 'mgroup';
      var head = document.createElement('a'); head.className = 'mtop';
      head.href = top.getAttribute('href'); head.textContent = top.textContent;
      if(top.classList.contains('active')) head.classList.add('active');
      group.appendChild(head);
      var sub = document.createElement('div'); sub.className = 'msub';
      g.querySelectorAll('.navmenu a[href]').forEach(function(link){
        var a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent;
        if(link.target){ a.target = link.target; a.rel = link.rel || 'noopener'; }
        sub.appendChild(a);
      });
      group.appendChild(sub);
      panel.appendChild(group);
    });
    document.body.appendChild(panel);

    function setOpen(open){
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      panel.classList.toggle('open', open);
      document.body.classList.toggle('navlock', open);
    }
    toggle.addEventListener('click', function(){
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function(e){ if(e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function(){ if(window.innerWidth > 900) setOpen(false); });
  })();
