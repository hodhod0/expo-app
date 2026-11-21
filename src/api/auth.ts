export type User = { name: string; email: string; phone?: string };

/**
 * Guest accounts.
 *
 * TODO: the bomain backend has no customer sign-in / sign-up / password-reset
 * endpoints yet (dm_users is the admin users list). Until they exist these
 * functions only simulate a network delay and accept any valid input —
 * no account is created on a server and no email is sent.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(email: string, _password: string): Promise<User> {
  await delay(800);
  return { name: email.split('@')[0], email };
}

export async function signUp(input: { name: string; email: string; phone?: string; password: string }): Promise<User> {
  await delay(900);
  return { name: input.name, email: input.email, phone: input.phone };
}

export async function requestPasswordReset(_email: string): Promise<void> {
  await delay(800);
}
