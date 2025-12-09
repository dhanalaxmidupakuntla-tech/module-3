let _inited = false;
let _firebase = null;
let _auth = null;
let _db = null;

export function initFirebase() {
  return new Promise((resolve, reject) => {
    try {
      const cfg = window.FIREBASE_CONFIG || null;
      if (!cfg) return resolve(null);
      if (!_inited) {
        _firebase = window.firebase;
        _firebase.initializeApp(cfg);
        _auth = _firebase.auth();
        _db = _firebase.firestore();
        _inited = true;
      }
      resolve({ auth: _auth, db: _db });
    } catch (e) {
      reject(e);
    }
  });
}

export function firebaseAuth() {
  return (window.firebase && _inited) ? _auth : (window.firebase && ! _inited ? _firebase.auth() : null);
}

export function firebaseDB() {
  return _db;
}
