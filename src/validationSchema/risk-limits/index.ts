import * as yup from 'yup';

export const riskLimitValidationSchema = yup.object().shape({
  limit_value: yup.number().integer().required(),
  user_id: yup.string().nullable(),
  exchange_id: yup.string().nullable(),
});
