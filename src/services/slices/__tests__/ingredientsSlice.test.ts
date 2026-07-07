import { describe, expect, test } from '@jest/globals';
import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';

const ingredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

describe('ingredientsSlice', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'unknown' });

    expect(result).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  test('устанавливает состояние загрузки при fetchIngredients.pending', () => {
    const result = ingredientsReducer(
      {
        items: [],
        isLoading: false,
        error: 'Ошибка загрузки'
      },
      fetchIngredients.pending('requestId', undefined)
    );

    expect(result).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  test('сохраняет ингредиенты при fetchIngredients.fulfilled', () => {
    const result = ingredientsReducer(
      {
        items: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled([ingredient], 'requestId', undefined)
    );

    expect(result).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null
    });
  });

  test('сохраняет ошибку при fetchIngredients.rejected', () => {
    const result = ingredientsReducer(
      {
        items: [ingredient],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error('Не удалось получить ингредиенты'),
        'requestId',
        undefined
      )
    );

    expect(result).toEqual({
      items: [ingredient],
      isLoading: false,
      error: 'Не удалось получить ингредиенты'
    });
  });
});
