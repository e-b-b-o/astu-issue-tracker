export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Only JPG, PNG, and PDF are allowed.';
  }

  if (file.size > maxSize) {
    return 'File size exceeds 5MB limit.';
  }

  return null; // Valid
};
