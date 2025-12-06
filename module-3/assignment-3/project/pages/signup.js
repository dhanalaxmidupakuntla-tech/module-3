export default function signup() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    // users stored as array in localStorage key 'users'
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // check duplicate
    if (users.find(u => u.email === email)) {
      alert('Email already registered. Please login.');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful. Redirecting to login.');
    location.href = 'login.html';
  });
}