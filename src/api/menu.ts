import { config } from '@/config';

import { api } from './client';
import type {
  CategoryRow,
  CompanyRow,
  ItemRow,
  LanguageRow,
  MainCategoryRow,
  SpecialtyRow,
} from './types';

/**
 * Menu endpoints — mirrors Digital-Menu/src/Models/api.js.
 * `languageId` is the backend's `la_id` (from getLanguages), not "en"/"ar".
 */
const cp = () => config.companyId;

export async function getLanguages() {
  const { data } = await api.get<LanguageRow[]>('dm_language/seldm_language_with_company', {
    params: { la_cp_id: cp() },
  });
  return data;
}

export async function getCompany() {
  const { data } = await api.get<CompanyRow[]>('dm_company/selcompany', { params: { cp_id: cp() } });
  return data;
}

export async function getMainCategories(languageId: string) {
  const { data } = await api.get<MainCategoryRow[]>(
    'dm_maincategory/seldm_maincategorywithlanguage',
    { params: { mc_cp_id: cp(), mc_la_id: languageId } },
  );
  return data;
}

export async function getCategories(mainCategoryId: string, languageId: string) {
  const { data } = await api.get<CategoryRow[]>('dm_category/seldm_category', {
    params: { ca_mc_id: mainCategoryId, ca_cp_id: cp(), ca_la_id: languageId },
  });
  return data;
}

export async function getItemsByCategory(categoryId: string, languageId: string) {
  const { data } = await api.get<ItemRow[]>('dm_item/seldm_item_with_category_where_inActive', {
    params: { dt_cp_id: cp(), dt_ca_id: categoryId, dt_la_id: languageId },
  });
  return data;
}

export async function getSpecialties(languageId: string) {
  const { data } = await api.get<SpecialtyRow[]>(
    'dm_specialties/seldm_specialties_with_price_item',
    { params: { dt_cp_id: cp(), sp_cp_id: cp(), sp_la_id: languageId } },
  );
  return data;
}
