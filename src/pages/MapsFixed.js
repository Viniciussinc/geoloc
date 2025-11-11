import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform, ScrollView } from "react-native";
import useLocation from "../hooks/useLocation";
import { UsersContext } from "../UsersContext";

export default function MapsFixed() {
  const { coords, errorMsg } = useLocation();
  const { users } = useContext(UsersContext);
  const [MapLib, setMapLib] = useState(null);

  useEffect(() => {
    let mounted = true;
    // Dynamically import react-native-maps only on native platforms
    if (Platform.OS !== "web") {
      import("react-native-maps")
        .then((mod) => {
          if (mounted) setMapLib({ MapView: mod.default, Marker: mod.Marker });
        })
        .catch((err) => {
          console.warn("Could not load react-native-maps:", err);
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Web fallback: don't attempt to import or render react-native-maps on web
  if (Platform.OS === "web") {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 8 }}>
          O mapa não é suportado nesta plataforma (web).
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 12 }}>Usuários cadastrados (lat, lng):</Text>
        {users && users.length > 0 ? (
          users.map((u) => (
            <View key={u.id} style={{ padding: 6 }}>
              <Text style={{ fontWeight: "bold" }}>{u.name}</Text>
              <Text>{u.address}</Text>
              <Text>
                ({u.latitude.toFixed(6)}, {u.longitude.toFixed(6)})
              </Text>
            </View>
          ))
        ) : (
          <Text>Nenhum usuário cadastrado.</Text>
        )}
      </ScrollView>
    );
  }

  // For native platforms, wait for dynamic import of react-native-maps
  if (!MapLib) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando mapa nativo...</Text>
      </View>
    );
  }

  const { MapView, Marker } = MapLib;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
    >
      <Marker
        coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
        title="Você está aqui"
        description="Sua localização atual"
      />
      {/* Markers for registered users */}
      {users &&
        users.map((u) => (
          <Marker
            key={u.id}
            coordinate={{ latitude: u.latitude, longitude: u.longitude }}
            title={u.name}
            description={u.address}
          />
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
