import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WelcomeScreen from "./screens/WelcomeScreen";
import SelectionScreen from "./screens/SelectionScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Selection" component={SelectionScreen} />
      <Stack.Screen name="Browser" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Toaster />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
