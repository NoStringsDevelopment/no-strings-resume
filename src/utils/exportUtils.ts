import { ResumeData, Theme, DEFAULT_BASICS_VISIBILITY } from '@/types/resume';
import { downloadBlob, downloadFile, exportResumeAsJson } from '@/utils/importExport';
import { buildResumeExportContent } from '@/utils/resumeExportContent';
import { buildEmailHref, buildPhoneHref, buildUrlHref, escapeHtml, isExternalHref } from '@/utils/linkUtils';
import { 
  getVisibleHighlights, 
  getHighlightContent, 
  getVisibleCourses, 
  getCourseName,
  getVisibleKeywords,
  getKeywordName,
  getVisibleRoles,
  getRoleName 
} from '@/utils/visibilityHelpers';

// Utility function to generate consistent filenames across all export formats
export function generateExportFilename(
  resumeData: ResumeData, 
  extension: string, 
  variant?: string,
  includeTime: boolean = false
): string {
  // Extract first and last name from full name
  const fullName = resumeData.basics.name || 'resume';
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'unknown';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
  // Get target role/company from active summary
  let targetRole = '';
  if (resumeData.activeSummaryId && resumeData.summaries) {
    const activeSummary = resumeData.summaries.find(s => s.id === resumeData.activeSummaryId);
    if (activeSummary && activeSummary.target.trim()) {
      targetRole = activeSummary.target.trim();
    }
  }
  
  // Sanitize strings for filename (remove special characters, replace spaces with hyphens)
  const sanitize = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };
  
  const sanitizedFirstName = sanitize(firstName);
  const sanitizedLastName = sanitize(lastName);
  const sanitizedTargetRole = targetRole ? sanitize(targetRole) : '';
  const sanitizedVariant = variant ? sanitize(variant) : '';
  
  // Build filename parts
  const parts: string[] = [];
  
  // Name part
  if (sanitizedLastName) {
    parts.push(`${sanitizedFirstName}-${sanitizedLastName}`);
  } else {
    parts.push(sanitizedFirstName);
  }
  
  // Fixed "resume" part
  parts.push('resume');
  
  // Target role/company (optional)
  if (sanitizedTargetRole) {
    parts.push(sanitizedTargetRole);
  }
  
  // Variant (optional)
  if (sanitizedVariant) {
    parts.push(sanitizedVariant);
  }
  
  // Date part
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  parts.push(date);
  
  // Time part (optional)
  if (includeTime) {
    const time = now.toISOString().split('T')[1].replace(/[:.]/g, '').substring(0, 6); // HHMMSS
    parts.push(time);
  }
  
  // Join parts and add extension
  return `${parts.join('-')}.${extension}`;
}

// Convert JSON Resume to HR-Open format
export function convertToHROpen(resumeData: ResumeData): Record<string, unknown> {
  const basicsVisibility = { ...DEFAULT_BASICS_VISIBILITY, ...resumeData.basicsVisibility };
  return {
    type: "http://schema.hropenstandards.org/4.4/recruiting/json/ler-rs/LER-RSType.json",
    person: {
      name: {
        formatted: resumeData.basics.name,
        given: resumeData.basics.name.split(' ')[0] || '',
        family: resumeData.basics.name.split(' ').slice(1).join(' ') || ''
      },
      communication: {
        email: basicsVisibility.email ? resumeData.basics.email : undefined,
        phone: basicsVisibility.phone ? resumeData.basics.phone : undefined,
        web: basicsVisibility.url ? resumeData.basics.url : undefined
      },
      location: {
        address: {
          line: basicsVisibility.location ? resumeData.basics.location.address : undefined,
          city: basicsVisibility.location ? resumeData.basics.location.city : undefined,
          postalCode: basicsVisibility.location ? resumeData.basics.location.postalCode : undefined,
          countrySubDivisions: basicsVisibility.location ? resumeData.basics.location.region : undefined,
          country: basicsVisibility.location ? resumeData.basics.location.countryCode : undefined
        }
      }
    },
    narratives: basicsVisibility.summary && resumeData.basics.summary ? [{
      type: "summary",
      content: resumeData.basics.summary
    }] : [],
    employmentHistories: resumeData.work
      .filter(work => work.visible !== false)
      .map(work => ({
        organization: {
          name: work.name,
          website: work.url,
          location: work.location,
          description: work.description
        },
        position: {
          title: work.position,
          startDate: work.startDate,
          endDate: work.endDate,
          description: work.summary,
          highlights: work.highlights
        }
      })),
    educationAndLearnings: resumeData.education
      .filter(edu => edu.visible !== false)
      .map(edu => ({
        institution: {
          name: edu.institution,
          url: edu.url
        },
        program: {
          name: edu.area,
          type: edu.studyType
        },
        dates: {
          start: edu.startDate,
          end: edu.endDate
        },
        score: edu.score,
        courses: edu.courses
      })),
    skills: resumeData.skills
      .filter(skill => skill.visible !== false)
      .map(skill => ({
        name: skill.name,
        proficiencyLevel: skill.level,
        keywords: skill.keywords
      })),
    certifications: resumeData.certificates
      .filter(cert => cert.visible !== false)
      .map(cert => ({
        name: cert.name,
        issuingAuthority: cert.issuer,
        date: cert.date,
        url: cert.url
      }))
  };
}

