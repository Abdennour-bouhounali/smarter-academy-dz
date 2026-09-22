import { call, get, send } from './teacherClient';

/**
 * Les classes (« الأقسام ») d'un enseignant. Aucun identifiant d'enseignant
 * ne part jamais : le serveur résout tout depuis le jeton, et refuse en 403
 * la classe d'un autre.
 */
export function fetchTeacherDashboard(token) {
  return call('/teacher/dashboard', get(token), 'classroomLoad').then((d) => d.dashboard);
}

export function fetchTeacherEntitlements(token) {
  return call('/teacher/entitlements', get(token), 'classroomLoad').then((d) => d.entitlements);
}

export function fetchClassGroups(token) {
  return call('/teacher/classrooms', get(token), 'classroomLoad');
}

export function createClassGroup(token, { name, grade, description, academicYear }) {
  return call('/teacher/classrooms', send('POST', token, { name, grade, description, academicYear }), 'classroomSave');
}

export function fetchClassGroup(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}`, get(token), 'classroomLoad').then((d) => d.classroom);
}

export function updateClassGroup(token, id, patch) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}`, send('PATCH', token, patch), 'classroomSave').then((d) => d.classroom);
}

export function archiveClassGroup(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/archive`, send('POST', token), 'classroomSave');
}

export function restoreClassGroup(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/restore`, send('POST', token), 'classroomSave');
}

export function rotateJoinCode(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/join-code/rotate`, send('POST', token), 'classroomSave').then((d) => d.classroom);
}

export function fetchClassStudents(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/students`, get(token), 'progressLoadClass').then((d) => d.students);
}

export function fetchClassStudentProgress(token, id, studentId) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/students/${encodeURIComponent(studentId)}/progress`, get(token), 'progressLoadClass');
}

export function removeClassStudent(token, id, studentId) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/students/${encodeURIComponent(studentId)}`, send('DELETE', token), 'classroomSave');
}

export function fetchClassInvitations(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/invitations`, get(token), 'invitationLoad').then((d) => d.invitations);
}

export function sendClassInvitation(token, id, email) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/invitations`, send('POST', token, { email }), 'invitationSend');
}

export function revokeClassInvitation(token, id, invitationId) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/invitations/${encodeURIComponent(invitationId)}`, send('DELETE', token), 'invitationSend');
}

export function fetchClassLessons(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/lessons`, get(token), 'classroomLoad').then((d) => d.curriculum);
}

/** @param {'visible'|'hidden'} status */
export function setClassLessonStatus(token, id, lessonId, status) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/lessons/${encodeURIComponent(lessonId)}`, send('PATCH', token, { status }), 'lessonVisibility');
}

/** Le lot : `{ applied, unchanged, failed }` — trois issues, jamais un simple « succès ». */
export function bulkSetClassLessonStatus(token, id, lessonIds, status) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/lessons/bulk`, send('POST', token, { lessonIds, status }), 'lessonVisibility');
}

export function fetchClassProgress(token, id) {
  return call(`/teacher/classrooms/${encodeURIComponent(id)}/progress`, get(token), 'progressLoadClass');
}
