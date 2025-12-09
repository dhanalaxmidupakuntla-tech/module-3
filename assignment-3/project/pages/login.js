// Module to init login page
export default function login() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Invalid credentials');
      return;
    }

    // set logged in user
    localStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, name: user.name }));
    // redirect to todos
    location.href = 'todos.html';
  });
}
