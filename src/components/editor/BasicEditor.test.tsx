
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeProvider } from '@/context/ResumeContext';
import BasicEditor from './BasicEditor';

const renderBasicEditor = () => {
  return render(
    <ResumeProvider>
      <BasicEditor />
    </ResumeProvider>
  );
};

describe('BasicEditor', () => {
  it('renders the basic editor with all sections', () => {
    renderBasicEditor();
    
    expect(screen.getByTestId('basic-editor')).toBeInTheDocument();
    expect(screen.getByTestId('personal-info-card')).toBeInTheDocument();
    expect(screen.getByTestId('location-card')).toBeInTheDocument();
    expect(screen.getByTestId('profiles-card')).toBeInTheDocument();
  });

  it('displays all personal information fields', () => {
    renderBasicEditor();
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('label-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    expect(screen.getByTestId('url-input')).toBeInTheDocument();
    expect(screen.getByTestId('summary-input')).toBeInTheDocument();
  });

  it('displays all location fields', () => {
    renderBasicEditor();
    
    expect(screen.getByTestId('address-input')).toBeInTheDocument();
    expect(screen.getByTestId('city-input')).toBeInTheDocument();
    expect(screen.getByTestId('region-input')).toBeInTheDocument();
    expect(screen.getByTestId('postal-code-input')).toBeInTheDocument();
    expect(screen.getByTestId('country-code-input')).toBeInTheDocument();
  });

  it('allows adding new profiles', () => {
    renderBasicEditor();
    
    const addButton = screen.getByTestId('add-profile-button');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('profile-0')).toBeInTheDocument();
    expect(screen.getByTestId('profile-0-network-input')).toBeInTheDocument();
    expect(screen.getByTestId('profile-0-username-input')).toBeInTheDocument();
    expect(screen.getByTestId('profile-0-url-input')).toBeInTheDocument();
  });

  it('has visibility toggle for section', () => {
    renderBasicEditor();
    
    expect(screen.getByTestId('basics-visibility-toggle')).toBeInTheDocument();
  });

  it('updates input values correctly', () => {
    renderBasicEditor();
    
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput.value).toBe('John Doe');
  });

  it('enables spell check on appropriate text fields', () => {
    renderBasicEditor();
    
    expect(screen.getByTestId('name-input')).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByTestId('label-input')).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByTestId('summary-input')).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByTestId('address-input')).toHaveAttribute('spellcheck', 'true');
  });
});
