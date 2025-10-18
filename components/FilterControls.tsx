
import React from 'react';

const LANGUAGES = ['JavaScript', 'Python', 'Go', 'Rust', 'TypeScript', 'Java', 'C++'];
const DATE_RANGES = ['Last 24 hours', 'Last 7 days', 'Last 30 days'];

interface FilterControlsProps {
  language: string;
  setLanguage: (lang: string) => void;
  dateRange: string;
  setDateRange: (date: string) => void;
  clearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  language,
  setLanguage,
  dateRange,
  setDateRange,
  clearFilters
}) => {
  const hasActiveFilters = language !== '' || dateRange !== '';

  return (
    <div className="mt-4 p-4 bg-brand-secondary border border-border-color rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="language-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Language
          </label>
          <select
            id="language-filter"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-brand-primary border border-border-color text-gray-200 rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Last Commit Date
          </label>
          <select
            id="date-filter"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-brand-primary border border-border-color text-gray-200 rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
          >
            <option value="">Any time</option>
            {DATE_RANGES.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border-color flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Active filters:</span>
                {language && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-brand-accent">
                        {language}
                        <button onClick={() => setLanguage('')} className="flex-shrink-0 ml-1.5 -mr-1 p-0.5 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-800/50 hover:text-blue-300 focus:outline-none">
                            <span className="sr-only">Remove language filter</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8"><path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" /></svg>
                        </button>
                    </span>
                )}
                {dateRange && (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-brand-purple">
                        {dateRange}
                        <button onClick={() => setDateRange('')} className="flex-shrink-0 ml-1.5 -mr-1 p-0.5 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-800/50 hover:text-purple-300 focus:outline-none">
                            <span className="sr-only">Remove date filter</span>
                             <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8"><path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" /></svg>
                        </button>
                    </span>
                )}
            </div>
          <button
            onClick={clearFilters}
            className="text-sm text-brand-accent hover:underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
