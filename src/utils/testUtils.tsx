import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

/**
 * Utility functions for testing RadixUI components
 */

/**
 * Interact with a RadixUI Select component
 */
export const selectOption = async (triggerLabel: string, optionText: string) => {
  const user = userEvent.setup();
  
  // Find and click the select trigger
  const trigger = screen.getByRole('combobox', { name: triggerLabel });
  await user.click(trigger);
  
  // Wait for options to appear and click the desired option
  await waitFor(async () => {
    const option = screen.getByText(optionText);
    await user.click(option);
  });
};

/**
 * Get a RadixUI Select value by its accessible name
 */
export const getSelectValue = (label: string) => {
  const select = screen.getByRole('combobox', { name: label });
  return select.getAttribute('data-value') || select.textContent;
};

/**
 * Interact with a RadixUI Slider component
 */
export const setSliderValue = async (sliderLabel: string, value: number) => {
  const user = userEvent.setup();
  const slider = screen.getByRole('slider', { name: sliderLabel });
  
  // Focus the slider and use keyboard to set value
  await user.click(slider);
  await user.keyboard(`{ArrowRight>}${value}{/ArrowRight}`);
};

/**
 * Check if a RadixUI component is visible
 */
export const expectComponentVisible = (role: string, name?: string) => {
  const element = name 
    ? screen.getByRole(role, { name })
    : screen.getByRole(role);
  
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
  return element;
};

/**
 * Wait for RadixUI component state changes
 */
export const waitForRadixUpdate = async (callback: () => void) => {
  await waitFor(callback, { timeout: 1000 });
};

/**
 * Helper to suppress act warnings for specific test blocks
 */
export const suppressActWarnings = (testFn: () => void | Promise<void>) => {
  const originalError = console.error;
  console.error = (msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('act(')) return;
    originalError(msg, ...args);
  };
  
  const result = testFn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      console.error = originalError;
    });
  } else {
    console.error = originalError;
    return result;
  }
};

/**
 * Custom matcher for checking RadixUI component states
 */
export const expectRadixComponent = {
  toBeExpanded: (element: Element) => {
    expect(element).toHaveAttribute('data-state', 'open');
  },
  toBeCollapsed: (element: Element) => {
    expect(element).toHaveAttribute('data-state', 'closed');
  },
  toBeSelected: (element: Element) => {
    expect(element).toHaveAttribute('data-selected', 'true');
  },
  toBeDisabled: (element: Element) => {
    expect(element).toHaveAttribute('data-disabled', 'true');
  }
}; 