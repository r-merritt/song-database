import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import Header from "../components/Header";

export default function RootLayout() {
  return (
  <PaperProvider>
    <Header />
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'rgba(235, 235, 235, 1)'},
      }}
    />
  </PaperProvider>
);
}
