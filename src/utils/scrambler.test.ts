import { describe, it, expect } from 'vitest';
import {
	generateScramblerSteps,
	processBit,
	getSchemaIndices,
	calculateXorFromIndices,
	shiftRegister,
} from './scrambler';

describe('Scrambler Utility Functions', () => {
	describe('getSchemaIndices', () => {
		it('should extract indices where schema has 1', () => {
			expect(getSchemaIndices('1011')).toEqual([0, 2, 3]);
			expect(getSchemaIndices('0100')).toEqual([1]);
			expect(getSchemaIndices('1111')).toEqual([0, 1, 2, 3]);
			expect(getSchemaIndices('0000')).toEqual([]);
		});
	});

	describe('calculateXorFromIndices', () => {
		it('should calculate XOR of register bits at specified indices', () => {
			expect(calculateXorFromIndices([1, 0, 1, 1], [0, 2, 3])).toBe(1);
			expect(calculateXorFromIndices([1, 0, 1, 1], [0])).toBe(1);
			expect(calculateXorFromIndices([1, 0, 1, 1], [1, 2])).toBe(1);
			expect(calculateXorFromIndices([0, 0, 0, 0], [0, 1, 2, 3])).toBe(0);
		});
	});

	describe('shiftRegister', () => {
		it('should shift register left and insert new bit', () => {
			expect(shiftRegister([1, 0, 1, 1], 0)).toEqual([0, 1, 0, 1]);
			expect(shiftRegister([1, 0, 1, 1], 1)).toEqual([1, 1, 0, 1]);
			expect(shiftRegister([0, 0, 0, 0], 1)).toEqual([1, 0, 0, 0]);
		});
	});

	describe('processBit', () => {
		it('should process a single bit correctly', () => {
			const result = processBit(1, [1, 0, 1, 1], '1011');
			expect(result.inputBit).toBe(1);
			expect(result.outputBit).toBeGreaterThanOrEqual(0);
			expect(result.outputBit).toBeLessThanOrEqual(1);
			expect(result.newRegister).toHaveLength(4);
		});
	});
});

describe('generateScramblerSteps - Test Cases', () => {
	describe('Test Case 1: 2 bits input', () => {
		const schema = '11';
		const initialRegister = [1, 1];
		const input = '01';

		it('should process all 2 bits', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps).toHaveLength(2);
		});

		it('should process bits from right to left (LSB first)', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps[0]?.inputBit).toBe(1);
			expect(steps[1]?.inputBit).toBe(0);
		});

		it('should generate scrambled output', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalScrambled = steps[steps.length - 1]?.accumulatedScrambled;
			expect(finalScrambled).toHaveLength(2);
			expect(finalScrambled).toMatch(/^[01]{2}$/);
		});

		it('should correctly descramble back to original input', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalDescrambled = steps[steps.length - 1]?.accumulatedDescrambled;
			expect(finalDescrambled).toBe(input);
		});

		it('should have correct step structure', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			steps.forEach((step, index) => {
				expect(step.iteration).toBe(index + 1);
				expect(step.inputBit).toBeGreaterThanOrEqual(0);
				expect(step.inputBit).toBeLessThanOrEqual(1);
				expect(step.outputBit).toBeGreaterThanOrEqual(0);
				expect(step.outputBit).toBeLessThanOrEqual(1);
				expect(step.xorResult).toBeGreaterThanOrEqual(0);
				expect(step.xorResult).toBeLessThanOrEqual(1);
				expect(step.registerBefore).toHaveLength(2);
				expect(step.registerAfter).toHaveLength(2);
				expect(step.accumulatedScrambled).toHaveLength(index + 1);
				expect(step.accumulatedDescrambled).toHaveLength(index + 1);
			});
		});
	});

	describe('Test Case 2: 4 bits input', () => {
		const schema = '1011';
		const initialRegister = [1, 0, 1, 1];
		const input = '1100';

		it('should process all 4 bits', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps).toHaveLength(4);
		});

		it('should process bits from right to left (LSB first)', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps[0]?.inputBit).toBe(0);
			expect(steps[1]?.inputBit).toBe(0);
			expect(steps[2]?.inputBit).toBe(1);
			expect(steps[3]?.inputBit).toBe(1);
		});

		it('should generate scrambled output', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalScrambled = steps[steps.length - 1]?.accumulatedScrambled;
			expect(finalScrambled).toHaveLength(4);
			expect(finalScrambled).toMatch(/^[01]{4}$/);
		});

		it('should correctly descramble back to original input', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalDescrambled = steps[steps.length - 1]?.accumulatedDescrambled;
			expect(finalDescrambled).toBe(input);
		});

		it('should have correct step structure', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			steps.forEach((step, index) => {
				expect(step.iteration).toBe(index + 1);
				expect(step.registerBefore).toHaveLength(4);
				expect(step.registerAfter).toHaveLength(4);
				expect(step.accumulatedScrambled).toHaveLength(index + 1);
				expect(step.accumulatedDescrambled).toHaveLength(index + 1);
			});
		});
	});

	describe('Test Case 3: 8 bits input', () => {
		const schema = '1011';
		const initialRegister = [1, 0, 1, 1];
		const input = '10101010';

		it('should process all 8 bits', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps).toHaveLength(8);
		});

		it('should process bits from right to left (LSB first)', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps[0]?.inputBit).toBe(0);
			expect(steps[1]?.inputBit).toBe(1);
			expect(steps[2]?.inputBit).toBe(0);
			expect(steps[3]?.inputBit).toBe(1);
			expect(steps[4]?.inputBit).toBe(0);
			expect(steps[5]?.inputBit).toBe(1);
			expect(steps[6]?.inputBit).toBe(0);
			expect(steps[7]?.inputBit).toBe(1);
		});

		it('should generate scrambled output', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalScrambled = steps[steps.length - 1]?.accumulatedScrambled;
			expect(finalScrambled).toHaveLength(8);
			expect(finalScrambled).toMatch(/^[01]{8}$/);
		});

		it('should correctly descramble back to original input', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalDescrambled = steps[steps.length - 1]?.accumulatedDescrambled;
			expect(finalDescrambled).toBe(input);
		});

		it('should have correct step structure', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			steps.forEach((step, index) => {
				expect(step.iteration).toBe(index + 1);
				expect(step.registerBefore).toHaveLength(4);
				expect(step.registerAfter).toHaveLength(4);
				expect(step.accumulatedScrambled).toHaveLength(index + 1);
				expect(step.accumulatedDescrambled).toHaveLength(index + 1);
			});
		});
	});

	describe('Test Case 4: 16 bits input', () => {
		const schema = '10001001';
		const initialRegister = [1, 0, 0, 0, 1, 0, 0, 1];
		const input = '1111000011110000';

		it('should process all 16 bits', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps).toHaveLength(16);
		});

		it('should process bits from right to left (LSB first)', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			expect(steps[0]?.inputBit).toBe(0);
			expect(steps[1]?.inputBit).toBe(0);
			expect(steps[2]?.inputBit).toBe(0);
			expect(steps[3]?.inputBit).toBe(0);
			expect(steps[4]?.inputBit).toBe(1);
			expect(steps[5]?.inputBit).toBe(1);
			expect(steps[6]?.inputBit).toBe(1);
			expect(steps[7]?.inputBit).toBe(1);
			expect(steps[8]?.inputBit).toBe(0);
			expect(steps[9]?.inputBit).toBe(0);
			expect(steps[10]?.inputBit).toBe(0);
			expect(steps[11]?.inputBit).toBe(0);
			expect(steps[12]?.inputBit).toBe(1);
			expect(steps[13]?.inputBit).toBe(1);
			expect(steps[14]?.inputBit).toBe(1);
			expect(steps[15]?.inputBit).toBe(1);
		});

		it('should generate scrambled output', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalScrambled = steps[steps.length - 1]?.accumulatedScrambled;
			expect(finalScrambled).toHaveLength(16);
			expect(finalScrambled).toMatch(/^[01]{16}$/);
		});

		it('should correctly descramble back to original input', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			const finalDescrambled = steps[steps.length - 1]?.accumulatedDescrambled;
			expect(finalDescrambled).toBe(input);
		});

		it('should have correct step structure', () => {
			const steps = generateScramblerSteps(input, initialRegister, schema);
			steps.forEach((step, index) => {
				expect(step.iteration).toBe(index + 1);
				expect(step.registerBefore).toHaveLength(8);
				expect(step.registerAfter).toHaveLength(8);
				expect(step.accumulatedScrambled).toHaveLength(index + 1);
				expect(step.accumulatedDescrambled).toHaveLength(index + 1);
			});
		});
	});
});

