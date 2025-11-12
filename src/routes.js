import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./pages/Main";
import Maps from "./pages/MapsFixed";
import Graficos from "./pages/Graficos";
import CameraPage from "./pages/Camera";
import { UsersProvider } from "./UsersContext";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <UsersProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Maps" component={Maps} />
          <Stack.Screen name="Graficos" component={Graficos} />
          <Stack.Screen name="Camera" component={CameraPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UsersProvider>
  );
}
