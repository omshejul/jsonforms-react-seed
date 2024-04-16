import { rankWith, scopeEndsWith } from '@jsonforms/core';

export const queryBuilder = rankWith(
  1000,
  scopeEndsWith('pre_condition')
);
