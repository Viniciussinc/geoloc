import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UsersContext } from "../UsersContext";
import { geocodeAddress } from "../utils/geocode";

export default function Main() {
  const navigation = useNavigation();
  const { users, addUser } = useContext(UsersContext);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");

  const handleRegister = async () => {
    if (!name || !street || !number || !city || !stateField) {
      Alert.alert("Campos incompletos", "Preencha todos os campos do endereço.");
      return;
    }

    const address = `${street}, ${number}, ${city}, ${stateField}`;
    const coords = await geocodeAddress(address);
    if (!coords) {
      Alert.alert(
        "Erro ao localizar endereço",
        "Não foi possível converter o endereço em coordenadas. Verifique e tente novamente."
      );
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      address,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    addUser(newUser);
    Alert.alert("Sucesso", "Usuário cadastrado e marcado no mapa.");
    // limpar campos
    setName("");
    setStreet("");
    setNumber("");
    setCity("");
    setStateField("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro com Geolocalização</Text>

      <TextInput
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Rua"
        value={street}
        onChangeText={setStreet}
        style={styles.input}
      />
      <TextInput
        placeholder="Número"
        value={number}
        onChangeText={setNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Cidade"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TextInput
        placeholder="Estado"
        value={stateField}
        onChangeText={setStateField}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Salvar Cadastro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => navigation.navigate("Maps")}
      >
        <Text style={styles.buttonText}>Ir para o Mapa</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Usuários cadastrados</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userAddress}>{item.address}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum usuário cadastrado.</Text>}
        style={{ width: "90%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    backgroundColor: "#3498db",
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 8,
  },
  secondary: {
    backgroundColor: "#7f8c8d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  userName: { fontWeight: "bold" },
  userAddress: { color: "#333" },
});
