export type CompletionCategory = {
  key: string;
  label: string;
  completed: number;
  required: number;
};

export function getCompletionPercent(categories: CompletionCategory[]) {
  const required = categories.reduce((sum, category) => sum + category.required, 0);
  const completed = categories.reduce((sum, category) => sum + Math.min(category.completed, category.required), 0);

  if (required === 0) {
    return 100;
  }

  return Math.round((completed / required) * 100);
}

export function getMissingCategories(categories: CompletionCategory[]) {
  return categories.filter((category) => category.completed < category.required);
}

