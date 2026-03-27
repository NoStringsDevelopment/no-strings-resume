import { ResumeData } from '@/types/resume';
import {
  getCourseName,
  getHighlightContent,
  getKeywordName,
  getRoleName,
  getVisibleCourses,
  getVisibleHighlights,
  getVisibleKeywords,
  getVisibleRoles,
} from '@/utils/visibilityHelpers';

export interface ExportResumeHeader {
  name: string;
  label?: string;
  contacts: string[];
  profiles: string[];
  summary?: string;
}

export interface ExportResumeEntry {
  title: string;
  subtitle?: string;
  metadata?: string;
  summary?: string;
  details: string[];
  bullets: string[];
}

export interface ExportResumeSection {
  title: string;
  entries: ExportResumeEntry[];
}

export interface ExportResumeDocument {
  header: ExportResumeHeader | null;
  sections: ExportResumeSection[];
}

function nonEmpty(values: Array<string | undefined | null | false>): string[] {
  return values
    .map((value) => String(value ?? '').trim())
    .filter(Boolean);
}

function formatDateRange(startDate?: string, endDate?: string): string | undefined {
  if (!startDate && !endDate) {
    return undefined;
  }

  return [startDate?.trim(), endDate?.trim() || 'Present']
    .filter(Boolean)
    .join(' - ');
}

function joinWithSeparator(values: Array<string | undefined | null | false>, separator: string = ' | '): string | undefined {
  const filtered = nonEmpty(values);
  return filtered.length > 0 ? filtered.join(separator) : undefined;
}

function createEntry(overrides: Partial<ExportResumeEntry> & { title: string }): ExportResumeEntry {
  return {
    title: overrides.title.trim(),
    subtitle: overrides.subtitle?.trim() || undefined,
    metadata: overrides.metadata?.trim() || undefined,
    summary: overrides.summary?.trim() || undefined,
    details: nonEmpty(overrides.details ?? []),
    bullets: nonEmpty(overrides.bullets ?? []),
  };
}

function createSection(title: string, entries: ExportResumeEntry[]): ExportResumeSection | null {
  if (entries.length === 0) {
    return null;
  }

  return { title, entries };
}

