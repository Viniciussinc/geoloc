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

  // Check if current location is available
  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando localização...</Text>
      </View>
    );
  }

  const { MapView, Marker } = MapLib;

  // Calculate region to show all markers (current location + registered users)
  const calculateRegion = () => {
    const allPoints = [];
    if (coords) {
      allPoints.push({ latitude: coords.latitude, longitude: coords.longitude });
    }
    if (users && users.length > 0) {
      users.forEach((u) => allPoints.push({ latitude: u.latitude, longitude: u.longitude }));
    }

    if (allPoints.length === 0) {
      // fallback se não houver pontos
      return {
        latitude: -23.55052,
        longitude: -46.633308,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const lats = allPoints.map((p) => p.latitude);
    const lngs = allPoints.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latDelta = (maxLat - minLat) * 1.5 || 0.01; // margem 50%
    const lngDelta = (maxLng - minLng) * 1.5 || 0.01;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={calculateRegion()}
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
            pinColor="blue"
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
