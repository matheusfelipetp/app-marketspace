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
          defaultSource={LogoImg}
          alt="Logo MarketSpace"
          width={size === 'small' ? 16 : 32}
          height={size === 'small' ? 12 : 20}
        />

        <Heading
          color="gray.700"
          fontSize={size === 'small' ? 'xl' : 'xxl'}
          fontFamily="heading"
          mt={2}
        >
          {title}
        </Heading>

        <Text
          color="gray.500"
          fontSize="sm"
          fontFamily="body"
          mt={1}
          textAlign="center"
        >
          {text}
        </Text>
      </Center>
    </VStack>
  );
}
