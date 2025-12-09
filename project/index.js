/* -----------------------------
   AI Time Tracker - script.js
   Single-file app logic (no React)
   - Uses Firestore if FIREBASE_CONFIG provided below
   - Falls back to localStorage (BrowserStorage) if not configured
   ----------------------------- */

/* ======================
   CONFIG: Paste your Firebase config here (optional).
   If you leave it as `null`, the app uses localStorage persistence.
   Replace the values with your Firebase project's config object.
   Example:
   const FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     ...
   };
   ====================== */
const FIREBASE_CONFIG = null;

/* ======================
   END CONFIG
   ====================== */

const DAILY_LIMIT = 1440; // minutes
const enableAnalyseWhen = DAILY_LIMIT; // change if you prefer >= or <=

/* -------------------
   Storage abstraction
   ------------------- */
const StorageFactory = (() => {
  // Mock Firestore-like interface backed by localStorage
  function makeKey(userId, dateStr) {
    return `tf:${userId}::${dateStr}`;
  }

  const BrowserStorage = {
    async init() { return Promise.resolve(); },
    async getActivities(userId, dateStr) {
      const key = makeKey(userId, dateStr);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    },
    async addActivity(userId, dateStr, activity) {
      const items = await BrowserStorage.getActivities(userId, dateStr);
      const id = 'a_' + Math.random().toString(36).slice(2,9);
      const newItem = { id, ...activity, createdAt: Date.now() };
      items.push(newItem);
      localStorage.setItem(makeKey(userId, dateStr), JSON.stringify(items));
      // call watchers
      BrowserStorage._notify(userId, dateStr, items);
      return id;
    },
    async updateActivity(userId, dateStr, activityId, patch) {
      const items = await BrowserStorage.getActivities(userId, dateStr);
      const idx = items.findIndex(i=>i.id===activityId);
      if (idx === -1) throw new Error("Not found");
      items[idx] = { ...items[idx], ...patch, updatedAt: Date.now() };
      localStorage.setItem(makeKey(userId, dateStr), JSON.stringify(items));
      BrowserStorage._notify(userId, dateStr, items);
    },
    async deleteActivity(userId, dateStr, activityId) {
      let items = await BrowserStorage.getActivities(userId, dateStr);
      items = items.filter(i=>i.id!==activityId);
      localStorage.setItem(makeKey(userId, dateStr), JSON.stringify(items));
      BrowserStorage._notify(userId, dateStr, items);
    },
    _watchers: {},
    _notify(userId, dateStr, items) {
      const key = makeKey(userId, dateStr);
      const list = BrowserStorage._watchers[key] || [];
      list.forEach(cb => cb(items));
    },
    onActivitiesChanged(userId, dateStr, cb) {
      const key = makeKey(userId, dateStr);
      BrowserStorage._watchers[key] = BrowserStorage._watchers[key] || [];
      BrowserStorage._watchers[key].push(cb);
      // return unsubscribe
      return () => {
        BrowserStorage._watchers[key] = (BrowserStorage._watchers[key] || []).filter(x=>x!==cb);
      };
    }
  };

  /* Firestore implementation using Firebase compat SDK (if config provided) */
  const FirestoreStorage = {
    async init(config) {
      if (!config) throw new Error("Firebase config missing");
      if (!window.firebase || !window.firebase.initializeApp) {
        throw new Error("Firebase SDK not loaded");
      }
      if (!FirestoreStorage._inited) {
        firebase.initializeApp(config);
        FirestoreStorage.auth = firebase.auth();
        FirestoreStorage.db = firebase.firestore();
        FirestoreStorage._inited = true;
      }
    },
    async getActivities(userId, dateStr) {
      const snap = await FirestoreStorage.db
        .collection('users').doc(userId)
        .collection('days').doc(dateStr)
        .collection('activities').orderBy('createdAt','asc')
        .get();
      const items = [];
      snap.forEach(d => items.push({ id: d.id, ...d.data() }));
      return items;
    },
    async addActivity(userId, dateStr, activity) {
      const ref = await FirestoreStorage.db
        .collection('users').doc(userId)
        .collection('days').doc(dateStr)
        .collection('activities')
        .add({ ...activity, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      // Firestore triggers will update listeners
      return ref.id;
    },
    async updateActivity(userId, dateStr, activityId, patch) {
      await FirestoreStorage.db
        .collection('users').doc(userId)
        .collection('days').doc(dateStr)
        .collection('activities').doc(activityId)
        .update({ ...patch, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    },
    async deleteActivity(userId, dateStr, activityId) {
      await FirestoreStorage.db
        .collection('users').doc(userId)
        .collection('days').doc(dateStr)
        .collection('activities').doc(activityId)
        .delete();
    },
    onActivitiesChanged(userId, dateStr, cb) {
      const ref = FirestoreStorage.db
        .collection('users').doc(userId)
        .collection('days').doc(dateStr)
        .collection('activities').orderBy('createdAt','asc');
      const unsub = ref.onSnapshot(snap => {
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        cb(items);
      });
      return unsub;
    }
  };

  return {
    create(useFirestore, firebaseConfig) {
      return useFirestore ? {
        impl: FirestoreStorage,
        init: () => FirestoreStorage.init(firebaseConfig)
      } : {
        impl: BrowserStorage,
        init: () => Promise.resolve()
      };
    }
  };
})();

/* -------------------
   App UI wiring
   ------------------- */
(() => {
  // DOM refs
  const authScreen = document.getElementById('authScreen');
  const appScreen = document.getElementById('appScreen');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const signinBtn = document.getElementById('signinBtn');
  const signupBtn = document.getElementById('signupBtn');
  const googleBtn = document.getElementById('googleBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const datePicker = document.getElementById('datePicker');

  const titleInput = document.getElementById('titleInput');
  const categoryInput = document.getElementById('categoryInput');
  const minutesInput = document.getElementById('minutesInput');
  const addBtn = document.getElementById('addBtn');
  const resetBtn = document.getElementById('resetBtn');

  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const activitiesList = document.getElementById('activitiesList');
  const analyseBtn = document.getElementById('analyseBtn');
  const ctaAdd = document.getElementById('ctaAdd');

  const noData = document.getElementById('noData');
  const analysis = document.getElementById('analysis');
  const statHours = document.getElementById('statHours');
  const statCount = document.getElementById('statCount');
  const statTop = document.getElementById('statTop');

  const editModal = document.getElementById('editModal');
  const editTitle = document.getElementById('editTitle');
  const editCategory = document.getElementById('editCategory');
  const editMinutes = document.getElementById('editMinutes');
  const saveEdit = document.getElementById('saveEdit');
  const cancelEdit = document.getElementById('cancelEdit');

  // charts
  let pieChart = null;
  let barChart = null;

  // state
  let Storage = null;
  let useFirestore = Boolean(FIREBASE_CONFIG);
  let currentUser = null; // object: {id, email}
  let activeDate = null;
  let dayActivities = [];
  let unsubListener = null;
  let editingId = null;

  // Initialize storage
  const storeFactory = StorageFactory.create(useFirestore, FIREBASE_CONFIG);
  Storage = storeFactory.impl;
  (async ()=>{
    try {
      await storeFactory.init();
    } catch (e) {
      console.warn("Firestore init failed or not configured; falling back to local storage.");
      // fallback already selected by factory
    }
  })();

  // Simple auth abstraction
  const Auth = {
    async init() {
      if (useFirestore && window.firebase && firebase.auth) {
        this._firebase = firebase.auth();
        // listen to state changes
        this._firebase.onAuthStateChanged(u => {
          if (u) {
            setUser({ id: u.uid, email: u.email });
          } else {
            setUser(null);
          }
        });
      } else {
        // local mock auth (simple): user stored in sessionStorage
        const s = sessionStorage.getItem('tf_demo_user');
        if (s) setUser(JSON.parse(s));
      }
    },
    async signIn(email, password) {
      if (useFirestore && this._firebase) {
        await this._firebase.signInWithEmailAndPassword(email, password);
      } else {
        // create demo user
        const id = 'demo_' + btoa(email).slice(0,8);
        const u = { id, email };
        sessionStorage.setItem('tf_demo_user', JSON.stringify(u));
        setUser(u);
      }
    },
    async signUp(email, password) {
      if (useFirestore && this._firebase) {
        await this._firebase.createUserWithEmailAndPassword(email, password);
      } else {
        // simple signUp in demo mode
        const id = 'demo_' + btoa(email).slice(0,8);
        const u = { id, email };
        sessionStorage.setItem('tf_demo_user', JSON.stringify(u));
        setUser(u);
      }
    },
    async signInWithGoogle() {
      if (useFirestore && this._firebase) {
        const provider = new firebase.auth.GoogleAuthProvider();
        await this._firebase.signInWithPopup(provider);
      } else {
        // demo google
        const id = 'demo_google_' + Math.random().toString(36).slice(2,8);
        const u = { id, email: `${id}@demo.local` };
        sessionStorage.setItem('tf_demo_user', JSON.stringify(u));
        setUser(u);
      }
    },
    async signOut() {
      if (useFirestore && this._firebase) {
        await this._firebase.signOut();
      }
      sessionStorage.removeItem('tf_demo_user');
      setUser(null);
    }
  };

  // bootstrap
  Auth.init();

  // UI event wiring
  signinBtn.addEventListener('click', async () => {
    try {
      await Auth.signIn(authEmail.value.trim(), authPassword.value);
    } catch (e) {
      alert("Sign in failed: " + (e.message || e));
    }
  });

  signupBtn.addEventListener('click', async () => {
    try {
      await Auth.signUp(authEmail.value.trim(), authPassword.value);
    } catch (e) {
      alert("Sign up failed: " + (e.message || e));
    }
  });

  googleBtn.addEventListener('click', async () => {
    try {
      await Auth.signInWithGoogle();
    } catch (e) {
      alert("Google sign-in failed: " + (e.message || e));
    }
  });

  signOutBtn.addEventListener('click', async () => {
    await Auth.signOut();
  });

  // auth UI reaction
  function setUser(user) {
    currentUser = user;
    if (user) {
      authScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');
      // default date
      const iso = new Date().toISOString().slice(0,10);
      datePicker.value = iso;
      setActiveDate(iso);
    } else {
      appScreen.classList.add('hidden');
      authScreen.classList.remove('hidden');
      cleanupListener();
      dayActivities = [];
      renderActivities();
      updateProgressUI();
    }
  }

  datePicker.addEventListener('change', () => setActiveDate(datePicker.value));
  ctaAdd.addEventListener('click', () => {
    titleInput.focus();
  });

  // add activity
  addBtn.addEventListener('click', async () => {
    if (!currentUser) return alert("Please sign in");
    if (!activeDate) return alert("Pick a date");
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const minutes = Number(minutesInput.value);

    if (!title) return alert("Enter title");
    if (!minutes || minutes <= 0) return alert("Enter minutes > 0");

    const total = totalMinutes();
    if (total + minutes > DAILY_LIMIT) {
      return alert(`Cannot add — would exceed ${DAILY_LIMIT} minutes. Remaining: ${DAILY_LIMIT - total} mins.`);
    }

    await Storage.addActivity(currentUser.id, activeDate, { title, category, minutes });
    titleInput.value = ""; minutesInput.value = "";
    // Storage listener will update UI
  });

  resetBtn.addEventListener('click', () => {
    titleInput.value = ""; minutesInput.value = "";
  });

  // edit handlers
  async function openEditModal(id) {
    const item = dayActivities.find(x=>x.id===id);
    if (!item) return alert("Not found");
    editingId = id;
    editTitle.value = item.title;
    editCategory.value = item.category;
    editMinutes.value = item.minutes;
    editModal.classList.remove('hidden');
  }
  cancelEdit.addEventListener('click', () => {
    editModal.classList.add('hidden'); editingId = null;
  });
  saveEdit.addEventListener('click', async () => {
    if (!editingId) return;
    const t = editTitle.value.trim();
    const c = editCategory.value;
    const m = Number(editMinutes.value);
    if (!t || !m || m<=0) return alert("Enter valid values");
    // compute total without this item
    const currentTotalWithout = dayActivities.reduce((s,a)=>a.id===editingId? s : s+a.minutes, 0);
    if (currentTotalWithout + m > DAILY_LIMIT) return alert(`Cannot update — would exceed ${DAILY_LIMIT} minutes.`);
    await Storage.updateActivity(currentUser.id, activeDate, editingId, { title: t, category: c, minutes: m });
    editModal.classList.add('hidden'); editingId = null;
  });

  // delete
  async function deleteActivity(id) {
    if (!confirm("Delete this activity?")) return;
    await Storage.deleteActivity(currentUser.id, activeDate, id);
  }

  // set active date and attach listener
  function setActiveDate(d) {
    if (!d) return;
    activeDate = d;
    attachListener();
  }

  function cleanupListener() {
    if (unsubListener) { unsubListener(); unsubListener = null; }
  }

  function attachListener() {
    if (!currentUser || !activeDate) return;
    cleanupListener();
    unsubListener = Storage.onActivitiesChanged(currentUser.id, activeDate, items => {
      dayActivities = items;
      renderActivities();
      updateProgressUI();
    });
    // also fetch once
    Storage.getActivities(currentUser.id, activeDate).then(items => {
      dayActivities = items;
      renderActivities();
      updateProgressUI();
    });
  }

  // render list
  function renderActivities() {
    activitiesList.innerHTML = "";
    if (!dayActivities || !dayActivities.length) {
      activitiesList.innerHTML = '<div class="muted">No activities yet for this date.</div>';
      return;
    }
    dayActivities.forEach(a => {
      const r = document.createElement('div');
      r.className = 'activity-row';
      r.innerHTML = `
        <div class="left">
          <div class="title">${escapeHtml(a.title)}</div>
          <div class="meta">${escapeHtml(a.category)} • ${a.minutes} mins</div>
        </div>
        <div class="actions">
          <button class="btn tiny outline" data-edit="${a.id}">Edit</button>
          <button class="btn tiny danger" data-del="${a.id}">Delete</button>
        </div>
      `;
      activitiesList.appendChild(r);
    });

    activitiesList.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => deleteActivity(btn.getAttribute('data-del')));
    });
    activitiesList.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-edit')));
    });
  }

  // compute totals and UI
  function totalMinutes() {
    return dayActivities.reduce((s,a)=>s + Number(a.minutes || 0), 0);
  }

  function updateProgressUI() {
    const total = totalMinutes();
    const remaining = Math.max(0, DAILY_LIMIT - total);
    progressText.innerText = `Remaining: ${remaining} mins`;
    const percent = Math.min(100, (total / DAILY_LIMIT) * 100);
    progressBar.style.width = percent + '%';
    // enable analyse when total equals required limit
    analyseBtn.disabled = (total !== enableAnalyseWhen);
    analyseBtn.innerText = (total === enableAnalyseWhen) ? 'Analyse (Ready)' : `Analyse (enable at ${enableAnalyseWhen} mins)`;
    if (!dayActivities.length) {
      noData.classList.remove('hidden');
      analysis.classList.add('hidden');
    } else {
      noData.classList.add('hidden');
      // keep analysis hidden until user clicks Analyse
      analysis.classList.add('hidden');
    }
  }

  // analyse flow
  analyseBtn.addEventListener('click', () => {
    if (analyseBtn.disabled) return;
    produceAnalysis();
    analysis.classList.remove('hidden');
    noData.classList.add('hidden');
    // scroll into view
    document.querySelector('.right').scrollIntoView({behavior:'smooth'});
  });

  function produceAnalysis() {
    const total = totalMinutes();
    statHours.innerText = `${(total/60).toFixed(2)} hrs`;
    statCount.innerText = `${dayActivities.length}`;

    const catMap = {};
    dayActivities.forEach(a => {
      catMap[a.category] = (catMap[a.category] || 0) + Number(a.minutes || 0);
    });
    const catEntries = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
    statTop.innerText = catEntries.length ? `${catEntries[0][0]} (${(catEntries[0][1]/60).toFixed(1)} hrs)` : '—';

    const pieLabels = catEntries.map(e=>e[0]);
    const pieValues = catEntries.map(e=>e[1]);
    const barLabels = dayActivities.map(a=>a.title);
    const barValues = dayActivities.map(a=>a.minutes);

    drawPieChart(pieLabels, pieValues);
    drawBarChart(barLabels, barValues);
  }

  function drawPieChart(labels, values) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
      type: 'pie',
      data: { labels, datasets: [{ data: values, backgroundColor: generateColors(values.length) }] },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  }

  function drawBarChart(labels, values) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Minutes', data: values, backgroundColor: generateColors(values.length) }] },
      options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 60 } } }, plugins: { legend: { display: false } } }
    });
  }

  function generateColors(n) {
    const palette = ['#2563EB','#06B6D4','#F97316','#10B981','#EF4444','#8B5CF6','#F59E0B','#E11D48'];
    const out = [];
    for (let i=0;i<n;i++) out.push(palette[i % palette.length]);
    return out;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // small keyboard UX
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (document.activeElement===minutesInput || document.activeElement===titleInput)) {
      e.preventDefault();
      addBtn.click();
    }
  });

  // expose Test API for automated tests or quick console usage
  window.TestAPI = {
    async addActivity(userId, dateStr, activity) { return Storage.addActivity(userId, dateStr, activity); },
    async getTotalMinutes(userId, dateStr) { const items = await Storage.getActivities(userId, dateStr); return items.reduce((s,a)=>s+a.minutes,0); },
    async canAddMinutes(userId, dateStr, minutes) { const total = await window.TestAPI.getTotalMinutes(userId, dateStr); return (total + minutes) <= DAILY_LIMIT; },
    async editActivity(userId, dateStr, id, patch) { return Storage.updateActivity(userId, dateStr, id, patch); },
    async deleteActivity(userId, dateStr, id) { return Storage.deleteActivity(userId, dateStr, id); },
    async computeCategoryTotals(userId, dateStr) {
      const items = await Storage.getActivities(userId, dateStr);
      const map = {}; items.forEach(i=>map[i.category] = (map[i.category]||0) + Number(i.minutes||0));
      return map;
    },
    // internal helpers
    getStorageImpl: () => Storage
  };

  // initial UI state
  updateProgressUI();

})();
