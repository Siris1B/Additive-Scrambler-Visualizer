import { ChakraProvider, Container, Heading, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { IterationList } from './components/IterationList';
import { MinWidthWarning } from './components/MinWidthWarning';
import { ScramblerForm } from './components/ScramblerForm';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useMinWidthCheck } from './hooks/useMinWidthCheck';
import {
	DEFAULT_INPUT,
	DEFAULT_REGISTER,
	DEFAULT_SCHEMA,
	SVG_CONFIG,
} from './utils/constants';
import { generateScramblerSteps } from './utils/scrambler';
import type { Step } from './utils/types';
import type { ScramblerFormSchema } from './utils/validationSchema';

/**
 * Main application content component.
 * Handles form submission, generates scrambler steps, and displays results.
 * Includes minimum width check and error handling.
 */
function AppContent() {
	const { isWidthValid, minWidth } = useMinWidthCheck();
	const { t } = useLanguage();
	const toast = useToast();
	const [steps, setSteps] = useState<Step[]>([]);
	const [currentSchema, setCurrentSchema] = useState<string>(DEFAULT_SCHEMA);
	const [currentRegister, setCurrentRegister] =
		useState<readonly number[]>(DEFAULT_REGISTER);
	const [currentInputString, setCurrentInputString] =
		useState<string>(DEFAULT_INPUT);

	const handleProcess = useCallback(
		(data: ScramblerFormSchema) => {
			setCurrentSchema(data.schema);
			setCurrentRegister(data.register);
			setCurrentInputString(data.input);

			const generatedSteps = generateScramblerSteps(
				data.input,
				data.register,
				data.schema
			);
			setSteps(generatedSteps);

			toast({
				title: t('toast.processingStarted'),
				description: t('toast.processingDescription'),
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'bottom-right',
			});
		},
		[toast, t]
	);

	if (!isWidthValid) {
		return (
			<ChakraProvider>
				<LanguageProvider>
					<MinWidthWarning minWidth={minWidth} />
				</LanguageProvider>
			</ChakraProvider>
		);
	}

	return (
		<ChakraProvider>
			<Header />
			<Container maxW='1400px' p={5} mt='60px'>
				<Heading mb={5} textAlign='center'>
					{t('form.title')}
				</Heading>
				<ScramblerForm
					defaultValues={{
						schema: DEFAULT_SCHEMA,
						register: DEFAULT_REGISTER.join(''),
						input: DEFAULT_INPUT,
					}}
					onProcess={handleProcess}
					toast={toast}
				/>
				{steps.length > 0 && (
					<IterationList
						steps={steps}
						schema={currentSchema}
						initialRegister={currentRegister}
						inputString={currentInputString}
						svgConfig={SVG_CONFIG}
					/>
				)}
			</Container>
		</ChakraProvider>
	);
}

/**
 * Root App component.
 * Wraps the application with error boundary and language provider.
 */
function App() {
	return (
		<ErrorBoundary>
			<LanguageProvider>
				<AppContent />
			</LanguageProvider>
		</ErrorBoundary>
	);
}

export default App;
