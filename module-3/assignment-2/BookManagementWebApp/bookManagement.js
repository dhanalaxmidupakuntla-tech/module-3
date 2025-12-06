let URL = "https://bookmanagementwebapp-default-rtdb.asia-southeast1.firebasedatabase.app/bookmanagementwebapp"

// -------------------------
// Replace with your project's firebaseConfig from Firebase Console
// -------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM
const bookGrid = document.getElementById('bookGrid');
const emptyState = document.getElementById('emptyState');
const addForm = document.getElementById('addForm');
const seedBtn = document.getElementById('seedBtn');
const refreshBtn = document.getElementById('refreshBtn');
const status = document.getElementById('status');

// Modal elements
const modal = document.getElementById('modal');
const mdTitle = document.getElementById('mdTitle');
const mdAuthor = document.getElementById('mdAuthor');
const mdPrice = document.getElementById('mdPrice');
const mdImg = document.getElementById('mdImg');
const closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click', ()=> modal.classList.remove('open'));
modal.addEventListener('click', (e)=> { if(e.target===modal) modal.classList.remove('open') });

// Simple helper to escape text for HTML insertion
function escapeHtml(str){
  return String(str || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
}

// Render single card from a Firestore document snapshot
function renderCard(doc){
  const data = doc.data();
  const id = doc.id;

  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="cover"><img src="${escapeHtml(data.coverImageURL || '')}" alt="cover"></div>
    <div class="title">${escapeHtml(data.title || 'Untitled')}</div>
    <div class="meta">Author: ${escapeHtml(data.author || 'Unknown')}</div>
    <div class="meta">Price: ₹${escapeHtml(String(data.price || '0'))}</div>
    <div class="actions">
      <button class="update">Update Author</button>
      <button class="delete">Delete</button>
      <button class="view">View Details</button>
    </div>
  `;

  card.querySelector('.delete').addEventListener('click', ()=> deleteBook(id));
  card.querySelector('.update').addEventListener('click', ()=> updateAuthorPrompt(id, data.author));
  card.querySelector('.view').addEventListener('click', ()=> openModal(data));

  bookGrid.appendChild(card);
}

// Open details modal
function openModal(data){
  mdTitle.textContent = data.title || '';
  mdAuthor.textContent = 'Author: ' + (data.author || '');
  mdPrice.textContent = 'Price: ₹' + (data.price || '');
  mdImg.src = data.coverImageURL || '';
  modal.classList.add('open');
}

// CRUD helpers
async function addBook(book){
  await db.collection('books').add(book);
}

async function deleteBook(id){
  if(!confirm('Delete this book?')) return;
  try {
    await db.collection('books').doc(id).delete();
  } catch (err) {
    console.error('Delete error', err);
    alert('Delete failed');
  }
}

async function updateAuthorPrompt(id, currentAuthor){
  const name = prompt('Enter new author name:', currentAuthor || '');
  if(name == null) return;
  try {
    await db.collection('books').doc(id).update({ author: name });
  } catch (err) {
    console.error('Update error', err);
    alert('Update failed');
  }
}

// Sample books (used by seed)
const sampleBooks = [
  { title: "The Alchemist", author: "Paulo Coelho", price: 399, coverImageURL: "https://covers.openlibrary.org/b/id/10568466-L.jpg" },
  { title: "Atomic Habits", author: "James Clear", price: 499, coverImageURL: "https://covers.openlibrary.org/b/id/11153250-L.jpg" },
  { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", price: 350, coverImageURL: "https://covers.openlibrary.org/b/id/10909258-L.jpg" },
  { title: "The Power of Now", author: "Eckhart Tolle", price: 450, coverImageURL: "https://covers.openlibrary.org/b/id/10012679-L.jpg" },
  { title: "Think and Grow Rich", author: "Napoleon Hill", price: 299, coverImageURL: "https://covers.openlibrary.org/b/id/7133550-L.jpg" },
  { title: "Deep Work", author: "Cal Newport", price: 420, coverImageURL: "https://covers.openlibrary.org/b/id/8369256-L.jpg" }
];

// Robust seed handler
seedBtn.addEventListener('click', async () => {
  console.log('[seed] clicked');
  seedBtn.disabled = true; seedBtn.textContent = 'Seeding...';

  try {
    // Sanity check: Firestore reachable
    try { await db.collection('books').limit(1).get(); } catch(e){ throw new Error('Firestore unreachable. Check firebaseConfig & rules. ' + e.message); }

    // If there is already data, skip
    const snap = await db.collection('books').limit(1).get();
    if(!snap.empty){ alert('Collection not empty — seed skipped.'); return; }

    // Add all books
    const promises = sampleBooks.map(b => db.collection('books').add(b));
    const refs = await Promise.all(promises);
    console.log('[seed] added ids:', refs.map(r => r.id));
    alert('Seed complete — added ' + refs.length + ' books.');
  } catch (err) {
    console.error('[seed] error', err);
    alert('Seeding failed. See console.');
  } finally {
    seedBtn.disabled = false; seedBtn.textContent = 'Seed Sample Books (if empty)';
  }
});

// Add form submit
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const book = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    price: Number(document.getElementById('price').value) || 0,
    coverImageURL: document.getElementById('imageURL').value.trim()
  };
  try {
    await addBook(book);
    addForm.reset();
  } catch (err) {
    console.error('Add book failed', err);
    alert('Add failed (check console)');
  }
});

// Manual refresh (one-time)
refreshBtn.addEventListener('click', () => { loadOnce(); });

// One-time load
async function loadOnce(){
  try {
    bookGrid.innerHTML = ''; emptyState.style.display = 'none';
    const snapshot = await db.collection('books').orderBy('title').get();
    if(snapshot.empty){ emptyState.style.display = 'block'; status.textContent = 'No books'; return; }
    snapshot.forEach(doc => renderCard(doc));
    status.textContent = 'Loaded';
  } catch (err) {
    console.error('Load once failed', err);
    status.textContent = 'Error';
  }
}

// Realtime listener (auto updates UI)
let unsub = null;
function startRealtime(){
  status.textContent = 'Listening...';
  if(unsub) unsub();
  unsub = db.collection('books').orderBy('title').onSnapshot(snapshot => {
    bookGrid.innerHTML = '';
    if(snapshot.empty){ emptyState.style.display = 'block'; status.textContent = 'No books'; return; }
    emptyState.style.display = 'none';
    snapshot.forEach(doc => renderCard(doc));
    status.textContent = 'Synced';
  }, err => {
    console.error('Snapshot error', err);
    status.textContent = 'Snapshot error';
  });
}

// Start realtime on load
startRealtime();
