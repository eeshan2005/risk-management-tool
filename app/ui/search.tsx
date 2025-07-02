// app/ui/search.tsx
"use client";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Search({ value, onChange }: SearchProps) {
  return (
    <input
      type="text"
      placeholder="Search..."
      className="w-full px-4 py-2 border rounded-md"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
