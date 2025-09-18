// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CompraScreen from '../screens/CompraScreen';
import ConsumoScreen from '../screens/ConsumoScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import MapScreen from '../screens/MapScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#A47148',
        tabBarInactiveTintColor: '#5E3A1C',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Forzar nombres exactos sin tildes
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
            case 'Mapa':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Configuracion':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          // Siempre forzar tamaño explícito para evitar cache de render
          return <Ionicons name={iconName} size={size || 18} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Compra" component={CompraScreen} />
      <Tab.Screen name="Costos" component={ConsumoScreen} />
      <Tab.Screen name="Movimientos" component={MovimientosScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Configuracion" component={ConfiguracionScreen} />
    </Tab.Navigator>
  );
}
