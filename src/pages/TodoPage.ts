import { expect, type Locator, type Page } from '@playwright/test';

export type TodoFilter = 'All' | 'Active' | 'Completed';

export class TodoPage {
  private readonly newTodoInput: Locator;
  private readonly todoTitles: Locator;
  private readonly remainingItemsCount: Locator;

  constructor(readonly page: Page) {
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoTitles = page.getByTestId('todo-title');
    this.remainingItemsCount = page.getByText(/\d+ items? left/);
  }

  async goto(url = 'https://demo.playwright.dev/todomvc'): Promise<void> {
    await this.page.goto(url);
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  async completeTodo(title: string): Promise<void> {
    const todoItem = this.todoItem(title);
    await todoItem.getByRole('checkbox', { name: 'Toggle Todo' }).check();
  }

  async filterTodos(filter: TodoFilter): Promise<void> {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }

  async verifyRemainingItemCount(expectedCount: number): Promise<void> {
    const expectedText = `${expectedCount} ${expectedCount === 1 ? 'item' : 'items'} left`;
    await expect(this.remainingItemsCount).toHaveText(expectedText);
  }

  async checkItemCount(expectedCount: number): Promise<void> {
    await expect(this.todoTitles).toHaveCount(expectedCount);
  }

  private todoItem(title: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }
}
