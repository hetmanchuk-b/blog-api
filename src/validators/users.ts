export const validateUsername = (username: string): string | null => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!username) return 'Username is required';
  if (!regex.test(username)) return 'Username must be 3-20 characters long and contain only letters, numbers, or underscores';
  return null;
};

export const validateEmail = (email: string): string | null => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!regex.test(email)) return 'Invalid email format';
  return null;
};

export const validateBio = (bio: string | null): string | null => {
  if (bio && bio.length > 500) return 'Bio must be 500 characters or less';
  return null;
};