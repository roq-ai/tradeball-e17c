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
import { createRiskLimit } from 'apiSdk/risk-limits';
import { Error } from 'components/error';
import { riskLimitValidationSchema } from 'validationSchema/risk-limits';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { ExchangeInterface } from 'interfaces/exchange';
import { getUsers } from 'apiSdk/users';
import { getExchanges } from 'apiSdk/exchanges';
import { RiskLimitInterface } from 'interfaces/risk-limit';

function RiskLimitCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RiskLimitInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRiskLimit(values);
      resetForm();
      router.push('/risk-limits');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RiskLimitInterface>({
    initialValues: {
      limit_value: 0,
      user_id: (router.query.user_id as string) ?? null,
      exchange_id: (router.query.exchange_id as string) ?? null,
    },
    validationSchema: riskLimitValidationSchema,
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
            Create Risk Limit
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="limit_value" mb="4" isInvalid={!!formik.errors?.limit_value}>
            <FormLabel>Limit Value</FormLabel>
            <NumberInput
              name="limit_value"
              value={formik.values?.limit_value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('limit_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.limit_value && <FormErrorMessage>{formik.errors?.limit_value}</FormErrorMessage>}
          </FormControl>
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'risk_limit',
  operation: AccessOperationEnum.CREATE,
})(RiskLimitCreatePage);
