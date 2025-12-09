import React from "react";

export default function ActivityList({ items = [], onDelete, onEdit }) {
  if (!items.length) return <div className="panel-card muted">No activities yet.</div>;
  return (
    <div className="panel-card">
      <h3>Activities</h3>
      <div>
        {items.map(it => (
          <div key={it.id} style={{display:'flex',justifyContent:'space-between',padding:8,background:'rgba(0,0,0,0.06)',marginBottom:8,borderRadius:6}}>
            <div>
              <div style={{fontWeight:700}}>{it.title}</div>
              <div className="muted">{it.category} • {it.minutes} mins</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button className="btn tiny outline" onClick={()=>onEdit(it.id)}>Edit</button>
              <button className="btn tiny danger" onClick={()=>onDelete(it.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
