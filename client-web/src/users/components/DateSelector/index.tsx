import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

/* 📅 TimeRangeSelector */
interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function TimeRangeSelector({
  value,
  onChange,
  options,
}: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        {selectedOption?.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                option.value === value
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
