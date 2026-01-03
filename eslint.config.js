import { fixupConfigRules } from '@eslint/compat'; // Utility for adapting legacy configs
import js from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

export default [
	// Apply the standard ESLint recommended rules
	js.configs.recommended,

	// Apply the React recommended rules and adapt them for flat config
	...fixupConfigRules(pluginReactConfig),

	// Configuration for config files (Node.js environment)
	{
		files: ['vite.config.js', 'vite.config.ts', '*.config.js', '*.config.ts'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},

	// Additional configuration object for specific settings
	{
		// Define files the config should apply to (adjust as needed)
		files: ['src/**/*.{js,jsx}'],

		// Language options: configure global variables and JSX support
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true, // Enable JSX parsing
				},
			},
			// Define global variables for browser and Node.js environments, etc.
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		// Override or add specific rules
		rules: {
			// Example: Turn off a rule not needed in modern React projects (React 17+)
			'react/react-in-jsx-scope': 'off',
		},

		// Settings for the React plugin
		settings: {
			react: {
				// Automatically detect the React version
				version: 'detect',
			},
		},
	},
];
