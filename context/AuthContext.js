import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocation = async (highAccuracy = true) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu ubicación para mejorar tu experiencia');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error en geolocalización:', error);
      return null;
    }
  };

  const login = async (userData) => {
    try {
      // Normalizar los datos del usuario
      const normalizedUser = {
        // Campos básicos de autenticación
        id_usuario: userData.id_usuario || null,
        usuario: userData.usuario || null,
        password: userData.password || null,

        // Datos personales
        nombre: userData.nombre || null,
        apellidoP: userData.apellidoP || userData.apellido_paterno || null,
        apellidoM: userData.apellidoM || userData.apellido_materno || null,

        // Información de contacto
        correo: userData.correo || null,
        telefono: userData.telefono || null,
        direccion: userData.direccion || null,
        codigoPostal: userData.codigoPostal || userData.codigo_postal || null,

        // Datos de ubicación y zona eléctrica
        region: userData.region || null,
        code: userData.code || userData.codigo || null,
        name: userData.name || userData.nombre || null,
        coords: userData.coords || null,

        // Configuración de tarifa
        tarifa: userData.tarifa || '1',

        // Campos adicionales que puedas necesitar
        fechaRegistro: userData.fechaRegistro || null,
        estatus: userData.estatus || 'activo',
        rol: userData.rol || 'usuario'
      };


      setUser(normalizedUser);
      await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
      return true;
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  const checkLogin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.usuario) {
          await login(parsedUser); // Usamos login para normalizar los datos
        } else {
          await AsyncStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error al cargar sesión:', error);
    } finally {
      setLoading(false);
    }
  };
































  const actualizaDisponible = async (cantidad) => {
    setUser(prevUser => ({
      ...prevUser,
      dispo: cantidad
      //dispo: nuevoDispo.toString() // Asegura que sea string si es necesario
    }));
  };

























  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        getLocation,
        updateUser: async (updatedData) => {
          const updatedUser = {
            ...user,
            ...updatedData,
            nombre: updatedData.nombre || user.nombre,
            apellidoP: updatedData.apellidoP || user.apellidoP,
            apellidoM: updatedData.apellidoM || user.apellidoM,
            usuario: updatedData.usuario || user.usuario,
            correo: updatedData.correo || user.correo,
            telefono: updatedData.telefono || user.telefono,
            direccion: updatedData.direccion || user.direccion,
            codigoPostal: updatedData.codigoPostal || user.codigoPostal,
            tarifa: updatedData.tarifa || user.tarifa,
            region: updatedData.region || user.region,
            code: updatedData.code || user.code,
            name: updatedData.name || user.name,
            coords: updatedData.coords || user.coords,
            dispo: updatedData.dispo
          };
          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        },
        actualizaDisponible
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};