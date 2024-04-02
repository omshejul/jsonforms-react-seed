import { rankWith, scopeEndsWith } from '@jsonforms/core';

export const customControlWithButtonTester = rankWith(
  1000,
  scopeEndsWith('apis')
);
