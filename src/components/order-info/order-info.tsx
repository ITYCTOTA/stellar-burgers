import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectIngredients,
  selectSelectedOrder,
  selectUserOrders
} from '../../services/selectors';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

type TOrderInfo = TOrder & {
  ingredientsInfo: TIngredientsWithCount;
  date: Date;
  total: number;
};

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const selectedOrder = useSelector(selectSelectedOrder);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const ingredients = useSelector(selectIngredients);

  const orderData =
    feedOrders.find((order) => order.number === orderNumber) ||
    userOrders.find((order) => order.number === orderNumber) ||
    (selectedOrder?.number === orderNumber ? selectedOrder : null);

  useEffect(() => {
    if (!orderData && Number.isFinite(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo<TOrderInfo | null>(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
