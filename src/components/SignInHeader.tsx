import LogoImg from '@assets/logo.png';
import { Center, Heading, Image, Text, VStack } from 'native-base';

type PropsSignInHeader = {
  size?: 'small' | 'large';
  title: string;
  text: string;
};

export function SignInHeader({
  size = 'large',
  title,
  text,
}: PropsSignInHeader) {
  return (
    <VStack>
      <Center>
        <Image
          source={LogoImg}
          alt="Logo MarketSpace"
          width={size === 'small' ? 20 : 32}
          height={size === 'small' ? 16 : 20}
        />

        <Heading color="gray.700" fontSize="xxl" fontFamily="heading" mt={4}>
          {title}
        </Heading>

        <Text color="gray.500" fontSize="sm" fontFamily="body">
          {text}
        </Text>
      </Center>
    </VStack>
  );
}
