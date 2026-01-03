/**
 * Result of processing a single bit through the scrambler.
 */
export interface ProcessResult {
	/** The input bit that was processed */
	inputBit: number;
	/** XOR result from the register taps (feedback) */
	xorResult: number;
	/** Output bit after XOR with input */
	outputBit: number;
	/** New register state after shifting with feedback */
	newRegister: number[];
}

/**
 * Represents a single iteration step in the scrambler/descrambler process.
 */
export interface Step {
	/** Iteration number (1-based) */
	iteration: number;
	/** Input bit processed in this iteration */
	inputBit: number;
	/** Register state before processing */
	registerBefore: number[];
	/** XOR result (feedback) for this iteration */
	xorResult: number;
	/** Output bit (scrambled) for this iteration */
	outputBit: number;
	/** Register state after processing */
	registerAfter: number[];
	/** Accumulated scrambled sequence up to this iteration */
	accumulatedScrambled: string;
	/** Accumulated descrambled sequence up to this iteration */
	accumulatedDescrambled: string;
}

/**
 * Result of input validation.
 */
export interface ValidationResult {
	/** Whether all inputs are valid */
	isValid: boolean;
	/** Array of error messages if validation failed */
	errors: string[];
}

/**
 * Configuration for SVG diagram rendering.
 * Defines positioning and sizing of all SVG elements.
 */
export interface SvgConfig {
	/** Size of register squares in pixels */
	readonly SQUARE_SIZE: number;
	/** Starting X coordinate for register squares */
	readonly START_X: number;
	/** Starting Y coordinate for register squares */
	readonly START_Y: number;
	/** Vertical gap between register squares */
	readonly GAP: number;
	/** X coordinate of scrambler XOR gate circle */
	readonly SCRAMBLER_CIRCLE_X: number;
	/** X coordinate of descrambler XOR gate circle */
	readonly DESCRAMBLER_CIRCLE_X: number;
	/** Y coordinate of top XOR gate circles */
	readonly TOP_CIRCLE_Y: number;
	/** Radius of XOR gate circles */
	readonly CIRCLE_RADIUS: number;
}

/**
 * Form data structure for scrambler input.
 */
export interface ScramblerFormData {
	/** Binary schema string defining register taps */
	schema: string;
	/** Binary register string (converted to number array) */
	register: string;
	/** Binary input string to be processed */
	input: string;
}
