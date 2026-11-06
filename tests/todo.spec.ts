import { expect, test, type Locator, type Page } from '@playwright/test';

const appUrl = 'https://demo.playwright.dev/todomvc';
const newTodoInput = 'What needs to be done?';

async function addTodo(page: Page, title: string): Promise<void> {
  const input = page.getByPlaceholder(newTodoInput);
  await input.fill(title);
  await input.press('Enter');
}

function todoItem(page: Page, title: string): Locator {
  return page.getByTestId('todo-title').filter({ hasText: title }).locator('..');
}

test.describe('TodoMVC temel işlemler', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl);
  });

  test('BO-01 başlangıç arayüzünü görüntüler', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
    await expect(page.getByPlaceholder(newTodoInput)).toBeVisible();
    await expect(page.locator('.todo-list')).toHaveCount(0);
    await expect(page.locator('.footer')).toHaveCount(0);
  });

  test('BO-02 Enter ile görev ekler', async ({ page }) => {
    await addTodo(page, 'Alışveriş yap');

    await expect(page.getByTestId('todo-title')).toHaveText(['Alışveriş yap']);
    await expect(page.getByPlaceholder(newTodoInput)).toHaveValue('');
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('BO-03 boş veya yalnızca boşluk içeren görev eklemez', async ({ page }) => {
    const input = page.getByPlaceholder(newTodoInput);
    await input.press('Enter');
    await input.fill('   ');
    await input.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('BO-04 görev metnindeki kenar boşluklarını temizler', async ({ page }) => {
    await addTodo(page, '  Raporu gönder  ');

    await expect(page.getByTestId('todo-title')).toHaveText(['Raporu gönder']);
  });

  test('BO-05 görevi tamamlandı ve etkin durumları arasında değiştirir', async ({ page }) => {
    await addTodo(page, 'Alışveriş yap');
    const item = todoItem(page, 'Alışveriş yap');
    const toggle = item.getByRole('checkbox', { name: 'Toggle Todo' });

    await toggle.check();
    await expect(toggle).toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('0 items left');

    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('BO-06 bütün görevleri tamamlar ve tekrar etkinleştirir', async ({ page }) => {
    await addTodo(page, 'Görev bir');
    await addTodo(page, 'Görev iki');
    const toggleAll = page.getByRole('checkbox', { name: 'Mark all as complete' });

    await toggleAll.check();
    await expect(toggleAll).toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('0 items left');
    await expect(page.getByRole('checkbox', { name: 'Toggle Todo' })).toHaveCount(2);
    await expect(page.getByRole('checkbox', { name: 'Toggle Todo' }).first()).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Toggle Todo' }).last()).toBeChecked();

    await toggleAll.uncheck();
    await expect(toggleAll).not.toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');
  });

  test('BO-07 görevi düzenler ve kaydeder', async ({ page }) => {
    await addTodo(page, 'Alışveriş yap');
    await page.getByTestId('todo-title').dblclick();
    const editInput = page.getByRole('textbox', { name: 'Edit' });
    await editInput.fill('Market alışverişi');
    await editInput.press('Enter');

    await expect(page.getByTestId('todo-title')).toHaveText(['Market alışverişi']);
    await expect(page.getByRole('textbox', { name: 'Edit' })).toHaveCount(0);
  });

  test('BO-08 Escape ile görev düzenlemesini iptal eder', async ({ page }) => {
    await addTodo(page, 'Alışveriş yap');
    await page.getByTestId('todo-title').dblclick();
    const editInput = page.getByRole('textbox', { name: 'Edit' });
    await editInput.fill('Değişiklik');
    await editInput.press('Escape');

    await expect(page.getByTestId('todo-title')).toHaveText(['Alışveriş yap']);
    await expect(page.getByRole('textbox', { name: 'Edit' })).toHaveCount(0);
  });

  test('BO-09 All, Active ve Completed filtrelerini ve sayacı doğrular', async ({ page }) => {
    await addTodo(page, 'Etkin görev');
    await addTodo(page, 'Tamamlanan görev');
    await todoItem(page, 'Tamamlanan görev')
      .getByRole('checkbox', { name: 'Toggle Todo' })
      .check();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['Etkin görev']);
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['Tamamlanan görev']);
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');

    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['Etkin görev', 'Tamamlanan görev']);
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('BO-10 tamamlanan görevleri temizler', async ({ page }) => {
    await addTodo(page, 'Etkin görev');
    await addTodo(page, 'Tamamlanacak görev');
    await todoItem(page, 'Tamamlanacak görev')
      .getByRole('checkbox', { name: 'Toggle Todo' })
      .check();

    const clearCompleted = page.getByRole('button', { name: 'Clear completed' });
    await expect(clearCompleted).toBeVisible();
    await clearCompleted.click();

    await expect(page.getByTestId('todo-title')).toHaveText(['Etkin görev']);
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
    await expect(clearCompleted).toHaveCount(0);
  });

  test('BO-11 yalnızca seçilen görevi siler', async ({ page }) => {
    await addTodo(page, 'Silinecek görev');
    await addTodo(page, 'Kalacak görev');

    const itemToDelete = todoItem(page, 'Silinecek görev');
    await itemToDelete.hover();
    await itemToDelete.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByTestId('todo-title')).toHaveText(['Kalacak görev']);
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('BO-12 görevleri ve durumlarını yenileme sonrasında korur', async ({ page }) => {
    await addTodo(page, 'Etkin görev');
    await addTodo(page, 'Tamamlanan görev');
    await todoItem(page, 'Tamamlanan görev')
      .getByRole('checkbox', { name: 'Toggle Todo' })
      .check();

    await page.reload();

    await expect(page.getByTestId('todo-title')).toHaveText(['Etkin görev', 'Tamamlanan görev']);
    await expect(todoItem(page, 'Etkin görev').getByRole('checkbox', { name: 'Toggle Todo' }))
      .not.toBeChecked();
    await expect(todoItem(page, 'Tamamlanan görev').getByRole('checkbox', { name: 'Toggle Todo' }))
      .toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });
});
