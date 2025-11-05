(function(){
  function setTheme(next){
    try { localStorage.setItem('theme', next); } catch(e) {}
    document.documentElement.classList.toggle('dark', next === 'dark');
  }
  function getTheme(){
    try { return localStorage.getItem('theme'); } catch(e) { return null; }
  }
  function hardenLinks(){
    try {
      var anchors = document.querySelectorAll('a[target="_blank"]');
      anchors.forEach(function(a){
        var rel = (a.getAttribute('rel') || '').toLowerCase();
        if (!/noopener/.test(rel) || !/noreferrer/.test(rel)) {
          a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
      });
    } catch(e) {}
  }

  function init(){
    var btn = document.getElementById('theme-toggle');
    if (btn){
      btn.addEventListener('click', function(){
        var current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // If no stored preference, sync with system
    if (!getTheme()){
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', function(e){ setTheme(e.matches ? 'dark' : 'light'); });
    }

    hardenLinks();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();