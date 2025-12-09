import React from "react";
import { useAuth } from "../../lib/auth";
import { createStorage } from "../../lib/storage";
import Chart from "chart.js/auto";

export default function Dashboard(){
  const { user } = useAuth();
  const [date, setDate] = React.useState(new Date().toISOString().slice(0,10));
  const [items, setItems] = React.useState([]);
  const storage = React.useMemo(()=> createStorage(false), []);

  React.useEffect(()=>{
    let active = true;
    storage.getActivities(user.id, date).then(arr => { if(active) setItems(arr); });
    return ()=> active=false;
  }, [date, storage, user]);

  React.useEffect(()=> {
    if (!items.length) return;
    const map = {};
    items.forEach(i=> map[i.category] = (map[i.category]||0) + Number(i.minutes||0));
    const labels = Object.keys(map);
    const values = labels.map(l=>map[l]);
    const ctxPie = document.getElementById('dashPie')?.getContext('2d');
    if (ctxPie) new Chart(ctxPie, { type: 'pie', data: { labels, datasets: [{ data: values }] } });
    const ctxBar = document.getElementById('dashBar')?.getContext('2d');
    if (ctxBar) new Chart(ctxBar, { type: 'bar', data: { labels: items.map(i=>i.title), datasets: [{ data: items.map(i=>i.minutes) }] } });
  }, [items]);

  return (
    <div>
      <div className="panel-card">
        <label>Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </div>
      <div className="panel-card">
        {items.length === 0 ? (
          <div className="no-data">No data available — start logging your day!</div>
        ) : (
          <>
            <div>Activities: {items.length}</div>
            <div>Total minutes: {items.reduce((s,x)=>s + Number(x.minutes||0),0)}</div>
            <div style={{display:'flex', gap:12, marginTop:12}}>
              <canvas id="dashPie" width="240" height="240"></canvas>
              <canvas id="dashBar" width="480" height="240"></canvas>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
