import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DetailsScreen from "./screens/DetailsScreen";
import QRScreen from "./screens/QRScreen";

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
      <Tab.Navigator screenOptions={{
        headerShown: false
      }}>
      <Tab.Screen name="Details" component={DetailsScreen} />
      <Tab.Screen name="QR Scan" component={QRScreen} />
      </Tab.Navigator>
  );
}
