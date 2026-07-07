import { expect, test } from '@playwright/test';
import path from 'path';

const bunId = '643d69a5c3f7b9001cfa093c';
const mainIngredientId = '643d69a5c3f7b9001cfa0941';
const harPath = path.join(__dirname, 'hars', 'constructor.har');

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(harPath, {
    url: '**/api/**'
  });
});

test.afterEach(async ({ context, page }) => {
  await page.evaluate(() => localStorage.clear());
  await context.clearCookies();
});

test('добавляет ингредиенты в конструктор', async ({ page }) => {
  await page.goto('/');

  await page
    .getByTestId(`ingredient-${bunId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();
  await page
    .getByTestId(`ingredient-${mainIngredientId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();

  await expect(page.getByTestId('constructor-bun-top')).toContainText(
    'Краторная булка N-200i (верх)'
  );
  await expect(page.getByTestId('constructor-ingredients')).toContainText(
    'Биокотлета из марсианской Магнолии'
  );
  await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
    'Краторная булка N-200i (низ)'
  );
});

test('открывает и закрывает модальное окно ингредиента', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText('Детали ингредиента');
  await expect(page.getByTestId('modal')).toContainText(
    'Краторная булка N-200i'
  );
  await expect(page.getByTestId('modal')).toContainText('420');

  await page.getByTestId('modal-close-button').click();

  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
  await page.goto('/');

  await page
    .getByTestId(`ingredient-${mainIngredientId}`)
    .getByRole('link')
    .click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText(
    'Биокотлета из марсианской Магнолии'
  );

  await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('создает заказ и очищает конструктор после закрытия модального окна', async ({
  context,
  page
}) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      url: 'http://localhost:4000'
    }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/');

  await page
    .getByTestId(`ingredient-${bunId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();
  await page
    .getByTestId(`ingredient-${mainIngredientId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText('12345');

  await page.getByTestId('modal-close-button').click();

  await expect(page.getByTestId('modal')).not.toBeVisible();
  await expect(page.getByTestId('constructor-bun-top')).toContainText(
    'Выберите булки'
  );
  await expect(page.getByTestId('constructor-empty-ingredients')).toContainText(
    'Выберите начинку'
  );
  await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
    'Выберите булки'
  );
});
