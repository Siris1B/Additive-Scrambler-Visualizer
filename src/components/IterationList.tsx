import {
	Box,
	Button,
	Collapse,
	HStack,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Step, SvgConfig } from '../utils/types';
import { IterationNavigation } from './IterationNavigation';
import { ResultsTable } from './ResultsTable';
import { ScramblerDiagram } from './ScramblerDiagram/ScramblerDiagram';

/**
 * Props for the IterationList component.
 */
interface IterationListProps {
	/** Array of processing steps */
	steps: Step[];
	/** Binary schema string */
	schema: string;
	/** Input string being processed */
	inputString: string;
	/** Initial state of the shift register */
	initialRegister: readonly number[];
	/** SVG configuration for diagram rendering */
	svgConfig: Readonly<SvgConfig>;
}

/**
 * Component that displays all iteration diagrams.
 * Supports both "show all" and "show one at a time" modes with navigation.
 * Includes animations for smooth transitions between iterations.
 *
 * @param props - Component props
 */
export const IterationList: React.FC<IterationListProps> = ({
	steps,
	schema,
	inputString,
	initialRegister,
	svgConfig,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAll, setShowAll] = useState(true);
	const { t } = useLanguage();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const totalIterations = steps.length;
	const allDiagrams = useMemo(() => {
		const initial = (
			<ScramblerDiagram
				key={0}
				scheme={schema}
				registerStatus={initialRegister}
				inputtedText={inputString}
				firstScramble={null}
				secondScramble={null}
				resultScramble={null}
				result={null}
				index={0}
				svgConfig={svgConfig}
			/>
		);

		const iterationDiagrams = steps.map(step => (
			<ScramblerDiagram
				key={step.iteration}
				scheme={schema}
				registerStatus={step.registerAfter}
				inputtedText={inputString}
				firstScramble={step.xorResult}
				secondScramble={step.xorResult}
				resultScramble={step.accumulatedScrambled}
				result={step.accumulatedDescrambled}
				index={step.iteration}
				svgConfig={svgConfig}
			/>
		));

		return [initial, ...iterationDiagrams];
	}, [steps, schema, inputString, initialRegister, svgConfig]);

	const handlePrevious = useCallback(() => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	}, [currentIndex]);

	const handleNext = useCallback(() => {
		if (currentIndex < totalIterations) {
			setCurrentIndex(currentIndex + 1);
		}
	}, [currentIndex, totalIterations]);

	const handleGoToIndex = useCallback(
		(index: number) => {
			setCurrentIndex(Math.max(0, Math.min(index, totalIterations)));
		},
		[totalIterations]
	);

	const animationVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.1,
				duration: 0.5,
				ease: 'easeOut',
			},
		}),
		exit: {
			opacity: 0,
			y: -20,
			transition: {
				duration: 0.3,
			},
		},
	};

	return (
		<Box p={5}>
			<VStack spacing={4} align='stretch'>
				<HStack justify='space-between'>
					<Button
						size='sm'
						variant={showAll ? 'solid' : 'outline'}
						colorScheme='teal'
						onClick={() => setShowAll(!showAll)}
					>
						{showAll ? t('results.hideAll') : t('results.showAll')}
					</Button>
					<Button
						onClick={onOpen}
						size='sm'
						variant='outline'
						colorScheme='teal'
					>
						{t('results.showTable')}
					</Button>
				</HStack>

				<ResultsTable
					steps={steps}
					onGoToIteration={handleGoToIndex}
					isOpen={isOpen}
					onOpen={onOpen}
					onClose={onClose}
				/>

				{!showAll && (
					<>
						<IterationNavigation
							currentIndex={currentIndex}
							totalIterations={totalIterations}
							onPrevious={handlePrevious}
							onNext={handleNext}
							onGoToIndex={handleGoToIndex}
						/>
						<Box>
							<AnimatePresence mode='wait'>
								<motion.div
									key={currentIndex}
									initial='hidden'
									animate='visible'
									exit='exit'
									variants={animationVariants}
								>
									{allDiagrams[currentIndex]}
								</motion.div>
							</AnimatePresence>
						</Box>
					</>
				)}

				<Collapse in={showAll} animateOpacity>
					{showAll && (
						<>
							<motion.div
								initial='hidden'
								animate='visible'
								variants={animationVariants}
								custom={0}
								style={{ marginBottom: '20px' }}
							>
								{allDiagrams[0]}
							</motion.div>
							{allDiagrams.slice(1).map((diagram, index) => (
								<motion.div
									key={steps[index]?.iteration ?? index + 1}
									initial='hidden'
									animate='visible'
									exit='exit'
									variants={animationVariants}
									custom={index + 1}
									style={{ marginBottom: '20px' }}
								>
									{diagram}
								</motion.div>
							))}
						</>
					)}
				</Collapse>
			</VStack>
		</Box>
	);
};
