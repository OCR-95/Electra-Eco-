import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CompraScreen from '../screens/CompraScreen';
import ConsumoScreen from '../screens/ConsumoScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Inicio':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Compra':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Costos':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Movimientos':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Configuración':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A47148',
        tabBarInactiveTintColor: '#5E3A1C',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Compra" component={CompraScreen} />
      <Tab.Screen name="Costos" component={ConsumoScreen} />
      <Tab.Screen name="Movimientos" component={MovimientosScreen} />
      <Tab.Screen name="Configuración" component={ConfiguracionScreen} />
    </Tab.Navigator>
  );
}
