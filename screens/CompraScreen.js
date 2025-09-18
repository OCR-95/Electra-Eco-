import React, { useState, useEffect, useContext, use } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator,
    View,
    StyleSheet,
    FlatList
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { styles } from '../styles/globalStyles';
import { API_URL } from "../config/constants"; // ajusta la ruta según tu estructura


export default function CompraScreen() { 

    const { user, actualizaDisponible } = useContext(AuthContext);

    const [kwh, setKwh] = useState('');
    const [loading, setLoading] = useState(false);
    const [compras, setCompras] = useState([]);
    const [kwhActual, setKwhActual] = useState(0);

    useEffect(() => {

        console.log("----------------");
        console.log(user.dispo);
        console.log("----------------");

        fetchCompras();
    }, []);

    const fetchCompras = async () => {
        try {
            //const response = await fetch('http://192.168.1.22:8080/eco/index.php', {
            //const response = await fetch('http://192.168.100.3:8080/eco/index.php', { // Por dos . . . .
            const response = await fetch(`${API_URL}/eco/index.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    obj: 'GetCompras',
                    id_usuario: user.id_usuario,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setCompras(data.compras);
                if (data.compras.length > 0) {
                    setKwhActual(data.compras[0].kwh_disponible); // El más reciente primero kwh_disponible


                    console.log("-----------------------");
                    console.log(" es el precio: ", data.compras[0].kwh_disponible);
                    await actualizaDisponible(data.compras[0].kwh_disponible);
                    console.log("-----------------------");
                    //setTimeout(() => {
                        console.log('Valor actualizado:', user.dispo);
                    //}, 5);
                    console.log("-----------------------");


                    /*  const success = await incrementaKwh(user);
                     if (success) {
                         console.log(" todo bien ... ");
                     }
  */


                }
            }
        } catch (error) {
            console.error('Error al obtener compras:', error);
        }
    };

    const handleCompra = async () => {
        if (!kwh || isNaN(kwh)) {
            Alert.alert('Validación', 'Ingresa un valor válido en kWh');
            return;
        }
        setLoading(true);
        try {
            //const response = await fetch('http://192.168.1.22:8080/eco/index.php', {
                const response = await fetch(`${API_URL}/eco/index.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    obj: 'Compra',
                    id_usuario: user.id_usuario,
                    kwh: parseFloat(kwh),
                    kwh_anterior: parseFloat(kwhActual),
                    kwh_actual: parseFloat(kwhActual) + parseFloat(kwh)
                }),
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert('Compra exitosa', `Has comprado ${kwh} kWh`);
                setKwh('');
                await fetchCompras();
            } else {
                Alert.alert('Error', data.message || 'Error al procesar la compra');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar al servidor');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={localStyles.row}>
            <Text style={localStyles.cell}>{item.kwh_compra} kWh</Text>
            <Text style={localStyles.cell}>{item.kwh_anterior} kWh</Text>
            <Text style={localStyles.cell}>{item.kwh_compra} kWh</Text>
            <Text style={localStyles.cell}>{item.kwh_actual} kWh</Text>
            <Text style={localStyles.cell}>{new Date(item.fecha).toLocaleString()}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#5E3A1C', marginBottom: 2 }}>Compra de Energía</Text>
                <TextInput
                    style={[styles.input, { textAlign: 'center', alignSelf: 'center' }]}
                    placeholder="Cantidad de kWh a comprar"
                    value={kwh}
                    onChangeText={setKwh}
                    keyboardType="numeric"
                    placeholderTextColor="#8B5E3C"
                />

                <View style={styles.buttonContainer}>
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color="#A47148"
                            style={{ marginVertical: 10 }}
                        />
                    ) : (
                        <Button
                            title="Comprar"
                            onPress={handleCompra}
                            color="#A47148"
                        />
                    )}
                </View>

                <Text style={localStyles.subtitle}>Disponible: {user.dispo} kWh</Text>
                <Text style={localStyles.subtitle}>Historial de Compras</Text>

                <View style={{ width: '90%', marginTop: 10, borderWidth: 1, borderColor: '#ccc' }}>
                    {/* Scroll horizontal */}
                    <ScrollView horizontal>
                        <View style={{ minWidth: 500 }}>
                            {/* Encabezado de la tabla */}
                            <View style={{ flexDirection: 'row', backgroundColor: '#E8D3B9', padding: 10 }}>
                                <Text style={{ width: 150, fontWeight: 'bold', color: '#5E3A1C' }}>Fecha</Text>
                                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Compra</Text>
                                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Anterior</Text>
                                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Disponible</Text>
                            </View>

                            {/* Scroll vertical */}
                            <ScrollView style={{ maxHeight: 250 }}>
                                {compras.map((mov, idx) => (
                                    <View key={idx} style={{ flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#D2B48C' }}>
                                        <Text
                                            style={{ width: 150, color: '#5E3A1C' }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {mov.fecha_registro}
                                        </Text>
                                        <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                                            {mov.kwh_compra}
                                        </Text>
                                        <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                                            {mov.kwh_anterior}
                                        </Text>
                                        <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                                            {mov.kwh_disponible}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
        color: '#8B5E3C',
        textAlign: 'center'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#A47148',
        paddingVertical: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    headerCell: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#FFF9F0'
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#8B5E3C'
    },
    table: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#A47148',
        borderRadius: 5
    }
});