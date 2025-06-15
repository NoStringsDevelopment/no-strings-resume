
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeProvider } from '@/context/ResumeContext';
import EducationEditor from './EducationEditor';

const renderEducationEditor = () => {
  return render(
    <ResumeProvider>
      <EducationEditor />
    </ResumeProvider>
  );
};

describe('EducationEditor', () => {
  it('renders education editor with correct header', () => {
    renderEducationEditor();
    
    expect(screen.getByTestId('education-editor')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByTestId('education-visibility-toggle')).toBeInTheDocument();
  });

  it('shows empty state when no education entries', () => {
    renderEducationEditor();
    
    expect(screen.getByTestId('no-education-message')).toBeInTheDocument();
    expect(screen.getByTestId('add-first-education-button')).toBeInTheDocument();
  });

  it('allows adding new education entries', () => {
    renderEducationEditor();
    
    const addButton = screen.getByTestId('add-education-button');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('education-0-card')).toBeInTheDocument();
    expect(screen.getByTestId('education-0-institution-input')).toBeInTheDocument();
    expect(screen.getByTestId('education-0-area-input')).toBeInTheDocument();
    expect(screen.getByTestId('education-0-study-type-input')).toBeInTheDocument();
    expect(screen.getByTestId('education-0-visibility-toggle')).toBeInTheDocument();
  });

  it('allows adding courses to education entries', () => {
    renderEducationEditor();
    
    // Add education first
    fireEvent.click(screen.getByTestId('add-education-button'));
    
    // Add a course
    const addCourseButton = screen.getByTestId('education-0-add-course-button');
    fireEvent.click(addCourseButton);
    
    expect(screen.getByTestId('education-0-course-1')).toBeInTheDocument();
    expect(screen.getByTestId('education-0-course-1-input')).toBeInTheDocument();
    expect(screen.getByTestId('education-0-course-1-remove-button')).toBeInTheDocument();
  });

  it('enables spell check on appropriate fields', () => {
    renderEducationEditor();
    
    fireEvent.click(screen.getByTestId('add-education-button'));
    
    expect(screen.getByTestId('education-0-institution-input')).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByTestId('education-0-area-input')).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByTestId('education-0-study-type-input')).toHaveAttribute('spellcheck', 'true');
  });
});
