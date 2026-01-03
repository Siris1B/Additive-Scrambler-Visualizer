import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
	SVG_CONFIG,
	SVG_LAYOUT,
	SVG_TEXT_POSITIONS,
} from '../../utils/constants';
import type { SvgConfig } from '../../utils/types';
import { Connection } from './Connection';
import { DataFlow } from './DataFlow';
import { DiagramLegend } from './DiagramLegend';
import { IterationLabel } from './IterationLabel';
import { ShiftRegister } from './ShiftRegister';
import { XorGate } from './XorGate';

/**
 * Props for the ScramblerDiagram component.
 */
interface ScramblerDiagramProps {
	/** Binary schema string defining register taps */
	scheme: string;
	/** Current state of the shift register */
	registerStatus: readonly number[];
	/** Input binary string being processed */
	inputtedText: string;
	/** First XOR result (scrambler feedback) */
	firstScramble: number | null;
	/** Second XOR result (descrambler feedback) */
	secondScramble: number | null;
	/** Accumulated scrambled output string */
	resultScramble: string | null;
	/** Accumulated descrambled output string */
	result: string | null;
	/** Iteration index (0 for initial state) */
	index: number;
	/** Optional SVG configuration (defaults to SVG_CONFIG) */
	svgConfig?: Readonly<SvgConfig>;
}

/**
 * Main diagram component that visualizes the scrambler/descrambler state.
 * Renders the complete SVG diagram including registers, XOR gates, connections,
 * and data flow arrows. Dynamically adjusts height based on content.
 *
 * @param props - Component props
 */
