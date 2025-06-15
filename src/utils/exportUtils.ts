
import { ResumeData } from '@/types/resume';
import { downloadFile, exportResumeAsJson } from '@/utils/importExport';

// Convert JSON Resume to HR-Open format
export function convertToHROpen(resumeData: ResumeData): any {
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
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(jsonContent, `resume-${timestamp}.json`, 'application/json');
}

export function exportAsHROpen(resumeData: ResumeData) {
  const hrOpenData = convertToHROpen(resumeData);
  const jsonContent = JSON.stringify(hrOpenData, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(jsonContent, `resume-hropen-${timestamp}.json`, 'application/json');
}

export function exportAsHTML(resumeData: ResumeData, theme: any) {
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

  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(htmlContent, `resume-${timestamp}.html`, 'text/html');
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
        ${resumeData.basics.profiles.filter(p => p.visible !== false).map(profile => 
          `<span>${profile.network}: ${profile.username || profile.url}</span>`
        ).join(' | ')}
        ${resumeData.basics.summary ? `<p>${resumeData.basics.summary}</p>` : ''}
      </header>
    `;
  }

  if (sectionVisibility.work && resumeData.work.some(w => w.visible !== false)) {
    html += '<div class="section"><h3>Work Experience</h3>';
    resumeData.work
      .filter(work => work.visible !== false)
      .forEach(work => {
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
            ${work.highlights.length > 0 ? `<ul>${work.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
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
        html += `
          <div class="skill-item">
            <h4>${skill.name}${skill.level ? ` (${skill.level})` : ''}</h4>
            ${skill.keywords.length > 0 ? `<div class="skill-keywords">${skill.keywords.join(', ')}</div>` : ''}
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
        html += `
          <div class="item">
            <h4 style="margin: 0 0 0.5em 0; font-size: 1.1em;">${project.name}</h4>
            <p>${project.description}</p>
            ${project.keywords.length > 0 ? `<p class="skill-keywords">Technologies: ${project.keywords.join(', ')}</p>` : ''}
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

export async function exportAsPDF(resumeData: ResumeData, theme: any) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  
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

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false, color: string = '#000000') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color);
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      checkNewPage();
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  const addSectionHeader = (title: string) => {
    yPosition += sectionSpacing;
    checkNewPage(12);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#2563eb'); // Primary color
    pdf.text(title.toUpperCase(), margin, yPosition);
    yPosition += 8;
    
    // Add underline
    pdf.setDrawColor(226, 232, 240); // Border color
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 4;
  };

  // Header section
  if (resumeData.sectionVisibility.basics) {
    // Name - large and bold
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#2563eb');
    pdf.text(resumeData.basics.name, margin, yPosition);
    yPosition += 12;

    // Label/title
    if (resumeData.basics.label) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#64748b');
      pdf.text(resumeData.basics.label, margin, yPosition);
      yPosition += 8;
    }
    
    // Contact information - compressed to single line
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
      const contactLine = contactInfo.join(' • ');
      addText(contactLine, 10, false, '#64748b');
    }

    // Profiles - also compressed to single line
    if (resumeData.basics.profiles.some(p => p.visible !== false)) {
      const profilesInfo = resumeData.basics.profiles
        .filter(profile => profile.visible !== false)
        .map(profile => `${profile.network}: ${profile.username || profile.url}`)
        .join(' • ');
      
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
        pdf.text(jobTitle, margin, yPosition);
        yPosition += 7;

        // Dates
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#64748b');
        pdf.text(`${work.startDate} - ${work.endDate || 'Present'}`, margin, yPosition);
        yPosition += 7;

        // Summary
        if (work.summary) {
          addText(work.summary, 10, false, '#1e293b');
          yPosition += 2;
        }

        // Highlights
        if (work.highlights.length > 0) {
          work.highlights.forEach(highlight => {
            addText(`• ${highlight}`, 10, false, '#1e293b');
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

  const timestamp = new Date().toISOString().split('T')[0];
  pdf.save(`resume-${timestamp}.pdf`);
}
