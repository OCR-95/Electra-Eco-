import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import RootStack from './navigation/RootStack';

import useImmediateSessionReset from './useImmediateSessionReset';


export default function App() {
  const handleForceLogout = () => {
    // Aquí tu lógica para:
    // 1. Resetear el estado de autenticación
    // 2. Redirigir a pantalla de login
    console.log('Sesión finalizada por ir a segundo plano');
  };

  // Usar el hook
  useImmediateSessionReset(handleForceLogout);


  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}