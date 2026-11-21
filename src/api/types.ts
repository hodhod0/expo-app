/**
 * Raw rows returned by the bomain API.
 * Field names are kept as the backend sends them; tighten these types once
 * we have real sample responses (see Digital-Menu/src/Models/api.js).
 */
export type ApiRow = Record<string, unknown>;

export type MainCategoryRow = ApiRow;
export type CategoryRow = ApiRow;
export type ItemRow = ApiRow;
export type LanguageRow = ApiRow;
export type SpecialtyRow = ApiRow;
export type CompanyRow = ApiRow;
