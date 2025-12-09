import { useState } from "react";
import { Edit2, Trash2, Save, X } from "lucide-react";
import type { Activity } from "@/shared/types";
import NoDataCard from "./NoDataCard";

interface ActivityListProps {
  activities: Activity[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIES = [
  "Work",
  "Personal",
  "Sleep",
  "Exercise",
  "Learning",
  "Entertainment",
  "Meals",
  "Commute",
  "Other",
];

export default function ActivityList({ activities, onUpdate, onDelete, isLoading }: ActivityListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    minutes: "",
    start_minute: "",
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return <NoDataCard />;
  }

  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm({
      title: activity.title,
      category: activity.category,
      minutes: activity.minutes.toString(),
      start_minute: activity.start_minute?.toString() || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", category: "", minutes: "", start_minute: "" });
  };

  const saveEdit = async (id: number) => {
    const minutesNum = parseInt(editForm.minutes);
    const startMinuteNum = editForm.start_minute ? parseInt(editForm.start_minute) : null;

    await onUpdate(id, {
      title: editForm.title.trim(),
      category: editForm.category,
      minutes: minutesNum,
      start_minute: startMinuteNum,
    });

    setEditingId(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Work: "bg-blue-100 text-blue-700 border-blue-200",
      Personal: "bg-purple-100 text-purple-700 border-purple-200",
      Sleep: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Exercise: "bg-green-100 text-green-700 border-green-200",
      Learning: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Entertainment: "bg-pink-100 text-pink-700 border-pink-200",
      Meals: "bg-orange-100 text-orange-700 border-orange-200",
      Commute: "bg-gray-100 text-gray-700 border-gray-200",
      Other: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
        <p className="text-sm text-gray-600 mt-1">{activities.length} activity items</p>
      </div>

      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            {editingId === activity.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Title"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select
                    aria-label="Category"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    value={editForm.minutes}
                    onChange={(e) => setEditForm({ ...editForm, minutes: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Minutes"
                    min="1"
                  />
                </div>

                <input
                  type="number"
                  value={editForm.start_minute}
                  onChange={(e) => setEditForm({ ...editForm, start_minute: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Start minute (optional)"
                  min="0"
                  max="1439"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(activity.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {activity.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {activity.minutes} min ({(activity.minutes / 60).toFixed(1)}h)
                    </span>
                    {activity.start_minute !== null && (
                      <span className="text-sm text-gray-500">
                        Start: {Math.floor(activity.start_minute / 60)}:{(activity.start_minute % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(activity)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit activity"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
