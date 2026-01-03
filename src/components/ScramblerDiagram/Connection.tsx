import React from 'react';

/**
 * Point coordinates in SVG space.
 */
interface Point {
	/** X coordinate */
	x: number;
	/** Y coordinate */
	y: number;
}

/**
 * Props for the Connection component.
 */
interface ConnectionProps {
	/** Starting point of the line */
	from: Point;
	/** Ending point of the line */
	to: Point;
	/** Line style */
	style?: 'solid' | 'dashed';
	/** Whether to show arrow marker at the end */
	showArrow?: boolean;
	/** Line color (hex code) */
	color?: string;
	/** Whether the connection is currently active/highlighted */
	isActive?: boolean;
}

/**
 * Component that renders a connection line in the SVG diagram.
 * Used for connecting register bits to XOR gates and other elements.
 *
 * @param props - Component props
 */
export const Connection: React.FC<ConnectionProps> = ({
	from,
	to,
	style = 'solid',
	showArrow = true,
	color = '#3182CE',
	isActive = false,
}) => {
	const strokeDasharray = style === 'dashed' ? '5,5' : undefined;
	const strokeColor = isActive ? '#2C5282' : color;
	const strokeWidth = isActive ? '3' : '2';

	return (
		<line
			x1={from.x}
			y1={from.y}
			x2={to.x}
			y2={to.y}
			stroke={strokeColor}
			strokeWidth={strokeWidth}
			strokeDasharray={strokeDasharray}
			markerEnd={showArrow ? 'url(#arrow-blue)' : undefined}
		/>
	);
};
