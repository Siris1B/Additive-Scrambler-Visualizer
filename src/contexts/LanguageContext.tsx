import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import enTranslations from '../locales/en.json';
import ukTranslations from '../locales/uk.json';

/**
 * Supported language codes.
 */
type Language = 'en' | 'uk';

/**
 * Type for translation objects.
 */
type Translations = typeof enTranslations;

/**
 * Context type for language functionality.
 */
interface LanguageContextType {
	/** Current language code */
	language: Language;
	/** Function to change the language */
	setLanguage: (lang: Language) => void;
	/** Translation function that retrieves text by key and replaces parameters */
	t: (key: string, params?: Record<string, string | number>) => string;
}

/**
 * React context for language management.
 */
const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

const translations: Record<Language, Translations> = {
	en: enTranslations,
	uk: ukTranslations,
};

/**
 * LocalStorage key for storing language preference.
 */
const STORAGE_KEY = 'scrambler-language';

/**
 * Retrieves the stored language preference from localStorage.
 * Returns default 'en' if no preference is stored or in SSR environment.
 *
 * @returns Stored language or 'en' as default
 */
function getStoredLanguage(): Language {
	if (typeof window === 'undefined') {
		return 'en';
	}

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'en' || stored === 'uk') {
		return stored;
	}

	return 'en';
}

/**
 * Stores the language preference in localStorage.
 *
 * @param lang - Language code to store
 */
function setStoredLanguage(lang: Language): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, lang);
	}
}

/**
 * Retrieves a nested value from an object using a dot-notation path.
 *
 * @param obj - Object to search in
 * @param path - Dot-notation path (e.g., 'form.title')
 * @returns The value at the path, or the path itself if not found
 */
function getNestedValue(obj: any, path: string): string {
	return path.split('.').reduce((current, key) => current?.[key], obj) ?? path;
}

/**
 * Replaces parameter placeholders in a string with actual values.
 * Placeholders are in the format {key}.
 *
 * @param text - Text with placeholders
 * @param params - Object with parameter values
 * @returns Text with replaced parameters
 *
 * @example
 * replaceParams('Hello {name}!', { name: 'World' }) // 'Hello World!'
 */
function replaceParams(
	text: string,
	params?: Record<string, string | number>
): string {
	if (!params) {
		return text;
	}

	return Object.entries(params).reduce((result, [key, value]) => {
		return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
	}, text);
}

/**
 * Props for the LanguageProvider component.
 */
interface LanguageProviderProps {
	/** Child components */
	children: ReactNode;
}

/**
 * Provider component that supplies language context to the application.
 * Manages language state, persistence, and translation function.
 *
 * @param props - Component props
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
}) => {
	const [language, setLanguageState] = useState<Language>(getStoredLanguage);

	useEffect(() => {
		setStoredLanguage(language);
	}, [language]);

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
	};

	const t = (key: string, params?: Record<string, string | number>): string => {
		const translation = getNestedValue(translations[language], key);
		return replaceParams(translation, params);
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

/**
 * Hook to access the language context.
 * Must be used within a LanguageProvider component.
 *
 * @returns Language context with current language, setter, and translation function
 * @throws Error if used outside of LanguageProvider
 *
 * @example
 * const { language, setLanguage, t } = useLanguage();
 * const title = t('form.title');
 */
export const useLanguage = (): LanguageContextType => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};
