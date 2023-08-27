import { IButtonProps, Button as NativeBaseButton, Text } from 'native-base';

type PropsButton = IButtonProps & {
  text: string;
  variant?: 'primary' | 'secondary';
};

export function Button({ text, variant = 'primary', ...rest }: PropsButton) {
  return (
    <NativeBaseButton
      w="full"
      h={12}
      rounded="sm"
      bgColor={variant === 'primary' ? 'blue.300' : 'gray.300'}
      borderWidth={0}
      _pressed={{
        bg: variant === 'primary' ? 'blue.700' : 'gray.400',
      }}
      {...rest}
    >
      <Text
        color={variant === 'primary' ? 'gray.100' : 'gray.700'}
        fontFamily="heading"
        fontSize="sm"
      >
        {text}
      </Text>
    </NativeBaseButton>
  );
}
