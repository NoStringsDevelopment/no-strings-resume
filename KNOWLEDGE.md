
# No Strings Resume - Project Knowledge Base

## Overview
No Strings Resume is a modern, web-based resume builder that follows the JSON Resume schema standard. It provides a user-friendly interface for creating, editing, and managing professional resumes while ensuring compatibility with the JSON Resume specification.

## Architecture

### Core Technologies
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Context with useReducer pattern
- **Build Tool**: Vite
- **Icons**: Lucide React

### Key Features
1. **JSON Resume Schema Compliance**: Strict adherence to JSON Resume v1.2.1 specification
2. **Graceful Import Handling**: Robust validation and error handling for invalid resume data
3. **Section Visibility Controls**: Toggle visibility for all resume sections and individual items
4. **Non-Conforming Data Management**: Special handling for data that doesn't fit the standard schema
5. **Responsive Design**: Mobile-first approach with responsive breakpoints
6. **Undo/Redo Functionality**: Complete history management for user actions
7. **Import/Export**: JSON Resume format support with validation

## File Structure

### Core Application Files
- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `src/index.css` - Global styles and Tailwind imports

### Context & State Management
- `src/context/ResumeContext.tsx` - Global state management for resume data
- `src/context/ThemeContext.tsx` - Theme management (for future theming features)

### Type Definitions
- `src/types/resume.ts` - Complete TypeScript definitions for resume data structure
- Includes extensions for visibility toggles and non-conforming data handling
- Matches JSON Resume Schema v1.2.1 with custom enhancements

### Pages
- `src/pages/Landing.tsx` - Homepage/landing page
- `src/pages/ResumeEditor.tsx` - Main editing interface
- `src/pages/ResumeView.tsx` - Resume preview/display
- `src/pages/ThemeEditor.tsx` - Theme customization (future feature)
- `src/pages/NotFound.tsx` - 404 error page

### Editor Components
- `src/components/editor/BasicEditor.tsx` - Personal information editing
- `src/components/editor/WorkEditor.tsx` - Work experience management
- `src/components/editor/EducationEditor.tsx` - Education history
- `src/components/editor/SkillsEditor.tsx` - Skills and competencies
- `src/components/editor/ProjectsEditor.tsx` - Project portfolio
- `src/components/editor/AwardsEditor.tsx` - Awards and recognition
- `src/components/editor/LanguagesEditor.tsx` - Language proficiency
- `src/components/editor/AdditionalSectionsEditor.tsx` - Certificates, Publications, etc.
- `src/components/editor/SectionVisibilityEditor.tsx` - Global section visibility controls

### Utility Components
- `src/components/NonConformingDataViewer.tsx` - Display and manage invalid import data
- `src/components/ui/` - Reusable UI components from shadcn/ui

### Schema & Validation
- `src/schemas/jsonResume.ts` - JSON Resume schema TypeScript definitions
- `src/schemas/jsonresume/v1.2.1/schema.json` - Official JSON Resume schema
- `src/schemas/hrOpen.ts` - HR Open schema support (alternative format)

### Utilities
- `src/utils/importExport.ts` - Resume import/export functionality with validation
- `src/utils/defaultData.ts` - Default resume template data
- `src/utils/defaultThemes.ts` - Default theme configurations

### Public Assets
- `public/resume.json` - Default resume template (matches the deployed version)

## Data Structure

### Resume Data Schema
The application strictly follows JSON Resume Schema v1.2.1 with these extensions:

#### Core Sections (as per JSON Resume)
- `basics` - Personal information, contact details, summary
- `work` - Employment history with highlights
- `volunteer` - Volunteer experience
- `education` - Academic background
- `skills` - Technical and soft skills with proficiency levels
- `awards` - Recognition and honors
- `certificates` - Professional certifications
- `publications` - Articles, papers, books
- `languages` - Language proficiency
- `interests` - Hobbies and personal interests
- `references` - Professional references
- `projects` - Personal and professional projects

#### Custom Extensions
- `sectionVisibility` - Boolean flags for showing/hiding entire sections
- `visible` property on individual items - Control visibility of specific entries
- `nonConformingData` - Container for invalid import data that needs manual review

### State Management Pattern
Uses React Context with useReducer for:
- Centralized resume data management
- Undo/redo functionality with history tracking
- Type-safe action dispatching
- Optimistic updates with rollback capability

## User Interface Design

### Responsive Breakpoints
- Mobile: < 640px (sm) - Minimal UI, essential functions only
- Tablet: 640px - 1024px (md/lg) - Condensed layout
- Desktop: > 1024px (xl) - Full feature set

### Header Responsiveness
- Mobile: Show only icons, hide text labels
- Tablet: Show some labels (View, Theme)
- Desktop: Show all labels and separators

### Navigation
- NR logo links to homepage
- Tab-based section navigation
- Clear visual indicators for sections with data/issues

## Import/Export Functionality

### Import Features
- JSON file validation against JSON Resume schema
- Graceful error handling for invalid data
- Non-conforming data preservation for manual review
- Visual feedback for import issues
- Safe defaults for missing or invalid fields

### Export Features
- Clean JSON Resume format output
- Validation before export
- Proper file naming and MIME types

## Validation & Error Handling

### Schema Validation
- Real-time validation against JSON Resume schema
- Field-level validation for required formats (email, URL, dates)
- Type safety through TypeScript definitions

### Error Recovery
- Non-destructive import process
- Preservation of original data for manual review
- Clear error messages and resolution guidance
- Fallback values for corrupted data

## Best Practices Implemented

### Code Organization
- Single responsibility principle for components
- Clear separation of concerns
- Consistent naming conventions
- Type-safe development

### User Experience
- Progressive disclosure of complexity
- Clear visual hierarchy
- Consistent interaction patterns
- Responsive feedback for user actions

### Performance
- Efficient re-rendering with proper React patterns
- Lazy loading where appropriate
- Optimized bundle size

## Development Guidelines

### Component Creation
- Keep components focused and small (< 200 lines)
- Use TypeScript for all new code
- Follow shadcn/ui patterns for consistency
- Include proper error boundaries

### State Updates
- Always use dispatch actions for state changes
- Maintain history for undo/redo functionality
- Validate data before state updates
- Handle edge cases gracefully

### Styling
- Use Tailwind CSS utilities
- Follow responsive-first approach
- Maintain consistent spacing and colors
- Use shadcn/ui components as base

## Future Enhancements

### Planned Features
- PDF export functionality
- Multiple resume templates
- Advanced theming system
- Resume analytics and optimization
- Collaborative editing
- Integration with job boards

### Technical Improvements
- Better caching strategies
- Enhanced validation rules
- Accessibility improvements
- Performance optimizations

## Troubleshooting

### Common Issues
1. **Import Failures**: Check JSON format and schema compliance
2. **Missing Data**: Verify all required fields are populated
3. **Display Issues**: Check section visibility settings
4. **Performance**: Monitor state update frequency

### Debug Tools
- Browser developer tools
- React Developer Tools
- Console logging for state changes
- Network tab for import/export issues

## Contributing

### Code Standards
- Follow existing patterns and conventions
- Add TypeScript types for all new interfaces
- Include proper error handling
- Test responsive design on multiple screen sizes
- Validate against JSON Resume schema

### Testing Approach
- Manual testing across device sizes
- Import/export validation with various data formats
- Edge case handling for malformed data
- Accessibility testing

This knowledge base should be updated as the application evolves and new features are added.
