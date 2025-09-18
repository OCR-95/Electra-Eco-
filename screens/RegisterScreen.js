import React, { useState, useContext } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    Button,
    Alert,
    ScrollView,
    View,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { styles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';
import regionesData from '../assets/regiones.json';
import { CommonActions } from '@react-navigation/native';
import { API_URL } from "../config/constants"; // ajusta la ruta según tu estructura

const tarifasDisponibles = ['DAC', '1', '1A', '1B', '1C', '1D', '1E', '1F', '2', '2A', '3'];

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function encontrarRegionMasCercana(latitud, longitud, regiones) {
    let regionMasCercana = null;
    let distanciaMinima = Infinity;

    regiones.forEach(region => {
        const latRegion = region.latitude || region.latitud;
        const lonRegion = region.longitude || region.longitud;
        const distancia = calcularDistancia(latitud, longitud, latRegion, lonRegion);

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            regionMasCercana = region;
        }
    });

    return { region: regionMasCercana, distancia: distanciaMinima };
}

export default function RegisterScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [tarifa, setTarifa] = useState('1');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!nombre.trim() || !apellidoP.trim() || !apellidoM.trim() || !usuario.trim() ||
            !password.trim() || !correo.trim() || !telefono.trim() || !direccion.trim() ||
            !codigoPostal.trim()) {
            Alert.alert('Validación', 'Todos los campos son obligatorios');
            return;
        }

        setLoading(true);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            const { latitude, longitude } = location.coords;

            const { region } = encontrarRegionMasCercana(latitude, longitude, regionesData);

            const datos = {
                nombre,
                apellidoP,
                apellidoM,
                usuario,
                password,
                correo,
                telefono,
                direccion,
                codigoPostal,
                tarifa,
                latitud: latitude,
                longitud: longitude,
                region: region.region,
                code: region.code || region.codigo,
                name: region.name || region.nombre,
                obj: 'register',
            };

            const response = await fetch(`${API_URL}/eco/index.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });

            const data = await response.json();

            if (data.mensaje === 'Registro exitoso') {
                const usuarioCompleto = {
                    ...data.usuario,
                    coords: { latitude, longitude },
                    region: region.region,
                    code: region.code || region.codigo,
                    name: region.name || region.nombre
                };

                await login(usuarioCompleto);

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                );

                Alert.alert('Éxito', 'Registro completado. Por favor inicia sesión');
            } else {
                Alert.alert('Error', data.mensaje || 'Error en el registro');
            }

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Ocurrió un error durante el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* 🔙 Flecha para regresar a Login */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{ alignSelf: 'flex-start', marginBottom: 10 }}
                >
                    <Text style={{ fontSize: 18, color: '#A47148' }}>← Regresar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Registro</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido Paterno"
                    value={apellidoP}
                    onChangeText={setApellidoP}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido Materno"
                    value={apellidoM}
                    onChangeText={setApellidoM}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    value={usuario}
                    onChangeText={setUsuario}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    keyboardType="email-address"
                    value={correo}
                    onChangeText={setCorreo}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    keyboardType="phone-pad"
                    value={telefono}
                    onChangeText={setTelefono}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dirección"
                    value={direccion}
                    onChangeText={setDireccion}
                    placeholderTextColor="#8B5E3C"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Código Postal"
                    keyboardType="numeric"
                    value={codigoPostal}
                    onChangeText={setCodigoPostal}
                    placeholderTextColor="#8B5E3C"
                />

                <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Tarifa Eléctrica</Text>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#D2B48C',
                        borderRadius: 8,
                        width: '100%',
                        marginTop: 8,
                        backgroundColor: '#FFF8F0',
                        overflow: 'hidden'
                    }}
                >
                    <Picker
                        selectedValue={tarifa}
                        onValueChange={setTarifa}
                        style={{ color: '#5E3A1C' }}
                        dropdownIconColor="#5E3A1C"
                        mode="dropdown"
                    >
                        {tarifasDisponibles.map((item) => (
                            <Picker.Item
                                key={item}
                                label={`Tarifa ${item}`}
                                value={item}
                            />
                        ))}
                    </Picker>
                </View>

                <View style={styles.buttonContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#A47148" />
                    ) : (
                        <Button
                            title="Registrar"
                            onPress={handleRegister}
                            color="#A47148"
                        />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
