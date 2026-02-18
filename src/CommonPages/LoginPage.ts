import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(url:string) 
  {
    await this.page.waitForTimeout(2000);
    // await this.page.waitForLoadState('domcontentloaded')
    await this.page.goto(url);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Logs in using username and optional password. If password is provided, both username and password are used.
   * If password is omitted, follows the existing login flow (username only).
   * @param username - The username to login
   * @param password - The password to login (optional)
   */
  async login(username: string, password?: string) {
    // Wait for username field to be visible
    await this.usernameInput.waitFor({ state: 'visible' });

    // Clear and fill username
    await this.usernameInput.click({ modifiers: ['ControlOrMeta'] });
    await this.usernameInput.fill(username);

    if (typeof password === 'string') {
      // Wait for password field and fill if provided
      await this.passwordInput.waitFor({ state: 'visible' });
      await this.passwordInput.click({ modifiers: ['ControlOrMeta'] });
      await this.passwordInput.fill(password);
    }

    // Wait for login button and click
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded')
  }
}
