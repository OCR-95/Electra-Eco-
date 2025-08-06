import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Button,
  Alert,
  ScrollView
} from 'react-native';
import { styles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';

export default function ConsumoScreen() {
  const { user } = useContext(AuthContext);
  const [costos, setCostos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchCenaceData();
  }, [])

  const fetchCenaceData = async () => {
    if (!user?.region) {
      Alert.alert('Información requerida', 'No se ha especificado la región eléctrica');
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      // Formatear fecha actual para la URL
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const regionCode = user.region.replace(/\s+/g, '-');
      const url = `https://ws01.cenace.gob.mx:8082/SWPEND/SIM/SIN/MDA/${regionCode}/${year}/${month}/${day}/${year}/${month}/${day}/JSON`;
      console.log("Se genera la url para buscar los precios por hora: ");
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.status}`);
      }
      const data = await response.json();
      //console.log('Zona de carga:', data.Resultados[0].zona_carga);
      //console.log('Datos CENACE - Valores:', JSON.stringify(data.Resultados[0].Valores, null, 2));
      setCostos(data.Resultados[0].Valores);
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
    
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#A47148" />
        <Text style={{ marginTop: 10 }}>Cargando datos del usuario...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Costos por día</Text>
      <View style={{ alignItems: 'flex-start', width: '80%', marginBottom: 20 }}>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Zona Eléctrica: <Text style={{ fontWeight: 'bold' }}>{user.region || 'No especificada'}</Text>
        </Text>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Nombre: <Text style={{ fontWeight: 'bold' }}>{user.name || user.nombre || 'N/A'}</Text>
        </Text>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Código: <Text style={{ fontWeight: 'bold' }}>{user.code || user.codigo || 'N/A'}</Text>
        </Text>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Tarifa: <Text style={{ fontWeight: 'bold' }}>{' 1 '}</Text>
        </Text>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Fecha: <Text style={{ fontWeight: 'bold' }}>{'28-07-2025'}</Text>
        </Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#A47148" style={{ marginTop: 10 }} />}
      <View style={{ width: '90%', marginTop: 5, borderWidth: 1, borderColor: '#ccc' }}>

        <ScrollView horizontal>
          <View style={{ minWidth: 300 }}>

            <View style={{ flexDirection: 'row', backgroundColor: '#E8D3B9', padding: 10 }}>
              <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Hora</Text>
              <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Marginal</Text>
              <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Energía</Text>
              <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Perdidas</Text>
              <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Congestión</Text>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {costos.map((mov, idx) => (
                <View key={idx} style={{ flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#D2B48C' }}>
                  <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                    {mov.hora}
                  </Text>
                  <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                    {mov.pz}
                  </Text>
                  <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                    {mov.pz_ene}
                  </Text>
                  <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                    {mov.pz_per}
                  </Text>
                  <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                    {mov.pz_cng}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      {apiError && (
        <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
          Error: {apiError}
        </Text>
      )}
    </SafeAreaView>
  );
}