// Dirección IP local (solo para pruebas en LAN con la misma red)
export const LOCAL_HOST = "http://192.168.1.100:3000/api"; // Asegúrate de que sea accesible

// Dirección del servidor remoto
export const REMOTE_HOST = "https://mi-servidor.com/api";

// Bandera para elegir el entorno activo (puedes cambiarla fácilmente)
export const API_BASE_URL = REMOTE_HOST; // o LOCAL_HOST

// Otras constantes útiles
export const TIMEOUT = 10000; // milisegundos para fetch/axios
