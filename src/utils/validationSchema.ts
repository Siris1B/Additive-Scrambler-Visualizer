import { z } from 'zod';

/**
 * Type for translation function.
 */
type TranslationFunction = (
	key: string,
	params?: Record<string, string | number>
) => string;

/**
 * Creates a Zod schema for form input validation with translated error messages.
 *
 * @param t - Translation function from useLanguage hook
 * @returns Zod schema with translated validation messages
 */
export function createScramblerFormInputSchema(t: TranslationFunction) {
	const baseSchema = z.object({
		schema: z
			.string()
			.min(1, t('validation.schemaRequired'))
			.regex(/^[01]+$/, t('validation.schemaInvalid')),
		register: z
			.string()
			.min(1, t('validation.registerRequired'))
			.regex(/^[01]+$/, t('validation.registerInvalid')),
		input: z
			.string()
			.min(1, t('validation.inputRequired'))
			.regex(/^[01]+$/, t('validation.inputInvalid')),
	});

	return baseSchema.refine(
		data => {
			return data.schema.length === data.register.length;
		},
		{
			message: t('validation.lengthMismatch'),
			path: ['register'],
		}
	);
}

/**
 * Creates a Zod schema for processed form data with translated error messages.
 * Same validation as input schema, but transforms register string to number array.
 *
 * @param t - Translation function from useLanguage hook
 * @returns Zod schema with transformation and translated validation messages
 */
export function createScramblerFormSchema(t: TranslationFunction) {
	const baseSchema = z.object({
		schema: z
			.string()
			.min(1, t('validation.schemaRequired'))
			.regex(/^[01]+$/, t('validation.schemaInvalid')),
		register: z
			.string()
			.min(1, t('validation.registerRequired'))
			.regex(/^[01]+$/, t('validation.registerInvalid')),
		input: z
			.string()
			.min(1, t('validation.inputRequired'))
			.regex(/^[01]+$/, t('validation.inputInvalid')),
	});

	return baseSchema
		.refine(
			data => {
				return data.schema.length === data.register.length;
			},
			{
				message: t('validation.lengthMismatch'),
				path: ['register'],
			}
		)
		.transform(data => ({
			schema: data.schema,
			register: data.register.split('').map(Number) as number[],
			input: data.input,
		}));
}

/**
 * Type for form input data (all fields as strings).
 * Inferred from the schema created by createScramblerFormInputSchema.
 */
export type ScramblerFormInputSchema = z.infer<
	ReturnType<typeof createScramblerFormInputSchema>
>;

/**
 * Type for processed form data (register as number array).
 * Inferred from the schema created by createScramblerFormSchema.
 */
export type ScramblerFormSchema = z.infer<
	ReturnType<typeof createScramblerFormSchema>
>;
