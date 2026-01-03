import type { SvgConfig } from './types';

/**
 * Default binary schema for the scrambler.
 * Defines which register bits are connected to XOR operation.
 */
export const DEFAULT_SCHEMA: string = '0101000100';

/**
 * Default initial state of the scrambler shift register.
 * Length must match DEFAULT_SCHEMA length.
 */
export const DEFAULT_REGISTER: readonly number[] = [
	1, 0, 1, 1, 0, 0, 1, 0, 1, 0,
] as const;

/**
 * Default binary input string for processing.
 */
export const DEFAULT_INPUT: string = '10110001';

/**
 * SVG configuration for diagram rendering.
 * Defines sizes, positions, and spacing of SVG elements.
 */
export const SVG_CONFIG: Readonly<SvgConfig> = {
	SQUARE_SIZE: 40,
	START_X: 180,
	START_Y: 100,
	GAP: 40,
	SCRAMBLER_CIRCLE_X: 105,
	DESCRAMBLER_CIRCLE_X: 500,
	TOP_CIRCLE_Y: 25,
	CIRCLE_RADIUS: 20,
} as const;

/**
 * SVG layout constants for positioning elements.
 * Contains offsets, widths, heights, and spacing values.
 */
export const SVG_LAYOUT = {
	DESCRAMBLER_OFFSET_X: 200,
	CONNECTION_Y: 70,
	SCRAMBLER_CONNECTION_X: 200,
	DESCRAMBLER_CONNECTION_X: 400,
	TOP_PADDING: 15,
	SVG_WIDTH: 600,
	DATA_FLOW_START_X: 5,
	DATA_FLOW_END_X: 590,
	TEXT_Y_OFFSET: 3,
	FIXED_ARROW_LENGTH: 85,
	MARKER_SIZE: 10,
	GAP_BETWEEN_ELEMENTS: 5,
	TEXT_OFFSET_X: 5,
	TEXT_POSITION_OFFSET: 60,
	VALUES_Y_OFFSET: 40,
	SVG_HEIGHT_OFFSET: 80,
} as const;

/**
 * Text positioning constants for labels and values in SVG.
 */
export const SVG_TEXT_POSITIONS = {
	SCRAMBLER_LABEL_X: 160,
	DESCRAMBLER_LABEL_X: 360,
	FIRST_SCRAMBLE_X: 110,
	SECOND_SCRAMBLE_X: 485,
	SCRAMBLE_Y: 88,
} as const;
