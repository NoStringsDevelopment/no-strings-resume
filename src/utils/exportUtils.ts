
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
        }
        .contact-info { 
            color: ${theme.colors.textSecondary}; 
            margin-bottom: 2em;
        }
        .contact-info span { 
            margin-right: 1em; 
        }
        .section { 
            margin-bottom: 2em; 
        }
        .item { 
            margin-bottom: 1em; 
        }
        .item-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
        }
        .company { 
            color: ${theme.colors.accent}; 
            font-weight: bold;
        }
        .date { 
            color: ${theme.colors.textSecondary}; 
            font-size: 0.9em;
        }
        ul { 
            margin: 0.5em 0; 
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
        </div>
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
                <strong>${work.position}</strong><br>
                <span class="company">${work.name}</span>
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

  // Add other sections similarly...
  
  return html;
}

export async function exportAsPDF(resumeData: ResumeData, theme: any) {
  // Simple PDF export using jsPDF
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  
  let yPosition = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 7;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    yPosition += 3; // Extra space after sections
  };

  // Header
  if (resumeData.sectionVisibility.basics) {
    addText(resumeData.basics.name, 20, true);
    if (resumeData.basics.label) {
      addText(resumeData.basics.label, 14);
    }
    
    const contactInfo = [
      resumeData.basics.email,
      resumeData.basics.phone,
      resumeData.basics.url
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      addText(contactInfo, 10);
    }
    
    if (resumeData.basics.summary) {
      yPosition += 5;
      addText(resumeData.basics.summary);
    }
  }

  // Work Experience
  if (resumeData.sectionVisibility.work && resumeData.work.some(w => w.visible !== false)) {
    yPosition += 10;
    addText('WORK EXPERIENCE', 16, true);
    
    resumeData.work
      .filter(work => work.visible !== false)
      .forEach(work => {
        addText(`${work.position} at ${work.name}`, 12, true);
        addText(`${work.startDate} - ${work.endDate || 'Present'}`, 10);
        if (work.summary) {
          addText(work.summary);
        }
        work.highlights.forEach(highlight => {
          addText(`• ${highlight}`);
        });
        yPosition += 5;
      });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  pdf.save(`resume-${timestamp}.pdf`);
}
