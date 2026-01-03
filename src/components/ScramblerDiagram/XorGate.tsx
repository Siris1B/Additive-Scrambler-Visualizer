import React from 'react';

/**
 * Props for the XorGate component.
 */
interface XorGateProps {
	/** X coordinate of the gate center */
	x: number;
	/** Y coordinate of the gate center */
	y: number;
	/** Circle radius (default: 20) */
	radius?: number;
}

/**
 * Component that renders an XOR gate as a circle with a plus sign.
 * Represents the XOR operation in the scrambler/descrambler circuit.
 *
 * @param props - Component props
 */
export const XorGate: React.FC<XorGateProps> = ({ x, y, radius = 20 }) => {
	return (
		<>
			<circle
				cx={x}
				cy={y}
				r={radius}
				fill='white'
				stroke='#3182CE'
				strokeWidth='2.5'
			/>
			<text
				x={x}
				y={y - 7}
				fontSize='20'
				fontWeight='bold'
				textAnchor='middle'
				dominantBaseline='middle'
				dy='0.35em'
				fill='#2C5282'
				style={{ pointerEvents: 'none' }}
			>
				+
			</text>
		</>
	);
};
