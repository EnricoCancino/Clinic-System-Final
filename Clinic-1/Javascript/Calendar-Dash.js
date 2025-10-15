(function(){
      const cal = document.getElementById('calendar');
      const daysGrid = document.getElementById('daysGrid');
      const calTitle = document.getElementById('calTitle');
      const selectedInfo = document.getElementById('selectedInfo');
      const prev = document.getElementById('prev');
      const next = document.getElementById('next');
      const todayBtn = document.getElementById('todayBtn');

      let view = new Date(); // displayed month
      let selected = null; // selected date (Date object)

      // Events stored as { 'YYYY-MM-DD': 'text' }
      const STORAGE_KEY = 'divCalendarEvents_v1';
      function loadEvents(){
        try{
          return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        }catch(e){ return {}; }
      }
      function saveEvents(obj){ localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }

      let events = loadEvents();

      function ymd(d){
        const y = d.getFullYear();
        const m = String(d.getMonth()+1).padStart(2,'0');
        const day = String(d.getDate()).padStart(2,'0');
        return `${y}-${m}-${day}`;
      }

      function startOfMonth(date){ return new Date(date.getFullYear(), date.getMonth(), 1); }
      function endOfMonth(date){ return new Date(date.getFullYear(), date.getMonth()+1, 0); }

      function render(){
        const year = view.getFullYear();
        const month = view.getMonth();
        calTitle.textContent = view.toLocaleString(undefined, { month: 'long', year: 'numeric' });

        daysGrid.innerHTML = '';

        const start = startOfMonth(view);
        const startDayIdx = start.getDay();
        const totalCells = 42;
        const firstCellDate = new Date(start);
        firstCellDate.setDate(start.getDate() - startDayIdx);

        for(let i=0;i<totalCells;i++){
          const d = new Date(firstCellDate);
          d.setDate(firstCellDate.getDate() + i);

          const cell = document.createElement('button');
          cell.type='button';
          cell.className = 'day';
          cell.setAttribute('data-date', d.toISOString());
          cell.setAttribute('aria-label', d.toDateString());

          const num = document.createElement('div'); num.className='num'; num.textContent = d.getDate();
          cell.appendChild(num);

          // show snippet if event exists
          const key = ymd(d);
          if(events[key]){
            const dot = document.createElement('div'); dot.className='event-dot'; cell.appendChild(dot);
            const snippet = document.createElement('div'); snippet.className='event-snippet'; snippet.textContent = events[key];
            cell.appendChild(snippet);
          }

          if(d.getMonth() !== month) cell.classList.add('other-month');

          const today = new Date();
          if(d.toDateString() === today.toDateString()) cell.classList.add('today');

          if(selected && d.toDateString() === selected.toDateString()) cell.classList.add('selected');

          // open editor on click
          cell.addEventListener('click', (e)=>{
            // stop double focus from buttons
            openEditor(d, key);
          });

          daysGrid.appendChild(cell);
        }
      }

      // Modal/editor
      function openEditor(date, key){
        selected = date;
        render();

        // create backdrop
        const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
        backdrop.tabIndex = -1;

        const modal = document.createElement('div'); modal.className='modal';
        const title = document.createElement('h3'); title.textContent = 'Note for ' + date.toLocaleDateString();
        const infoP = document.createElement('p'); infoP.className='pill'; infoP.textContent = date.toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        const ta = document.createElement('textarea'); ta.placeholder = 'Write a note, event, reminders...';
        ta.value = events[key] || '';

        const actions = document.createElement('div'); actions.className='actions';
        const saveBtn = document.createElement('button'); saveBtn.className='btn'; saveBtn.textContent='Save';
        const deleteBtn = document.createElement('button'); deleteBtn.className='btn'; deleteBtn.textContent='Delete';
        const closeBtn = document.createElement('button'); closeBtn.className='btn'; closeBtn.textContent='Close';

        actions.appendChild(deleteBtn);
        actions.appendChild(closeBtn);
        actions.appendChild(saveBtn);

        modal.appendChild(title);
        modal.appendChild(infoP);
        modal.appendChild(ta);
        modal.appendChild(actions);
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // focus
        ta.focus();

        function cleanup(){
          document.body.removeChild(backdrop);
          selected = null;
          render();
        }

        saveBtn.addEventListener('click', ()=>{
          const val = ta.value.trim();
          if(val){ events[key] = val; }
          else { delete events[key]; }
          saveEvents(events);
          cleanup();
          selectedInfo.textContent = val ? ('Saved for ' + date.toLocaleDateString()) : ('Cleared for ' + date.toLocaleDateString());
        });

        deleteBtn.addEventListener('click', ()=>{
          if(events[key]){ delete events[key]; saveEvents(events); }
          cleanup();
          selectedInfo.textContent = 'Deleted note for ' + date.toLocaleDateString();
        });

        closeBtn.addEventListener('click', ()=>{ cleanup(); });

        // close on backdrop click (but not if clicking inside modal)
        backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) cleanup(); });

        // keyboard shortcuts
        backdrop.addEventListener('keydown', (e)=>{
          if(e.key === 'Escape') cleanup();
          if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
            e.preventDefault(); saveBtn.click();
          }
        });

      }

      // nav handlers
      prev.addEventListener('click', ()=>{ view = new Date(view.getFullYear(), view.getMonth()-1, 1); render(); });
      next.addEventListener('click', ()=>{ view = new Date(view.getFullYear(), view.getMonth()+1, 1); render(); });
      todayBtn.addEventListener('click', ()=>{ view = new Date(); selected = new Date(); render(); selectedInfo.textContent = 'Selected: ' + selected.toLocaleDateString(); });

      // keyboard navigation: left/right to change month when focused inside calendar
      cal.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowLeft') { view = new Date(view.getFullYear(), view.getMonth()-1, 1); render(); }
        if(e.key === 'ArrowRight') { view = new Date(view.getFullYear(), view.getMonth()+1, 1); render(); }
      });

      // initial render
      render();

      // expose for debugging (optional)
      window._divCal = { events, saveEvents, loadEvents };
    })();