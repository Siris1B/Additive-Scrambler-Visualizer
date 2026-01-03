import { describe, it, expect } from 'vitest';
import {
	validateBinaryString,
	validateSchema,
	validateRegister,
	validateSchemaRegisterMatch,
	normalizeBinaryInput,
	validateInputs,
} from './validation';

describe('Validation Utility Functions', () => {
	describe('validateBinaryString', () => {
		it('should return true for valid binary strings', () => {
			expect(validateBinaryString('1011')).toBe(true);
			expect(validateBinaryString('0000')).toBe(true);
			expect(validateBinaryString('111111')).toBe(true);
			expect(validateBinaryString('')).toBe(true);
		});

		it('should return false for invalid binary strings', () => {
			expect(validateBinaryString('1012')).toBe(false);
			expect(validateBinaryString('abc')).toBe(false);
			expect(validateBinaryString('101a')).toBe(false);
		});
	});

	describe('validateSchema', () => {
		it('should return true for valid schemas', () => {
			expect(validateSchema('1011')).toBe(true);
			expect(validateSchema('1')).toBe(true);
		});

		it('should return false for invalid schemas', () => {
			expect(validateSchema('')).toBe(false);
			expect(validateSchema('1012')).toBe(false);
			expect(validateSchema('abc')).toBe(false);
		});
	});

	describe('validateRegister', () => {
		it('should return true for valid registers with numbers', () => {
			expect(validateRegister([1, 0, 1, 1])).toBe(true);
			expect(validateRegister([0, 0, 0])).toBe(true);
			expect(validateRegister([1])).toBe(true);
			expect(validateRegister([0])).toBe(true);
		});

		it('should return true for valid registers with strings', () => {
			expect(validateRegister(['1', '0', '1'])).toBe(true);
			expect(validateRegister(['0', '0', '0'])).toBe(true);
			expect(validateRegister(['1'])).toBe(true);
		});

		it('should return false for invalid registers with numbers', () => {
			expect(validateRegister([1, 0, 2])).toBe(false);
			expect(validateRegister([1, 0, 3])).toBe(false);
			expect(validateRegister([5])).toBe(false);
		});

		it('should return false for invalid registers with strings', () => {
			expect(validateRegister(['1', '0', '2'])).toBe(false);
			expect(validateRegister(['a', 'b', 'c'])).toBe(false);
			expect(validateRegister(['1', '2', '3'])).toBe(false);
		});
	});

	describe('validateSchemaRegisterMatch', () => {
		it('should return true when lengths match', () => {
			expect(validateSchemaRegisterMatch('1011', [1, 0, 1, 1])).toBe(true);
			expect(validateSchemaRegisterMatch('1', [1])).toBe(true);
		});

		it('should return false when lengths do not match', () => {
			expect(validateSchemaRegisterMatch('1011', [1, 0])).toBe(false);
			expect(validateSchemaRegisterMatch('1', [1, 0])).toBe(false);
		});
	});

	describe('normalizeBinaryInput', () => {
		it('should remove non-binary characters', () => {
			expect(normalizeBinaryInput('101a2b3')).toBe('101');
			expect(normalizeBinaryInput('1011')).toBe('1011');
			expect(normalizeBinaryInput('abc')).toBe('');
		});
	});

	describe('validateInputs', () => {
		it('should return valid for correct inputs', () => {
			const result = validateInputs('1011', [1, 0, 1, 1], '1100');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should return errors for invalid schema', () => {
			const result = validateInputs('1012', [1, 0, 1, 1], '1100');
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should return errors for invalid register', () => {
			const result = validateInputs('1011', [1, 0, 2, 1], '1100');
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should return errors for invalid input string', () => {
			const result = validateInputs('1011', [1, 0, 1, 1], '11a0');
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should detect length mismatch', () => {
			const result = validateInputs('1011', [1, 0], '1100');
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should return multiple errors when multiple validations fail', () => {
			const result = validateInputs('1012', [1, 0, 2], '11a0');
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(1);
		});
	});
});

