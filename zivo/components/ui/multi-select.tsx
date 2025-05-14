import { Checkbox } from "./checkbox"

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export const MultiSelect = ({ options, selected, onChange, placeholder }: Props) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="border rounded p-2 max-h-40 overflow-y-auto">
      {options.length === 0 && <p className="text-sm text-muted-foreground">{placeholder || "Seçenek bulunamadı."}</p>}
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer py-1">
          <Checkbox checked={selected.includes(opt.value)} onCheckedChange={() => handleToggle(opt.value)} />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
