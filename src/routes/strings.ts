import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { analyzeString } from '../utils/stringAnalyzer';
import { stringStore } from '../storage/stringStore';
import { CreateStringRequest, StoredString } from '../types';
import { parseNaturalLanguageQuery, validateFilters } from '../utils/naturalLanguageParser';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body'
      });
    }

    if (!('value' in body)) {
      return res.status(400).json({
        error: 'Missing "value" field'
      });
    }

    if (typeof body.value !== 'string') {
      return res.status(422).json({
        error: 'Invalid data type for "value" (must be string)'
      });
    }

    const { value } = body as CreateStringRequest;

    const properties = analyzeString(value);
    const id = properties.sha256_hash;

    if (stringStore.exists(id)) {
      return res.status(409).json({
        error: 'String already exists in the system'
      });
    }

    const storedString: StoredString = {
      id,
      value,
      properties,
      created_at: new Date().toISOString(),
    };

    stringStore.add(storedString);

    return res.status(201).json(storedString);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

    const filters_applied: any = {};
    let allStrings = stringStore.getAll();

    if (is_palindrome !== undefined) {
      if (is_palindrome !== 'true' && is_palindrome !== 'false') {
        return res.status(400).json({
          error: 'Invalid query parameter values or types'
        });
      }
      const isPalindromeValue = is_palindrome === 'true';
      filters_applied.is_palindrome = isPalindromeValue;
      allStrings = allStrings.filter(s => s.properties.is_palindrome === isPalindromeValue);
    }

    if (min_length !== undefined) {
      const minLengthValue = parseInt(min_length as string);
      if (isNaN(minLengthValue)) {
        return res.status(400).json({
          error: 'Invalid query parameter values or types'
        });
      }
      filters_applied.min_length = minLengthValue;
      allStrings = allStrings.filter(s => s.properties.length >= minLengthValue);
    }

    if (max_length !== undefined) {
      const maxLengthValue = parseInt(max_length as string);
      if (isNaN(maxLengthValue)) {
        return res.status(400).json({
          error: 'Invalid query parameter values or types'
        });
      }
      filters_applied.max_length = maxLengthValue;
      allStrings = allStrings.filter(s => s.properties.length <= maxLengthValue);
    }

    if (word_count !== undefined) {
      const wordCountValue = parseInt(word_count as string);
      if (isNaN(wordCountValue)) {
        return res.status(400).json({
          error: 'Invalid query parameter values or types'
        });
      }
      filters_applied.word_count = wordCountValue;
      allStrings = allStrings.filter(s => s.properties.word_count === wordCountValue);
    }

    if (contains_character !== undefined) {
      if (typeof contains_character !== 'string' || contains_character.length !== 1) {
        return res.status(400).json({
          error: 'Invalid query parameter values or types'
        });
      }
      filters_applied.contains_character = contains_character;
      allStrings = allStrings.filter(s => s.value.includes(contains_character));
    }

    return res.status(200).json({
      data: allStrings,
      count: allStrings.length,
      filters_applied
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/filter-by-natural-language', (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Unable to parse natural language query'
      });
    }

    const originalQuery = query;
    const parsedFilters = parseNaturalLanguageQuery(query);

    if (Object.keys(parsedFilters).length === 0) {
      return res.status(400).json({
        error: 'Unable to parse natural language query'
      });
    }

    const conflictError = validateFilters(parsedFilters);
    if (conflictError) {
      return res.status(422).json({
        error: conflictError
      });
    }

    let allStrings = stringStore.getAll();

    if (parsedFilters.is_palindrome !== undefined) {
      allStrings = allStrings.filter(s => s.properties.is_palindrome === parsedFilters.is_palindrome);
    }

    if (parsedFilters.min_length !== undefined) {
      allStrings = allStrings.filter(s => s.properties.length >= parsedFilters.min_length!);
    }

    if (parsedFilters.max_length !== undefined) {
      allStrings = allStrings.filter(s => s.properties.length <= parsedFilters.max_length!);
    }

    if (parsedFilters.word_count !== undefined) {
      allStrings = allStrings.filter(s => s.properties.word_count === parsedFilters.word_count);
    }

    if (parsedFilters.contains_character !== undefined) {
      allStrings = allStrings.filter(s => s.value.includes(parsedFilters.contains_character!));
    }

    return res.status(200).json({
      data: allStrings,
      count: allStrings.length,
      interpreted_query: {
        original: originalQuery,
        parsed_filters: parsedFilters
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/:string_value', (req: Request, res: Response) => {
  try {
    const { string_value } = req.params;

    const hash = crypto.createHash('sha256').update(string_value).digest('hex');
    const storedString = stringStore.getById(hash);

    if (!storedString) {
      return res.status(404).json({
        error: 'String does not exist in the system'
      });
    }

    return res.status(200).json(storedString);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.delete('/:string_value', (req: Request, res: Response) => {
  try {
    const { string_value } = req.params;

    const hash = crypto.createHash('sha256').update(string_value).digest('hex');
    const deleted = stringStore.delete(hash);

    if (!deleted) {
      return res.status(404).json({
        error: 'String does not exist in the system'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
