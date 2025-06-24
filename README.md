# No Strings Resume - Project Knowledge Base

## Project Overview
No Strings Resume is a privacy-first resume builder single page web application that allows users to create and edit resumes entirely in their browser. The application uses no backend or cloud storage – all data stays in localStorage unless the user exports it. Users can customize resume content and design themes, and export the final resume in multiple formats including PDF, DOCX, JSON, HTML, and HR-Open JSON. The name "No Strings" reflects the principle that there are no attached strings: no hidden data collection, no account required, no vendor lock-in.

The application is built with accessibility as a core principle. The modern, minimalist design prioritizes usability with intuitive workflows, clear visual hierarchy, and responsive layouts that work flawlessly across all devices from mobile phones to desktop computers. Touch-friendly interface elements ensure excellent mobile usability, while progressive disclosure keeps complex features accessible without overwhelming new users. The application provides immediate visual feedback, helpful error messages, and contextual guidance to create a smooth user experience for both technical and non-technical users.

By combining privacy-first architecture with inclusive design principles and professional export capabilities, No Strings Resume serves as a comprehensive solution that respects user privacy while ensuring accessibility for all users in their job search journey.

## Architecture

### Core Technologies
- **Frontend**: React 18 with TypeScript for type-safe development
- **Styling**: Tailwind CSS with shadcn/ui components for consistent, accessible design
- **Routing**: React Router DOM for single-page application navigation
- **State Management**: React Context with useReducer pattern for centralized state
- **Build Tool**: Vite for fast development and optimized production builds
- **Icons**: Lucide React for consistent iconography
- **PDF Generation**: jsPDF and html2canvas for client-side PDF creation
- **DOCX Generation**: docx-templates for Microsoft Word document export
- **Testing**: Vitest for unit tests, React Testing Library for component tests, Playwright for E2E testing

### Key Features
1. **Privacy-First Architecture**: No server communication, all data processing happens client-side
2. **JSON Resume Schema Compliance**: Strict adherence to JSON Resume v1.2.1 specification
3. **Multiple Export Formats**: PDF, DOCX, HTML, JSON Resume, and HR-Open JSON export
4. **Advanced Theme System**: Full theme customization with live preview
5. **Section Visibility Controls**: Toggle visibility for all resume sections and individual items
6. **Graceful Import Handling**: Robust validation and error handling for invalid resume data
7. **Non-Conforming Data Management**: Special handling for data that doesn't fit standard schema
8. **Responsive Design**: Mobile-first approach with responsive breakpoints
9. **Undo/Redo Functionality**: Complete history management for user actions
10. **Auto-Save**: Automatic localStorage persistence with manual import/export backup
11. **Accessibility**: Full keyboard navigation, screen reader support, and WCAG compliance
12. **ATS-Friendly Output**: Properly structured exports optimized for Applicant Tracking Systems

## User Personas & Use Cases

### Casual Explorer
Wants to try the app without commitment. Can immediately see a sample resume and test editing, then preview output. The app works with zero setup and provides instant value demonstration.

### Recruiter/Employer (Viewer)
Receives a link that leads directly to view mode. Can easily export to PDF for review and filing. Sees well-formatted documents with ATS-friendly structure and proper keyword optimization.

### Non-Technical Regular User
Uses the app as primary resume tool. Benefits from simple import/export functionality and friendly UI for content editing. Relies on localStorage to persist work between sessions with clear backup options.

### Technical Regular User
May self-host the application and expects high code quality with extension possibilities. Can interact directly with JSON data and customize templates or add new sections as needed.

### Power User
Utilizes advanced features like custom theme creation and template modification. Can swap default DOCX templates with custom designs and leverage all export formats for different use cases.

### Privacy-Conscious User
Values the no-backend architecture and local data storage. Appreciates the ability to use the application without creating accounts or sharing personal information with third parties.

## File Structure

