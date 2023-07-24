import React, { useState } from "react";

interface SliderProps<T extends number | number[]> {
  min: number;
  max: number;
  step?: number;
  defaultValue?: T;
  onChange: (value: T |number | string |readonly string[]) => void;
}

function Slider<T extends number | string |readonly string[]>({
  min,
  max,
  step = 1,
  defaultValue,
  onChange,
}: SliderProps<number | number[]>) {
  const [value, setValue] = useState<T>(defaultValue as T);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value as any as T;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-4 bg-gray-300 rounded-full appearance-none"
      />
    </div>
  );
}

export default Slider;
