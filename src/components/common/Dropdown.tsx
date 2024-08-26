import React, { useEffect, useState } from 'react';
import { ReactComponent as MenuDown } from '../../assets/images/down.svg';
import { ReactComponent as MenuUp } from '../../assets/images/up.svg';

interface DropdownProps {
  className?: string;
  options: string[]; // options로는 렌더링마다 바뀌지않는 상태변수 또는 useMemo된 값을 넣어야함.
  defaultValue?: string;
  onSelect?: (value: string) => void;
  iconPosition?: 'right' | 'left';
}

export default function Dropdown({
  className,
  options,
  defaultValue = options[0],
  onSelect,
  iconPosition = 'right',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setIsOpen(false);
    setSelected(defaultValue);
  }, [options, defaultValue]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    if (onSelect) onSelect(value);
    setIsOpen(false);
  };

  return (
    <div
      className={`dropdown ${className}`}
      style={{ textAlign: iconPosition === 'left' ? 'right' : 'left' }}
    >
      <div className="dropdown_head" onClick={handleToggle}>
        {iconPosition === 'left' && (
          <div className="dropdown_icon">{isOpen ? <MenuUp /> : <MenuDown />}</div>
        )}
        <div className={`dropdown_head_value ${selected === defaultValue ? 'is_default' : ''}`}>
          {selected}
        </div>
        {iconPosition !== 'left' && (
          <div className="dropdown_icon">{isOpen ? <MenuUp /> : <MenuDown />}</div>
        )}
      </div>
      {isOpen && options.length > 0 && (
        <ul className="dropdown_list">
          {options
            .filter(option => option !== selected)
            .map((option, idx) => (
              <li key={idx} className="dropdown_list_item" onClick={() => handleSelect(option)}>
                {option}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
