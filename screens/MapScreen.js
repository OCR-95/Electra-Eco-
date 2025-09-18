// MapScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import regiones from '../assets/regiones.json';

const userIcon = require('../assets/home.png');     // Icono casa
const factoryIcon = require('../assets/factory.png'); // Icono fábrica

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso denegado: No se puede acceder a tu ubicación.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }
    })();
  }, []);

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#A47148" />
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider="google"
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      }}
      showsUserLocation={false}
    >
      {/* Mi ubicación - Casa */}
      <Marker coordinate={location} image={userIcon} anchor={{ x: 0.5, y: 0.5 }}>
        <Callout>
          <Text>Mi ubicación</Text>
        </Callout>
      </Marker>

      {regiones.map((region, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: parseFloat(region.latitude),
            longitude: parseFloat(region.longitude),
          }}
          image={factoryIcon}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Callout>
            <View>
              <Text style={{ fontWeight: 'bold' }}>{region.name}</Text>
              <Text>Código: {region.code}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
