import * as yup from 'yup';

export const reportValidationSchema = yup.object().shape({
  report_data: yup.string().required(),
  user_id: yup.string().nullable(),
  exchange_id: yup.string().nullable(),
});
