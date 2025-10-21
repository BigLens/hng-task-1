import crypto from 'crypto';
import { StringProperties } from '../types';

export function analyzeString(value: string): StringProperties {
  const length = value.length;
  const is_palindrome = isPalindrome(value);
  const unique_characters = countUniqueCharacters(value);
  const word_count = countWords(value);
  const sha256_hash = generateSHA256(value);
  const character_frequency_map = buildCharacterFrequencyMap(value);

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
}

function isPalindrome(str: string): boolean {
  const normalized = str.toLowerCase();
  const reversed = normalized.split('').reverse().join('');
  return normalized === reversed;
}

function countUniqueCharacters(str: string): number {
  const uniqueChars = new Set(str);
  return uniqueChars.size;
}

function countWords(str: string): number {
  const words = str.trim().split(/\s+/);
  return words.length === 1 && words[0] === '' ? 0 : words.length;
}

function generateSHA256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function buildCharacterFrequencyMap(str: string): Record<string, number> {
  const frequencyMap: Record<string, number> = {};
  
  for (const char of str) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }
  
  return frequencyMap;
}
