import { ResumeData, Theme } from '@/types/resume';
import { downloadFile, exportResumeAsJson } from '@/utils/importExport';
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
  return {
    type: "http://schema.hropenstandards.org/4.4/recruiting/json/ler-rs/LER-RSType.json",
    person: {
      name: {
        formatted: resumeData.basics.name,
        given: resumeData.basics.name.split(' ')[0] || '',
        family: resumeData.basics.name.split(' ').slice(1).join(' ') || ''
      },
      communication: {
        email: resumeData.basics.email,
        phone: resumeData.basics.phone,
        web: resumeData.basics.url
      },
      location: {
        address: {
          line: resumeData.basics.location.address,
          city: resumeData.basics.location.city,
          postalCode: resumeData.basics.location.postalCode,
          countrySubDivisions: resumeData.basics.location.region,
          country: resumeData.basics.location.countryCode
        }
      }
    },
    narratives: resumeData.basics.summary ? [{
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

export async function exportAsDOCX(resumeData: ResumeData, theme: Theme) {
  const { default: PizZip } = await import('pizzip');
  const { default: Docxtemplater } = await import('docxtemplater');
  
  // Create a basic DOCX template content
  const docxContent = generateDOCXContent(resumeData, theme);
  
  // Create a simple DOCX structure
  const zip = new PizZip();
  
  // Add the basic DOCX structure
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);

  zip.file('word/document.xml', docxContent);

  const blob = zip.generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const filename = generateExportFilename(resumeData, 'docx', undefined, true);
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateDOCXContent(resumeData: ResumeData, theme: Theme): string {
  let content = '';
  const { sectionVisibility } = resumeData;
  
  // Helper function to convert hex color to Word format (remove #)
  const formatColorForWord = (hexColor: string | undefined): string => {
    if (!hexColor) return '000000'; // Default to black if color is undefined
    return hexColor.replace('#', '');
  };

  // Convert theme font sizes and spacing
  const baseFontSize = Math.round(theme.typography.fontSize * 2); // Convert to half-points (Word format)
  const headingFontSize = Math.round(baseFontSize * 1.5);
  const largeFontSize = Math.round(baseFontSize * 2);
  
  const createParagraph = (text: string, style: 'heading1' | 'heading2' | 'heading3' | 'normal' | 'contact' | 'jobTitle' | 'company' = 'normal') => {
    const styles = {
      heading1: `<w:pStyle w:val="Heading1"/><w:color w:val="${formatColorForWord(theme.colors.primary)}"/><w:sz w:val="${largeFontSize}"/><w:szCs w:val="${largeFontSize}"/><w:b/>`,
      heading2: `<w:pStyle w:val="Heading2"/><w:color w:val="${formatColorForWord(theme.colors.secondary)}"/><w:sz w:val="${headingFontSize}"/><w:szCs w:val="${headingFontSize}"/><w:b/>`,
      heading3: `<w:pStyle w:val="Heading3"/><w:color w:val="${formatColorForWord(theme.colors.primary)}"/><w:sz w:val="${headingFontSize}"/><w:szCs w:val="${headingFontSize}"/><w:b/>`,
      normal: `<w:color w:val="${formatColorForWord(theme.colors.text)}"/><w:sz w:val="${baseFontSize}"/><w:szCs w:val="${baseFontSize}"/>`,
      contact: `<w:color w:val="${formatColorForWord(theme.colors.textSecondary)}"/><w:sz w:val="${baseFontSize}"/><w:szCs w:val="${baseFontSize}"/>`,
      jobTitle: `<w:color w:val="${formatColorForWord(theme.colors.text)}"/><w:sz w:val="${baseFontSize}"/><w:szCs w:val="${baseFontSize}"/><w:b/>`,
      company: `<w:color w:val="${formatColorForWord(theme.colors.accent)}"/><w:sz w:val="${baseFontSize}"/><w:szCs w:val="${baseFontSize}"/><w:b/>`
    };
    
    const rPrStyle = styles[style];
    const isHeading = style.startsWith('heading');
    const fontFamily = isHeading ? (theme.fonts?.heading || 'Arial') : (theme.fonts?.body || 'Arial');
    
    return `
    <w:p>
      <w:pPr>
        ${isHeading ? `<w:pStyle w:val="${style.charAt(0).toUpperCase() + style.slice(1)}"/>` : ''}
        <w:spacing w:after="${isHeading ? '160' : '120'}"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          ${rPrStyle}
          <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}" w:cs="${fontFamily}"/>
        </w:rPr>
        <w:t>${text}</w:t>
      </w:r>
    </w:p>`;
  };

  // Header - document structure
  content += `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>`;

  // Basics section
  if (sectionVisibility.basics) {
    content += createParagraph(resumeData.basics.name, 'heading1');
    
    if (resumeData.basics.label) {
      content += createParagraph(resumeData.basics.label, 'heading2');
    }
    
    // Contact information
    const contactInfo = [
      resumeData.basics.email,
      resumeData.basics.phone,
      resumeData.basics.url,
      [resumeData.basics.location.city, resumeData.basics.location.region].filter(Boolean).join(', ')
    ].filter(Boolean);
    
    if (contactInfo.length > 0) {
      content += createParagraph(contactInfo.join(' | '), 'contact');
    }
    
    // Profiles
    const visibleProfiles = resumeData.basics.profiles.filter(p => p.visible !== false);
    if (visibleProfiles.length > 0) {
      const profilesInfo = visibleProfiles.map(profile => 
        `${profile.network}: ${profile.username || profile.url}`
      ).join(' | ');
      
      if (profilesInfo) {
        content += createParagraph(profilesInfo, 'contact');
      }
    }
    
    // Summary section with spacing
    if (resumeData.basics.summary) {
      content += '<w:p><w:pPr><w:spacing w:before="240" w:after="240"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="1" w:color="e2e8f0"/><w:bottom w:val="single" w:sz="4" w:space="1" w:color="e2e8f0"/></w:pBdr></w:pPr></w:p>';
      content += createParagraph('SUMMARY', 'heading3');
      content += createParagraph(resumeData.basics.summary);
    }
  }

  // Work Experience with visibility filtering
  if (sectionVisibility.work && resumeData.work.some(w => w.visible !== false)) {
    content += '<w:p><w:pPr><w:spacing w:before="400"/></w:pPr></w:p>';
    content += createParagraph('WORK EXPERIENCE', 'heading3');
    
    resumeData.work
      .filter(work => work.visible !== false)
      .forEach(work => {
        content += createParagraph(`${work.position}`, 'jobTitle');
        content += createParagraph(`${work.name}`, 'company');
        content += createParagraph(`${work.startDate} - ${work.endDate || 'Present'}`, 'contact');
        
        if (work.summary) {
          content += createParagraph(work.summary);
        }
        
        // Use visibility helper for highlights
        const visibleHighlights = getVisibleHighlights(work.highlights);
        visibleHighlights.forEach(highlight => {
          content += createParagraph(`• ${getHighlightContent(highlight)}`);
        });
        
        content += '<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>';
      });
  }

  // Education with course visibility filtering
  if (sectionVisibility.education && resumeData.education.some(e => e.visible !== false)) {
    content += '<w:p><w:pPr><w:spacing w:before="400"/></w:pPr></w:p>';
    content += createParagraph('EDUCATION', 'heading3');
    
    resumeData.education
      .filter(edu => edu.visible !== false)
      .forEach(edu => {
        const degree = `${edu.studyType}${edu.area ? ` in ${edu.area}` : ''}`;
        content += createParagraph(degree, 'jobTitle');
        content += createParagraph(edu.institution, 'company');
        content += createParagraph(`${edu.startDate} - ${edu.endDate || 'Present'}`, 'contact');
        
        if (edu.score) {
          content += createParagraph(`Score: ${edu.score}`, 'contact');
        }
        
        // Use visibility helper for courses
        const visibleCourses = getVisibleCourses(edu.courses);
        if (visibleCourses.length > 0) {
          const courseNames = visibleCourses.map(course => getCourseName(course));
          content += createParagraph(`Relevant Courses: ${courseNames.join(', ')}`, 'contact');
        }
        
        content += '<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>';
      });
  }

  // Skills
  if (sectionVisibility.skills && resumeData.skills.some(s => s.visible !== false)) {
    content += '<w:p><w:pPr><w:spacing w:before="400"/></w:pPr></w:p>';
    content += createParagraph('SKILLS', 'heading3');
    
    resumeData.skills
      .filter(skill => skill.visible !== false)
      .forEach(skill => {
        const skillText = `${skill.name}${skill.level ? ` (${skill.level})` : ''}`;
        content += createParagraph(skillText, 'normal');
        
        const visibleKeywords = getVisibleKeywords(skill.keywords);
        if (visibleKeywords.length > 0) {
          const keywordNames = visibleKeywords.map(keyword => getKeywordName(keyword));
          content += createParagraph(keywordNames.join(', '), 'contact');
        }
        
        content += '<w:p><w:pPr><w:spacing w:after="80"/></w:pPr></w:p>';
      });
  }

  // Projects
  if (sectionVisibility.projects && resumeData.projects.some(p => p.visible !== false)) {
    content += '<w:p><w:pPr><w:spacing w:before="320"/></w:pPr></w:p>';
    content += createParagraph('PROJECTS', 'heading3');
    
    resumeData.projects
      .filter(project => project.visible !== false)
      .forEach(project => {
        content += createParagraph(project.name, 'normal');
        content += createParagraph(project.description);
        
        const visibleHighlights = getVisibleHighlights(project.highlights);
        if (visibleHighlights.length > 0) {
          visibleHighlights.forEach(highlight => {
            content += createParagraph(`• ${getHighlightContent(highlight)}`);
          });
        }
        
        const visibleKeywords = getVisibleKeywords(project.keywords);
        if (visibleKeywords.length > 0) {
          const keywordNames = visibleKeywords.map(keyword => getKeywordName(keyword));
          content += createParagraph(`Technologies: ${keywordNames.join(', ')}`, 'contact');
        }
        
        const visibleRoles = getVisibleRoles(project.roles);
        if (visibleRoles.length > 0) {
          const roleNames = visibleRoles.map(role => getRoleName(role));
          content += createParagraph(`Roles: ${roleNames.join(', ')}`, 'contact');
        }
        
        content += '<w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>';
      });
  }

  // Awards
  if (sectionVisibility.awards && resumeData.awards.some(a => a.visible !== false)) {
    content += '<w:p><w:pPr><w:spacing w:before="320"/></w:pPr></w:p>';
    content += createParagraph('AWARDS', 'heading3');
    
    resumeData.awards
      .filter(award => award.visible !== false)
      .forEach(award => {
        content += createParagraph(`${award.title} - ${award.awarder}`, 'normal');
        content += createParagraph(award.date, 'contact');
        
        if (award.summary) {
          content += createParagraph(award.summary);
        }
        
        content += '<w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>';
      });
  }

  // Languages
  if (sectionVisibility.languages && resumeData.languages.some(l => l.visible !== false)) {
    content += '<w:p><w:pPr><w:spacing w:before="320"/></w:pPr></w:p>';
    content += createParagraph('LANGUAGES', 'heading3');
    
    resumeData.languages
      .filter(lang => lang.visible !== false)
      .forEach(lang => {
        const langText = `${lang.language}${lang.fluency ? ` (${lang.fluency})` : ''}`;
        content += createParagraph(langText);
      });
  }

  content += `
  </w:body>
</w:document>`;

  return content;
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
  let html = '';
  const { sectionVisibility } = resumeData;

  if (sectionVisibility.basics) {
    html += `
      <header>
        <h1>${resumeData.basics.name}</h1>
        ${resumeData.basics.label ? `<h2>${resumeData.basics.label}</h2>` : ''}
        <div class="contact-info">
          ${resumeData.basics.email ? `<span>📧 ${resumeData.basics.email}</span>` : ''}
          ${resumeData.basics.phone ? `<span>📞 ${resumeData.basics.phone}</span>` : ''}
          ${resumeData.basics.url ? `<span>🌐 ${resumeData.basics.url}</span>` : ''}
          ${(resumeData.basics.location.city || resumeData.basics.location.region) ? 
            `<span>📍 ${[resumeData.basics.location.city, resumeData.basics.location.region].filter(Boolean).join(', ')}</span>` : ''}
        </div>
        ${resumeData.basics.profiles.filter(p => p.visible !== false).length > 0 ? 
          `<div class="contact-info">${resumeData.basics.profiles.filter(p => p.visible !== false).map(profile => 
            `<span>${profile.network}: ${profile.username || profile.url}</span>`
          ).join(' • ')}</div>` : ''}
      </header>
      
      ${resumeData.basics.summary ? `
        <div class="summary-section">
          <h3>Summary</h3>
          <p>${resumeData.basics.summary}</p>
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
                <div class="company">${work.name}</div>
              </div>
              <span class="date">${work.startDate} - ${work.endDate || 'Present'}</span>
            </div>
            ${work.summary ? `<p>${work.summary}</p>` : ''}
            ${visibleHighlights.length > 0 ? `<ul>${visibleHighlights.map(h => `<li>${getHighlightContent(h)}</li>`).join('')}</ul>` : ''}
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
                <div class="position">${edu.studyType}${edu.area ? ` in ${edu.area}` : ''}</div>
                <div class="company">${edu.institution}</div>
              </div>
              <span class="date">${edu.startDate} - ${edu.endDate || 'Present'}</span>
            </div>
            ${edu.score ? `<p>Score: ${edu.score}</p>` : ''}
            ${visibleCourses.length > 0 ? `<p><strong>Relevant Courses:</strong> ${visibleCourses.map(c => getCourseName(c)).join(', ')}</p>` : ''}
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
            <h4>${skill.name}${skill.level ? ` (${skill.level})` : ''}</h4>
            ${visibleKeywords.length > 0 ? `<div class="skill-keywords">${visibleKeywords.map(keyword => getKeywordName(keyword)).join(', ')}</div>` : ''}
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
            <h4 style="margin: 0 0 0.5em 0; font-size: 1.1em;">${project.name}</h4>
            <p>${project.description}</p>
            ${visibleHighlights.length > 0 ? `<ul>${visibleHighlights.map(h => `<li>${getHighlightContent(h)}</li>`).join('')}</ul>` : ''}
            ${visibleKeywords.length > 0 ? `<p class="skill-keywords">Technologies: ${visibleKeywords.map(keyword => getKeywordName(keyword)).join(', ')}</p>` : ''}
            ${visibleRoles.length > 0 ? `<p class="skill-keywords">Roles: ${visibleRoles.map(role => getRoleName(role)).join(', ')}</p>` : ''}
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
                <div class="position">${award.title}</div>
                <div class="company">${award.awarder}</div>
              </div>
              <span class="date">${award.date}</span>
            </div>
            ${award.summary ? `<p>${award.summary}</p>` : ''}
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
    .replace(/'/g, "'")  // curly single quote
    .replace(/'/g, "'")  // curly single quote
    .replace(/"/g, '"')  // curly double quote left
    .replace(/"/g, '"')  // curly double quote right
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
  return /[\u{1F300}-\u{1F9FF}]|[•–—""''…]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text);
}

// Helper function to try loading Unicode-capable font
async function tryLoadUnicodeFont(pdf: unknown): Promise<boolean> {
  try {
    // Try to load a system font or web font that supports Unicode
    // This is a simplified approach - in production, you might want to:
    // 1. Bundle a Unicode font with your app
    // 2. Load from Google Fonts or other CDN
    // 3. Use a more comprehensive Unicode font like Noto Sans
    
    // For now, we'll detect if the browser/system has better font support
    // In a real implementation, you would load a proper TTF font file
    
    // Check if we can use a system font with better Unicode support
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    
    // Test if system fonts can render emoji/Unicode
    ctx.font = '12px "Segoe UI", "Apple Color Emoji", "Noto Color Emoji", system-ui, sans-serif';
    const testText = '📧📞🌐📍•';
    const width1 = ctx.measureText(testText).width;
    
    ctx.font = '12px monospace';
    const width2 = ctx.measureText(testText).width;
    
    // If widths are significantly different, we likely have Unicode support
    const hasUnicodeSupport = Math.abs(width1 - width2) > 2;
    
    if (hasUnicodeSupport) {
      // Try to set a Unicode-friendly font in jsPDF
      // Note: This is a simplified approach. For production use, you'd want to:
      // 1. Load actual TTF font files
      // 2. Use pdf.addFileToVFS() and pdf.addFont()
      // 3. Handle font loading errors properly
      
      // For now, we'll just indicate that we should try to preserve Unicode
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Failed to load Unicode font for PDF export:', error);
    return false;
  }
}

export async function exportAsPDF(resumeData: ResumeData, theme: Theme) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  
  // Try to enable Unicode support
  const hasUnicodeSupport = await tryLoadUnicodeFont(pdf);
  
  let yPosition = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 6;
  const sectionSpacing = 8;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight: number = lineHeight) => {
    if (yPosition + requiredHeight > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add text with word wrapping and smart Unicode handling
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false, color: string = '#000000') => {
    if (!text) return;
    
    let processedText = text;
    
    // Only sanitize if we don't have Unicode support AND the text contains problematic characters
    if (!hasUnicodeSupport && containsUnicodeSymbols(text)) {
      processedText = sanitizeTextForPDF(text);
      console.log(`PDF Export: Sanitized text due to limited Unicode support: "${text}" -> "${processedText}"`);
    }
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color);
    
    const lines = pdf.splitTextToSize(processedText, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      checkNewPage();
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  const addSectionHeader = (title: string) => {
    if (!title) return;
    
    yPosition += sectionSpacing;
    checkNewPage(12);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#2563eb'); // Primary color
    
    let processedTitle = title;
    if (!hasUnicodeSupport && containsUnicodeSymbols(title)) {
      processedTitle = sanitizeTextForPDF(title);
    }
    
    pdf.text(processedTitle.toUpperCase(), margin, yPosition);
    yPosition += 8;
    
    // Add underline
    pdf.setDrawColor(226, 232, 240); // Border color
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 4;
  };

  // Add a note about Unicode support at the beginning
  if (!hasUnicodeSupport) {
    console.info('PDF Export: Using ASCII fallback mode. Some Unicode characters will be converted to text equivalents.');
  } else {
    console.info('PDF Export: Unicode support detected. Preserving original characters.');
  }

  // Header section
  if (resumeData.sectionVisibility.basics) {
    // Name - large and bold
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#2563eb');
    
    let processedName = resumeData.basics.name;
    if (!hasUnicodeSupport && containsUnicodeSymbols(resumeData.basics.name)) {
      processedName = sanitizeTextForPDF(resumeData.basics.name);
    }
    pdf.text(processedName, margin, yPosition);
    yPosition += 12;

    // Label/title
    if (resumeData.basics.label) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#64748b');
      
      let processedLabel = resumeData.basics.label;
      if (!hasUnicodeSupport && containsUnicodeSymbols(resumeData.basics.label)) {
        processedLabel = sanitizeTextForPDF(resumeData.basics.label);
      }
      pdf.text(processedLabel, margin, yPosition);
      yPosition += 8;
    }
    
    // Contact information - with smart Unicode handling
    const contactInfo = [
      resumeData.basics.email && `📧 ${resumeData.basics.email}`,
      resumeData.basics.phone && `📞 ${resumeData.basics.phone}`,
      resumeData.basics.url && `🌐 ${resumeData.basics.url}`,
      (resumeData.basics.location.city || resumeData.basics.location.region) && 
        `📍 ${[resumeData.basics.location.city, resumeData.basics.location.region].filter(Boolean).join(', ')}`
    ].filter(Boolean);
    
    if (contactInfo.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#64748b');
      
      let contactLine: string;
      if (hasUnicodeSupport) {
        // Use bullet separator and keep emojis
        contactLine = contactInfo.map(item => item as string).join(' • ');
      } else {
        // Use sanitized version
        contactLine = sanitizeContactInfo(contactInfo);
      }
      addText(contactLine, 10, false, '#64748b');
    }

    // Profiles - also with smart Unicode handling
    if (resumeData.basics.profiles.some(p => p.visible !== false)) {
      const profilesInfo = resumeData.basics.profiles
        .filter(profile => profile.visible !== false)
        .map(profile => `${profile.network}: ${profile.username || profile.url}`)
        .join(hasUnicodeSupport ? ' • ' : ' | ');
      
      if (profilesInfo) {
        addText(profilesInfo, 10, false, '#64748b');
      }
    }
    
    // Summary
    if (resumeData.basics.summary) {
      yPosition += 4;
      addText(resumeData.basics.summary, 11, false, '#1e293b');
    }
  }

  // Work Experience
  if (resumeData.sectionVisibility.work && resumeData.work.some(w => w.visible !== false)) {
    addSectionHeader('Work Experience');
    
    resumeData.work
      .filter(work => work.visible !== false)
      .forEach(work => {
        // Position and company
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#1e293b');
        const jobTitle = `${work.position} at ${work.name}`;
        
        let processedJobTitle = jobTitle;
        if (!hasUnicodeSupport && containsUnicodeSymbols(jobTitle)) {
          processedJobTitle = sanitizeTextForPDF(jobTitle);
        }
        pdf.text(processedJobTitle, margin, yPosition);
        yPosition += 7;

        // Dates
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#64748b');
        const dateRange = `${work.startDate} - ${work.endDate || 'Present'}`;
        
        let processedDateRange = dateRange;
        if (!hasUnicodeSupport && containsUnicodeSymbols(dateRange)) {
          processedDateRange = sanitizeTextForPDF(dateRange);
        }
        pdf.text(processedDateRange, margin, yPosition);
        yPosition += 7;

        // Summary
        if (work.summary) {
          addText(work.summary, 10, false, '#1e293b');
          yPosition += 2;
        }

        // Highlights
        if (work.highlights.length > 0) {
          work.highlights.forEach(highlight => {
            const bulletChar = hasUnicodeSupport ? '•' : '-';
            addText(`${bulletChar} ${highlight}`, 10, false, '#1e293b');
          });
        }
        yPosition += 4;
      });
  }

  // Education
  if (resumeData.sectionVisibility.education && resumeData.education.some(e => e.visible !== false)) {
    addSectionHeader('Education');
    
    resumeData.education
      .filter(edu => edu.visible !== false)
      .forEach(edu => {
        const degree = `${edu.studyType}${edu.area ? ` in ${edu.area}` : ''}`;
        addText(degree, 12, true, '#1e293b');
        addText(edu.institution, 11, false, '#0ea5e9');
        addText(`${edu.startDate} - ${edu.endDate || 'Present'}`, 10, false, '#64748b');
        if (edu.score) {
          addText(`Score: ${edu.score}`, 10, false, '#64748b');
        }
        yPosition += 4;
      });
  }

  // Skills
  if (resumeData.sectionVisibility.skills && resumeData.skills.some(s => s.visible !== false)) {
    addSectionHeader('Skills');
    
    resumeData.skills
      .filter(skill => skill.visible !== false)
      .forEach(skill => {
        const skillText = `${skill.name}${skill.level ? ` (${skill.level})` : ''}`;
        addText(skillText, 11, true, '#1e293b');
        if (skill.keywords.length > 0) {
          addText(skill.keywords.join(', '), 10, false, '#64748b');
        }
        yPosition += 2;
      });
  }

  // Projects
  if (resumeData.sectionVisibility.projects && resumeData.projects.some(p => p.visible !== false)) {
    addSectionHeader('Projects');
    
    resumeData.projects
      .filter(project => project.visible !== false)
      .forEach(project => {
        addText(project.name, 12, true, '#1e293b');
        addText(project.description, 10, false, '#1e293b');
        if (project.keywords.length > 0) {
          addText(`Technologies: ${project.keywords.join(', ')}`, 10, false, '#64748b');
        }
        yPosition += 4;
      });
  }

  // Awards
  if (resumeData.sectionVisibility.awards && resumeData.awards.some(a => a.visible !== false)) {
    addSectionHeader('Awards');
    
    resumeData.awards
      .filter(award => award.visible !== false)
      .forEach(award => {
        addText(`${award.title} - ${award.awarder}`, 11, true, '#1e293b');
        addText(award.date, 10, false, '#64748b');
        if (award.summary) {
          addText(award.summary, 10, false, '#1e293b');
        }
        yPosition += 4;
      });
  }

  // Languages
  if (resumeData.sectionVisibility.languages && resumeData.languages.some(l => l.visible !== false)) {
    addSectionHeader('Languages');
    
    resumeData.languages
      .filter(lang => lang.visible !== false)
      .forEach(lang => {
        const langText = `${lang.language}${lang.fluency ? ` (${lang.fluency})` : ''}`;
        addText(langText, 11, false, '#1e293b');
      });
  }

  const filename = generateExportFilename(resumeData, 'pdf', undefined, true);
  pdf.save(filename);
}
