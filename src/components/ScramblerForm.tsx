import type { UseToastOptions } from '@chakra-ui/react';
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	HStack,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLanguage } from '../contexts/LanguageContext';
import { normalizeBinaryInput } from '../utils/validation';
import {
	createScramblerFormInputSchema,
	type ScramblerFormInputSchema,
	type ScramblerFormSchema,
} from '../utils/validationSchema';

type ToastFunction = (options: UseToastOptions) => void;

/**
 * Props for the ScramblerForm component.
 */
interface ScramblerFormProps {
	/** Default values for form fields */
	defaultValues: {
		/** Binary schema string */
		schema: string;
		/** Binary register string */
		register: string;
		/** Binary input string */
		input: string;
	};
	/** Callback function called when form is submitted with valid data */
	onProcess: (data: ScramblerFormSchema) => void;
	/** Toast notification function from Chakra UI */
	toast: ToastFunction;
}

/**
 * Form component for entering scrambler parameters.
 * Handles input validation, normalization, and submission.
 * Uses React Hook Form with Zod validation.
 *
 * @param props - Component props
 */
export const ScramblerForm: React.FC<ScramblerFormProps> = ({
	defaultValues,
	onProcess,
	toast,
}) => {
	const { t } = useLanguage();
	const validationSchema = useMemo(
		() => createScramblerFormInputSchema(t),
		[t]
	);
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ScramblerFormInputSchema>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			schema: defaultValues.schema,
			register: defaultValues.register,
			input: defaultValues.input,
		},
	});

	const handleReset = useCallback(() => {
		reset({
			schema: defaultValues.schema,
			register: defaultValues.register,
			input: defaultValues.input,
		});
		toast({
			title: t('form.resetSuccess'),
			description: t('form.resetDescription'),
			status: 'info',
			duration: 2000,
			isClosable: true,
			position: 'bottom-right',
		});
	}, [reset, defaultValues, toast, t]);

	const fieldNames = useMemo(
		() => ({
			schema: t('form.schema'),
			register: t('form.register'),
			input: t('form.input'),
		}),
		[t]
	);

	const handleInputChange = useCallback(
		(
			field: 'schema' | 'register' | 'input',
			value: string,
			onChange: (value: string) => void
		) => {
			const normalized = normalizeBinaryInput(value);
			onChange(normalized);

			if (value !== normalized && normalized.length < value.length) {
				toast({
					title: t('validation.invalidCharsRemoved'),
					description: t('validation.onlyBinaryAllowed', {
						field: fieldNames[field],
					}),
					status: 'warning',
					duration: 3000,
					isClosable: true,
					position: 'bottom-right',
				});
			}
		},
		[toast, fieldNames, t]
	);

	const onSubmit = useCallback(
		(data: ScramblerFormInputSchema) => {
			const transformedData: ScramblerFormSchema = {
				schema: data.schema,
				register: data.register.split('').map(Number) as number[],
				input: data.input,
			};
			onProcess(transformedData);
		},
		[onProcess]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={4}>
				<FormControl isInvalid={!!errors.schema}>
					<Text mb={1}>{t('form.schema')}</Text>
					<Controller
						name='schema'
						control={control}
						render={({ field }) => (
							<>
								<Input
									placeholder={t('form.schemaPlaceholder')}
									value={field.value}
									onChange={e => {
										handleInputChange('schema', e.target.value, field.onChange);
									}}
								/>
								<FormHelperText fontSize='sm' color='gray.600' mt={1}>
									{t('form.schemaHelper')}
								</FormHelperText>
								{errors.schema && (
									<FormErrorMessage>{errors.schema.message}</FormErrorMessage>
								)}
							</>
						)}
					/>
				</FormControl>

				<FormControl isInvalid={!!errors.register}>
					<Text mb={1}>{t('form.register')}</Text>
					<Controller
						name='register'
						control={control}
						render={({ field }) => (
							<>
								<Input
									placeholder={t('form.registerPlaceholder')}
									value={field.value}
									onChange={e => {
										handleInputChange(
											'register',
											e.target.value,
											field.onChange
										);
									}}
								/>
								<FormHelperText fontSize='sm' color='gray.600' mt={1}>
									{t('form.registerHelper')}
								</FormHelperText>
								{errors.register && (
									<FormErrorMessage>{errors.register.message}</FormErrorMessage>
								)}
							</>
						)}
					/>
				</FormControl>

				<FormControl isInvalid={!!errors.input}>
					<Text mb={1}>{t('form.input')}</Text>
					<Controller
						name='input'
						control={control}
						render={({ field }) => (
							<>
								<Input
									placeholder={t('form.inputPlaceholder')}
									value={field.value}
									onChange={e => {
										handleInputChange('input', e.target.value, field.onChange);
									}}
								/>
								<FormHelperText fontSize='sm' color='gray.600' mt={1}>
									{t('form.inputHelper')}
								</FormHelperText>
								{errors.input && (
									<FormErrorMessage>{errors.input.message}</FormErrorMessage>
								)}
							</>
						)}
					/>
				</FormControl>

				<HStack spacing={3}>
					<Button type='submit' colorScheme='teal' flex={1}>
						{t('form.submit')}
					</Button>
					<Button type='button' variant='outline' onClick={handleReset}>
						{t('form.reset')}
					</Button>
				</HStack>
			</Stack>
		</form>
	);
};
