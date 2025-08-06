import React, { useContext, useState, useEffect } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    Button,
    ScrollView,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import { styles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

const tarifasDisponibles = ['DAC', '1', '1A', '1B', '1C', '1D', '1E', '1F', '2', '2A', '3'];

export default function HomeScreen() {
    const { user, updateUser } = useContext(AuthContext);

    const [form, setForm] = useState({
        nombre: user?.nombre || '',
        apellidoP: user?.apellidoP || user?.apellido_paterno || '',
        apellidoM: user?.apellidoM || user?.apellido_materno || '',
        usuario: user?.usuario || '',
        password: user?.password || '',
        correo: user?.correo || '',
        telefono: user?.telefono || '',
        direccion: user?.direccion || '',
        codigoPostal: user?.codigoPostal || user?.codigo_postal || '',
    });
    const [tarifa, setTarifa] = useState(user?.tarifa || '1');
    const [loading, setLoading] = useState(false);

    // Efecto para actualizar el form cuando cambia el usuario
    useEffect(() => {
        if (user) {
            setForm({
                nombre: user.nombre || '',
                apellidoP: user.apellidoP || user.apellido_paterno || '',
                apellidoM: user.apellidoM || user.apellido_materno || '',
                usuario: user.usuario || '',
                password: user.password || '',
                correo: user.correo || '',
                telefono: user.telefono || '',
                direccion: user.direccion || '',
                codigoPostal: user.codigoPostal || user.codigo_postal || '',
            });
            setTarifa(user.tarifa || '1');

        }
    }, [user]);

    useEffect(() => {
        cargaValores();
    }, []);
    const cargaValores = async () => {
        kwhDiponibles();
    };

    const kwhDiponibles = async () => {
        try {
            const response = await fetch('http://192.168.100.3:8080/eco/index.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    obj: 'GetCompras',
                    id_usuario: user.id_usuario,
                }),
            });
            const data = await response.json();
            if (data.success) {
                if (data.compras.length > 0) {
                    await updateUser({
                        ...form,
                        tarifa,
                        region: user.region,  // Mantener región
                        code: user.code,       // Mantener código
                        dispo: data.compras[0].kwh_disponible //se guarda el valor de disponible de la tabla compras
                    });

                }
            }
        } catch (error) {
            console.error('Error al obtener compras:', error);
        }
    }
    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        setLoading(true);

        try {
            //const response = await fetch('http://192.168.100.3:8080/eco/index.php', {
            const response = await fetch('http://192.168.1.22:8080/eco/index.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: user.id_usuario,
                    ...form,
                    tarifa,
                    region: user.region,  // Incluir región en la actualización
                    code: user.code,     // Incluir código en la actualización
                    obj: 'update'
                }),
            });

            const data = await response.json();

            if (data.mensaje === 'Actualización exitosa') {
                await updateUser({
                    ...form,
                    tarifa,
                    region: user.region,  // Mantener región
                    code: user.code       // Mantener código
                });
                Alert.alert('Éxito', 'Perfil actualizado correctamente');
            } else {
                Alert.alert('Error', data.mensaje || 'Error al actualizar');
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Bienvenido, {form.nombre || 'Usuario'}!</Text>

            {/* Mostrar información de región y código */}
            <View style={{
                backgroundColor: '#FFF8F0',
                padding: 15,
                borderRadius: 8,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#D2B48C'
            }}>
                <Text style={{ fontWeight: 'bold', color: '#5E3A1C', fontSize: 16 }}>
                    Información de Zona:
                </Text>
                <Text style={{ color: '#5E3A1C' }}>
                    Región: <Text style={{ fontWeight: 'bold' }}>{user?.region || 'No especificada'}</Text>
                </Text>
                <Text style={{ color: '#5E3A1C' }}>
                    Código: <Text style={{ fontWeight: 'bold' }}>{user?.code || 'N/A'}</Text>
                </Text>
                <Text style={{ color: '#5E3A1C' }}>
                    Nombre: <Text style={{ fontWeight: 'bold' }}>{user?.name || 'N/A'}</Text>
                </Text>
                {user?.coords && (
                    <Text style={{ color: '#5E3A1C' }}>
                        Ubicación: <Text style={{ fontWeight: 'bold' }}>
                            {user.coords.latitude.toFixed(4)}, {user.coords.longitude.toFixed(4)}
                        </Text>
                    </Text>
                )}
            </View>

            {/* Resto del formulario... */}
            {Object.entries(form).map(([key, value]) => (
                <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    value={value}
                    onChangeText={text => handleChange(key, text)}
                    secureTextEntry={key === 'password'}
                    keyboardType={
                        key === 'telefono' ? 'phone-pad' :
                            key === 'correo' ? 'email-address' :
                                key === 'codigoPostal' ? 'numeric' : 'default'
                    }
                />
            ))}

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
                }}>
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
                        title="Actualizar"
                        onPress={handleUpdate}
                        color="#A47148"
                        disabled={loading}
                    />
                )}
            </View>
        </ScrollView>
    );
}