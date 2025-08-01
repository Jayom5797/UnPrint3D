import React from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  colors: { name: string; hex: string; }[];
  onColorSelect: (color: { name: string; hex: string; }) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onColorSelect }) => {
  return (
    <div className="color-picker-wrapper">
      <div className="container-items">
        {colors.map((color) => (
          <button
            key={color.name}
            className="item-color"
            style={{ '--color': color.hex } as React.CSSProperties}
            aria-label={color.name}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

