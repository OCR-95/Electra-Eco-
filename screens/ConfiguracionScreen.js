// src/screens/ConfiguracionScreen.js
import React, { useContext } from 'react';
import { SafeAreaView, Text, Button, View, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { styles } from '../styles/globalStyles';
import { CommonActions } from '@react-navigation/native';

export default function ConfiguracionScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      
      // Redirigir a LoginScreen y resetear el stack de navegación
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir de tu cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          onPress: handleLogout,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>

      {user && (
        <>
          <Text>Nombre: {user.nombre}</Text>
          <Text>Correo: {user.correo}</Text>
          <Text>Usuario: {user.usuario}</Text>
          <Text>Tarifa: {user.tarifa}</Text>
          <Text>Teléfono: {user.telefono}</Text>
          <Text>Dirección: {user.direccion}</Text>
          <Text>Código Postal: {user.codigoPostal}</Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          title="Cerrar Sesión" 
          onPress={confirmLogout} 
          color="#A47148" 
        />
      </View>
    </SafeAreaView>
  );
}