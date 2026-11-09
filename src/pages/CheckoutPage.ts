import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  private readonly cartItems: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly finishButton: Locator;
  private readonly orderConfirmationMessage: Locator;

  constructor(readonly page: Page) {
    this.cartItems = page.getByRole('button', { name: /Remove/ });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.orderConfirmationMessage = page.getByText('Thank you for your order!', {
      exact: true,
    });
  }

  async goto(url = 'https://www.saucedemo.com'): Promise<void> {
    await this.page.goto(url);
  }

  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async enterCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.orderConfirmationMessage).toBeVisible();
  }
}
