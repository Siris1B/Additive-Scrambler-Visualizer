import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SVG_LAYOUT } from '../../utils/constants';
import type { SvgConfig } from '../../utils/types';
import { XorGate } from './XorGate';

/**
 * Props for the DataFlow component.
 */
interface DataFlowProps {
	/** SVG configuration for positioning elements */
	config: Readonly<SvgConfig>;
}

/**
 * Component that renders the top data flow visualization.
 * Displays input/output arrows, XOR gates, and labels (Input, Scrambled, Descrambled).
 *
 * @param props - Component props
 */
export const DataFlow: React.FC<DataFlowProps> = ({ config }) => {
	const { t } = useLanguage();
	const topY = config.TOP_CIRCLE_Y;
	const startX = SVG_LAYOUT.DATA_FLOW_START_X;
	const scramblerCircleX = config.SCRAMBLER_CIRCLE_X;
	const descramblerCircleX = config.DESCRAMBLER_CIRCLE_X;
	const endX = SVG_LAYOUT.DATA_FLOW_END_X;

	const textY = SVG_LAYOUT.TEXT_Y_OFFSET;

	const scramblerCircleLeft = scramblerCircleX - config.CIRCLE_RADIUS;
	const scramblerCircleRight = scramblerCircleX + config.CIRCLE_RADIUS;
	const descramblerCircleLeft = descramblerCircleX - config.CIRCLE_RADIUS;
	const descramblerCircleRight = descramblerCircleX + config.CIRCLE_RADIUS;

	const fixedArrowLength = SVG_LAYOUT.FIXED_ARROW_LENGTH;
	const markerSize = SVG_LAYOUT.MARKER_SIZE;
	const gapBetweenElements = SVG_LAYOUT.GAP_BETWEEN_ELEMENTS;

	const firstArrowStart = startX;
	const firstArrowEnd = scramblerCircleLeft - markerSize;

	const secondArrowStart = scramblerCircleRight;
	const secondArrowEnd = secondArrowStart + fixedArrowLength;

	const dashedLineStart = secondArrowEnd + gapBetweenElements;
	const dashedLineEnd = descramblerCircleLeft - fixedArrowLength - markerSize;

	const fourthArrowStart = dashedLineEnd;
	const fourthArrowEnd = descramblerCircleLeft - markerSize;

	const fifthArrowStart = descramblerCircleRight;
	const fifthArrowEnd = endX;

	const inputTextStartX = startX + SVG_LAYOUT.TEXT_OFFSET_X;
	const inputTextEndX = scramblerCircleLeft - SVG_LAYOUT.TEXT_OFFSET_X;
	const inputTextCenterX =
		inputTextStartX + (inputTextEndX - inputTextStartX) / 2;

	const scrambledTextStartX = scramblerCircleRight + SVG_LAYOUT.TEXT_OFFSET_X;
	const scrambledTextEndX = descramblerCircleLeft - SVG_LAYOUT.TEXT_OFFSET_X;
	const scrambledTextCenterX =
		scrambledTextStartX + (scrambledTextEndX - scrambledTextStartX) / 2;

	const descrambledTextStartX =
		descramblerCircleRight + SVG_LAYOUT.TEXT_OFFSET_X;
	const descrambledTextEndX = endX - SVG_LAYOUT.TEXT_OFFSET_X;
	const descrambledTextCenterX =
		descrambledTextStartX + (descrambledTextEndX - descrambledTextStartX) / 2;

	return (
		<>
			<XorGate x={scramblerCircleX} y={topY} radius={config.CIRCLE_RADIUS} />
			<XorGate x={descramblerCircleX} y={topY} radius={config.CIRCLE_RADIUS} />

			<line
				x1={firstArrowStart}
				y1={topY}
				x2={firstArrowEnd}
				y2={topY}
				stroke='#48BB78'
				strokeWidth='2.5'
				markerEnd='url(#arrow-green)'
			/>
			<line
				x1={secondArrowStart}
				y1={topY}
				x2={secondArrowEnd}
				y2={topY}
				stroke='#F56565'
				strokeWidth='2.5'
				markerEnd='url(#arrow-red)'
			/>
			<line
				x1={dashedLineStart}
				y1={topY}
				x2={dashedLineEnd}
				y2={topY}
				stroke='#718096'
				strokeWidth='2'
				strokeDasharray='5,5'
			/>
			<line
				x1={fourthArrowStart}
				y1={topY}
				x2={fourthArrowEnd}
				y2={topY}
				stroke='#F56565'
				strokeWidth='2.5'
				markerEnd='url(#arrow-red)'
			/>
			<line
				x1={fifthArrowStart}
				y1={topY}
				x2={fifthArrowEnd}
				y2={topY}
				stroke='#48BB78'
				strokeWidth='2.5'
				markerEnd='url(#arrow-green)'
			/>

			<text
				x={inputTextCenterX}
				y={textY}
				fontSize='12'
				fill='black'
				textAnchor='middle'
				fontWeight='bold'
				style={{ userSelect: 'none' }}
			>
				{t('diagram.input')}
			</text>

			<text
				x={scrambledTextCenterX}
				y={textY}
				fontSize='12'
				fill='black'
				textAnchor='middle'
				fontWeight='bold'
				style={{ userSelect: 'none' }}
			>
				{t('diagram.scrambled')}
			</text>

			<text
				x={descrambledTextCenterX}
				y={textY}
				fontSize='12'
				fill='black'
				textAnchor='middle'
				fontWeight='bold'
				style={{ userSelect: 'none' }}
			>
				{t('diagram.descrambled')}
			</text>
		</>
	);
};
