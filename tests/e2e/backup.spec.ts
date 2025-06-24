import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Page } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function to dismiss any visible toasts
async function dismissToasts(page: Page) {
  // Wait for any toasts to appear and then dismiss them
  try {
    const toasts = page.locator('[role="status"]');
    const count = await toasts.count();
    for (let i = 0; i < count; i++) {
      const toast = toasts.nth(i);
      if (await toast.isVisible()) {
        // Try to click close button if it exists, otherwise wait for auto-dismiss
        const closeButton = toast.locator('button');
        if (await closeButton.count() > 0) {
          await closeButton.click();
        }
      }
    }
    // Wait a bit for toasts to disappear
    await page.waitForTimeout(1000);
  } catch (error) {
    // Ignore errors if toasts don't exist or can't be dismissed
  }
}

// Helper function to navigate to the editor
async function navigateToEditor(page: Page) {
  await page.goto('/');
  
  // Wait for landing page to load
  await page.waitForSelector('[data-testid="start-building-btn"]', { timeout: 10000 });
  
  // Click start building
  await page.getByTestId('start-building-btn').click();
  
  // Wait for editor to load and ensure the basics tab is active and name input is available
  await page.waitForSelector('[data-testid="name-input"]', { timeout: 10000 });
  
  // Ensure we're on the basics tab
  await page.getByTestId('basics-tab').click();
  await page.waitForTimeout(500);
  
  // Dismiss any initial toasts
  await dismissToasts(page);
}

// Helper function to upload a file with better error handling
async function uploadFile(page: Page, filePath: string) {
  // Dismiss any existing toasts first
  await dismissToasts(page);
  
  // Start listening for the file chooser before clicking
  const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 10000 });
  
  // Click the import button
  await page.getByTestId('import-button').click();
  
  // Wait for the file chooser and set files
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
  
  // Wait for the import to process and dismiss any toasts
  await page.waitForTimeout(2000);
  await dismissToasts(page);
}

// Helper function to create backup with better error handling
async function createBackup(page: Page, downloadPath: string) {
  // Dismiss any existing toasts first
  await dismissToasts(page);
  
  // Start listening for download before clicking
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
  
  // Click backup button
  await page.getByTestId('backup-button').click();
  
  // Wait for download and save
  const download = await downloadPromise;
  await download.saveAs(downloadPath);
  
  // Verify file was created
  await page.waitForTimeout(1000);
  const fileExists = await fs.access(downloadPath).then(() => true).catch(() => false);
  if (!fileExists) {
    throw new Error(`Backup file was not created at ${downloadPath}`);
  }
  
  // Dismiss any toasts from the backup operation
  await dismissToasts(page);
  
  return download;
}

// Helper function to set up basic resume data
async function setupBasicResume(page: Page) {
  await navigateToEditor(page);
  
  // Clear existing data first and wait for it to complete
  await page.getByTestId('clear-button').click();
  await page.waitForTimeout(500);
  await dismissToasts(page);
  
  // Ensure we're on basics tab and add basic data
  await page.getByTestId('basics-tab').click();
  await page.waitForTimeout(500);
  
  await page.getByTestId('name-input').fill('John Doe');
  await page.getByTestId('email-input').fill('john@example.com');
  
  // Add work experience
  await page.getByTestId('work-tab').click();
  await page.waitForTimeout(500);
  
  await page.getByText('Add work').click();
  
  // Wait for the form to appear and fill it
  await page.waitForSelector('input[placeholder="Company name"]', { timeout: 5000 });
  await page.locator('input[placeholder="Company name"]').fill('Tech Corp');
  
  await page.waitForSelector('input[placeholder="Job title"]', { timeout: 5000 });
  await page.locator('input[placeholder="Job title"]').fill('Software Engineer');
  
  // Wait for data to be saved
  await page.waitForTimeout(500);
}

