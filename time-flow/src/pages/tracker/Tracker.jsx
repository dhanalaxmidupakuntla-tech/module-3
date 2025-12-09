import React from "react";
import ActivityForm from "../../components/ActivityForm";
import ActivityList from "../../components/ActivityList";
import { useAuth } from "../../lib/auth";
import { createStorage } from "../../lib/storage";

export default function Tracker(){
  const { user } = useAuth();
  const [date, setDate] = React.useState(new Date().toISOString().slice(0,10));
  const [activities, setActivities] = React.useState([]);
  const storage = React.useMemo(()=> createStorage(false), []);

  React.useEffect(()=>{
    let active = true;
    storage.getActivities(user.id, date).then(items => { if(active) setActivities(items); });
    return ()=> active=false;
  }, [date, user, storage]);

  async function addAct(a){
    const total = activities.reduce((s,x)=>s + Number(x.minutes||0), 0);
    if (total + a.minutes > 1440) return alert('Exceeds daily 1440 minutes');
    await storage.addActivity(user.id, date, a);
    const items = await storage.getActivities(user.id, date);
    setActivities(items);
  }

  async function delAct(id){
    await storage.deleteActivity(user.id, date, id);
    const items = await storage.getActivities(user.id, date);
    setActivities(items);
  }

  async function editAct(id, patch){
    const totalWithout = activities.reduce((s,x)=>x.id===id? s : s + Number(x.minutes||0), 0);
    if (totalWithout + patch.minutes > 1440) return alert('Exceeds daily 1440 minutes');
    await storage.updateActivity(user.id, date, id, patch);
    const items = await storage.getActivities(user.id, date);
    setActivities(items);
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'360px 1fr', gap:16}}>
      <div>
        <div className="panel-card">
          <label>Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <ActivityForm onAdd={addAct} remainingMinutes={1440 - activities.reduce((s,x)=>s + Number(x.minutes||0),0)} />
        <ActivityList items={activities} onDelete={delAct} onEdit={editAct} />
      </div>
      <div>
        <div className="panel-card">
          <h3>Summary</h3>
          <div>Total activities: {activities.length}</div>
          <div>Total minutes: {activities.reduce((s,x)=>s + Number(x.minutes||0),0)}</div>
        </div>
      </div>
    </div>
  );
}
