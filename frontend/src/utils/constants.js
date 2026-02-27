// Status values must match the Complaint model enum exactly
export const STATUSES = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

// Role values must match the User model enum exactly (mixed-case)
export const ROLES = {
  STUDENT: 'Student',
  STAFF: 'Staff',
  ADMIN: 'Admin',
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
