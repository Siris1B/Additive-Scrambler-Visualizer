import { useEffect, useState } from 'react';

/**
 * Minimum required screen width in pixels.
 */
const MIN_WIDTH: number = 768;

/**
 * Custom hook that checks if the current window width meets the minimum requirement.
 * Listens for resize and orientation change events to update the check.
 *
 * @returns Object with `isWidthValid` (boolean) and `minWidth` (number)
 *
 * @example
 * const { isWidthValid, minWidth } = useMinWidthCheck();
 * if (!isWidthValid) {
 *   return <MinWidthWarning minWidth={minWidth} />;
 * }
 */
export function useMinWidthCheck() {
	const [isWidthValid, setIsWidthValid] = useState(true);

	useEffect(() => {
		const checkWidth = () => {
			const width = window.innerWidth;
			setIsWidthValid(width >= MIN_WIDTH);
		};

		checkWidth();

		window.addEventListener('resize', checkWidth);
		window.addEventListener('orientationchange', checkWidth);

		return () => {
			window.removeEventListener('resize', checkWidth);
			window.removeEventListener('orientationchange', checkWidth);
		};
	}, []);

	return { isWidthValid, minWidth: MIN_WIDTH };
}