describe('generateScramblerSteps - Edge Cases', () => {
	it('should return empty array for empty input', () => {
		const steps = generateScramblerSteps('', [1, 0, 1, 1], '1011');
		expect(steps).toEqual([]);
	});

	it('should throw error for empty schema', () => {
		expect(() => {
			generateScramblerSteps('1011', [1, 0, 1, 1], '');
		}).toThrow('Schema cannot be empty');
	});

	it('should throw error for empty register', () => {
		expect(() => {
			generateScramblerSteps('1011', [], '1011');
		}).toThrow('Initial register cannot be empty');
	});

	it('should throw error for length mismatch', () => {
		expect(() => {
			generateScramblerSteps('1011', [1, 0, 1], '1011');
		}).toThrow('Schema and register lengths must match');
	});

	it('should throw error for invalid input bit', () => {
		expect(() => {
			generateScramblerSteps('1021', [1, 0, 1, 1], '1011');
		}).toThrow('Invalid input bit');
	});
});

describe('Scrambler-Descrambler Integration', () => {
	it('should maintain scrambler-descrambler consistency for all test cases', () => {
		const testCases = [
			{
				schema: '11',
				register: [1, 1],
				input: '01',
			},
			{
				schema: '1011',
				register: [1, 0, 1, 1],
				input: '1100',
			},
			{
				schema: '1011',
				register: [1, 0, 1, 1],
				input: '10101010',
			},
			{
				schema: '10001001',
				register: [1, 0, 0, 0, 1, 0, 0, 1],
				input: '1111000011110000',
			},
		];

		testCases.forEach(({ schema, register, input }) => {
			const steps = generateScramblerSteps(input, register, schema);
			const finalDescrambled = steps[steps.length - 1]?.accumulatedDescrambled;
			expect(finalDescrambled).toBe(input);
		});
	});

	it('should ensure descrambled output matches input for various inputs', () => {
		const schema = '1011';
		const register = [1, 0, 1, 1];
		const testInputs = ['0000', '1111', '0101', '1010', '00001111'];

		testInputs.forEach(input => {
			const steps = generateScramblerSteps(input, register, schema);
			const finalDescrambled = steps[steps.length - 1]?.accumulatedDescrambled;
			expect(finalDescrambled).toBe(input);
		});
	});
});