export function buildResumeExportContent(resumeData: ResumeData): ExportResumeDocument {
  const { sectionVisibility } = resumeData;
  const sections: ExportResumeSection[] = [];

  const header = sectionVisibility.basics
    ? {
        name: resumeData.basics.name.trim() || 'Resume',
        label: resumeData.basics.label.trim() || undefined,
        contacts: nonEmpty([
          resumeData.basics.email,
          resumeData.basics.phone,
          resumeData.basics.url,
          joinWithSeparator([resumeData.basics.location.city, resumeData.basics.location.region], ', '),
        ]),
        profiles: resumeData.basics.profiles
          .filter((profile) => profile.visible !== false)
          .map((profile) => joinWithSeparator([profile.network, profile.username || profile.url], ': '))
          .filter((value): value is string => Boolean(value)),
        summary: resumeData.basics.summary.trim() || undefined,
      }
    : null;

  const workSection = createSection(
    'Work Experience',
    resumeData.work
      .filter((work) => sectionVisibility.work && work.visible !== false)
      .map((work) =>
        createEntry({
          title: work.position,
          subtitle: work.name,
          metadata: joinWithSeparator([formatDateRange(work.startDate, work.endDate), work.location]),
          summary: work.summary,
          bullets: getVisibleHighlights(work.highlights).map((highlight) => getHighlightContent(highlight)),
        }),
      ),
  );
  if (workSection) sections.push(workSection);

  const volunteerSection = createSection(
    'Volunteer Experience',
    resumeData.volunteer
      .filter((volunteer) => sectionVisibility.volunteer && volunteer.visible !== false)
      .map((volunteer) =>
        createEntry({
          title: volunteer.position,
          subtitle: volunteer.organization,
          metadata: formatDateRange(volunteer.startDate, volunteer.endDate),
          summary: volunteer.summary,
          bullets: getVisibleHighlights(volunteer.highlights).map((highlight) => getHighlightContent(highlight)),
        }),
      ),
  );
  if (volunteerSection) sections.push(volunteerSection);

  const educationSection = createSection(
    'Education',
    resumeData.education
      .filter((education) => sectionVisibility.education && education.visible !== false)
      .map((education) => {
        const visibleCourses = getVisibleCourses(education.courses).map((course) => getCourseName(course));

        return createEntry({
          title: joinWithSeparator([education.studyType, education.area ? `in ${education.area}` : undefined], ' ') || education.studyType,
          subtitle: education.institution,
          metadata: formatDateRange(education.startDate, education.endDate),
          details: [
            education.score ? `Score: ${education.score}` : undefined,
            visibleCourses.length > 0 ? `Relevant courses: ${visibleCourses.join(', ')}` : undefined,
          ],
        });
      }),
  );
  if (educationSection) sections.push(educationSection);

  const skillsSection = createSection(
    'Skills',
    resumeData.skills
      .filter((skill) => sectionVisibility.skills && skill.visible !== false)
      .map((skill) =>
        createEntry({
          title: joinWithSeparator([skill.name, skill.level ? `(${skill.level})` : undefined], ' ') || skill.name,
          details: [
            getVisibleKeywords(skill.keywords)
              .map((keyword) => getKeywordName(keyword))
              .join(', '),
          ],
        }),
      ),
  );
  if (skillsSection) sections.push(skillsSection);

  const projectsSection = createSection(
    'Projects',
    resumeData.projects
      .filter((project) => sectionVisibility.projects && project.visible !== false)
      .map((project) => {
        const visibleKeywords = getVisibleKeywords(project.keywords).map((keyword) => getKeywordName(keyword));
        const visibleRoles = getVisibleRoles(project.roles).map((role) => getRoleName(role));

        return createEntry({
          title: project.name,
          subtitle: project.entity || undefined,
          metadata: joinWithSeparator([formatDateRange(project.startDate, project.endDate), project.url]),
          summary: project.description,
          details: [
            visibleKeywords.length > 0 ? `Technologies: ${visibleKeywords.join(', ')}` : undefined,
            visibleRoles.length > 0 ? `Roles: ${visibleRoles.join(', ')}` : undefined,
          ],
          bullets: getVisibleHighlights(project.highlights).map((highlight) => getHighlightContent(highlight)),
        });
      }),
  );
  if (projectsSection) sections.push(projectsSection);

  const awardsSection = createSection(
    'Awards',
    resumeData.awards
      .filter((award) => sectionVisibility.awards && award.visible !== false)
      .map((award) =>
        createEntry({
          title: award.title,
          subtitle: award.awarder,
          metadata: award.date || undefined,
          summary: award.summary,
        }),
      ),
  );
  if (awardsSection) sections.push(awardsSection);

  const certificatesSection = createSection(
    'Certificates',
    resumeData.certificates
      .filter((certificate) => sectionVisibility.certificates && certificate.visible !== false)
      .map((certificate) =>
        createEntry({
          title: certificate.name,
          subtitle: certificate.issuer,
          metadata: certificate.date || undefined,
          details: [certificate.url || undefined],
        }),
      ),
  );
  if (certificatesSection) sections.push(certificatesSection);

  const publicationsSection = createSection(
    'Publications',
    resumeData.publications
      .filter((publication) => sectionVisibility.publications && publication.visible !== false)
      .map((publication) =>
        createEntry({
          title: publication.name,
          subtitle: publication.publisher,
          metadata: joinWithSeparator([publication.releaseDate, publication.url]),
          summary: publication.summary,
        }),
      ),
  );
  if (publicationsSection) sections.push(publicationsSection);

  const languagesSection = createSection(
    'Languages',
    resumeData.languages
      .filter((language) => sectionVisibility.languages && language.visible !== false)
      .map((language) =>
        createEntry({
          title: joinWithSeparator([language.language, language.fluency ? `(${language.fluency})` : undefined], ' ') || language.language,
        }),
      ),
  );
  if (languagesSection) sections.push(languagesSection);

  const interestsSection = createSection(
    'Interests',
    resumeData.interests
      .filter((interest) => sectionVisibility.interests && interest.visible !== false)
      .map((interest) =>
        createEntry({
          title: interest.name,
          details: [
            getVisibleKeywords(interest.keywords)
              .map((keyword) => getKeywordName(keyword))
              .join(', '),
          ],
        }),
      ),
  );
  if (interestsSection) sections.push(interestsSection);

  const referencesSection = createSection(
    'References',
    resumeData.references
      .filter((reference) => sectionVisibility.references && reference.visible !== false)
      .map((reference) =>
        createEntry({
          title: reference.name,
          summary: reference.reference,
        }),
      ),
  );
  if (referencesSection) sections.push(referencesSection);

  return { header, sections };
}
