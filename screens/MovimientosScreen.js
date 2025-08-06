// ✅ screens/MovimientosScreen.js
import React from 'react';
import { SafeAreaView, Text, View, ScrollView, TextInput, Button, Alert } from 'react-native';
import { styles } from '../styles/globalStyles';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


/* const movimientos = [
  { fecha: '2025-07-28', hora: '1', precio: '150', consumido: '0.09 kWh', total: '$' },
  { fecha: '2025-07-28', hora: '2', precio: '200', consumido: '0.10 kWh', total: '$' },
  { fecha: '2025-07-28', hora: '3', precio: '300', consumido: '0.15 kWh', total: '$' },
]; */

export default function MovimientosScreen() {

  const [movimientos, setmovimientos] = useState([])

  const { user, updateUser, actualizaDisponible} = useContext(AuthContext);

  const [hora, setHora] = useState(1);
  const [consumido, setConsumido] = useState(0);
  const [precio, setPrecio] = useState(0);

  const [precios, setPrecios] = useState([]);

  const [dec, setDec] = useState(0);


  useEffect(() => {
    if (hora === 1) {
      console.log("Inicio con la hora 1");
      handleBuscaPz();
    }
  }, [hora]);

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    console.log("Carga la tabla de base . . . ");
    try {
      const response = await fetch('http://192.168.1.22:8080/eco/index.php', {
      //const response = await fetch('http://192.168.100.3:8080/eco/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          obj: 'GetMovimientos',
          id_usuario: user.id_usuario,
        }),
      });
      const data = await response.json();
      console.log("Este es el resultado : ", data.movimientos);
      if (data.success) {
        setmovimientos(data.movimientos); // Regresa todos los valores para la tabla
      }
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
    }

  };


  const handleBuscaPz = async () => {
    console.log("Busca precio por hora . . . ", hora);
    //setLoading(true); Revisar la indicador de tabla ...
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const regionCode = user.region.replace(/\s+/g, '-');
      const url = `https://ws01.cenace.gob.mx:8082/SWPEND/SIM/SIN/MDA/${regionCode}/${year}/${month}/${day}/${year}/${month}/${day}/JSON`;
      const response = await fetch(url);
      const data = await response.json();
      const valores = data.Resultados[0].Valores;
      setPrecios(valores);

      const horaBuscada = parseFloat(hora);
      //const horaBuscadaN = parseFloat(hora + 1);
      const resultado = valores.find(item => item.hora == horaBuscada);
      //const resultadoN = valores.find(item => item.hora == horaBuscadaN);

      /* if (hora < 24) {
      setHora(resultadoN);
    } else {
      setHora(parseFloat(1));
    }
    setConsumido(parseFloat(0)); */

      console.log("Precio: ", resultado.pz);
      setPrecio(resultado.pz);

      //console.log("resultadoN: ", resultadoN.pz);


      /*       if (resultadoA) {
              console.log("Precio (pz) para la hora", horaBuscadaA, " : ", resultadoA.pz);
              setPrecio(resultadoB.pz);
              //handleSuguiente(resultadoA.pz);
            } else {
              console.log("No se encontró la hora", horaBuscada);
            }
              */
    } catch (error) {
      console.error('Error:', error);
    } finally {
      //setLoading(false); Revisar la indicador de tabla ...
    }


  }

  const handleSuguiente = async () => {


    //  const horaActual = valores.find(item => item.hora == (hora + 1));
    console.log("El precio a guardar es: . . . ", parseFloat(precio));
    console.log("La hora que se va guardar es: . . . ", hora);

    //setLoading(true); Revisar si se cuenta con el spiner
    try {

      const response = await fetch('http://192.168.1.22:8080/eco/index.php', {
      //const response = await fetch('http://192.168.100.3:8080/eco/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          obj: 'Movimiento',
          id_usuario: user.id_usuario,

          //Se mandan los parametros importantes en este caso los campos de la tabla 
          //- fecha, hora, precio, consumido, total, descontar el disponible decrementadondo lo consumido
          //- ésta funcion es ficticia, solo es para simular la lectura he insercion a la base de datos
          //por parte del dispositiv, después hay que modificar esta parte ó posiblemente desaparece 

          hora: hora,
          precio: parseFloat(precio), // para este punto ya debiste haber buscado el precio
          consumido: parseFloat(consumido),
          total: parseFloat(consumido) * parseFloat(precio)
        }),
      });


      const data = await response.json();
      console.log("=> ", data.message);


      if (data.success) {


        console.log("data.success");
        Alert.alert('El registro por hora se guardo correctamente');


        // aumentar la hora


        /* if (hora < 24) {
          setHora(hora + 1);
        } else {
          setHora(parseFloat(1));
        } */
        let nuevaHora = hora < 24 ? hora + 1 : 1;
        setHora(nuevaHora);

        setConsumido(parseFloat(0));


        // actualizar precio filtrando los valores con la nueva hora

        const horaBuscada = parseFloat(hora);
        console.log("La hora a buscar es: ", nuevaHora);

        const resultado = precios.find(item => item.hora == nuevaHora);


        console.log("Nuevo Precio: ", resultado.pz);
        setPrecio(resultado.pz);
        await fetchMovimientos();


      } else {
        Alert.alert('Error', data.message || 'Error al procesar la compra');
      }

    } catch (error) {
      console.log("error");

      Alert.alert('Error', 'No se pudo conectar al servidor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }

    /* 
          
        */



  }


  const handleConsumo = async () => {
    console.log("consumo hora ...");
    setConsumido((parseFloat(consumido) + 0.05).toFixed(2));

    const dec = (parseFloat(user.dispo) - (parseFloat(consumido) + 0.05).toFixed(2));
    console.log("Cuando aumente la hora hace el registro", dec);
    setDec(dec);
    actualizaDisponible(dec);
    console.log(" Ya -  . - ");
    

    //***await actualizaDisponible(dec); Revisar que tan viable actualizar este valor en tiempo real cada 5 minutos

    //***hacer una solicitud cada 1 minutos o 2 de el ultimo registro...  no esta implementado solo cuando hay sesión****
    //Se debe actualizar el user.dispo ... restando el consumo ... esta por discutirse de preferencia noooooooooo****

    //actualizar el valor del la fecha
    //deacuerdo a el contador hora, buscar el precio

    //si queda tiempo  *** Generar un codigo para que genere en automatico la hora del sistema o de base de datos
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Movimientos</Text>











      <View style={{ alignItems: 'flex-start', width: '80%', marginBottom: 20 }}>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Fecha: <Text style={{ fontWeight: 'bold' }}>'2025-07-28'</Text>
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
          <Text style={{ color: '#5E3A1C', fontSize: 16, width: 160 }}>
            Hora: <Text style={{ fontWeight: 'bold' }}>{parseFloat(hora)}</Text>
          </Text>
          {/* {loading ? (
            <ActivityIndicator
              size="large"
              color="#A47148"
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Button
              title="Siguien hora +"
              onPress={handleCompra}
              color="#A47148"
            />
          )} */}

          <Button
            title="Siguien hora +"
            onPress={handleSuguiente}
            color="#A47148"
          />
        </View>
        <Text style={{ color: '#5E3A1C', fontSize: 16 }}>
          Precio(hora): <Text style={{ fontWeight: 'bold' }}>{precio}</Text>
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
          <Text style={{ color: '#5E3A1C', fontSize: 16, width: 230 }}>
            KWH consumido(hora): <Text style={{ fontWeight: 'bold' }}>{parseFloat(consumido)}</Text>
          </Text>
          {/* {loading ? (
            <ActivityIndicator
              size="large"
              color="#A47148"
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Button
              title="Siguien hora +"
              onPress={handleCompra}
              color="#A47148"
            />
          )} */}

          <Button
            title=" INC +"
            onPress={handleConsumo}
            color="#A47148"
          />
        </View>
        <Text style={{ color: '#5E3A1C', fontSize: 16, marginTop: 2 }}>
          * KWH Disponible: <Text style={{ fontWeight: 'bold' }}>{user.dispo}kWh</Text>
        </Text>
        <Text style={{ color: '#5E3A1C', fontSize: 16, marginTop: 2 }}>
          * KWH dec: <Text style={{ fontWeight: 'bold' }}>{dec}kWh</Text>
        </Text>

      </View>














      <View style={{ width: '90%', marginTop: 10 }}>
        <View style={{ width: '90%', marginTop: 10, borderWidth: 1, borderColor: '#ccc' }}>
          {/* Scroll horizontal */}
          <ScrollView horizontal>
            <View style={{ minWidth: 600 }}>
              {/* Encabezado de la tabla */}
              <View style={{ flexDirection: 'row', backgroundColor: '#E8D3B9', padding: 10 }}>
                <Text style={{ width: 200, fontWeight: 'bold', color: '#5E3A1C' }}>Fecha</Text>
                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Hora</Text>
                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Precio</Text>
                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Consumido</Text>
                <Text style={{ width: 100, fontWeight: 'bold', color: '#5E3A1C' }}>Total</Text>
              </View>
              {/* Scroll vertical */}
              <ScrollView style={{ maxHeight: 250 }}>
                {movimientos.map((mov, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#D2B48C' }}>
                    <Text style={{ width: 200, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                      {mov.fecha_registro}
                    </Text>
                    <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                      {mov.hora}

                    </Text>
                    <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                      {mov.precio}
                    </Text>
                    <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                      {mov.consumo}
                    </Text>
                    <Text style={{ width: 100, color: '#5E3A1C' }} numberOfLines={1} ellipsizeMode="tail">
                      {mov.total}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>


      </View>


    </ScrollView>
  );
}
