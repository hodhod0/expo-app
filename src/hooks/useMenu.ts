import { useQuery } from '@tanstack/react-query';

import {
  getCategories,
  getItemsByCategory,
  getLanguages,
  getMainCategories,
  getSpecialties,
} from '@/api/menu';

/** TanStack Query wrappers: caching, loading and error states for each endpoint. */
export const useLanguages = () => useQuery({ queryKey: ['languages'], queryFn: getLanguages });

export const useMainCategories = (languageId?: string) =>
  useQuery({
    queryKey: ['mainCategories', languageId],
    queryFn: () => getMainCategories(languageId!),
    enabled: !!languageId,
  });

export const useCategories = (mainCategoryId?: string, languageId?: string) =>
  useQuery({
    queryKey: ['categories', mainCategoryId, languageId],
    queryFn: () => getCategories(mainCategoryId!, languageId!),
    enabled: !!mainCategoryId && !!languageId,
  });

export const useItems = (categoryId?: string, languageId?: string) =>
  useQuery({
    queryKey: ['items', categoryId, languageId],
    queryFn: () => getItemsByCategory(categoryId!, languageId!),
    enabled: !!categoryId && !!languageId,
  });

export const useSpecialties = (languageId?: string) =>
  useQuery({
    queryKey: ['specialties', languageId],
    queryFn: () => getSpecialties(languageId!),
    enabled: !!languageId,
  });
