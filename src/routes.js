import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./pages/Main";
import Maps from "./pages/MapsFixed";
import { UsersProvider } from "./UsersContext";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <UsersProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Maps" component={Maps} />
       
        </Stack.Navigator>
      </NavigationContainer>
    </UsersProvider>
  );
}
