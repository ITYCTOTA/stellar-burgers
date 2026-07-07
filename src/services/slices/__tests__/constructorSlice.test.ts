import { describe, expect, test } from '@jest/globals';
import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from '../constructorSlice';

const bun = {
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

const mainIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

const sauceIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

const constructorIngredient = {
  ...mainIngredient,
  id: 'constructor-main-id'
};

const secondConstructorIngredient = {
  ...sauceIngredient,
  id: 'constructor-sauce-id'
};

describe('constructorSlice', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'unknown' });

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку в constructor.bun', () => {
    const result = constructorReducer(undefined, addIngredient(bun));

    expect(result.bun).toEqual({
      ...bun,
      id: expect.any(String)
    });
    expect(result.ingredients).toEqual([]);
  });

  test('добавляет ингредиент в список начинки', () => {
    const result = constructorReducer(undefined, addIngredient(mainIngredient));

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([
      {
        ...mainIngredient,
        id: expect.any(String)
      }
    ]);
  });

  test('удаляет ингредиент из списка начинки', () => {
    const result = constructorReducer(
      {
        bun,
        ingredients: [constructorIngredient, secondConstructorIngredient]
      },
      removeIngredient(constructorIngredient.id)
    );

    expect(result).toEqual({
      bun,
      ingredients: [secondConstructorIngredient]
    });
  });

  test('перемещает ингредиент в списке начинки', () => {
    const result = constructorReducer(
      {
        bun,
        ingredients: [constructorIngredient, secondConstructorIngredient]
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(result).toEqual({
      bun,
      ingredients: [secondConstructorIngredient, constructorIngredient]
    });
  });

  test('очищает конструктор', () => {
    const result = constructorReducer(
      {
        bun,
        ingredients: [constructorIngredient]
      },
      clearConstructor()
    );

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
