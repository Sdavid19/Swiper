export const getDefaultRange = () => {
  const now = new Date();

  const from = new Date();
  from.setFullYear(now.getFullYear() - 2);

  return { from, to: now };
};