export function exportAsJsonResume(resumeData: ResumeData) {
  const jsonContent = exportResumeAsJson(resumeData);
  const filename = generateExportFilename(resumeData, 'json', undefined, true);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportAsHROpen(resumeData: ResumeData) {
  const hrOpenData = convertToHROpen(resumeData);
  const jsonContent = JSON.stringify(hrOpenData, null, 2);
  const filename = generateExportFilename(resumeData, 'json', 'hropen', true);
  downloadFile(jsonContent, filename, 'application/json');
}

function normalizeHexColor(value: string | undefined, fallback: string): string {
  const sanitized = (value || fallback).replace('#', '').trim();
  return sanitized || fallback;
}

function normalizeExportTheme(theme: Theme) {
  const fontSize = Number.isFinite(theme.typography?.fontSize) ? Math.max(theme.typography.fontSize, 10) : 12;
  const lineHeight = Number.isFinite(theme.typography?.lineHeight) ? Math.max(theme.typography.lineHeight, 1.2) : 1.4;

  return {
    primary: normalizeHexColor(theme.colors?.primary, '2563eb'),
    secondary: normalizeHexColor(theme.colors?.secondary, '64748b'),
    accent: normalizeHexColor(theme.colors?.accent, '0ea5e9'),
    text: normalizeHexColor(theme.colors?.text, '1e293b'),
    textSecondary: normalizeHexColor(theme.colors?.textSecondary, '64748b'),
    border: normalizeHexColor(theme.colors?.border, 'e2e8f0'),
    headingFont: theme.fonts?.heading || theme.typography?.fontFamily || 'Arial',
    bodyFont: theme.fonts?.body || theme.typography?.fontFamily || 'Arial',
    fontSize,
    lineHeight,
  };
}

const DOCX_PAGE_WIDTH_TWIPS = 12240;
const DOCX_PAGE_HEIGHT_TWIPS = 15840;
const TWIPS_PER_PIXEL = 15;
const EMUS_PER_PIXEL = 9525;
const PDF_TEXT_WRAP_GAP_MM = 4;

type ExportVisualKind = 'icon' | 'photo';

interface PreparedExportVisual {
  kind: ExportVisualKind;
  dataUrl: string;
  pdfType: 'PNG' | 'JPEG';
  docxType: 'png' | 'jpg';
  position: {
    top: number;
    right: number;
  };
  size: number;
}

interface PdfTopVisualLayout {
  bottom: number;
  left: number;
}

function getVisualLabel(kind: ExportVisualKind): string {
  return kind === 'icon' ? 'icon' : 'photo';
}

function pixelToEmu(pixels: number): number {
  return Math.round(pixels * EMUS_PER_PIXEL);
}

function twipsToPixels(twips: number): number {
  return twips / TWIPS_PER_PIXEL;
}

function getDataUrlMimeType(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:([^;,]+)[;,]/i);
  return match?.[1]?.toLowerCase() ?? null;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const [, payload = ''] = dataUrl.split(',', 2);
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function loadImageElement(dataUrl: string): Promise<HTMLImageElement | null> {
  if (typeof Image === 'undefined') {
    return null;
  }

  return await new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}

async function renderStyledVisualDataUrl(kind: ExportVisualKind, dataUrl: string, size: number): Promise<string | null> {
  const image = await loadImageElement(dataUrl);
  if (!image) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(Math.round(size), 1);
  canvas.height = Math.max(Math.round(size), 1);

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const sourceWidth = Math.max(Math.round(image.naturalWidth || image.width || 1), 1);
  const sourceHeight = Math.max(Math.round(image.naturalHeight || image.height || 1), 1);
  const scale = kind === 'photo'
    ? Math.max(canvas.width / sourceWidth, canvas.height / sourceHeight)
    : Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = (canvas.width - drawWidth) / 2;
  const drawY = (canvas.height - drawHeight) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (kind === 'photo') {
    context.save();
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    context.closePath();
    context.clip();
  }

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  if (kind === 'photo') {
    context.restore();
  }

  try {
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

async function normalizeExportImageDataUrl(kind: ExportVisualKind, source: string | undefined, size: number): Promise<{
  dataUrl: string;
  pdfType: 'PNG' | 'JPEG';
  docxType: 'png' | 'jpg';
} | null> {
  const dataUrl = await resolveImageDataUrl(source);
  if (!dataUrl) {
    return null;
  }

  const styledDataUrl = await renderStyledVisualDataUrl(kind, dataUrl, size);
  if (styledDataUrl) {
    return {
      dataUrl: styledDataUrl,
      pdfType: 'PNG',
      docxType: 'png',
    };
  }

  const mimeType = getDataUrlMimeType(dataUrl);
  if (mimeType === 'image/png') {
    return {
      dataUrl,
      pdfType: 'PNG',
      docxType: 'png',
    };
  }

  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return {
      dataUrl,
      pdfType: 'JPEG',
      docxType: 'jpg',
    };
  }

  return null;
}

async function prepareResumeVisuals(resumeData: ResumeData): Promise<PreparedExportVisual[]> {
  const visualEntries: Array<{
    kind: ExportVisualKind;
    source: string | undefined;
    position: { top: number; right: number } | undefined;
    size: number | undefined;
  }> = [
    {
      kind: 'icon',
      source: resumeData.icon?.data,
      position: resumeData.icon?.position,
      size: resumeData.icon?.size,
    },
    {
      kind: 'photo',
      source: resumeData.photo?.data,
      position: resumeData.photo?.position,
      size: resumeData.photo?.size,
    },
  ];

  const preparedVisuals = await Promise.all(
    visualEntries.map(async (entry) => {
      if (!entry.source || !entry.position || !entry.size) {
        return null;
      }

      const normalized = await normalizeExportImageDataUrl(entry.kind, entry.source, entry.size);
      if (!normalized) {
        return null;
      }

      return {
        kind: entry.kind,
        dataUrl: normalized.dataUrl,
        pdfType: normalized.pdfType,
        docxType: normalized.docxType,
        position: entry.position,
        size: entry.size,
      } satisfies PreparedExportVisual;
    }),
  );

  return preparedVisuals
    .filter((visual): visual is PreparedExportVisual => Boolean(visual))
    .sort((left, right) => right.position.right - left.position.right);
}

export async function exportAsDOCX(resumeData: ResumeData, theme: Theme) {
  const {
    BorderStyle,
    Document,
    HorizontalPositionRelativeFrom,
    ImageRun,
    Packer,
    Paragraph,
    TextWrappingType,
    TextRun,
    VerticalPositionRelativeFrom,
  } = await import('docx');

  const exportTheme = normalizeExportTheme(theme);
  const exportContent = buildResumeExportContent(resumeData);
  const preparedVisuals = await prepareResumeVisuals(resumeData);
  const docxPageWidthPx = twipsToPixels(DOCX_PAGE_WIDTH_TWIPS);
  const baseDocxSize = Math.round(exportTheme.fontSize * 2);
  const titleDocxSize = Math.round(baseDocxSize * 1.15);
  const sectionDocxSize = Math.round(baseDocxSize * 1.2);
  const nameDocxSize = Math.round(baseDocxSize * 1.85);

  const children: InstanceType<typeof Paragraph>[] = [];

  if (preparedVisuals.length > 0) {
    const visualRuns = preparedVisuals.map((visual) =>
      new ImageRun({
        data: dataUrlToUint8Array(visual.dataUrl),
        type: visual.docxType,
        transformation: {
          width: visual.size,
          height: visual.size,
        },
        floating: {
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.PAGE,
            offset: pixelToEmu(Math.max(docxPageWidthPx - visual.position.right - visual.size, 0)),
          },
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.PAGE,
            offset: pixelToEmu(Math.max(visual.position.top, 0)),
          },
          wrap: {
            type: TextWrappingType.SQUARE,
          },
          margins: {
            top: pixelToEmu(4),
            right: pixelToEmu(4),
            bottom: pixelToEmu(4),
            left: pixelToEmu(4),
          },
          allowOverlap: true,
          behindDocument: false,
          layoutInCell: true,
        },
        altText: {
          title: `Resume ${getVisualLabel(visual.kind)}`,
          description: `Resume ${getVisualLabel(visual.kind)}`,
        },
      }),
    );

    children.push(
      new Paragraph({
        spacing: { after: 0 },
        children: [
          ...visualRuns,
          new TextRun({
            text: '',
          }),
        ],
      }),
    );
  }

  if (exportContent.header) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        keepNext: true,
        children: [
          new TextRun({
            text: exportContent.header.name,
            bold: true,
            color: exportTheme.primary,
            font: exportTheme.headingFont,
            size: nameDocxSize,
          }),
        ],
      }),
    );

    if (exportContent.header.label) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          keepNext: true,
          children: [
            new TextRun({
              text: exportContent.header.label,
              color: exportTheme.secondary,
              font: exportTheme.bodyFont,
              size: titleDocxSize,
            }),
          ],
        }),
      );
    }

    if (exportContent.header.contacts.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: exportContent.header.contacts.join(' | '),
              color: exportTheme.textSecondary,
              font: exportTheme.bodyFont,
              size: baseDocxSize,
            }),
          ],
        }),
      );
    }

    if (exportContent.header.profiles.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: exportContent.header.summary ? 200 : 120 },
          children: [
            new TextRun({
              text: exportContent.header.profiles.join(' | '),
              color: exportTheme.textSecondary,
              font: exportTheme.bodyFont,
              size: baseDocxSize,
            }),
          ],
        }),
      );
    }

    if (exportContent.header.summary) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          keepNext: true,
          border: {
            bottom: {
              color: exportTheme.border,
              size: 4,
              style: BorderStyle.SINGLE,
            },
          },
          children: [
            new TextRun({
              text: 'Summary',
              bold: true,
              color: exportTheme.primary,
              font: exportTheme.headingFont,
              size: sectionDocxSize,
            }),
          ],
        }),
      );

      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: exportContent.header.summary,
              color: exportTheme.text,
              font: exportTheme.bodyFont,
              size: baseDocxSize,
            }),
          ],
        }),
      );
    }
  }

  exportContent.sections.forEach((section) => {
    children.push(
      new Paragraph({
        pageBreakBefore: section.pageBreakBefore,
        spacing: { before: 220, after: 120 },
        keepNext: true,
        border: {
          bottom: {
            color: exportTheme.border,
            size: 4,
            style: BorderStyle.SINGLE,
          },
        },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            color: exportTheme.primary,
            font: exportTheme.headingFont,
            size: sectionDocxSize,
          }),
        ],
      }),
    );

    section.entries.forEach((entry) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          keepNext: true,
          children: [
            new TextRun({
              text: entry.title,
              bold: true,
              color: exportTheme.text,
              font: exportTheme.bodyFont,
              size: titleDocxSize,
            }),
          ],
        }),
      );

      if (entry.subtitle) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            keepNext: true,
            children: [
              new TextRun({
                text: entry.subtitle,
                bold: true,
                color: exportTheme.accent,
                font: exportTheme.bodyFont,
                size: baseDocxSize,
              }),
            ],
          }),
        );
      }

      if (entry.metadata) {
        children.push(
          new Paragraph({
            spacing: { after: entry.summary || entry.details.length > 0 || entry.bullets.length > 0 ? 40 : 120 },
            children: [
              new TextRun({
                text: entry.metadata,
                color: exportTheme.textSecondary,
                font: exportTheme.bodyFont,
                size: baseDocxSize,
              }),
            ],
          }),
        );
      }

      if (entry.summary) {
        children.push(
          new Paragraph({
            spacing: { after: entry.details.length > 0 || entry.bullets.length > 0 ? 40 : 120 },
            children: [
              new TextRun({
                text: entry.summary,
                color: exportTheme.text,
                font: exportTheme.bodyFont,
                size: baseDocxSize,
              }),
            ],
          }),
        );
      }

      entry.details.forEach((detail, index) => {
        children.push(
          new Paragraph({
            spacing: { after: index === entry.details.length - 1 && entry.bullets.length === 0 ? 120 : 40 },
            children: [
              new TextRun({
                text: detail,
                color: exportTheme.textSecondary,
                font: exportTheme.bodyFont,
                size: baseDocxSize,
              }),
            ],
          }),
        );
      });

      entry.bullets.forEach((bullet, index) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: index === entry.bullets.length - 1 ? 120 : 40 },
            children: [
              new TextRun({
                text: bullet,
                color: exportTheme.text,
                font: exportTheme.bodyFont,
                size: baseDocxSize,
              }),
            ],
          }),
        );
      });
    });
  });

  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: DOCX_PAGE_WIDTH_TWIPS,
              height: DOCX_PAGE_HEIGHT_TWIPS,
            },
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toArrayBuffer(document);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  if (!blob || blob.size === 0) {
    throw new Error('Generated DOCX file was empty.');
  }

  const filename = generateExportFilename(resumeData, 'docx', undefined, true);
  downloadBlob(blob, filename);
}

