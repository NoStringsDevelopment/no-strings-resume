import { test, expect, Page } from '@playwright/test';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = join(__dirname, 'temp');

// Helper functions
async function ensureTempDir() {
  await fs.mkdir(TEMP_DIR, { recursive: true });
}

async function cleanupTempDir() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    for (const file of files) {
      await fs.unlink(join(TEMP_DIR, file));
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

async function downloadBackup(page: Page): Promise<string> {
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('backup-button').click();
  const download = await downloadPromise;
  
  const downloadPath = join(TEMP_DIR, await download.suggestedFilename());
  await download.saveAs(downloadPath);
  return downloadPath;
}

async function uploadFile(page: Page, filePath: string) {
  await page.getByTestId('import-button').click();
  const fileChooser = await page.waitForEvent('filechooser');
  await fileChooser.setFiles(filePath);
}

async function setupBasicResume(page: Page) {
  // Navigate to editor
  await page.goto('/');
  await page.getByTestId('start-building-btn').click();
  
  // Clear existing data
  await page.getByTestId('clear-button').click();
  
  // Add basic data
  await page.getByTestId('name-input').fill('John Doe');
  await page.getByTestId('email-input').fill('john@example.com');
  
  // Add work experience
  await page.getByTestId('work-tab').click();
  await page.getByText('Add work').click();
  await page.locator('input[placeholder="Company name"]').fill('Tech Corp');
  await page.locator('input[placeholder="Job title"]').fill('Engineer');
  
  // Hide the work entry to test visibility
  await page.getByTestId('work-0-visibility-toggle').click();
}

test.describe('Backup Functionality', () => {
  test.beforeEach(async () => {
    await ensureTempDir();
  });

  test.afterEach(async () => {
    await cleanupTempDir();
  });

  test('should create and download backup file', async ({ page }) => {
    await setupBasicResume(page);
    
    // Download backup
    const backupPath = await downloadBackup(page);
    
    // Verify file exists and has correct format
    const content = await fs.readFile(backupPath, 'utf8');
    const backup = JSON.parse(content);
    
    expect(backup).toHaveProperty('$extensions');
    expect(backup.$extensions.$schemaVersion).toBe('1.0.0');
    expect(backup.$extensions.backup.format).toBe('extended');
    expect(backup.basics.name).toBe('John Doe');
    expect(backup.$extensions.visibility.items.work).toEqual([false]); // We hid it
  });

  test('should restore backup with all settings', async ({ page }) => {
    await setupBasicResume(page);
    
    // Create backup
    const backupPath = await downloadBackup(page);
    
    // Clear data
    await page.getByTestId('clear-button').click();
    await expect(page.getByTestId('name-input')).toHaveValue('');
    
    // Restore backup
    await uploadFile(page, backupPath);
    await expect(page.getByText('Backup Restored Successfully')).toBeVisible();
    
    // Verify data restored
    await expect(page.getByTestId('name-input')).toHaveValue('John Doe');
    
    // Verify visibility restored
    await page.getByTestId('work-tab').click();
    const workToggle = page.getByTestId('work-0-visibility-toggle').locator('svg');
    await expect(workToggle).toHaveClass(/lucide-eye-off/); // Should be hidden
  });

  test('should import regular JSON Resume with defaults', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('start-building-btn').click();
    
    // Create regular JSON Resume file
    const regularResume = {
      basics: { name: 'Jane Doe', email: 'jane@example.com' },
      work: [{ name: 'Company', position: 'Role', url: '', startDate: '', endDate: '', summary: '', highlights: [] }],
      education: [],
      skills: [],
      projects: [],
      awards: [],
      certificates: [],
      publications: [],
      languages: [],
      interests: [],
      references: [],
      volunteer: []
    };
    
    const jsonPath = join(TEMP_DIR, 'regular-resume.json');
    await fs.writeFile(jsonPath, JSON.stringify(regularResume, null, 2));
    
    // Upload regular JSON Resume
    await uploadFile(page, jsonPath);
    await expect(page.getByText('JSON Resume Imported Successfully')).toBeVisible();
    
    // Verify imported with defaults (everything visible)
    await expect(page.getByTestId('name-input')).toHaveValue('Jane Doe');
    await page.getByTestId('work-tab').click();
    const workToggle = page.getByTestId('work-0-visibility-toggle').locator('svg');
    await expect(workToggle).toHaveClass(/lucide-eye/); // Should be visible by default
  });

  test('should handle invalid files gracefully', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('start-building-btn').click();
    
    // Create invalid file
    const invalidPath = join(TEMP_DIR, 'invalid.json');
    await fs.writeFile(invalidPath, '{ invalid json }');
    
    await uploadFile(page, invalidPath);
    await expect(page.getByText('Import Failed')).toBeVisible();
  });

  test('should preserve complex visibility settings', async ({ page }) => {
    await setupBasicResume(page);
    
    // Add and configure highlights
    await page.getByTestId('work-tab').click();
    await page.getByTestId('work-0-add-highlight-button').click();
    await page.getByTestId('work-0-highlight-0-input').fill('Highlight 1');
    await page.getByTestId('work-0-add-highlight-button').click();
    await page.getByTestId('work-0-highlight-1-input').fill('Highlight 2');
    
    // Hide second highlight
    await page.getByTestId('work-0-highlight-1-visibility-toggle').click();
    
    // Backup and restore
    const backupPath = await downloadBackup(page);
    await page.getByTestId('clear-button').click();
    await uploadFile(page, backupPath);
    await expect(page.getByText('Backup Restored Successfully')).toBeVisible();
    
    // Verify highlights preserved with correct visibility
    await page.getByTestId('work-tab').click();
    await expect(page.getByTestId('work-0-highlight-0-input')).toHaveValue('Highlight 1');
    await expect(page.getByTestId('work-0-highlight-1-input')).toHaveValue('Highlight 2');
    
    const highlight1Toggle = page.getByTestId('work-0-highlight-0-visibility-toggle').locator('svg');
    const highlight2Toggle = page.getByTestId('work-0-highlight-1-visibility-toggle').locator('svg');
    
    await expect(highlight1Toggle).toHaveClass(/lucide-eye/); // visible
    await expect(highlight2Toggle).toHaveClass(/lucide-eye-off/); // hidden
  });
});

test.describe('Mobile Backup', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should work on mobile', async ({ page }) => {
    await ensureTempDir();
    
    await page.goto('/');
    await page.getByTestId('start-building-btn').click();
    await page.getByTestId('name-input').fill('Mobile User');
    
    // Use mobile backup button
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('backup-button-mobile').click();
    const download = await downloadPromise;
    
    const downloadPath = join(TEMP_DIR, await download.suggestedFilename());
    await download.saveAs(downloadPath);
    
    const content = JSON.parse(await fs.readFile(downloadPath, 'utf8'));
    expect(content.basics.name).toBe('Mobile User');
    
    await cleanupTempDir();
  });
}); 