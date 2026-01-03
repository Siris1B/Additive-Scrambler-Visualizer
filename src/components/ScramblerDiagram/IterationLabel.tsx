import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for the IterationLabel component.
 */
interface IterationLabelProps {
	/** Iteration number to display */
	iteration: number;
	/** Total height of the SVG */
	svgHeight: number;
	/** Total width of the SVG */
	svgWidth: number;
}

/**
 * Component that displays the iteration number in the bottom-right corner of the diagram.
 *
 * @param props - Component props
 */
export const IterationLabel: React.FC<IterationLabelProps> = ({
	iteration,
	svgHeight,
	svgWidth,
}) => {
	const { t } = useLanguage();

	return (
		<text
			x={svgWidth - 10}
			y={svgHeight - 4}
			fontSize='24'
			fontWeight='bold'
			textAnchor='end'
		>
			{`${t('diagram.iteration')} ${iteration}`}
		</text>
	);
};
