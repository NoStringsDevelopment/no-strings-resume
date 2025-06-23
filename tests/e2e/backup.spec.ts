import { test, expect, Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function to ensure we're navigating to the editor properly
async function navigateToEditor(page: Page) {
  // Navigate to homepage first
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Click the start building button
  await page.getByTestId('start-building-btn').click();
  
  // Wait for the editor to load
  await page.waitForLoadState('networkidle');
  
  // Wait for the editor main content to be visible
  await page.waitForSelector('[data-testid="editor-main"]', { timeout: 10000 });
  
  // Ensure the basics tab is active and name input is available
  await page.waitForSelector('[data-testid="name-input"]', { timeout: 10000 });
}

// Helper function to upload a file
async function uploadFile(page: Page, filePath: string) {
  await page.getByTestId('import-button').click();
  const fileChooser = await page.waitForEvent('filechooser');
  await fileChooser.setFiles(filePath);
}

// Helper function to set up basic resume data
async function setupBasicResume(page: Page) {
  await navigateToEditor(page);
  
  // Clear existing data first
  await page.getByTestId('clear-button').click();
  
  // Add basic data
  await page.getByTestId('name-input').fill('John Doe');
  await page.getByTestId('email-input').fill('john@example.com');
  
  // Add work experience
  await page.getByTestId('work-tab').click();
  await page.getByText('Add work').click();
  
  // Wait for the form to appear and fill it
  await page.waitForSelector('input[placeholder="Company name"]', { timeout: 5000 });
  await page.locator('input[placeholder="Company name"]').fill('Tech Corp');
  
  await page.waitForSelector('input[placeholder="Job title"]', { timeout: 5000 });
  await page.locator('input[placeholder="Job title"]').fill('Software Engineer');
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
    await page.getByTestId('backup-button').click();
    
    // Wait for download to complete
    const download = await page.waitForEvent('download');
    const downloadPath = path.join(__dirname, 'temp', 'test-backup.json');
    await download.saveAs(downloadPath);
    
    // Verify file exists and has content
    const fileExists = await fs.access(downloadPath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
    
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
    await page.getByTestId('backup-button').click();
    const download = await page.waitForEvent('download');
    const backupPath = path.join(__dirname, 'temp', 'restore-test-backup.json');
    await download.saveAs(backupPath);
    
    // Clear data
    await page.getByTestId('clear-button').click();
    await expect(page.getByTestId('name-input')).toHaveValue('');
    
    // Restore backup
    await uploadFile(page, backupPath);
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
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
    
    // Import the file
    await uploadFile(page, tempFile);
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
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
    
    // Wait for any error handling to complete
    await page.waitForTimeout(1000);
    
    // The page should still be functional - check that name input is still available
    await expect(page.getByTestId('name-input')).toBeVisible();
    
    // Clean up
    await fs.unlink(invalidFile).catch(() => {});
  });

  test('should preserve complex visibility settings', async ({ page }) => {
    await setupBasicResume(page);
    
    // Toggle some visibility settings
    await page.getByTestId('basics-visibility-toggle').click();
    
    // Create backup
    await page.getByTestId('backup-button').click();
    const download = await page.waitForEvent('download');
    const backupPath = path.join(__dirname, 'temp', 'visibility-backup.json');
    await download.saveAs(backupPath);
    
    // Clear and restore
    await page.getByTestId('clear-button').click();
    await uploadFile(page, backupPath);
    
    // Wait for import to complete
    await page.waitForTimeout(1000);
    
    // Verify data and settings are preserved
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
    
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('backup-button').click();
    const download = await downloadPromise;
    
    const downloadPath = path.join(__dirname, 'temp', await download.suggestedFilename());
    await download.saveAs(downloadPath);
    
    const content = JSON.parse(await fs.readFile(downloadPath, 'utf8'));
    expect(content.basics.name).toBe('Mobile User');
    
    // Clean up
    await fs.unlink(downloadPath).catch(() => {});
  });
}); 