import {
  FormControl,
  IInputProps,
  Input as NativeBaseInput,
} from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="gray.100"
        h={12}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="gray.700"
        fontFamily="body"
        mb={2}
        placeholderTextColor="gray.400"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.300',
        }}
        _focus={{
          bg: 'gray.100',
          borderWidth: 1,
          borderColor: 'blue.300',
        }}
        {...rest}
      />

      <FormControl.ErrorMessage
        mt={-1}
        _text={{ color: 'red.300', fontSize: 'sm' }}
      >
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
