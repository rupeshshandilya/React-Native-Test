import { CameraView } from "expo-camera";
import { AppState, SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Overlay } from "../components/Overlay";

interface UserData {
  name: string;
  phoneNumber: string;
  address: string;
  photoUrl: string;
}

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleQRScan = async (data: string) => {
    if (!data || qrLock.current) return;
    qrLock.current = true;

    try {
      
      const parsedData = JSON.parse(data);

      const response = await axios.post(
        `https://backend-test-3vzb.onrender.com/api/v1/decode-qr/${parsedData.userId}`
      );

      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setUserData(null);
    } finally {
      setTimeout(() => {
        qrLock.current = false;
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={async ({ data }) => await handleQRScan(data)}
      />
      <Overlay />

      {userData && (
        <View style={styles.dataContainer}>
          <Text style={styles.title}>User Details</Text>
          <Text style={styles.text}>Name: {userData.name}</Text>
          <Text style={styles.text}>Phone: {userData.phoneNumber}</Text>
          <Text style={styles.text}>Address: {userData.address}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  errorContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    padding: 15,
    borderRadius: 10,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
