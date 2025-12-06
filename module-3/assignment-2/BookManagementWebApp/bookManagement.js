// bookManagement.js (Realtime Database - modular imports)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
  update,
  get
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxxxx",
  authDomain: "bookmanagementwebapp.firebaseapp.com",
  databaseURL: "https://bookmanagementwebapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bookmanagementwebapp",
  storageBucket: "bookmanagementwebapp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

/* -------------------------------------------------------- */

// init
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const booksRef = ref(db, "books"); // top-level node /books

// sample books to seed
const sampleBooks = [
  { title: "The Alchemist", author: "Paulo Coelho", price: 399, coverImageURL: "https://covers.openlibrary.org/b/id/10568466-L.jpg" },
  { title: "Atomic Habits", author: "James Clear", price: 499, coverImageURL: "https://covers.openlibrary.org/b/id/11153250-L.jpg" },
  { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", price: 350, coverImageURL: "https://covers.openlibrary.org/b/id/10909258-L.jpg" },
  { title: "The Power of Now", author: "Eckhart Tolle", price: 450, coverImageURL: "https://covers.openlibrary.org/b/id/10012679-L.jpg" },
  { title: "Think and Grow Rich", author: "Napoleon Hill", price: 299, coverImageURL: "https://covers.openlibrary.org/b/id/7133550-L.jpg" },
  { title: "Deep Work", author: "Cal Newport", price: 420, coverImageURL: "https://covers.openlibrary.org/b/id/8369256-L.jpg" }
];

// DOM
const addBookForm = document.getElementById("addBookForm");
const bookContainer = document.getElementById("book-container");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");

// realtime listener for /books -> render
onValue(booksRef, (snapshot) => {
  const data = snapshot.val() || {};
  // convert object to array with id
  const books = Object.keys(data).map(key => ({ id: key, ...data[key] }));
  renderBooks(books);
});

// render UI
function renderBooks(list){
  bookContainer.innerHTML = "";
  if (!list.length) {
    bookContainer.innerHTML = `<p>No books found. Add some from the left panel.</p>`;
    return;
  }
  list.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";
    card.innerHTML = `
      <img class="book-cover" src="${escapeHtml(book.coverImageURL||'')}" alt="${escapeHtml(book.title||'')}"/>
      <div class="book-body">
        <h3 class="book-title">${escapeHtml(book.title||'Untitled')}</h3>
        <p class="book-author">${escapeHtml(book.author||'Unknown')}</p>
        <p class="book-price">₹${escapeHtml(String(book.price||'0'))}</p>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn secondary btn-update">Update Author</button>
          <button class="btn danger btn-delete">Delete</button>
          <button class="btn outline btn-view">View</button>
        </div>
      </div>
    `;
    card.querySelector(".btn-update").addEventListener("click", () => updateAuthorPrompt(book));
    card.querySelector(".btn-delete").addEventListener("click", () => deleteBook(book.id));
    card.querySelector(".btn-view").addEventListener("click", () => openModal(book));
    bookContainer.appendChild(card);
  });
}

// add book
addBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const price = Number(document.getElementById("price").value);
  const imageURL = document.getElementById("imageURL").value.trim();

  if (!title || !author || !imageURL || isNaN(price)) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    // push returns a new ref; set data there
    const newRef = push(booksRef);
    await set(newRef, { title, author, price, coverImageURL: imageURL, createdAt: Date.now() });
    addBookForm.reset();
  } catch (err) {
    console.error("Add failed:", err);
    alert("Failed to add book. See console.");
  }
});

// update author
function updateAuthorPrompt(book){
  const newAuthor = prompt("Enter new author name:", book.author || "");
  if (newAuthor === null) return;
  const trimmed = newAuthor.trim();
  if (!trimmed) { alert("Author cannot be empty"); return; }
  const bookNode = ref(db, `books/${book.id}`);
  update(bookNode, { author: trimmed });
}

// delete
function deleteBook(id){
  if (!confirm("Delete this book?")) return;
  remove(ref(db, `books/${id}`)).catch(err => { console.error("Delete error:", err); alert("Delete failed"); });
}

// modal
function openModal(book){
  modalContent.innerHTML = `
    <h3>${escapeHtml(book.title||"Untitled")}</h3>
    <p><strong>Author:</strong> ${escapeHtml(book.author||"Unknown")}</p>
    <p><strong>Price:</strong> ₹${escapeHtml(String(book.price||"0"))}</p>
    <img src="${escapeHtml(book.coverImageURL||"")}" style="width:100%;margin-top:8px;border-radius:8px" />
  `;
  modalOverlay.classList.remove("hidden");
}
function closeModal(){ modalOverlay.classList.add("hidden"); }
closeModalBtn?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", (e)=> { if (e.target === modalOverlay) closeModal(); });

// seed sample books if /books empty
async function seedIfEmpty(){
  try {
    const snap = await get(booksRef);
    const val = snap.exists() ? snap.val() : null;
    if (!val) {
      // seed
      for (const b of sampleBooks) {
        const r = push(booksRef);
        await set(r, { ...b, createdAt: Date.now() });
      }
      console.log("Sample books seeded to RTDB.");
    } else {
      console.log("Books node not empty — seed skipped.");
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}
seedIfEmpty();

// small helper
function escapeHtml(s){ return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
