export const STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
};

export const ROLES = {
  STUDENT: 'STUDENT',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

export const isValidTransition = (current, next) => {
  if (current === STATUSES.OPEN && next === STATUSES.IN_PROGRESS) return true;
  if (current === STATUSES.IN_PROGRESS && next === STATUSES.RESOLVED) return true;
  return false;
};

export const getNextValidStatuses = (current) => {
  if (current === STATUSES.OPEN) return [STATUSES.IN_PROGRESS];
  if (current === STATUSES.IN_PROGRESS) return [STATUSES.RESOLVED];
  return [];
};
