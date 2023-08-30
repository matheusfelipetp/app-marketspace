import { MaterialIcons } from '@expo/vector-icons';
import { HStack, IImageProps, Icon, Image, Pressable } from 'native-base';

type PropsAvatar = IImageProps & {
  size: number;
  hasEditButton?: boolean;
  onPress?: () => void;
};

export function Avatar({
  size,
  hasEditButton = false,
  onPress,
  ...rest
}: PropsAvatar) {
  return (
    <HStack position="relative">
      <Image
        w={size}
        h={size}
        rounded="full"
        borderWidth={2}
        borderColor="blue.300"
        {...rest}
      />

      {hasEditButton && (
        <Pressable
          bgColor="blue.300"
          color="gray.100"
          rounded="full"
          position="absolute"
          bottom={4}
          right={-4}
          p={2}
          _pressed={{
            bgColor: 'blue.700',
          }}
          onPress={onPress}
        >
          <Icon size={6} color="gray.100" as={<MaterialIcons name="edit" />} />
        </Pressable>
      )}
    </HStack>
  );
}
