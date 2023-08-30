import HomeSvg from '@assets/Home.svg';
import LogoutSvg from '@assets/Logout.svg';
import ProductsSvg from '@assets/Products.svg';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Home } from '@screens/Home';
import { Logout } from '@screens/Logout';
import { Products } from '@screens/Products';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

type AppRoutes = {
  home: undefined;
  products: undefined;
  logout: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();
  const iconSize = sizes[8];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.blue[500],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.gray[100],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="products"
        component={Products}
        options={{
          tabBarIcon: ({ color }) => (
            <ProductsSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="logout"
        component={Logout}
        options={{
          tabBarIcon: () => <LogoutSvg width={iconSize} height={iconSize} />,
        }}
      />
    </Navigator>
  );
}
