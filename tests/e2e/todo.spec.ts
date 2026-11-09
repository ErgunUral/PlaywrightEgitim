import { expect, test } from '@playwright/test';
import { TodoPage } from '../../src/pages/TodoPage';

test.describe('Todo Listesi Yönetimi', () => {
  test('üç görev ekler, ikincisini tamamlar ve Active/Completed filtrelerini doğrular', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1. TodoMVC uygulamasını aç.
    await todoPage.goto();

    // 2. Üç görevi ekle ve başlangıç öğe sayısını ve kalan sayacı doğrula.
    await todoPage.addTodo('Kitap oku');
    await todoPage.addTodo('E-postaları yanıtla');
    await todoPage.addTodo('Akşam yemeği hazırla');
    await todoPage.checkItemCount(3);
    await todoPage.verifyRemainingItemCount(3);

    // 3. İkinci görevi tamamla ve kalan öğe sayısını doğrula.
    await todoPage.completeTodo('E-postaları yanıtla');
    await todoPage.verifyRemainingItemCount(2);

    // 4. Active filtresinde yalnızca tamamlanmamış görevleri doğrula.
    await todoPage.filterTodos('Active');
    await expect(page.getByTestId('todo-title')).toHaveText([
      'Kitap oku',
      'Akşam yemeği hazırla',
    ]);
    await todoPage.checkItemCount(2);
    await todoPage.verifyRemainingItemCount(2);

    // 5. Completed filtresinde yalnızca tamamlanmış görevi doğrula.
    await todoPage.filterTodos('Completed');
    await expect(page.getByTestId('todo-title')).toHaveText(['E-postaları yanıtla']);
    await todoPage.checkItemCount(1);
    await todoPage.verifyRemainingItemCount(2);
  });
});