### Core Application Files
- `src/App.tsx` - Main application component with routing and global providers
- `src/main.tsx` - Application entry point with React and provider setup
- `src/index.css` - Global styles and Tailwind CSS imports

### Context & State Management
- `src/context/ResumeContext.tsx` - Global state management for resume data with undo/redo
- `src/context/ThemeContext.tsx` - Theme management and customization state

### Type Definitions
- `src/types/resume.ts` - Complete TypeScript definitions for resume data structure
- `src/types/theme.ts` - Theme configuration and customization types
- Includes extensions for visibility toggles and non-conforming data handling
- Matches JSON Resume Schema v1.2.1 with custom enhancements

### Pages
- `src/pages/Landing.tsx` - Homepage with app introduction and privacy messaging
- `src/pages/ResumeEditor.tsx` - Main editing interface with form-based editing
- `src/pages/ResumeView.tsx` - Formatted resume display and export functionality
- `src/pages/ThemeEditor.tsx` - Theme customization interface with live preview
- `src/pages/NotFound.tsx` - 404 error page

### Editor Components
- `src/components/editor/BasicEditor.tsx` - Personal information and contact details
- `src/components/editor/WorkEditor.tsx` - Work experience with highlights management
- `src/components/editor/EducationEditor.tsx` - Academic background and certifications
- `src/components/editor/SkillsEditor.tsx` - Skills with proficiency levels and categories
- `src/components/editor/ProjectsEditor.tsx` - Personal and professional project portfolio
- `src/components/editor/AwardsEditor.tsx` - Awards, honors, and recognition
- `src/components/editor/LanguagesEditor.tsx` - Language proficiency with fluency levels
- `src/components/editor/VolunteerEditor.tsx` - Volunteer work and community involvement
- `src/components/editor/CertificatesEditor.tsx` - Professional certifications and licenses
- `src/components/editor/PublicationsEditor.tsx` - Articles, papers, and published works
- `src/components/editor/ReferencesEditor.tsx` - Professional references management
- `src/components/editor/InterestsEditor.tsx` - Hobbies and personal interests
- `src/components/editor/SectionVisibilityEditor.tsx` - Global section visibility controls

### Export & Import Components
- `src/components/export/PDFExporter.tsx` - PDF generation with formatting controls
- `src/components/export/DOCXExporter.tsx` - Microsoft Word document generation
- `src/components/export/HTMLExporter.tsx` - Standalone HTML export
- `src/components/export/JSONExporter.tsx` - JSON Resume format export
- `src/components/export/HROpenExporter.tsx` - HR-Open JSON format export

### Theme & Display Components
- `src/components/theme/ThemePreview.tsx` - Live theme preview component
- `src/components/theme/ColorPicker.tsx` - Color customization interface
- `src/components/theme/FontSelector.tsx` - Typography selection and preview
- `src/components/theme/LayoutControls.tsx` - Layout and spacing customization
- `src/components/display/ResumeRenderer.tsx` - Main resume display component
- `src/components/display/SectionRenderer.tsx` - Individual section formatting

### Utility Components
- `src/components/NonConformingDataViewer.tsx` - Display and manage invalid import data
- `src/components/ui/` - Reusable UI components from shadcn/ui
- `src/components/common/ConfirmDialog.tsx` - Confirmation dialogs for destructive actions
- `src/components/common/LoadingSpinner.tsx` - Loading states and feedback
- `src/components/common/Toast.tsx` - User feedback and notifications

### Schema & Validation
- `src/schemas/jsonResume.ts` - JSON Resume schema TypeScript definitions
- `src/schemas/jsonresume/v1.2.1/schema.json` - Official JSON Resume schema
- `src/schemas/hrOpen.ts` - HR Open schema support with mapping functions
- `src/validation/resumeValidator.ts` - Comprehensive validation logic
- `src/validation/fieldValidators.ts` - Individual field validation functions

