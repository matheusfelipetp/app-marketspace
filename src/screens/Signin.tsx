import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { SignInHeader } from '@components/SignInHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { Center, Icon, Pressable, ScrollView, Text, VStack } from 'native-base';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

type FormDataProps = {
  email: string;
  password: string;
};

const signUpSchema = yup.object({
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informe a senha'),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const handleSignUp = () => {
    navigation.navigate('signUp');
  };

  const handleSignIn = (data: FormDataProps) => {
    setIsLoading(true);
    console.log(data);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack pt={24} pb={18} px={10}>
        <SignInHeader title="marketspace" text="Seu espaço de compra e venda" />

        <Center my={24}>
          <Text color="gray.700" fontSize="md" fontFamily="body" mb={4}>
            Acesse sua conta
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType="send"
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showPassword ? 'visibility' : 'visibility-off'}
                        />
                      }
                      size={6}
                      mr={4}
                      color="gray.400"
                    />
                  </Pressable>
                }
              />
            )}
          />

          <Button
            text="Entrar"
            isLoading={isLoading}
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>
      </VStack>

      <VStack flex={1} bgColor="gray.100" p={10}>
        <Center>
          <Text color="gray.700" fontSize="sm" fontFamily="body" mb={4}>
            Ainda não tem acesso?
          </Text>

          <Button
            text="Criar uma conta"
            variant="secondary"
            onPress={handleSignUp}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
