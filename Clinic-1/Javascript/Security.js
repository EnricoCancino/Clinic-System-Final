// ----- CONFIGURE (change before demo/launch) -----
    const VALID_USER = "admin";
    const VALID_PASS = "sjbcnl"; // mock password for demo (change this)
    const REDIRECT_TO = "Dashboard-Main.html";
    const MAX_ATTEMPTS = 3;
    // -------------------------------------------------

    let attemptsLeft = MAX_ATTEMPTS;
    const userEl = document.getElementById('username');
    const passEl = document.getElementById('password');
    const btn = document.getElementById('loginBtn');
    const msg = document.getElementById('msg');
    const attemptsEl = document.getElementById('attempts');
    const showPass = document.getElementById('showPass');

    attemptsEl.textContent = attemptsLeft;

    function setMessage(text, type){
      if(!text){ msg.innerHTML = ''; return; }
      const cls = type === 'error' ? 'error' : 'success';
      msg.innerHTML = `<div class="${cls}">${text}</div>`;
    }

    showPass.addEventListener('change', () => {
      passEl.type = showPass.checked ? 'text' : 'password';
    });

    function lockout() {
      setMessage("Too many failed attempts. Try again later.", 'error');
      btn.disabled = true;
      userEl.disabled = true;
      passEl.disabled = true;
      // simple visual cool-down (mock): re-enable after 30s
      setTimeout(() => {
        attemptsLeft = MAX_ATTEMPTS;
        attemptsEl.textContent = attemptsLeft;
        setMessage("", "");
        btn.disabled = false;
        userEl.disabled = false;
        passEl.disabled = false;
      }, 30000);
    }

    function attemptLogin() {
      const u = userEl.value.trim();
      const p = passEl.value;

      if(!u || !p){
        setMessage("Please enter both username and password.", 'error');
        return;
      }

      if(u === VALID_USER && p === VALID_PASS){
        setMessage("Access granted. Redirecting...", 'success');
        // small delay so user sees the message (mock)
        setTimeout(() => {
          window.location.href = REDIRECT_TO;
        }, 700);
      } else {
        attemptsLeft -= 1;
        attemptsEl.textContent = attemptsLeft;
        setMessage("Invalid username or password.", 'error');
        if(attemptsLeft <= 0) lockout();
      }
    }

    // allow Enter key
    [userEl, passEl].forEach(el => {
      el.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') attemptLogin();
      });
    });

    btn.addEventListener('click', attemptLogin);

    // Accessibility: focus username on load
    window.addEventListener('load', () => userEl.focus());
