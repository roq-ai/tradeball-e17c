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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTrade } from 'apiSdk/trades';
import { Error } from 'components/error';
import { tradeValidationSchema } from 'validationSchema/trades';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { StockInterface } from 'interfaces/stock';
import { UserInterface } from 'interfaces/user';
import { getStocks } from 'apiSdk/stocks';
import { getUsers } from 'apiSdk/users';
import { TradeInterface } from 'interfaces/trade';

function TradeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TradeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTrade(values);
      resetForm();
      router.push('/trades');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TradeInterface>({
    initialValues: {
      quantity: 0,
      price: 0,
      trade_type: '',
      stock_id: (router.query.stock_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: tradeValidationSchema,
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
            Create Trade
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="quantity" mb="4" isInvalid={!!formik.errors?.quantity}>
            <FormLabel>Quantity</FormLabel>
            <NumberInput
              name="quantity"
              value={formik.values?.quantity}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.quantity && <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>}
          </FormControl>
          <FormControl id="price" mb="4" isInvalid={!!formik.errors?.price}>
            <FormLabel>Price</FormLabel>
            <NumberInput
              name="price"
              value={formik.values?.price}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.price && <FormErrorMessage>{formik.errors?.price}</FormErrorMessage>}
          </FormControl>
          <FormControl id="trade_type" mb="4" isInvalid={!!formik.errors?.trade_type}>
            <FormLabel>Trade Type</FormLabel>
            <Input type="text" name="trade_type" value={formik.values?.trade_type} onChange={formik.handleChange} />
            {formik.errors.trade_type && <FormErrorMessage>{formik.errors?.trade_type}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<StockInterface>
            formik={formik}
            name={'stock_id'}
            label={'Select Stock'}
            placeholder={'Select Stock'}
            fetcher={getStocks}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.symbol}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'trade',
  operation: AccessOperationEnum.CREATE,
})(TradeCreatePage);
