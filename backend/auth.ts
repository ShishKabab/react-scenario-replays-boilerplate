export function hashPassword(password: string) {
  console.warn(`REMINDER: Don't use this app in production. We're storing passwords as plain text. Not good.`);
  return password;
}
