import React from "react";

export default function ActivityForm({ onAdd, remainingMinutes }) {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Work");
  const [minutes, setMinutes] = React.useState("");

  function submit(e){
    e.preventDefault();
    const mins = Number(minutes);
    if (!title || !mins || mins <=0) return alert("Fill fields correctly");
    if (mins > remainingMinutes) return alert(`Exceeds remaining ${remainingMinutes} mins`);
    onAdd({ title, category, minutes: mins });
    setTitle(""); setMinutes("");
  }

  return (
    <form onSubmit={submit} className="panel-card">
      <h3>Add activity</h3>
      <label>Title</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} />
      <label>Category</label>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option>Work</option>
        <option>Study</option>
        <option>Sleep</option>
        <option>Exercise</option>
        <option>Entertainment</option>
        <option>Other</option>
      </select>
      <label>Minutes (remaining {remainingMinutes})</label>
      <input type="number" value={minutes} onChange={e=>setMinutes(e.target.value)} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button className="btn primary" type="submit">Add</button>
        <button className="btn outline" type="button" onClick={()=>{setTitle(''); setMinutes('');}}>Clear</button>
      </div>
    </form>
  );
}
