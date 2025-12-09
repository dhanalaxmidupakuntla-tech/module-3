import { firebaseDB } from "./firebase";

function key(userId, dateStr){ return `tf:${userId}:${dateStr}`; }

export const BrowserStorage = {
  async getActivities(userId, dateStr) {
    const raw = localStorage.getItem(key(userId,dateStr));
    return raw ? JSON.parse(raw) : [];
  },
  async addActivity(userId, dateStr, activity) {
    const items = await this.getActivities(userId,dateStr);
    const id = 'a_'+Math.random().toString(36).slice(2,9);
    const it = { id, ...activity, createdAt: Date.now() };
    items.push(it);
    localStorage.setItem(key(userId,dateStr), JSON.stringify(items));
    return id;
  },
  async updateActivity(userId,dateStr,id,patch){
    const items = await this.getActivities(userId,dateStr);
    const idx = items.findIndex(x=>x.id===id); if (idx===-1) throw new Error('not found');
    items[idx] = { ...items[idx], ...patch, updatedAt: Date.now() };
    localStorage.setItem(key(userId,dateStr), JSON.stringify(items));
  },
  async deleteActivity(userId,dateStr,id){
    let items = await this.getActivities(userId,dateStr);
    items = items.filter(x=>x.id!==id);
    localStorage.setItem(key(userId,dateStr), JSON.stringify(items));
  }
};

export const FirestoreStorage = {
  async getActivities(userId, dateStr){
    const db = firebaseDB();
    if(!db) return [];
    const snap = await db.collection('users').doc(userId).collection('days').doc(dateStr).collection('activities').orderBy('createdAt','asc').get();
    const arr = [];
    snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
    return arr;
  },
  async addActivity(userId,dateStr,activity){
    const db = firebaseDB();
    if(!db) throw new Error("Firestore not initialized");
    const ref = await db.collection('users').doc(userId).collection('days').doc(dateStr).collection('activities').add({ ...activity, createdAt: window.firebase.firestore.FieldValue.serverTimestamp() });
    return ref.id;
  },
  async updateActivity(userId,dateStr,id,patch){
    const db = firebaseDB();
    await db.collection('users').doc(userId).collection('days').doc(dateStr).collection('activities').doc(id).update({ ...patch, updatedAt: window.firebase.firestore.FieldValue.serverTimestamp() });
  },
  async deleteActivity(userId,dateStr,id){
    const db = firebaseDB();
    await db.collection('users').doc(userId).collection('days').doc(dateStr).collection('activities').doc(id).delete();
  }
};

export function createStorage(useFirestore=false){
  return useFirestore ? FirestoreStorage : BrowserStorage;
}
