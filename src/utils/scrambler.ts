import type { ProcessResult, Step } from './types';

/**
 * Extracts indices from schema where value is '1'.
 * These indices represent register positions connected to XOR operation.
 *
 * @param schema - Binary schema string (e.g., '1011' means taps at positions 0, 2, 3)
 * @returns Array of indices where schema has '1'
 *
 * @example
 * getSchemaIndices('1011') // [0, 2, 3]
 * getSchemaIndices('0100') // [1]
 */
export function getSchemaIndices(schema: string): number[] {
	return Array.from(schema)
		.map((value: string, index: number) => (value === '1' ? index : -1))
		.filter((index: number) => index !== -1);
}

/**
 * Calculates XOR of register bits at specified indices.
 * This represents the feedback value for the scrambler/descrambler.
 *
 * @param register - Current state of the shift register
 * @param indices - Array of register positions to XOR (tap positions)
 * @returns XOR result of all tapped register bits (0 or 1)
 *
 * @example
 * calculateXorFromIndices([1, 0, 1, 1], [0, 2, 3]) // 1 XOR 1 XOR 1 = 1
 */
export function calculateXorFromIndices(
	register: readonly number[],
	indices: readonly number[]
): number {
	return indices.reduce(
		(acc: number, index: number) => acc ^ register[index],
		0
	);
}

/**
 * Shifts the register left and inserts a new bit at the beginning.
 * The rightmost bit is discarded.
 *
 * @param register - Current register state
 * @param newBit - Bit to insert at the beginning (leftmost position)
 * @returns New register state after shift
 *
 * @example
 * shiftRegister([1, 0, 1, 1], 0) // [0, 1, 0, 1]
 */
export function shiftRegister(
	register: readonly number[],
	newBit: number
): number[] {
	return [newBit, ...register.slice(0, register.length - 1)];
}

/**
 * Processes a single input bit through the scrambler.
 * Calculates XOR feedback, scrambles the input bit, and shifts the register.
 *
 * @param inputBit - Input bit to process (0 or 1)
 * @param register - Current state of the shift register
 * @param schema - Binary schema string defining register taps
 * @returns Process result containing XOR result, output bit, and new register state
 *
 * @example
 * const result = processBit(1, [1, 0, 1, 1], '1011');
 * // Returns: { inputBit: 1, xorResult: 1, outputBit: 0, newRegister: [1, 1, 0, 1] }
 */
export function processBit(
	inputBit: number,
	register: readonly number[],
	schema: string
): ProcessResult {
	const indices: number[] = getSchemaIndices(schema);
	const xorResult: number = calculateXorFromIndices(register, indices);
	const outputBit: number = inputBit ^ xorResult;
	const newRegister: number[] = shiftRegister(register, xorResult);

	return {
		inputBit,
		xorResult,
		outputBit,
		newRegister,
	};
}

/**
 * Generates all processing steps for an input string through the scrambler.
 * Processing occurs from right to left (LSB first).
 * Each step includes scrambler and descrambler states.
 *
 * @param input - Binary input string to process
 * @param initialRegister - Initial state of the scrambler shift register
 * @param schema - Binary schema string defining register taps
 * @returns Array of steps, one for each input bit
 * @throws {Error} If input is invalid, schema/register are empty, or lengths don't match
 *
 * @example
 * const steps = generateScramblerSteps('1011', [1, 0, 1, 1], '1011');
 * // Returns array of 4 steps, one for each bit
 */
export function generateScramblerSteps(
	input: string,
	initialRegister: readonly number[],
	schema: string
): Step[] {
	if (!input || input.length === 0) {
		return [];
	}

	if (!schema || schema.length === 0) {
		throw new Error('Schema cannot be empty');
	}

	if (!initialRegister || initialRegister.length === 0) {
		throw new Error('Initial register cannot be empty');
	}

	if (schema.length !== initialRegister.length) {
		throw new Error('Schema and register lengths must match');
	}

	const steps: Step[] = [];
	let currentRegister: number[] = [...initialRegister];
	let accumulatedScrambled: string = '';
	let accumulatedDescrambled: string = '';

	for (let i = 0; i < input.length; i++) {
		const inputBitIndex: number = input.length - i - 1;
		const inputBitStr: string = input[inputBitIndex];

		if (inputBitStr !== '0' && inputBitStr !== '1') {
			throw new Error(
				`Invalid input bit at index ${inputBitIndex}: ${inputBitStr}`
			);
		}

		const inputBit: number = Number(inputBitStr);

		const result: ProcessResult = processBit(inputBit, currentRegister, schema);
		const descrambledBit: number = result.outputBit ^ result.xorResult;

		accumulatedScrambled = String(result.outputBit) + accumulatedScrambled;
		accumulatedDescrambled = String(descrambledBit) + accumulatedDescrambled;

		steps.push({
			iteration: i + 1,
			inputBit: result.inputBit,
			registerBefore: [...currentRegister],
			xorResult: result.xorResult,
			outputBit: result.outputBit,
			registerAfter: result.newRegister,
			accumulatedScrambled,
			accumulatedDescrambled,
		});

		currentRegister = result.newRegister;
	}

	return steps;
}
