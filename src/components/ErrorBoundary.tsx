import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import React, { Component, type ReactNode } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
	/** Child components to wrap */
	children: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
	/** Whether an error has been caught */
	hasError: boolean;
	/** The error that was caught, if any */
	error: Error | null;
}

/**
 * Inner error boundary class component that catches rendering errors.
 * Displays a fallback UI when an error occurs.
 */
class ErrorBoundaryInner extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<ErrorDisplay error={this.state.error} onReset={this.handleReset} />
			);
		}

		return this.props.children;
	}
}

/**
 * Component that displays the error fallback UI.
 *
 * @param props - Component props
 * @param props.error - The error that occurred
 * @param props.onReset - Callback to reset the error boundary
 */
const ErrorDisplay: React.FC<{
	error: Error | null;
	onReset: () => void;
}> = ({ error, onReset }) => {
	const { t } = useLanguage();

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
					{t('error.somethingWentWrong')}
				</Heading>
				<Text fontSize='md' color='gray.700'>
					{t('error.errorOccurred')}
				</Text>
				{error && (
					<Text fontSize='sm' color='gray.500' fontFamily='monospace'>
						{error.message}
					</Text>
				)}
				<Button colorScheme='teal' onClick={onReset}>
					{t('error.tryAgain')}
				</Button>
			</VStack>
		</Box>
	);
};

/**
 * Error boundary component that wraps the application.
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the app.
 *
 * @param props - Component props
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
	return (
		<LanguageProvider>
			<ErrorBoundaryInner>{children}</ErrorBoundaryInner>
		</LanguageProvider>
	);
};
