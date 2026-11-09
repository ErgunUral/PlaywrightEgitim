import type { Locator, Page } from '@playwright/test';

export type ProductSortOption =
  | 'Price (low to high)'
  | 'Price (high to low)'
  | 'Name (A to Z)'
  | 'Name (Z to A)';

export type SauceDemoProduct = 'Sauce Labs Onesie' | 'Sauce Labs Bike Light';

export class InventoryPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly sortDropdown: Locator;
  private readonly productAddToCartButtons: Record<SauceDemoProduct, Locator>;

  constructor(readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    this.productAddToCartButtons = {
      'Sauce Labs Onesie': page.getByTestId('add-to-cart-sauce-labs-onesie'),
      'Sauce Labs Bike Light': page.getByTestId('add-to-cart-sauce-labs-bike-light'),
    };
  }

  async goto(url = 'https://www.saucedemo.com'): Promise<void> {
    await this.page.goto(url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async sortProducts(option: ProductSortOption): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
  }

  async addToCart(product: SauceDemoProduct): Promise<void> {
    await this.productAddToCartButtons[product].click();
  }
}