### Utilities
- `src/utils/importExport.ts` - Multi-format import/export functionality with validation
- `src/utils/defaultData.ts` - Default resume template data and sample content
- `src/utils/defaultThemes.ts` - Default theme configurations and color schemes
- `src/utils/localStorage.ts` - LocalStorage management with error handling
- `src/utils/formatters.ts` - Date, text, and data formatting utilities
- `src/utils/pdfGenerator.ts` - PDF creation with layout optimization
- `src/utils/docxGenerator.ts` - DOCX template processing and generation

### Test Infrastructure
- `src/**/*.test.ts` - Unit tests alongside source files
- `src/components/**/*.test.tsx` - Component tests with React Testing Library
- `tests/e2e/` - End-to-end test suites
- `tests/e2e/pageObjects/` - Page object patterns for E2E tests
- `vitest.config.ts` - Vitest configuration with coverage targets ≥85%
- `playwright.config.ts` - Playwright configuration for cross-browser testing

### Public Assets
- `public/resume.json` - Default resume template matching deployed version
- `public/templates/` - DOCX templates for document export
- `public/themes/` - Additional theme configurations

## Data Structure

### Resume Data Schema
The application follows JSON Resume Schema v1.2.1 with privacy-focused extensions:

#### Core Sections (JSON Resume Standard)
- `basics` - Personal information, contact details, summary, and location
- `work` - Employment history with company, position, dates, and highlights
- `volunteer` - Volunteer experience with organization and impact details
- `education` - Academic background including institution, degree, and dates
- `skills` - Technical and soft skills with proficiency levels and keywords
- `awards` - Recognition, honors, and achievements with dates and details
- `certificates` - Professional certifications and licenses with expiration dates
- `publications` - Articles, papers, books, and published works
- `languages` - Language proficiency with fluency levels
- `interests` - Hobbies, personal interests, and activities
- `references` - Professional references with contact information
- `projects` - Personal and professional projects with descriptions and links

#### Privacy & Control Extensions
- `sectionVisibility` - Boolean flags for showing/hiding entire sections
- `visible` property on individual items - Control visibility of specific entries
- `nonConformingData` - Container for invalid import data requiring manual review
- `exportSettings` - User preferences for different export formats
- `themeSettings` - Custom theme configurations and overrides

### State Management Pattern
Uses React Context with useReducer for:
- Centralized resume data management with type safety
- Undo/redo functionality with complete history tracking
- Auto-save to localStorage
- Theme state management with live preview updates
- Import/export state with progress tracking and error handling

## User Interface Design

### Design Philosophy
Modern minimalist design with lots of white space, clean lines, and intuitive icons. The interface doesn't distract from resume content creation. Uses a privacy-first messaging approach with clear data handling explanations.

### Responsive Breakpoints
- Mobile: < 640px (sm) - Stacked layout, essential functions, touch-optimized
- Tablet: 640px - 1024px (md/lg) - Condensed side-by-side layout
- Desktop: > 1024px (xl) - Full feature set with optimal spacing

### Navigation & Layout
- **Landing Page**: Clean introduction with privacy messaging and quick start
- **Edit Mode**: Form-based editing with section navigation and live validation
- **View Mode**: Formatted resume display with export options
- **Theme Editor**: Visual customization with real-time preview
- **Toggle Navigation**: Easy switching between Edit and View modes

### Accessibility Features
- Complete keyboard navigation (Tab, Enter, Space, Arrow keys)
- Screen reader support with semantic HTML and ARIA labels
- High contrast color schemes and sufficient color contrast ratios
- Touch-friendly interface elements (minimum 44px touch targets)
- Focus indicators and skip navigation links
- Proper heading hierarchy and landmark regions

### User Experience Elements
- Confirm dialogs for destructive actions ("Clear all data", "Delete section")
- Toast notifications for user feedback ("Resume saved", "Export completed")
- Loading states for export operations
- Progressive disclosure of complex features
- Contextual help and tooltips
- Keyboard shortcuts for power users

