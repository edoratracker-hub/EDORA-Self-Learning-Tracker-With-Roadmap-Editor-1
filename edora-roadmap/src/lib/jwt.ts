// Authentication removed - stub functions for compatibility

export const TOKEN_COOKIE_NAME = '__roadmapsh_jt__';
export const COURSE_PURCHASE_PARAM = 'course_purchase';
export const COURSE_PURCHASE_SUCCESS_PARAM = 'course_purchase_success';

export function decodeToken(token: string) {
  return null;
}

export function getUser() {
  return null;
}

export function removeAuthToken() {
  // No-op function
}

export function isLoggedIn() {
  return false;
}

export function setViewSponsorCookie() {
  // No-op function
}

export function setAIReferralCode(code: string) {
  // No-op function
}

export function visitAIRoadmap(roadmapId: string) {
  // No-op function
}
