import { expect, test, type Page } from '@playwright/test';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { InventoryPage } from '../../src/pages/InventoryPage';

test.use({ testIdAttribute: 'data-test' });

async function loginAsStandardUser(page: Page): Promise<InventoryPage> {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await inventoryPage.login('standard_user', 'secret_sauce');
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  return inventoryPage;
}

async function openCart(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Cart/ }).click();
}

test.describe('SauceDemo satın alma akışı', () => {
  test('SD-01 fiyatı düşükten yükseğe sıralar ve siparişi tamamlar', async ({ page }) => {
    const inventoryPage = await loginAsStandardUser(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.sortProducts('Price (low to high)');
    await expect(page.getByRole('combobox', { name: 'Sort products' })).toHaveValue('lohi');
    await expect(page.getByRole('main')).toContainText(
      /Sauce Labs Onesie[\s\S]*\$7\.99[\s\S]*Sauce Labs Bike Light[\s\S]*\$9\.99[\s\S]*Sauce Labs Bolt T-Shirt[\s\S]*\$15\.99[\s\S]*Test\.allTheThings\(\) T-Shirt \(Red\)[\s\S]*\$15\.99[\s\S]*Sauce Labs Backpack[\s\S]*\$29\.99[\s\S]*Sauce Labs Fleece Jacket[\s\S]*\$49\.99/,
    );

    await inventoryPage.addToCart('Sauce Labs Onesie');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();
    await openCart(page);

    await checkoutPage.verifyCartItemCount(2);
    await expect(page.getByText('Sauce Labs Onesie', { exact: true })).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
    await expect(page.getByText('$9.99', { exact: true })).toBeVisible();
    await expect(page.getByText('1', { exact: true })).toHaveCount(2);
    await page.getByRole('button', { name: 'Checkout' }).click();
    await checkoutPage.enterCustomerInformation('Test', 'Customer', '10001');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Sauce Labs Onesie', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
    await expect(page.getByText('Item total: $17.98', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $1.44', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $19.42', { exact: true })).toBeVisible();
    await checkoutPage.finishOrder();

    await expect(page.getByText('Checkout: Complete!', { exact: true })).toBeVisible();
    await checkoutPage.verifyOrderConfirmation();
  });

  test('SD-02 geçersiz kullanıcı bilgileriyle girişe izin vermez', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.login('invalid_user', 'invalid_password');

    await expect(page.getByText(
      'Epic sadface: Username and password do not match any user in this service',
    )).toBeVisible();
    await expect(page.getByText('Products', { exact: true })).not.toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('SD-03 checkout formundaki zorunlu alanları ayrı ayrı doğrular', async ({ page }) => {
    const inventoryPage = await loginAsStandardUser(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('Sauce Labs Onesie');
    await openCart(page);
    await checkoutPage.verifyCartItemCount(1);
    await page.getByRole('button', { name: 'Checkout' }).click();

    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.click();
    await expect(page.getByText('Error: First Name is required', { exact: true })).toBeVisible();

    await page.getByPlaceholder('First Name').fill('Test');
    await continueButton.click();
    await expect(page.getByText('Error: Last Name is required', { exact: true })).toBeVisible();

    await page.getByPlaceholder('Last Name').fill('Customer');
    await continueButton.click();
    await expect(page.getByText('Error: Postal Code is required', { exact: true })).toBeVisible();

    await expect(page.getByText('Checkout: Overview', { exact: true })).not.toBeVisible();
  });

  test('SD-04 boş sepet ürün içermez', async ({ page }) => {
    await loginAsStandardUser(page);
    await openCart(page);

    await expect(page.getByRole('button', { name: /Remove/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
    await expect(page.getByText('Checkout: Complete!', { exact: true })).not.toBeVisible();
  });
});