### Responsive Element Architecture
- **Single Responsive Elements**: One DOM element per logical UI component, not separate mobile/desktop versions
- **Unique Test IDs**: Each logical element has one test ID across all screen sizes for consistent testing
- **Progressive Disclosure**: Use CSS classes to show/hide text content based on breakpoints
- **Elimination of Duplicates**: No duplicate buttons or controls that create testing ambiguity
- **Benefits**: 
  - Avoids Playwright "strict mode violations" from multiple matching elements
  - Simplifies state management (no syncing across duplicate elements)
  - Easier maintenance with changes applied in one place
  - Better accessibility (screen readers encounter each element once)
  - Consistent user experience across device types

## Import/Export Functionality

### Import Capabilities
- **JSON Resume Format**: Full v1.2.1 schema support with validation
- HR open resume import with sensible mappings between the two standards.
- **Schema Validation**: Real-time validation with detailed error reporting
- **Graceful Error Handling**: Invalid data preservation for manual review
- **Backup Import**: User's exported backup files with full fidelity
- **Drag & Drop**: Intuitive file import interface

### Export Formats

#### JSON Resume Export
- Clean v1.2.1 compliant output with validation
- Strips internal visibility flags and metadata
- Proper file naming with timestamps
- Validation before export with error reporting

#### PDF Export
- Professional formatting with consistent typography
- Optimized page breaks and section flow
- ATS-friendly structure with proper heading hierarchy
- Custom styling based on selected theme
- Print-optimized margins and spacing
- **Unicode Support**: Intelligent character handling with automatic fallback (see [Unicode Font Guide](docs/UNICODE_FONTS_GUIDE.md))

#### DOCX Export
- Microsoft Word compatibility with proper formatting
- Template-based generation with customizable layouts
- Maintains formatting consistency across platforms
- Supports custom templates and branding
- Compatible with corporate document standards

#### HTML Export
- Standalone HTML with embedded CSS
- Responsive design for web viewing
- SEO-optimized structure and metadata
- Print-friendly CSS for physical copies
- Accessible markup with proper semantic structure

#### HR-Open JSON Export
- Industry standard HR-Open schema compliance
- Proper field mapping from JSON Resume data
- ATS integration compatibility
- Structured data for automated processing

### Auto-Save & Persistence
- Automatic localStorage saves on every data change
- Export reminders for backup creation
- Session recovery after browser crashes
- Data integrity validation on load

## Theme System

### Theme Architecture
- Comprehensive visual customization system
- Live preview with real-time updates
- Multiple theme presets with professional styling
- Custom color scheme creation
- Typography selection with web-safe fonts
- Layout and spacing customization

### Theme Components
- **Color Schemes**: Primary, secondary, accent colors with contrast validation
- **Typography**: Font families, sizes, weights, and line spacing
- **Layout**: Margins, padding, section spacing, and column layouts
- **Visual Elements**: Borders, shadows, icons, and decorative elements
- **Export Styling**: Format-specific optimizations (PDF margins, DOCX styles)

### Theme Editor Interface
- Visual color picker with accessibility validation
- Font preview with real resume content
- Layout adjustment controls with live preview
- Export format-specific settings
- Theme save/load functionality
- Reset to defaults option

## Validation & Error Handling

### Schema Validation
- Real-time validation against JSON Resume v1.2.1 schema
- Field-level validation for emails, URLs, phone numbers, and dates
- Custom validation rules for resume-specific requirements
- Type safety through comprehensive TypeScript definitions
- Graceful degradation for partial or invalid data

### Error Recovery
- Non-destructive import process with data preservation
- Clear error messages with resolution guidance
- Fallback values for corrupted or missing data
- Undo/redo functionality for mistake recovery
- Session recovery with automatic backups

### Data Integrity
- Validation before export operations
- Consistency checks across related fields
- Format-specific validation (PDF layout, DOCX compatibility)
- User confirmation for potentially problematic data

## Testing Infrastructure