export function exportAsHTML(resumeData: ResumeData, theme: Theme) {
  // Create a standalone HTML version
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.basics.name} - Resume</title>
    <style>
        body { 
            font-family: ${theme.fonts.body}, Arial, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
            color: ${theme.colors.text};
        }
        .resume { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: ${theme.colors.primary}; 
            font-family: ${theme.fonts.heading}, Arial, sans-serif;
            font-size: 2.5em;
            margin-bottom: 0.5em;
        }
        h2 { 
            color: ${theme.colors.secondary}; 
            font-size: 1.5em;
            margin-bottom: 1em;
        }
        h3 { 
            color: ${theme.colors.primary}; 
            font-family: ${theme.fonts.heading}, Arial, sans-serif;
            border-bottom: 2px solid ${theme.colors.border};
            padding-bottom: 0.5em;
            font-size: 1.5em;
            margin-top: 2em;
            margin-bottom: 1em;
        }
        .contact-info { 
            color: ${theme.colors.textSecondary}; 
            margin-bottom: 2em;
            font-size: 0.9em;
        }
        .contact-info span { 
            margin-right: 1em; 
        }
        .summary-section {
            margin-top: 2em;
            margin-bottom: 2em;
            padding-top: 1.5em;
            padding-bottom: 1.5em;
            border-top: 1px solid ${theme.colors.border || '#e2e8f0'};
            border-bottom: 1px solid ${theme.colors.border || '#e2e8f0'};
            clear: both;
        }
        .summary-section h3 {
            margin-top: 0;
            border-bottom: none !important;
            font-size: 1.3em;
            margin-bottom: 1em;
            color: ${theme.colors.primary || '#2563eb'};
        }
        .summary-section p {
            margin: 0;
            line-height: 1.6;
            color: ${theme.colors.text || '#1e293b'};
        }
        .section { 
            margin-bottom: 2em; 
        }
        .item { 
            margin-bottom: 1.5em; 
        }
        .item-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            margin-bottom: 0.5em;
        }
        .position { 
            font-size: 1.1em;
            font-weight: bold;
            color: ${theme.colors.text};
        }
        .company { 
            color: ${theme.colors.accent}; 
            font-weight: 600;
        }
        .date { 
            color: ${theme.colors.textSecondary}; 
            font-size: 0.9em;
        }
        ul { 
            margin: 0.5em 0; 
            padding-left: 1.2em;
        }
        li {
            margin-bottom: 0.3em;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1em;
        }
        .skill-item h4 {
            margin: 0 0 0.3em 0;
            color: ${theme.colors.text};
        }
        .skill-keywords {
            color: ${theme.colors.textSecondary};
            font-size: 0.9em;
        }
        @media print {
            body { background: white; padding: 0; }
            .resume { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="resume">
        ${generateHTMLContent(resumeData)}
    </div>
</body>
</html>`;

  const filename = generateExportFilename(resumeData, 'html', undefined, true);
  downloadFile(htmlContent, filename, 'text/html');
}

function generateHTMLContent(resumeData: ResumeData): string {
  const buildHtmlLink = (text: string, href: string | null): string => {
    const escapedText = escapeHtml(text);

    if (!href) {
      return `<span>${escapedText}</span>`;
    }

    const escapedHref = escapeHtml(href);
    const externalAttributes = isExternalHref(href) ? ' target="_blank" rel="noreferrer"' : '';
    return `<a href="${escapedHref}"${externalAttributes}>${escapedText}</a>`;
  };

  let html = '';
  const { sectionVisibility } = resumeData;
  const basicsVisibility = { ...DEFAULT_BASICS_VISIBILITY, ...resumeData.basicsVisibility };
  const locationText = [resumeData.basics.location.city, resumeData.basics.location.region || resumeData.basics.location.countryCode]
    .filter(Boolean)
    .join(', ');

  if (sectionVisibility.basics) {
    const contactItems = [
      basicsVisibility.email && resumeData.basics.email ? buildHtmlLink(resumeData.basics.email, buildEmailHref(resumeData.basics.email)) : '',
      basicsVisibility.phone && resumeData.basics.phone ? buildHtmlLink(resumeData.basics.phone, buildPhoneHref(resumeData.basics.phone)) : '',
      basicsVisibility.url && resumeData.basics.url ? buildHtmlLink(resumeData.basics.url, buildUrlHref(resumeData.basics.url)) : '',
      basicsVisibility.location && locationText ? `<span>${escapeHtml(locationText)}</span>` : ''
    ].filter(Boolean);

    html += `
      <header>
        <h1>${escapeHtml(resumeData.basics.name)}</h1>
        ${basicsVisibility.label && resumeData.basics.label ? `<h2>${escapeHtml(resumeData.basics.label)}</h2>` : ''}
        ${contactItems.length > 0 ? `<div class="contact-info">${contactItems.join(' • ')}</div>` : ''}
        ${resumeData.basics.profiles.filter(p => p.visible !== false).length > 0 ? 
          `<div class="contact-info">${resumeData.basics.profiles.filter(p => p.visible !== false).map(profile => 
            buildHtmlLink(`${profile.network}: ${profile.username || profile.url}`, buildUrlHref(profile.url))
          ).join(' • ')}</div>` : ''}
      </header>
      
      ${basicsVisibility.summary && resumeData.basics.summary ? `
        <div class="summary-section">
          <h3>Summary</h3>
          <p>${escapeHtml(resumeData.basics.summary)}</p>
        </div>
      ` : ''}
    `;
  }

  if (sectionVisibility.work && resumeData.work.some(w => w.visible !== false)) {
    html += '<div class="section"><h3>Work Experience</h3>';
    resumeData.work
      .filter(work => work.visible !== false)
      .forEach(work => {
        const visibleHighlights = getVisibleHighlights(work.highlights);
        html += `
          <div class="item">
            <div class="item-header">
              <div>
                <div class="position">${work.position}</div>
                <div class="company">${buildHtmlLink(work.name, buildUrlHref(work.url))}</div>
              </div>
              <span class="date">${escapeHtml(work.startDate)} - ${escapeHtml(work.endDate || 'Present')}</span>
            </div>
            ${work.summary ? `<p>${escapeHtml(work.summary)}</p>` : ''}
            ${visibleHighlights.length > 0 ? `<ul>${visibleHighlights.map(h => `<li>${escapeHtml(getHighlightContent(h))}</li>`).join('')}</ul>` : ''}
          </div>
        `;
      });
    html += '</div>';
  }

  if (sectionVisibility.education && resumeData.education.some(e => e.visible !== false)) {
    html += '<div class="section"><h3>Education</h3>';
    resumeData.education
      .filter(edu => edu.visible !== false)
      .forEach(edu => {
        const visibleCourses = getVisibleCourses(edu.courses);
        html += `
          <div class="item">
            <div class="item-header">
              <div>
                <div class="position">${escapeHtml(`${edu.studyType}${edu.area ? ` in ${edu.area}` : ''}`)}</div>
                <div class="company">${buildHtmlLink(edu.institution, buildUrlHref(edu.url))}</div>
              </div>
              <span class="date">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate || 'Present')}</span>
            </div>
            ${edu.score ? `<p>Score: ${escapeHtml(edu.score)}</p>` : ''}
            ${visibleCourses.length > 0 ? `<p><strong>Relevant Courses:</strong> ${visibleCourses.map(c => escapeHtml(getCourseName(c))).join(', ')}</p>` : ''}
          </div>
        `;
      });
    html += '</div>';
  }

  if (sectionVisibility.skills && resumeData.skills.some(s => s.visible !== false)) {
    html += '<div class="section"><h3>Skills</h3><div class="skills-grid">';
    resumeData.skills
      .filter(skill => skill.visible !== false)
      .forEach(skill => {
        const visibleKeywords = getVisibleKeywords(skill.keywords);
        html += `
          <div class="skill-item">
            <h4>${escapeHtml(`${skill.name}${skill.level ? ` (${skill.level})` : ''}`)}</h4>
            ${visibleKeywords.length > 0 ? `<div class="skill-keywords">${visibleKeywords.map(keyword => escapeHtml(getKeywordName(keyword))).join(', ')}</div>` : ''}
          </div>
        `;
      });
    html += '</div></div>';
  }

  // Add other sections with similar improvements...
  if (sectionVisibility.projects && resumeData.projects.some(p => p.visible !== false)) {
    html += '<div class="section"><h3>Projects</h3>';
    resumeData.projects
      .filter(project => project.visible !== false)
      .forEach(project => {
        const visibleHighlights = getVisibleHighlights(project.highlights);
        const visibleKeywords = getVisibleKeywords(project.keywords);
        const visibleRoles = getVisibleRoles(project.roles);
        
        html += `
          <div class="item">
            <h4 style="margin: 0 0 0.5em 0; font-size: 1.1em;">${buildHtmlLink(project.name, buildUrlHref(project.url))}</h4>
            <p>${escapeHtml(project.description)}</p>
            ${visibleHighlights.length > 0 ? `<ul>${visibleHighlights.map(h => `<li>${escapeHtml(getHighlightContent(h))}</li>`).join('')}</ul>` : ''}
            ${visibleKeywords.length > 0 ? `<p class="skill-keywords">Technologies: ${visibleKeywords.map(keyword => escapeHtml(getKeywordName(keyword))).join(', ')}</p>` : ''}
            ${visibleRoles.length > 0 ? `<p class="skill-keywords">Roles: ${visibleRoles.map(role => escapeHtml(getRoleName(role))).join(', ')}</p>` : ''}
          </div>
        `;
      });
    html += '</div>';
  }

  if (sectionVisibility.awards && resumeData.awards.some(a => a.visible !== false)) {
    html += '<div class="section"><h3>Awards</h3>';
    resumeData.awards
      .filter(award => award.visible !== false)
      .forEach(award => {
        html += `
          <div class="item">
            <div class="item-header">
              <div>
                <div class="position">${escapeHtml(award.title)}</div>
                <div class="company">${escapeHtml(award.awarder)}</div>
              </div>
              <span class="date">${escapeHtml(award.date)}</span>
            </div>
            ${award.summary ? `<p>${escapeHtml(award.summary)}</p>` : ''}
          </div>
        `;
      });
    html += '</div>';
  }

  if (sectionVisibility.languages && resumeData.languages.some(l => l.visible !== false)) {
    html += '<div class="section"><h3>Languages</h3><div class="skills-grid">';
    resumeData.languages
      .filter(lang => lang.visible !== false)
      .forEach(lang => {
        html += `
          <div class="skill-item">
            <h4>${lang.language}${lang.fluency ? ` (${lang.fluency})` : ''}</h4>
          </div>
        `;
      });
    html += '</div></div>';
  }
  
  return html;
}

// Helper function to sanitize text for PDF export (fallback only)
function sanitizeTextForPDF(text: string): string {
  if (!text) return '';
  
  return text
    // Replace emoji characters with text equivalents
    .replace(/📧/g, 'Email:')
    .replace(/📞/g, 'Phone:')
    .replace(/🌐/g, 'Website:')
    .replace(/📍/g, 'Location:')
    .replace(/📱/g, 'Mobile:')
    // Replace bullet points with ASCII dash
    .replace(/•/g, '-')
    // Replace other common problematic characters
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/–/g, '-')  // en dash
    .replace(/—/g, '--') // em dash
    .replace(/…/g, '...') // ellipsis
    // Keep accented characters as they should work with jsPDF
    .trim();
}

// Helper function to clean contact info array
function sanitizeContactInfo(contactInfo: (string | false)[]): string {
  return contactInfo
    .filter(Boolean)
    .map(item => sanitizeTextForPDF(item as string))
    .join(' | '); // Use pipe separator instead of bullet
}

// Helper function to check if text contains Unicode characters that need special handling
function containsUnicodeSymbols(text: string): boolean {
  // Check for emojis, special symbols, and non-ASCII characters that might not render in Helvetica
  return /[\u{1F300}-\u{1F9FF}]|[•–—\u2018\u2019\u201C\u201D…]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text);
}

// Helper function to try loading Unicode-capable font
async function tryLoadUnicodeFont(): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    
    // Test if system fonts can render emoji/Unicode
    ctx.font = '12px "Segoe UI", "Apple Color Emoji", "Noto Color Emoji", system-ui, sans-serif';
    const testText = '📧📞🌐📍•';
    const width1 = ctx.measureText(testText).width;
    
    ctx.font = '12px monospace';
    const width2 = ctx.measureText(testText).width;
    
    return Math.abs(width1 - width2) > 2;
  } catch (error) {
    console.warn('Failed to load Unicode font for PDF export:', error);
    return false;
  }
}

async function resolveImageDataUrl(source: string | undefined): Promise<string | null> {
  if (!source) return null;
  if (source.startsWith('data:image')) return source;

  try {
    let path = source;
    if (!/^https?:\/\//.test(path) && !path.startsWith('/')) {
      path = `/${path}`;
    }

    const response = await fetch(path);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function getPdfLineHeight(fontSize: number, lineHeightMultiplier: number): number {
  return Math.max(4.5, fontSize * lineHeightMultiplier * 0.352778);
}

async function renderPdfTopVisuals(pdf: {
  internal: { pageSize: { getWidth: () => number } };
  addImage: (...args: unknown[]) => void;
}, resumeData: ResumeData): Promise<PdfTopVisualLayout> {
  const pxToMm = (pixels: number) => pixels * 0.264583;
  let bottom = 0;
  let left = pdf.internal.pageSize.getWidth();

  try {
    const preparedVisuals = await prepareResumeVisuals(resumeData);

    preparedVisuals.forEach((visual) => {
      const sizeMm = pxToMm(visual.size);
      const topMm = pxToMm(visual.position.top || 20);
      const rightMm = pxToMm(visual.position.right || 20);
      const x = pdf.internal.pageSize.getWidth() - rightMm - sizeMm;
      const y = topMm;

      pdf.addImage(visual.dataUrl, visual.pdfType, x, y, sizeMm, sizeMm);
      bottom = Math.max(bottom, y + sizeMm);
      left = Math.min(left, x);
    });
  } catch (error) {
    console.warn('PDF export: failed to render optional images.', error);
  }

  return {
    bottom,
    left,
  };
}

export async function exportAsPDF(resumeData: ResumeData, theme: Theme) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ compress: true });
  const exportTheme = normalizeExportTheme(theme);
  const exportContent = buildResumeExportContent(resumeData);
  const hasUnicodeSupport = await tryLoadUnicodeFont();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const sectionSpacing = 5;
  const usableWidth = pageWidth - margin * 2;
  const textColor = `#${exportTheme.text}`;
  const mutedColor = `#${exportTheme.textSecondary}`;
  const accentColor = `#${exportTheme.accent}`;
  const primaryColor = `#${exportTheme.primary}`;
  const borderColor = `#${exportTheme.border}`;
  let yPosition = margin;
  let currentPage = 1;
  const topVisualLayout = await renderPdfTopVisuals(pdf as unknown as {
    internal: { pageSize: { getWidth: () => number } };
    addImage: (...args: unknown[]) => void;
  }, resumeData);

  const prepareText = (text: string): string => {
    if (!hasUnicodeSupport && containsUnicodeSymbols(text)) {
      return sanitizeTextForPDF(text);
    }
    return text;
  };

  const addNewPage = () => {
    pdf.addPage();
    currentPage += 1;
    yPosition = margin;
  };

  const ensureSpace = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      addNewPage();
    }
  };

  const addWrappedText = (
    text: string,
    options?: {
      fontSize?: number;
      bold?: boolean;
      color?: string;
      indent?: number;
      width?: number;
      spacingAfter?: number;
      ignoreTopVisualWrap?: boolean;
      align?: 'left' | 'justify';
    },
  ) => {
    if (!text?.trim()) {
      return;
    }

    const fontSize = options?.fontSize ?? 11;
    const indent = options?.indent ?? margin;
    const preferredWidth = options?.width ?? pageWidth - indent - margin;
    const width = currentPage === 1 && !options?.ignoreTopVisualWrap && topVisualLayout.bottom > 0 && yPosition < topVisualLayout.bottom
      ? Math.max(30, Math.min(preferredWidth, topVisualLayout.left - PDF_TEXT_WRAP_GAP_MM - indent))
      : preferredWidth;
    const spacingAfter = options?.spacingAfter ?? 1;
    const processedText = prepareText(text);

    pdf.setFont('helvetica', options?.bold ? 'bold' : 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(options?.color ?? textColor);

    const lineHeight = getPdfLineHeight(fontSize, exportTheme.lineHeight);
    const lines = pdf.splitTextToSize(processedText, width);

    lines.forEach((line: string) => {
      ensureSpace(lineHeight);
      const shouldJustify = options?.align === 'justify' && lines.length > 1 && line !== lines[lines.length - 1];
      if (shouldJustify) {
        pdf.text(line, indent, yPosition, { align: 'justify', maxWidth: width });
      } else {
        pdf.text(line, indent, yPosition);
      }
      yPosition += lineHeight;
    });

    yPosition += spacingAfter;
  };

  const addBullet = (text: string) => {
    const fontSize = 10;
    const lineHeight = getPdfLineHeight(fontSize, exportTheme.lineHeight);
    const bullet = hasUnicodeSupport ? '•' : '-';
    const bulletIndent = margin + 4;
    const lines = pdf.splitTextToSize(prepareText(text), pageWidth - bulletIndent - margin);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(textColor);

    lines.forEach((line: string, index: number) => {
      ensureSpace(lineHeight);
      if (index === 0) {
        pdf.text(bullet, margin, yPosition);
      }
      pdf.text(line, bulletIndent, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 1;
  };

  const addSectionHeader = (title: string) => {
    yPosition += sectionSpacing;
    ensureSpace(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(primaryColor);
    pdf.text(prepareText(title.toUpperCase()), margin, yPosition);
    yPosition += 6;
    pdf.setDrawColor(borderColor);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 4;
  };

  const renderEntry = (entry: {
    title: string;
    subtitle?: string;
    metadata?: string;
    summary?: string;
    details: string[];
    bullets: string[];
  }) => {
    addWrappedText(entry.title, { fontSize: 12, bold: true, color: textColor, spacingAfter: 0.5 });

    if (entry.subtitle) {
      addWrappedText(entry.subtitle, { fontSize: 11, bold: true, color: accentColor, spacingAfter: 0.5 });
    }

    if (entry.metadata) {
      addWrappedText(entry.metadata, {
        fontSize: 10,
        color: mutedColor,
        spacingAfter: entry.summary || entry.details.length > 0 || entry.bullets.length > 0 ? 0.5 : 2,
      });
    }

    if (entry.summary) {
      addWrappedText(entry.summary, {
        fontSize: 10,
        color: textColor,
        spacingAfter: entry.details.length > 0 || entry.bullets.length > 0 ? 0.5 : 2,
      });
    }

    entry.details.forEach((detail, index) => {
      addWrappedText(detail, {
        fontSize: 10,
        color: mutedColor,
        spacingAfter: index === entry.details.length - 1 && entry.bullets.length === 0 ? 2 : 0.5,
      });
    });

    entry.bullets.forEach(addBullet);
    yPosition += 2;
  };

  if (!hasUnicodeSupport) {
    console.info('PDF Export: Using ASCII fallback mode. Some Unicode characters will be converted to text equivalents.');
  }

  if (exportContent.header) {
    addWrappedText(exportContent.header.name, { fontSize: 24, bold: true, color: primaryColor, spacingAfter: 1 });

    if (exportContent.header.label) {
      addWrappedText(exportContent.header.label, { fontSize: 16, color: mutedColor, spacingAfter: 1.5 });
    }

    if (exportContent.header.contacts.length > 0) {
      const contactLine = hasUnicodeSupport
        ? exportContent.header.contacts.join(' • ')
        : sanitizeContactInfo(exportContent.header.contacts);
      addWrappedText(contactLine, { fontSize: 10, color: mutedColor, spacingAfter: 1 });
    }

    if (exportContent.header.profiles.length > 0) {
      addWrappedText(exportContent.header.profiles.join(hasUnicodeSupport ? ' • ' : ' | '), {
        fontSize: 10,
        color: mutedColor,
        spacingAfter: exportContent.header.summary ? 2 : 3,
      });
    }

    if (exportContent.header.summary) {
      addSectionHeader('Summary');
      addWrappedText(exportContent.header.summary, {
        fontSize: 10.5,
        color: textColor,
        spacingAfter: 3,
        ignoreTopVisualWrap: true,
        align: 'justify',
      });
    }
  }

  if (topVisualLayout.bottom > 0) {
    yPosition = Math.max(yPosition, topVisualLayout.bottom + 4);
  }

  exportContent.sections.forEach((section) => {
    if (section.pageBreakBefore && currentPage >= 1) {
      addNewPage();
    }
    addSectionHeader(section.title);
    section.entries.forEach(renderEntry);
  });

  const filename = generateExportFilename(resumeData, 'pdf', undefined, true);
  pdf.save(filename);
}
