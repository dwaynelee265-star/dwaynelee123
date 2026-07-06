const footerHTML = `
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div><h3>Leebound Coffee Roasters</h3><p>412 Foundry Street<br>Portland, ME 04101</p></div>
    <div><h3>Explore</h3><ul>
      <li><a data-goto="home">Home</a></li>
      <li><a data-goto="products">Products &amp; Process</a></li>
      <li><a data-goto="contact">Contact</a></li>
    </ul></div>
    <div><h3>Hours</h3><ul><li>Tue–Fri: 7am–5pm</li><li>Sat–Sun: 8am–3pm</li><li>Mon: Roasting only</li></ul></div>
  </div>
  <div class="footer-bottom"><span>&copy; 2026 Leebound Coffee Roasters</span><span>Roasted in small batches since 2016</span></div>
</div></footer>`;
document.getElementById('footer-home').innerHTML = footerHTML;
document.getElementById('footer-products').innerHTML = footerHTML;
document.getElementById('footer-contact').innerHTML = footerHTML;

function showPage(name){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  document.querySelectorAll('.demo-btn').forEach(b => {
    const dataPage = b.dataset.page;
    b.classList.toggle('active', dataPage === name);
  });
  window.scrollTo(0,0);
}
document.querySelectorAll('.demo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    if(page) showPage(page);
  });
});
document.addEventListener('click', function(e){
  const target = e.target instanceof Element ? e.target.closest('[data-goto]') : null;
  if(target){
    e.preventDefault();
    const page = target.dataset.goto;
    if(page) showPage(page);
  }
});

document.querySelectorAll('.nav-toggle').forEach(function(toggle){
  const links = toggle.parentElement?.querySelector('.nav-links');
  if(!links) return;
  toggle.addEventListener('click', function(){
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

function partOfDay(h){ if(h<5) return 'night owl'; if(h<12) return 'morning'; if(h<17) return 'afternoon'; if(h<21) return 'evening'; return 'night owl'; }
function updateTime(){
  const now = new Date(); const hour = now.getHours();
  const greetEl = document.getElementById('dynamic-greeting');
  const clockEl = document.getElementById('roastery-clock');
  if(greetEl){
    const part = partOfDay(hour);
    greetEl.textContent = part === 'night owl'
      ? "Good night, fellow night owl — the roaster's cold, but the shop's still open."
      : 'Good ' + part + ' — thanks for stopping by Leebound.';
  }
  if(clockEl){
    const t = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const d = now.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
    clockEl.textContent = 'Roastery time: ' + d + ', ' + t;
  }
}
updateTime(); setInterval(updateTime, 30000);

const form = document.getElementById('contact-form');
if(form){
  const status = document.getElementById('form-status');
  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    topic: (v) => v ? '' : 'Please choose a topic.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
  };
  function showError(field, msg){
    const el = form.querySelector('[name="'+field+'"]');
    if(!el) return;
    const wrap = el.closest('.form-field');
    if(!wrap) return;
    wrap.querySelector('.field-error').textContent = msg;
    wrap.classList.toggle('has-error', !!msg);
  }
  function validateField(field){
    const el = form.querySelector('[name="'+field+'"]');
    if(!el) return false;
    const msg = validators[field](el.value);
    showError(field, msg);
    return msg === '';
  }
  Object.keys(validators).forEach(f => {
    const el = form.querySelector('[name="'+f+'"]');
    if(el) el.addEventListener('blur', () => validateField(f));
  });
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const allValid = Object.keys(validators).map(validateField).every(Boolean);
    if(allValid && status){
      status.textContent = "Thanks — your message has been queued for the next roast day. We'll reply within two business days.";
      status.className = 'form-status success';
      form.reset();
    } else if(status){
      status.textContent = 'A few fields need a second look before this can be sent.';
      status.className = 'form-status error';
    }
  });
}
