import React, { useState, useContext } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { styles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';
import { CommonActions } from '@react-navigation/native';
import { API_URL } from "../config/constants"; // ajusta la ruta según tu estructura


export default function LoginScreen({ navigation }) {
    const [usu, setUsu] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!usu.trim() || !password.trim()) {
            Alert.alert('Validación', 'Usuario y contraseña son obligatorios');
            return;
        }

        setLoading(true);

        try {
            //const response = await fetch('http://192.168.100.3:8080/eco/index.php', {
            //const response = await fetch('http://192.168.100.3:8080/eco/index.php', {
            const response = await fetch(`${API_URL}/eco/index.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usu: usu,
                    password: password,
                    obj: 'login',
                }),
            });

            const data = await response.json();


            if (data.status === 'success') {
                const success = await login(data.user);
                if (success) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        })
                    );
                }
            } else {
                Alert.alert('Error', data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            Alert.alert('Error', 'No se pudo conectar al servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            {/* <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={usu}
                onChangeText={setusu}
                placeholderTextColor="#8B5E3C"
                autoCapitalize="none"
                keyboardType="usu-address"
            /> */}

            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={usu}
                onChangeText={setUsu}
                placeholderTextColor="#8B5E3C"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#8B5E3C"
            />

            <View style={styles.buttonContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#A47148" />
                ) : (
                    <Button title="Ingresar" onPress={handleLogin} color="#A47148" />
                )}
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={{ marginTop: 15 }}
            >
                <Text style={{ color: '#5E3A1C', textDecorationLine: 'underline' }}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}