### Unit Tests (Vitest)
- **Coverage Target**: ≥85% on critical modules
- **Test Files**: `*.test.ts` alongside source files
- **Focus Areas**: Export functions, validation logic, data transformations
- **Utilities Testing**: Date formatters, schema validators, localStorage helpers

### Component Tests (React Testing Library)
- **Editor Components**: Form behavior, data binding, validation feedback
- **Display Components**: Rendering accuracy, theme application, responsiveness
- **Integration**: Context providers, state management, user interactions
- **Accessibility**: Keyboard navigation, screen reader compatibility

### End-to-End Tests (Playwright)
- **Core User Flows**:
  1. Load app → import sample JSON → verify form population
  2. Edit fields → toggle to view → assert changes in rendered resume
  3. Export JSON → re-import → assert roundtrip fidelity
  4. Export PDF → validate blob dimensions and content
  5. Theme customization → export → verify styling application
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Mobile, tablet, desktop breakpoints
- **Page Object Patterns**: Maintainable test organization

## Performance & Optimization

### Client-Side Performance
- Efficient React rendering with proper hooks usage
- Lazy loading for non-critical components
- Optimized bundle size with code splitting
- LocalStorage operations with debouncing

### Export Performance
- Asynchronous export operations with progress indicators
- Optimized PDF generation with proper page handling
- Efficient DOCX template processing

## Security & Privacy

### Privacy-First Architecture
- No server communication for core functionality
- All data processing happens client-side
- LocalStorage with user control
- No tracking or analytics
- Clear data handling policies and user education

### Data Security
- Client-side validation and sanitization
- Safe HTML generation for exports
- Secure file handling for imports

## Development Guidelines

### Code Standards
- TypeScript for all new code with strict type checking
- Component size limit: <200 lines for maintainability
- Consistent naming conventions across the codebase
- Single responsibility principle for components and utilities
- Comprehensive error handling and user feedback

### State Management Patterns
- Centralized state through React Context
- Immutable state updates with proper action dispatching
- History tracking for undo/redo functionality
- Validation before state mutations
- Optimistic updates with rollback capability

### Styling Guidelines
- Tailwind CSS utilities for consistent styling
- Responsive-first approach with mobile optimization
- shadcn/ui components for consistent patterns
- Accessibility considerations in all styling decisions
- Theme system integration for customizable appearance

### Testing Requirements
- **Data Test IDs**: All interactive elements use `data-testid` attributes for stable test identification
- **Unit Tests**: Vitest for all utility functions with ≥85% coverage
- **Component Tests**: React Testing Library for user interaction flows
- **E2E Tests**: Playwright for critical user journeys across browsers
- **Accessibility Testing**: WCAG 2.1 AA compliance validation in test suites

### Testing Best Practices
- Use `data-testid` attributes instead of CSS classes or IDs for element identification
- Follow naming convention: `data-testid="section-action-element"` (e.g., `data-testid="landing-get-started-button"`)
- Test user interactions, not implementation details
- Include accessibility checks in all component and E2E tests
- Use page object patterns for maintainable E2E tests

### Accessibility Standards
- WCAG 2.1 AA compliance across all features
- Semantic HTML with proper heading hierarchy
- Keyboard navigation for all interactive elements
- Screen reader compatibility with ARIA labels
- Color contrast validation in theme system
- Touch target sizes for mobile usability

## API Integration Points

While the core application operates without server communication, integration points exist for advanced features:

### Optional External Services
- Resume optimization AI services (with user API keys)
- Resume/Job-board publishing APIs (driven by user selection and warning of external terms of service implications)

### Self-Hosting Considerations
- Static file hosting requirements
- Custom domain configuration
- Analytics integration options (privacy-focused)
- Backup and recovery procedures

This comprehensive knowledge base serves as the definitive guide for No Strings Resume development, ensuring consistent implementation of privacy-first resume building with professional export capabilities and complete user data control.
