// Todos page module: protects route, fetches todos, uses displayTodos
import { displayTodos } from '../components/displayTodos.js';

export default function todos() {
  const logged = localStorage.getItem('loggedInUser');
  if (!logged) {
    // not logged in — redirect
    alert('Please login to view todos.');
    location.href = 'login.html';
    return;
  }

  const status = document.getElementById('status');
  const container = document.getElementById('todoContainer');

  async function loadTodos() {
    status.textContent = 'Loading todos...';
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      displayTodos(data, container);
      status.textContent = 'Showing todos (first 20)';
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p class="muted">Failed to fetch todos.</p>';
      status.textContent = 'Failed to load';
    }
  }

  loadTodos();
}
