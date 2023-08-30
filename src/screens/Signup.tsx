import UserDefaultImg from '@assets/Avatar.png';
import { Avatar } from '@components/Avatar';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { SignInHeader } from '@components/SignInHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { AppError } from '@utils/AppError';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Center,
  Icon,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

type FormDataProps = {
  name: string;
  email: string;
  tel: string;
  password: string;
  confirm_password: string;
};

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  tel: yup
    .string()
    .required('Informe o telefone')
    .matches(/^\+?55\s?\d{2}\s?\d{8,9}$/, 'Telefone inválido'),
  password: yup.string().required('Informe a senha'),
  confirm_password: yup
    .string()
    .required('Informe a senha')
    .oneOf([yup.ref('password'), ''], 'As senhas devem ser iguais'),
});

const PHOTO_SIZE = 24;

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userPhotoSelected, setUserPhotoSelected] = useState({} as any);

  const toast = useToast();
  const { signUp } = useAuth();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const handleSignIn = () => {
    navigation.navigate('signIn');
  };

  const handleSignUp = async (data: FormDataProps) => {
    try {
      setIsLoading(true);

      const fileExtension = userPhotoSelected.uri.split('.').pop();

      const photoFile = {
        name: `${uuidv4()}.${fileExtension}`.toLowerCase(),
        uri: userPhotoSelected.uri,
        type: `${userPhotoSelected.type}/${fileExtension}`,
      } as any;

      const userFormData = new FormData();
      userFormData.append('avatar', photoFile);
      userFormData.append('name', data.name);
      userFormData.append('email', data.email);
      userFormData.append('tel', data.tel);
      userFormData.append('password', data.password);

      await signUp(userFormData);

      toast.show({
        title: 'Usuário criado com sucesso!',
        placement: 'top',
        bgColor: 'green.300',
      });

      handleSignIn();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;

      toast.show({
        title: isAppError
          ? error.message
          : 'Erro ao criar conta. Tente novamente mais tarde.',
        placement: 'top',
        bgColor: 'red.300',
      });
    }
  };

  const handleUserPhotoSelect = async () => {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        );

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.300',
          });
        }

        setUserPhotoSelected(photoSelected.assets[0]);
      }
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Erro ao selecionar a foto. Tente novamente mais tarde.',
        placement: 'top',
        bgColor: 'red.300',
      });
    } finally {
      setPhotoIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack pt={10} px={10}>
        <SignInHeader
          title="Boas vindas!"
          text="Crie sua conta e use o espaço para comprar itens variados e vender seus produtos"
          size="small"
        />

        <Center mt={4} mb={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.300"
              endColor="gray.400"
              mb={4}
            />
          ) : (
            <Avatar
              size={PHOTO_SIZE}
              mb={4}
              source={
                userPhotoSelected.uri
                  ? { uri: userPhotoSelected.uri }
                  : UserDefaultImg
              }
              alt="Imagem de perfil do usuário"
              hasEditButton
              onPress={handleUserPhotoSelect}
            />
          )}

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

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
            name="tel"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.tel?.message}
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

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry={!showConfirmPassword}
                value={value}
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                InputRightElement={
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      as={
                        <MaterialIcons
                          name={
                            showConfirmPassword
                              ? 'visibility'
                              : 'visibility-off'
                          }
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
            text="Criar"
            isLoading={isLoading}
            onPress={handleSubmit(handleSignUp)}
            bgColor="gray.700"
          />
        </Center>
      </VStack>

      <VStack flex={1} bgColor="gray.100" px={10} pt={6} pb={8}>
        <Center>
          <Text color="gray.700" fontSize="sm" fontFamily="body" mb={4}>
            Já tem uma conta?
          </Text>

          <Button
            text="Ir para o login"
            variant="secondary"
            onPress={handleSignIn}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
