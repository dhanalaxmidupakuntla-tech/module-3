import { Calendar } from "lucide-react";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  return (
    <div className="space-y-3">
      <label htmlFor="date-picker" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Calendar className="w-4 h-4 text-indigo-600" />
        Select Date
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
    </div>
  );
}