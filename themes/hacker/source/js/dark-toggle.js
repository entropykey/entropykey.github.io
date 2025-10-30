(function(){
  function setTheme(next){
    try { localStorage.setItem('theme', next); } catch(e) {}
    document.documentElement.classList.toggle('dark', next === 'dark');
  }
  function getTheme(){
    try { return localStorage.getItem('theme'); } catch(e) { return null; }
  }
  function init(){
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function(){
      var current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // If no stored preference, sync with system
    if (!getTheme()){
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', function(e){ setTheme(e.matches ? 'dark' : 'light'); });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();