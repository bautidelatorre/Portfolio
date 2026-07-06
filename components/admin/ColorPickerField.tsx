"use client";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isValid = HEX_RE.test(value);

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={isValid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-border p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#rrggbb"
          className="w-32 rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
        {!isValid && (
          <span className="text-xs text-red-600">Formato #rrggbb</span>
        )}
      </div>
    </div>
  );
}
