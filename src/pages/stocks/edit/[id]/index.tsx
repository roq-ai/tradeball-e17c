import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getStockById, updateStockById } from 'apiSdk/stocks';
import { Error } from 'components/error';
import { stockValidationSchema } from 'validationSchema/stocks';
import { StockInterface } from 'interfaces/stock';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ExchangeInterface } from 'interfaces/exchange';
import { getExchanges } from 'apiSdk/exchanges';

function StockEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StockInterface>(
    () => (id ? `/stocks/${id}` : null),
    () => getStockById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StockInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStockById(id, values);
      mutate(updated);
      resetForm();
      router.push('/stocks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StockInterface>({
    initialValues: data,
    validationSchema: stockValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Stock
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="symbol" mb="4" isInvalid={!!formik.errors?.symbol}>
              <FormLabel>Symbol</FormLabel>
              <Input type="text" name="symbol" value={formik.values?.symbol} onChange={formik.handleChange} />
              {formik.errors.symbol && <FormErrorMessage>{formik.errors?.symbol}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ExchangeInterface>
              formik={formik}
              name={'exchange_id'}
              label={'Select Exchange'}
              placeholder={'Select Exchange'}
              fetcher={getExchanges}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'stock',
  operation: AccessOperationEnum.UPDATE,
})(StockEditPage);
