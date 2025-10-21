interface ParsedFilters {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
}

export function parseNaturalLanguageQuery(query: string): ParsedFilters {
  const lowerQuery = query.toLowerCase();
  const filters: ParsedFilters = {};

  if (lowerQuery.includes('palindrome') || lowerQuery.includes('palindromic')) {
    filters.is_palindrome = true;
  }

  const singleWordMatch = lowerQuery.match(/\b(single|one)\s+word\b/);
  if (singleWordMatch) {
    filters.word_count = 1;
  }

  const wordCountMatch = lowerQuery.match(/\b(\d+)\s+words?\b/);
  if (wordCountMatch) {
    filters.word_count = parseInt(wordCountMatch[1]);
  }

  const longerThanMatch = lowerQuery.match(/\blonger\s+than\s+(\d+)(\s+characters?)?\b/);
  if (longerThanMatch) {
    filters.min_length = parseInt(longerThanMatch[1]) + 1;
  }

  const shorterThanMatch = lowerQuery.match(/\bshorter\s+than\s+(\d+)(\s+characters?)?\b/);
  if (shorterThanMatch) {
    filters.max_length = parseInt(shorterThanMatch[1]) - 1;
  }

  const atLeastMatch = lowerQuery.match(/\bat\s+least\s+(\d+)\s+characters?\b/);
  if (atLeastMatch) {
    filters.min_length = parseInt(atLeastMatch[1]);
  }

  const atMostMatch = lowerQuery.match(/\bat\s+most\s+(\d+)\s+characters?\b/);
  if (atMostMatch) {
    filters.max_length = parseInt(atMostMatch[1]);
  }

  const containsLetterMatch = lowerQuery.match(/\bcontains?\s+(?:the\s+)?(?:letter\s+)?([a-z])\b/);
  if (containsLetterMatch) {
    filters.contains_character = containsLetterMatch[1];
  }

  const firstVowelMatch = lowerQuery.match(/\bfirst\s+vowel\b/);
  if (firstVowelMatch) {
    filters.contains_character = 'a';
  }

  return filters;
}

export function validateFilters(filters: ParsedFilters): string | null {
  if (filters.min_length !== undefined && filters.max_length !== undefined) {
    if (filters.min_length > filters.max_length) {
      return 'Query parsed but resulted in conflicting filters';
    }
  }

  return null;
}
