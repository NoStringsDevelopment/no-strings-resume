
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeProvider } from '@/context/ResumeContext';
import SkillsEditor from './SkillsEditor';

const renderSkillsEditor = () => {
  return render(
    <ResumeProvider>
      <SkillsEditor />
    </ResumeProvider>
  );
};

describe('SkillsEditor', () => {
  it('renders skills editor with section header', () => {
    renderSkillsEditor();
    
    expect(screen.getByTestId('skills-editor')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByTestId('skills-visibility-toggle')).toBeInTheDocument();
  });

  it('shows add skill button', () => {
    renderSkillsEditor();
    
    expect(screen.getByTestId('add-skill-button')).toBeInTheDocument();
  });

  it('shows empty state when no skills', () => {
    renderSkillsEditor();
    
    expect(screen.getByTestId('no-skills-message')).toBeInTheDocument();
    expect(screen.getByTestId('add-first-skill-button')).toBeInTheDocument();
  });

  it('allows adding new skills', () => {
    renderSkillsEditor();
    
    const addButton = screen.getByTestId('add-skill-button');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('skill-0-card')).toBeInTheDocument();
    expect(screen.getByTestId('skill-0-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('skill-0-level-input')).toBeInTheDocument();
    expect(screen.getByTestId('skill-0-visibility-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('skill-0-remove-button')).toBeInTheDocument();
  });

  it('allows adding keywords to skills', () => {
    renderSkillsEditor();
    
    // Add a skill first
    const addButton = screen.getByTestId('add-skill-button');
    fireEvent.click(addButton);
    
    // Add a keyword
    const addKeywordButton = screen.getByTestId('skill-0-add-keyword-button');
    fireEvent.click(addKeywordButton);
    
    expect(screen.getByTestId('skill-0-keyword-1')).toBeInTheDocument();
    expect(screen.getByTestId('skill-0-keyword-1-input')).toBeInTheDocument();
    expect(screen.getByTestId('skill-0-keyword-1-remove-button')).toBeInTheDocument();
  });

  it('enables spell check on text inputs', () => {
    renderSkillsEditor();
    
    fireEvent.click(screen.getByTestId('add-skill-button'));
    
    expect(screen.getByTestId('skill-0-name-input')).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByTestId('skill-0-level-input')).toHaveAttribute('spellcheck', 'true');
  });
});
