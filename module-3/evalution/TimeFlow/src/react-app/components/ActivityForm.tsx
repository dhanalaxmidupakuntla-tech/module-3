import { useState } from "react";
import { Plus } from "lucide-react";

interface ActivityFormProps {
  selectedDate: string;
  onActivityAdded: (activity: any) => Promise<void>;
  remainingMinutes: number;
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

export default function ActivityForm({ selectedDate, onActivityAdded, remainingMinutes }: ActivityFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [minutes, setMinutes] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const minutesNum = parseInt(minutes);
    const startMinuteNum = startMinute ? parseInt(startMinute) : null;

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (isNaN(minutesNum) || minutesNum <= 0) {
      setError("Minutes must be a positive number");
      return;
    }

    if (minutesNum > remainingMinutes) {
      setError(`Only ${remainingMinutes} minutes remaining for this day`);
      return;
    }

    if (startMinuteNum !== null && (isNaN(startMinuteNum) || startMinuteNum < 0 || startMinuteNum >= 1440)) {
      setError("Start minute must be between 0 and 1439");
      return;
    }

    setIsSubmitting(true);

    try {
      await onActivityAdded({
        title: title.trim(),
        category,
        minutes: minutesNum,
        start_minute: startMinuteNum,
        date: selectedDate,
      });

      // Reset form
      setTitle("");
      setCategory("Work");
      setMinutes("");
      setStartMinute("");
    } catch (err) {
      setError("Failed to add activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Add Activity</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Morning meeting"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minutes
        </label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="60"
          min="1"
          max={remainingMinutes}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Minute (Optional)
        </label>
        <input
          type="number"
          value={startMinute}
          onChange={(e) => setStartMinute(e.target.value)}
          placeholder="0-1439"
          min="0"
          max="1439"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">
          Minute of day (0 = 12:00 AM, 720 = 12:00 PM)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || remainingMinutes === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" />
        {isSubmitting ? "Adding..." : "Add Activity"}
      </button>
    </form>
  );
}
