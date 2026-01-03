import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Props for the MinWidthWarning component.
 */
interface MinWidthWarningProps {
	/** Minimum required screen width in pixels */
	minWidth: number;
}

/**
 * Component that displays a warning when the screen width is below the minimum required.
 * Blocks application usage on devices with insufficient width.
 *
 * @param props - Component props
 */
export const MinWidthWarning: React.FC<MinWidthWarningProps> = ({
	minWidth,
}) => {
	const { t } = useLanguage();
	const currentWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

	return (
		<Box
			w='100vw'
			h='100vh'
			display='flex'
			alignItems='center'
			justifyContent='center'
			bg='gray.50'
			p={5}
		>
			<VStack spacing={4} textAlign='center' maxW='500px'>
				<Heading color='red.500' size='lg'>
					{t('minWidth.title')}
				</Heading>
				<Text fontSize='lg' color='gray.700'>
					{t('minWidth.description', { minWidth })}
				</Text>
				<Text fontSize='md' color='gray.600'>
					{t('minWidth.orientation')}
				</Text>
				<Text fontSize='sm' color='gray.500' mt={4}>
					{t('minWidth.currentWidth', { width: currentWidth })}
				</Text>
			</VStack>
		</Box>
	);
};
