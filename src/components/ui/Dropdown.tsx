/**
 * Dropdown Menu Component
 */

import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxHeight?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  triggerClassName,
  menuClassName,
  disabled = false,
  searchable = false,
  maxHeight = '240px',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const triggerContent = (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => !disabled && setIsOpen(!isOpen)}
      disabled={disabled}
      className={cn(
        'flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all duration-200',
        'bg-white dark:bg-gray-800',
        'text-left',
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        triggerClassName
      )}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={placeholder}
    >
      <span className={cn('truncate', selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500')}>
        {selectedOption?.label || placeholder}
      </span>
      <ChevronDown
        className={cn(
          'h-5 w-5 text-gray-400 flex-shrink-0 ml-2 transition-transform',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );

  const menuContent = (
    <div
      ref={menuRef}
      className={cn(
        'absolute z-50 mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800 shadow-elevated overflow-hidden animate-fade-in',
        menuClassName
      )}
      style={{ maxHeight }}
      role="listbox"
      aria-label={placeholder}
    >
      {searchable && (
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>
      )}
      <div className="py-1 max-h-[200px] overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 text-sm">
            No options found
          </div>
        ) : (
          filteredOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                setSearchQuery('');
              }}
              disabled={option.disabled}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                'w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors',
                option.value === value
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              <span className="truncate flex-1">{option.label}</span>
              {option.value === value && <Check className="h-4 w-4 flex-shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className="relative inline-block w-full">{triggerContent}</div>
      {isOpen && createPortal(menuContent, document.body)}
    </Fragment>
  );
}

interface SimpleSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SimpleSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: SimpleSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border transition-all duration-200 appearance-none',
        'bg-white dark:bg-gray-800',
        'text-gray-900 dark:text-white',
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        className
      )}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}