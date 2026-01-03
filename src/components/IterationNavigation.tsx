import { Box, Button, HStack, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Props for the IterationNavigation component.
 */
interface IterationNavigationProps {
	/** Current iteration index being displayed */
	currentIndex: number;
	/** Total number of iterations */
	totalIterations: number;
	/** Callback for navigating to previous iteration */
	onPrevious: () => void;
	/** Callback for navigating to next iteration */
	onNext: () => void;
	/** Callback for jumping to specific iteration index */
	onGoToIndex: (index: number) => void;
}

/**
 * Component that provides navigation controls for viewing iterations one at a time.
 * Displays previous/next buttons and first/last jump buttons.
 *
 * @param props - Component props
 */
export const IterationNavigation: React.FC<IterationNavigationProps> = ({
	currentIndex,
	totalIterations,
	onPrevious,
	onNext,
	onGoToIndex,
}) => {
	const { t } = useLanguage();

	return (
		<Box mb={4} p={4} bg='gray.50' borderRadius='md' borderWidth='1px'>
			<HStack justify='space-between' align='center'>
				<HStack spacing={2}>
					<IconButton
						aria-label={t('navigation.previous')}
						icon={<Text>‹</Text>}
						onClick={onPrevious}
						isDisabled={currentIndex === 0}
						size='sm'
						variant='outline'
					/>
					<Text
						fontSize='sm'
						fontWeight='medium'
						minW='80px'
						textAlign='center'
					>
						{t('navigation.iteration', {
							current: currentIndex + 1,
							total: totalIterations + 1,
						})}
					</Text>
					<IconButton
						aria-label={t('navigation.next')}
						icon={<Text>›</Text>}
						onClick={onNext}
						isDisabled={currentIndex >= totalIterations}
						size='sm'
						variant='outline'
					/>
				</HStack>
				<HStack spacing={2}>
					<Button
						size='xs'
						variant='ghost'
						onClick={() => onGoToIndex(0)}
						isDisabled={currentIndex === 0}
					>
						{t('navigation.first')}
					</Button>
					<Button
						size='xs'
						variant='ghost'
						onClick={() => onGoToIndex(totalIterations)}
						isDisabled={currentIndex >= totalIterations}
					>
						{t('navigation.last')}
					</Button>
				</HStack>
			</HStack>
		</Box>
	);
};
