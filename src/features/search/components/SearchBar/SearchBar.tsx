import React from 'react';
import { Search, X, Code, Users } from 'lucide-react';
import { Input } from '../../../../components/ui/Input';
import { Tabs, TabItem } from '../../../../components/ui/Tabs';
import { SearchTabType } from '../../../../hooks/useUrlState';
import styles from './SearchBar.module.css';

const POPULAR_LANGUAGES = [
  'All Languages',
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'PHP',
  'Ruby',
  'Swift',
];

export interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  activeTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  repoCount?: number;
  userCount?: number;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  repoCount,
  userCount,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'repos',
      label: 'Repositories',
      count: repoCount,
      icon: <Code size={16} />,
    },
    {
      id: 'users',
      label: 'Developers',
      count: userCount,
      icon: <Users size={16} />,
    },
  ];

  return (
    <div className={styles.searchSection}>
      <div className={styles.searchBarWrapper}>
        <div className={styles.inputWrapper}>
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              activeTab === 'repos'
                ? 'Search repositories (e.g. react, vite, rust, machine-learning)...'
                : 'Search developers (e.g. torvalds, gaearon, sindresorhus)...'
            }
            leftIcon={<Search size={18} />}
            rightIcon={
              query ? (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className={styles.clearButton}
                  aria-label="Clear search input"
                >
                  <X size={16} />
                </button>
              ) : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div className={styles.filterRow}>
        <Tabs
          items={tabs}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as SearchTabType)}
          ariaLabel="Search Results Type"
        />

        {activeTab === 'repos' && (
          <div className={styles.languageFilter}>
            <label htmlFor="language-select" className={styles.languageLabel}>
              Language:
            </label>
            <select
              id="language-select"
              className={styles.select}
              value={language || 'All Languages'}
              onChange={(e) =>
                onLanguageChange(
                  e.target.value === 'All Languages' ? '' : e.target.value
                )
              }
            >
              {POPULAR_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