export const ScramblerDiagram: React.FC<ScramblerDiagramProps> = ({
	scheme,
	registerStatus,
	inputtedText,
	firstScramble,
	secondScramble,
	resultScramble,
	result,
	index,
	svgConfig = SVG_CONFIG,
}) => {
	const length = scheme.length;

	const centerY = useMemo(
		() => svgConfig.START_Y + (length / 2) * svgConfig.GAP,
		[svgConfig.START_Y, length, svgConfig.GAP]
	);
	const textPositionY = useMemo(
		() =>
			svgConfig.START_Y +
			length * svgConfig.GAP +
			SVG_LAYOUT.TEXT_POSITION_OFFSET,
		[svgConfig.START_Y, length, svgConfig.GAP]
	);
	const valuesY = useMemo(
		() => textPositionY + SVG_LAYOUT.VALUES_Y_OFFSET,
		[textPositionY]
	);
	const foreignObjectRef = useRef<HTMLDivElement>(null);
	const [foreignObjectHeight, setForeignObjectHeight] = useState(60);

	useEffect(() => {
		if (foreignObjectRef.current) {
			const resizeObserver = new ResizeObserver(entries => {
				for (const entry of entries) {
					setForeignObjectHeight(entry.contentRect.height);
				}
			});

			resizeObserver.observe(foreignObjectRef.current);

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, []);

	const legendHeight = 85;
	const legendY = useMemo(
		() => valuesY + Math.max(foreignObjectHeight, 60) + 10,
		[valuesY, foreignObjectHeight]
	);
	const svgHeight = useMemo(
		() => legendY + legendHeight + 10,
		[legendY, legendHeight]
	);

	const descramblerOffset = SVG_LAYOUT.DESCRAMBLER_OFFSET_X;
	const connectionY = SVG_LAYOUT.CONNECTION_Y;
	const scramblerConnectionX = SVG_LAYOUT.SCRAMBLER_CONNECTION_X;
	const descramblerConnectionX = SVG_LAYOUT.DESCRAMBLER_CONNECTION_X;
	const topPadding = SVG_LAYOUT.TOP_PADDING;
	const adjustedSvgHeight = useMemo(
		() => svgHeight + topPadding,
		[svgHeight, topPadding]
	);
	const svgWidth = SVG_LAYOUT.SVG_WIDTH;
	const { t } = useLanguage();

	return (
		<svg
			style={{ border: '1px solid black', padding: '8px', display: 'block' }}
			width='100%'
			height={adjustedSvgHeight}
			viewBox={`0 -${topPadding} ${svgWidth} ${adjustedSvgHeight}`}
		>
			<IterationLabel
				iteration={index}
				svgHeight={svgHeight}
				svgWidth={svgWidth}
			/>

			<DataFlow config={svgConfig} />

			<XorGate
				x={svgConfig.SCRAMBLER_CIRCLE_X}
				y={centerY}
				radius={svgConfig.CIRCLE_RADIUS}
			/>
			<XorGate
				x={svgConfig.DESCRAMBLER_CIRCLE_X}
				y={centerY}
				radius={svgConfig.CIRCLE_RADIUS}
			/>

			<Connection
				from={{
					x: svgConfig.SCRAMBLER_CIRCLE_X,
					y: centerY - svgConfig.CIRCLE_RADIUS,
				}}
				to={{ x: svgConfig.SCRAMBLER_CIRCLE_X, y: connectionY - 15 }}
			/>
			<Connection
				from={{ x: svgConfig.SCRAMBLER_CIRCLE_X, y: connectionY }}
				to={{ x: scramblerConnectionX, y: connectionY }}
				showArrow={false}
			/>
			<Connection
				from={{ x: scramblerConnectionX, y: connectionY }}
				to={{ x: scramblerConnectionX, y: 90 }}
			/>

			<Connection
				from={{
					x: svgConfig.DESCRAMBLER_CIRCLE_X,
					y: centerY - svgConfig.CIRCLE_RADIUS,
				}}
				to={{ x: svgConfig.DESCRAMBLER_CIRCLE_X, y: connectionY - 15 }}
			/>
			<Connection
				from={{ x: descramblerConnectionX, y: connectionY }}
				to={{ x: svgConfig.DESCRAMBLER_CIRCLE_X, y: connectionY }}
				showArrow={false}
			/>
			<Connection
				from={{ x: descramblerConnectionX, y: connectionY }}
				to={{ x: descramblerConnectionX, y: 90 }}
			/>

			<ShiftRegister
				register={registerStatus}
				scheme={scheme}
				config={svgConfig}
				isScrambler={true}
			/>
			<ShiftRegister
				register={registerStatus}
				scheme={scheme}
				config={svgConfig}
				offsetX={descramblerOffset}
				isScrambler={false}
			/>

			<text
				x={SVG_TEXT_POSITIONS.SCRAMBLER_LABEL_X}
				y={textPositionY}
				fontSize='18'
			>
				{t('diagram.scrambler')}
			</text>
			<text
				x={SVG_TEXT_POSITIONS.DESCRAMBLER_LABEL_X}
				y={textPositionY}
				fontSize='18'
			>
				{t('diagram.descrambler')}
			</text>

			<text
				x={SVG_TEXT_POSITIONS.SECOND_SCRAMBLE_X}
				y={SVG_TEXT_POSITIONS.SCRAMBLE_Y}
				fontSize='16'
				fontWeight='bold'
			>
				{secondScramble ?? ''}
			</text>
			<text
				x={SVG_TEXT_POSITIONS.FIRST_SCRAMBLE_X}
				y={SVG_TEXT_POSITIONS.SCRAMBLE_Y}
				fontSize='16'
				fontWeight='bold'
			>
				{firstScramble ?? ''}
			</text>

			<foreignObject
				x='10'
				y={valuesY - 10}
				width='580'
				height={Math.max(foreignObjectHeight, 60)}
				xmlns='http://www.w3.org/1999/xhtml'
			>
				<div
					ref={foreignObjectRef}
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '16px',
						alignItems: 'flex-start',
						justifyContent: 'center',
						minHeight: '60px',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
						<span
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
								color: '#4A5568',
							}}
						>
							{t('diagram.input')}:
						</span>
						<span
							style={{
								fontSize: '16px',
								fontWeight: '600',
								fontFamily: 'monospace',
								color: '#2D3748',
							}}
						>
							{inputtedText || '—'}
						</span>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
						<span
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
								color: '#4A5568',
							}}
						>
							{t('diagram.scrambled')}:
						</span>
						<span
							style={{
								fontSize: '16px',
								fontWeight: '600',
								fontFamily: 'monospace',
								color: '#2D3748',
							}}
						>
							{resultScramble || '—'}
						</span>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
						<span
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
								color: '#4A5568',
							}}
						>
							{t('diagram.descrambled')}:
						</span>
						<span
							style={{
								fontSize: '16px',
								fontWeight: '600',
								fontFamily: 'monospace',
								color: '#2D3748',
							}}
						>
							{result || '—'}
						</span>
					</div>
				</div>
			</foreignObject>

			<DiagramLegend x={10} y={legendY} />

			<defs>
				<marker
					id='arrow'
					markerWidth='10'
					markerHeight='10'
					refX='5'
					refY='5'
					orient='auto'
				>
					<path d='M0,0 L0,10 L10,5 z' fill='currentColor' />
				</marker>
				<marker
					id='arrow-green'
					markerWidth='9'
					markerHeight='9'
					refX='4.5'
					refY='4.5'
					orient='auto'
				>
					<path d='M0,0 L0,9 L9,4.5 z' fill='#48BB78' />
				</marker>
				<marker
					id='arrow-red'
					markerWidth='9'
					markerHeight='9'
					refX='4.5'
					refY='4.5'
					orient='auto'
				>
					<path d='M0,0 L0,9 L9,4.5 z' fill='#F56565' />
				</marker>
				<marker
					id='arrow-blue'
					markerWidth='9'
					markerHeight='9'
					refX='4.5'
					refY='4.5'
					orient='auto'
				>
					<path d='M0,0 L0,9 L9,4.5 z' fill='#3182CE' />
				</marker>
				<marker
					id='arrow-green-small'
					markerWidth='5'
					markerHeight='5'
					refX='2.5'
					refY='2.5'
					orient='auto'
				>
					<path d='M0,0 L0,5 L5,2.5 z' fill='#48BB78' />
				</marker>
				<marker
					id='arrow-red-small'
					markerWidth='5'
					markerHeight='5'
					refX='2.5'
					refY='2.5'
					orient='auto'
				>
					<path d='M0,0 L0,5 L5,2.5 z' fill='#F56565' />
				</marker>
			</defs>
		</svg>
	);
};

export default ScramblerDiagram;
