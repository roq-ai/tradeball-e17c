import * as yup from 'yup';

export const tradeValidationSchema = yup.object().shape({
  quantity: yup.number().integer().required(),
  price: yup.number().integer().required(),
  trade_type: yup.string().required(),
  stock_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
