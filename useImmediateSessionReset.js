import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useImmediateSessionReset = (onLogout) => {
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        // Limpiar todo inmediatamente
        try {
          // 1. Borrar todo el almacenamiento
          //await AsyncStorage.clear();
          await AsyncStorage.removeItem('user');
          
          // 2. Cerrar sesión en el contexto/estado global
          onLogout && onLogout();
          
          // 3. Opcional: Forzar recarga de la app
          // Si usas NavigationContainer, puedes redirigir al login aquí
          console.log('Sesión cerrada - Aplicación en segundo plano');


        } catch (error) {
          console.error('Error al limpiar sesión:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [onLogout]);
};

export default useImmediateSessionReset;