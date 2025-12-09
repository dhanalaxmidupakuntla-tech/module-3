import React from "react";
import Chart from "chart.js/auto";

export default function Analytics({ activities = [] }) {
  React.useEffect(()=> {
    if (!activities.length) return;
    const map = {};
    activities.forEach(a => map[a.category] = (map[a.category] || 0) + Number(a.minutes || 0));
    const labels = Object.keys(map);
    const data = labels.map(l => map[l]);

    const ctx1 = document.getElementById('analyticsPie')?.getContext('2d');
    if (ctx1) new Chart(ctx1, { type: 'pie', data: { labels, datasets: [{ data }] } });

    const ctx2 = document.getElementById('analyticsBar')?.getContext('2d');
    if (ctx2) new Chart(ctx2, { type: 'bar', data: { labels: activities.map(a=>a.title), datasets: [{ data: activities.map(a=>a.minutes) }] } });
  }, [activities]);

  if (!activities.length) return <div className="panel-card">No activities to analyze</div>;

  return (
    <div className="panel-card">
      <h3>Analytics</h3>
      <canvas id="analyticsPie" width="240" height="240"></canvas>
      <canvas id="analyticsBar" width="480" height="240"></canvas>
    </div>
  );
}
