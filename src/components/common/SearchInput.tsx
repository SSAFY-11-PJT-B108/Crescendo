import React from 'react';
import { ReactComponent as Search } from '../../assets/images/search.svg';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  className?: string;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  onSearch,
  className,
}: InputProps) {
  return (
    <div className={`${className} search-container`}>
      <span>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="search-input"
          onKeyUp={event => {
            if (event.key === 'Enter' && onSearch) {
              onSearch();
            }
          }}
        />
        <div className="search-icon" onClick={onSearch}>
          <Search />
        </div>
      </span>
    </div>
  );
}
