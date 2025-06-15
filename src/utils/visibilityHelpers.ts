import { Highlight, Course, Keyword, Role } from '@/types/resume';

// Helper functions for working with highlights and courses
export function normalizeHighlight(highlight: string | Highlight): Highlight {
  if (typeof highlight === 'string') {
    return { content: highlight, visible: true };
  }
  return highlight;
}

export function normalizeCourse(course: string | Course): Course {
  if (typeof course === 'string') {
    return { name: course, visible: true };
  }
  return course;
}

export function normalizeKeyword(keyword: string | Keyword): Keyword {
  if (typeof keyword === 'string') {
    return { name: keyword, visible: true };
  }
  return keyword;
}

export function normalizeRole(role: string | Role): Role {
  if (typeof role === 'string') {
    return { name: role, visible: true };
  }
  return role;
}

export function normalizeHighlights(highlights: (string | Highlight)[]): Highlight[] {
  return highlights.map(normalizeHighlight);
}

export function normalizeCourses(courses: (string | Course)[]): Course[] {
  return courses.map(normalizeCourse);
}

export function normalizeKeywords(keywords: (string | Keyword)[]): Keyword[] {
  return keywords.map(normalizeKeyword);
}

export function normalizeRoles(roles: (string | Role)[]): Role[] {
  return roles.map(normalizeRole);
}

export function getHighlightContent(highlight: string | Highlight): string {
  return typeof highlight === 'string' ? highlight : highlight.content;
}

export function getCourseName(course: string | Course): string {
  return typeof course === 'string' ? course : course.name;
}

export function getKeywordName(keyword: string | Keyword): string {
  return typeof keyword === 'string' ? keyword : keyword.name;
}

export function getRoleName(role: string | Role): string {
  return typeof role === 'string' ? role : role.name;
}

export function isHighlightVisible(highlight: string | Highlight): boolean {
  return typeof highlight === 'string' ? true : highlight.visible !== false;
}

export function isCourseVisible(course: string | Course): boolean {
  return typeof course === 'string' ? true : course.visible !== false;
}

export function isKeywordVisible(keyword: string | Keyword): boolean {
  return typeof keyword === 'string' ? true : keyword.visible !== false;
}

export function isRoleVisible(role: string | Role): boolean {
  return typeof role === 'string' ? true : role.visible !== false;
}

export function getVisibleHighlights(highlights: (string | Highlight)[]): (string | Highlight)[] {
  return highlights.filter(isHighlightVisible);
}

export function getVisibleCourses(courses: (string | Course)[]): (string | Course)[] {
  return courses.filter(isCourseVisible);
}

export function getVisibleKeywords(keywords: (string | Keyword)[]): (string | Keyword)[] {
  return keywords.filter(isKeywordVisible);
}

export function getVisibleRoles(roles: (string | Role)[]): (string | Role)[] {
  return roles.filter(isRoleVisible);
} 