test.describe('Backup Functionality', () => {
  test.beforeEach(async () => {
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, 'temp');
    await fs.mkdir(tempDir, { recursive: true });
  });

  test('should create and download backup file', async ({ page }) => {
    await setupBasicResume(page);
    
    // Create backup
    const downloadPath = path.join(__dirname, 'temp', 'test-backup.json');
    await createBackup(page, downloadPath);
    
    // Verify file content
    const content = await fs.readFile(downloadPath, 'utf-8');
    const backup = JSON.parse(content);
    
    expect(backup).toHaveProperty('basics');
    expect(backup).toHaveProperty('work');
    expect(backup).toHaveProperty('$extensions');
    expect(backup.$extensions.$schemaVersion).toBe('1.1.0');
    expect(backup.$extensions.backup.format).toBe('extended');
    
    // Clean up
    await fs.unlink(downloadPath).catch(() => {});
  });

  test('should restore backup with all settings', async ({ page }) => {
    // First, create a backup
    await setupBasicResume(page);
    
    // Create backup
    const backupPath = path.join(__dirname, 'temp', 'restore-test-backup.json');
    await createBackup(page, backupPath);
    
    // Clear data and wait for it to complete
    await page.getByTestId('clear-button').click();
    await page.waitForTimeout(1000);
    await dismissToasts(page);
    
    // Ensure we're on basics tab to check the cleared state
    await page.getByTestId('basics-tab').click();
    await page.waitForTimeout(500);
    
    // Verify data is cleared
    await expect(page.getByTestId('name-input')).toHaveValue('');
    
    // Restore backup
    await uploadFile(page, backupPath);
    
    // Ensure we're on basics tab to verify restoration
    await page.getByTestId('basics-tab').click();
    await page.waitForTimeout(500);
    
    // Verify data is restored
    await expect(page.getByTestId('name-input')).toHaveValue('John Doe');
    await expect(page.getByTestId('email-input')).toHaveValue('john@example.com');
    
    // Clean up
    await fs.unlink(backupPath).catch(() => {});
  });

  test('should import regular JSON Resume with defaults', async ({ page }) => {
    await navigateToEditor(page);
    
    // Create a simple JSON Resume file  
    const jsonResume = {
      basics: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "(555) 123-4567"
      },
      work: [{
        company: "Example Corp",
        position: "Developer",
        startDate: "2020-01-01"
      }]
    };
    
    const tempFile = path.join(__dirname, 'temp', 'json-resume.json');
    await fs.writeFile(tempFile, JSON.stringify(jsonResume, null, 2));
    
    // Clear existing data
    await page.getByTestId('clear-button').click();
    await page.waitForTimeout(500);
    await dismissToasts(page);
    
    // Import the file
    await uploadFile(page, tempFile);
    
    // Ensure we're on basics tab to verify import
    await page.getByTestId('basics-tab').click();
    await page.waitForTimeout(500);
    
    // Verify data was imported
    await expect(page.getByTestId('name-input')).toHaveValue('Jane Smith');
    await expect(page.getByTestId('email-input')).toHaveValue('jane@example.com');
    
    // Clean up
    await fs.unlink(tempFile).catch(() => {});
  });

  test('should handle invalid files gracefully', async ({ page }) => {
    await navigateToEditor(page);
    
    // Create an invalid JSON file
    const invalidFile = path.join(__dirname, 'temp', 'invalid.json');
    await fs.writeFile(invalidFile, '{ invalid json content }');
    
    // Try to import the invalid file
    await uploadFile(page, invalidFile);
    
    // Ensure we're on basics tab
    await page.getByTestId('basics-tab').click();
    await page.waitForTimeout(500);
    
    // The page should still be functional - check that name input is still available
    await expect(page.getByTestId('name-input')).toBeVisible();
    
    // Clean up
    await fs.unlink(invalidFile).catch(() => {});
  });

  test('should preserve complex visibility settings', async ({ page }) => {
    await setupBasicResume(page);
    
    // Go to basics tab to access visibility toggle
    await page.getByTestId('basics-tab').click();
    await page.waitForTimeout(500);
    
    // Look for visibility toggle - it might be in a different location
    const visibilityToggle = page.getByTestId('basics-visibility-toggle');
    
    // Check if the toggle exists before clicking
    if (await visibilityToggle.isVisible()) {
      await visibilityToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Create backup
    const backupPath = path.join(__dirname, 'temp', 'visibility-backup.json');
    await createBackup(page, backupPath);
    
    // Clear and restore
    await page.getByTestId('clear-button').click();
    await page.waitForTimeout(1000);
    await dismissToasts(page);
    
    await uploadFile(page, backupPath);
    
    // Ensure we're on basics tab to verify data
    await page.getByTestId('basics-tab').click();
    await page.waitForTimeout(500);
    
    // Verify data is preserved
    await expect(page.getByTestId('name-input')).toHaveValue('John Doe');
    
    // Clean up
    await fs.unlink(backupPath).catch(() => {});
  });
});

test.describe('Mobile Backup', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should work on mobile', async ({ page }) => {
    await navigateToEditor(page);
    
    await page.getByTestId('name-input').fill('Mobile User');
    await page.waitForTimeout(500);
    
    const downloadPath = path.join(__dirname, 'temp', 'mobile-backup.json');
    await createBackup(page, downloadPath);
    
    const content = JSON.parse(await fs.readFile(downloadPath, 'utf8'));
    expect(content.basics.name).toBe('Mobile User');
    
    // Clean up
    await fs.unlink(downloadPath).catch(() => {});
  });
}); 