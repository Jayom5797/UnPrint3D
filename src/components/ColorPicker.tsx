import React from 'react';
import './ColorPicker.css';

import { ProductColor } from '../types';

interface ColorPickerProps {
  colors: ProductColor[];
  onColorSelect: (color: ProductColor) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onColorSelect }) => {
  return (
    <div className="color-picker-wrapper">
      <div className="container-items">
        {colors.map((color) => (
          <button
            key={color.name}
            className="item-color"
            style={{ '--color': color.hex_code } as React.CSSProperties}
            aria-label={color.name}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

