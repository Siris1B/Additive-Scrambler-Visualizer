import React, { useMemo } from 'react';
import { getSchemaIndices } from '../../utils/scrambler';
import type { SvgConfig } from '../../utils/types';

/**
 * Props for the ShiftRegister component.
 */
interface ShiftRegisterProps {
	/** Current state of the shift register */
	register: readonly number[];
	/** Binary schema string defining which bits are connected */
	scheme: string;
	/** SVG configuration for positioning */
	config: Readonly<SvgConfig>;
	/** Horizontal offset for positioning (for descrambler) */
	offsetX?: number;
	/** Whether this is the scrambler register (affects connection direction) */
	isScrambler: boolean;
}

/**
 * Component that renders a shift register visualization.
 * Displays register squares with their bit values and connections to XOR gates.
 * Connected bits are highlighted in blue with connection lines.
 *
 * @param props - Component props
 */
export const ShiftRegister: React.FC<ShiftRegisterProps> = ({
	register,
	scheme,
	config,
	offsetX = 0,
	isScrambler,
}) => {
	const indices = useMemo(() => getSchemaIndices(scheme), [scheme]);
	const centerY = useMemo(
		() => config.START_Y + (scheme.length / 2) * config.GAP,
		[config.START_Y, config.GAP, scheme.length]
	);
	const circleX = useMemo(
		() =>
			isScrambler ? config.SCRAMBLER_CIRCLE_X : config.DESCRAMBLER_CIRCLE_X,
		[isScrambler, config.SCRAMBLER_CIRCLE_X, config.DESCRAMBLER_CIRCLE_X]
	);
	const connectionX = useMemo(
		() =>
			isScrambler
				? circleX + config.CIRCLE_RADIUS
				: circleX - config.CIRCLE_RADIUS,
		[isScrambler, circleX, config.CIRCLE_RADIUS]
	);

	return (
		<>
			{scheme.split('').map((_, index) => {
				const bit = register[index];
				const x = config.START_X + offsetX;
				const y = config.START_Y + index * config.GAP;

				const isConnected = indices.includes(index);
				const rectId = `register-${
					isScrambler ? 'scrambler' : 'descrambler'
				}-${index}`;

				if (isConnected) {
					return null;
				}

				return (
					<React.Fragment key={index}>
						<rect
							id={rectId}
							x={x}
							y={y}
							width={config.SQUARE_SIZE}
							height={config.SQUARE_SIZE}
							fill='white'
							stroke='black'
							strokeWidth='2'
						/>
						<text x={x + 15} y={y + config.SQUARE_SIZE / 2 + 7} fontSize='18'>
							{bit}
						</text>
					</React.Fragment>
				);
			})}
			{scheme.split('').map((_, index) => {
				const bit = register[index];
				const x = config.START_X + offsetX;
				const y = config.START_Y + index * config.GAP;

				const isConnected = indices.includes(index);
				const rectId = `register-${
					isScrambler ? 'scrambler' : 'descrambler'
				}-${index}-connected`;

				if (!isConnected) {
					return null;
				}

				return (
					<React.Fragment key={`connected-${index}`}>
						<line
							x1={isScrambler ? x : x + config.SQUARE_SIZE}
							y1={y + config.SQUARE_SIZE / 2}
							x2={connectionX}
							y2={centerY}
							stroke='#3182CE'
							strokeWidth='2.5'
						/>
						<rect
							id={rectId}
							x={x}
							y={y}
							width={config.SQUARE_SIZE}
							height={config.SQUARE_SIZE}
							fill='#E6F2FF'
							stroke='#3182CE'
							strokeWidth='2.5'
						/>
						<text
							x={x + 15}
							y={y + config.SQUARE_SIZE / 2 + 7}
							fontSize='18'
							fontWeight='bold'
						>
							{bit}
						</text>
					</React.Fragment>
				);
			})}
		</>
	);
};
