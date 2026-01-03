import type { ValidationResult } from './types';

/**
 * Validates that a string contains only binary digits (0 and 1).
 *
 * @param str - The string to validate
 * @returns `true` if the string contains only '0' and '1', `false` otherwise
 *
 * @example
 * validateBinaryString('1011') // true
 * validateBinaryString('1012') // false
 */
export function validateBinaryString(str: string): boolean {
	return /^[01]*$/.test(str);
}

/**
 * Validates a scrambler schema string.
 * A valid schema must be non-empty and contain only binary digits.
 *
 * @param schema - The schema string to validate
 * @returns `true` if the schema is valid, `false` otherwise
 *
 * @example
 * validateSchema('1011') // true
 * validateSchema('') // false
 */
export function validateSchema(schema: string): boolean {
	return validateBinaryString(schema) && schema.length > 0;
}

/**
 * Validates that all elements in a register array are binary digits (0 or 1).
 *
 * @param register - Array of register bits (numbers or strings)
 * @returns `true` if all bits are 0 or 1, `false` otherwise
 *
 * @example
 * validateRegister([1, 0, 1, 1]) // true
 * validateRegister([1, 0, 2]) // false
 */
export function validateRegister(register: number[] | string[]): boolean {
	return register.every((bit: number | string) => {
		if (typeof bit === 'string') {
			return bit === '0' || bit === '1';
		}
		return bit === 0 || bit === 1;
	});
}

/**
 * Validates that schema and register have matching lengths.
 *
 * @param schema - The schema string
 * @param register - The register array
 * @returns `true` if lengths match, `false` otherwise
 *
 * @example
 * validateSchemaRegisterMatch('1011', [1, 0, 1, 1]) // true
 * validateSchemaRegisterMatch('101', [1, 0, 1, 1]) // false
 */
export function validateSchemaRegisterMatch(
	schema: string,
	register: number[]
): boolean {
	return schema.length === register.length;
}

/**
 * Removes all non-binary characters from a string, keeping only '0' and '1'.
 *
 * @param input - The input string to normalize
 * @returns String containing only '0' and '1' characters
 *
 * @example
 * normalizeBinaryInput('101a2b3') // '101'
 */
export function normalizeBinaryInput(input: string): string {
	return input.replace(/[^01]/g, '');
}

/**
 * Validates all scrambler inputs (schema, register, input string).
 * Performs comprehensive validation and returns all errors found.
 *
 * @param schema - Binary schema string
 * @param register - Array of register bits
 * @param input - Binary input string to process
 * @returns Validation result object with `isValid` flag and array of error messages
 *
 * @example
 * const result = validateInputs('1011', [1, 0, 1, 1], '1100');
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */
export function validateInputs(
	schema: string,
	register: number[],
	input: string
): ValidationResult {
	const errors: string[] = [];

	if (!validateSchema(schema)) {
		errors.push('Схема має містити тільки 0 та 1');
	}

	if (!validateRegister(register)) {
		errors.push('Регістр зсуву має містити тільки 0 та 1');
	}

	if (!validateBinaryString(input)) {
		errors.push('Вхідна стрічка має містити тільки 0 та 1');
	}

	if (
		schema.length > 0 &&
		register.length > 0 &&
		!validateSchemaRegisterMatch(schema, register)
	) {
		errors.push('Розміри схеми та регістру зсуву мають співпадати');
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
