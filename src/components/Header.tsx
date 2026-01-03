import { Box, Flex, Heading, Select } from '@chakra-ui/react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Header component that displays the application title and language selector.
 * Fixed at the top of the page with a fixed position.
 */
export const Header: React.FC = () => {
	const { language, setLanguage, t } = useLanguage();

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLanguage = e.target.value as 'en' | 'uk';
		setLanguage(newLanguage);
	};

	return (
		<Box
			position='fixed'
			top={0}
			left={0}
			right={0}
			zIndex={1000}
			bg='white'
			borderBottom='1px solid'
			borderColor='gray.200'
			shadow='sm'
		>
			<Flex
				maxW='1400px'
				mx='auto'
				px={5}
				py={3}
				justifyContent='space-between'
				alignItems='center'
			>
				<Heading size='md' color='teal.600'>
					{t('app.title')}
				</Heading>
				<Select
					value={language}
					onChange={handleLanguageChange}
					w='180px'
					size='sm'
					borderRadius='md'
				>
					<option value='en'>{t('language.english')}</option>
					<option value='uk'>{t('language.ukrainian')}</option>
				</Select>
			</Flex>
		</Box>
	);
};
