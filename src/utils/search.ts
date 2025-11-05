/**
 * Search utilities for polls
 */

import { Poll } from '../services/pollsService';

/**
 * Søk i avstemninger basert på søkeord
 */
export const searchPolls = (polls: Poll[], searchTerm: string): Poll[] => {
  if (!searchTerm || searchTerm.trim() === '') {
    return polls;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return polls.filter(poll => {
    const titleMatch = poll.title.toLowerCase().includes(term);
    const descriptionMatch = poll.description?.toLowerCase().includes(term) || false;
    const categoryMatch = poll.category?.toLowerCase().includes(term) || false;
    const districtMatch = poll.district?.toLowerCase().includes(term) || false;
    const optionsMatch = poll.options.some(option => 
      option.toLowerCase().includes(term)
    );

    return titleMatch || descriptionMatch || categoryMatch || districtMatch || optionsMatch;
  });
};

/**
 * Filtrer avstemninger basert på kategori
 */
export const filterPollsByCategory = (polls: Poll[], category: string | null): Poll[] => {
  if (!category) {
    return polls;
  }

  return polls.filter(poll => poll.category === category);
};

/**
 * Filtrer avstemninger basert på bydel
 */
export const filterPollsByDistrict = (polls: Poll[], district: string | null): Poll[] => {
  if (!district) {
    return polls;
  }

  return polls.filter(poll => poll.district === district);
};

/**
 * Kombinert søk og filter
 */
export const searchAndFilterPolls = (
  polls: Poll[],
  searchTerm: string,
  category: string | null = null,
  district: string | null = null
): Poll[] => {
  let filtered = polls;

  if (searchTerm) {
    filtered = searchPolls(filtered, searchTerm);
  }

  if (category) {
    filtered = filterPollsByCategory(filtered, category);
  }

  if (district) {
    filtered = filterPollsByDistrict(filtered, district);
  }

  return filtered;
};

