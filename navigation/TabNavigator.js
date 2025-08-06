import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import CompraScreen from '../screens/CompraScreen';
import ConsumoScreen from '../screens/ConsumoScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Costos') iconName = focused ? 'card' : 'card-outline';
          else if (route.name === 'Compra') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Consumo') iconName = focused ? 'pulse' : 'pulse-outline';
          else if (route.name === 'Configuracion') iconName = focused ? 'settings' : 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A47148',
        tabBarInactiveTintColor: '#5E3A1C',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Movimientos" component={MovimientosScreen} />
      <Tab.Screen name="Compra" component={CompraScreen} />
      <Tab.Screen name="Costos" component={ConsumoScreen} />
      <Tab.Screen name="Configuracion" component={ConfiguracionScreen} />
    </Tab.Navigator>
  );
}
