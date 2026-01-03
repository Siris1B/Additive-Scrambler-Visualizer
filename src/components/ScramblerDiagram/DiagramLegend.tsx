import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for the DiagramLegend component.
 */
interface DiagramLegendProps {
	/** X coordinate for legend position */
	x: number;
	/** Y coordinate for legend position */
	y: number;
}

/**
 * Component that displays a legend explaining the diagram elements.
 * Shows color-coded arrows and connected register bit indicator.
 *
 * @param props - Component props
 */
export const DiagramLegend: React.FC<DiagramLegendProps> = ({ x, y }) => {
	const { t } = useLanguage();

	return (
		<g id='legend' transform={`translate(${x}, ${y})`}>
			<rect
				x='0'
				y='0'
				width='200'
				height='85'
				fill='white'
				stroke='#E2E8F0'
				strokeWidth='1.5'
				rx='4'
				opacity='0.95'
			/>
			<text x='10' y='20' fontSize='12' fontWeight='bold' fill='#2D3748'>
				{t('diagram.legend.title')}
			</text>
			<line x1='10' y1='30' x2='190' y2='30' stroke='#E2E8F0' strokeWidth='1' />
			<g transform='translate(10, 43)'>
				<line
					x1='0'
					y1='3'
					x2='17.5'
					y2='3'
					stroke='#48BB78'
					strokeWidth='2.5'
					markerEnd='url(#arrow-green-small)'
				/>
				<text x='28' y='7' fontSize='10' fill='#4A5568'>
					{t('diagram.legend.input')}
				</text>
			</g>
			<g transform='translate(10, 60)'>
				<line
					x1='0'
					y1='3'
					x2='17.5'
					y2='3'
					stroke='#F56565'
					strokeWidth='2.5'
					markerEnd='url(#arrow-red-small)'
				/>
				<text x='28' y='7' fontSize='10' fill='#4A5568'>
					{t('diagram.legend.scrambled')}
				</text>
			</g>
			<g transform='translate(10, 77)'>
				<rect
					x='0'
					y='0'
					width='15'
					height='15'
					fill='#E6F2FF'
					stroke='#3182CE'
					strokeWidth='2'
				/>
				<text x='25' y='10' fontSize='10' fill='#4A5568'>
					{t('diagram.legend.connected')}
				</text>
			</g>
		</g>
	);
};
