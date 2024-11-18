import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { useColorScheme, AppRegistry } from "react-native";
import { PaperProvider,Text } from "react-native-paper";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { store, persistor } from "./store/redux/store";import { PersistGate } from 'redux-persist/integration/react'; 

export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={<><Text>Loading....</Text></>} persistor={persistor}>
          <PaperProvider>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => Main);
