# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added

- Initial release of Additive Scrambler Visualizer
- Interactive SVG visualization of scrambler and descrambler operations
- Step-by-step processing visualization with detailed iteration diagrams
- Form validation using React Hook Form and Zod schemas
- Real-time input validation with helpful error messages
- Binary input normalization (automatic removal of invalid characters)
- Internationalization support (English and Ukrainian)
- Language switcher in header
- Responsive design with minimum width check (768px)
- Error boundary for graceful error handling
- Toast notifications for user feedback
- Navigation controls for viewing iterations one by one
- Results table modal with comprehensive iteration data
- Animated transitions using Framer Motion
- Diagram legend explaining color-coded elements
- Color-coded arrows and connections (green for input/output, red for scrambled data, blue for connections)
- Helper text for form fields explaining their correspondence to the diagram
- Reset to default button for form
- Professional README with screenshots and comprehensive documentation
- JSDoc documentation for all functions and components
- TypeScript strict mode with full type coverage
- Code splitting and build optimizations
- Performance optimizations (React.memo, useMemo, useCallback)

### Technical

- TypeScript 5.6.3 with strict mode enabled
- React 18.3.1 with modern hooks and patterns
- Chakra UI 2.10.3 for accessible components
- Vite 5.4.8 for fast development and optimized builds
- React Hook Form 7.69.0 for efficient form management
- Zod 4.3.4 for TypeScript-first validation
- Framer Motion 11.11.9 for smooth animations
- Comprehensive error handling and edge case management
- Modular component architecture
- Separation of concerns (UI, logic, utilities)
- Constants management (all magic numbers extracted)
- Production-ready build configuration with Terser optimization

### Documentation

- Comprehensive README.md with installation, usage, and examples
- JSDoc comments on all exported functions and components
- Type definitions with clear documentation
- Project structure documentation
- FAQ section
- Contributing guidelines ready
- LICENSE file (MIT)

## [0.1.0] - 2024-12-01

### Added

- Initial project setup
- Basic scrambler algorithm implementation
- Core component structure
- Basic SVG diagram rendering
