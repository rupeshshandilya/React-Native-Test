import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Button,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FormComponent from "../components/FormComponent";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const DetailsScreen = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleForm = async () => {
    try {
      const response = await axios.post(
        `https://backend-test-3vzb.onrender.com/api/v1/generate-qr`,
        {
          name: username,
          phoneNumber,
          address,
          photoUrl,
        }
      );
      setQrCodeUrl(response.data.qrCode);
      Alert.alert("data submited");
    } catch (error) {
      Alert.alert("Something Went Wrong Try Again");
    }
  };

  const saveBase64Image = async (base64Data: string) => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save the QR code"
        );
        return;
      }

      const filename = `${FileSystem.cacheDirectory}qr-code-${Date.now()}.png`;

      const base64Code = base64Data.startsWith("data:")
        ? base64Data.split("base64,")[1]
        : base64Data;

      await FileSystem.writeAsStringAsync(filename, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === "android") {
        // Save to media library on Android
        const asset = await MediaLibrary.createAssetAsync(filename);
        await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
        Alert.alert("Success", "QR Code has been saved to your gallery!");
      } else {
        // Share on iOS
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(filename);
        } else {
          Alert.alert("Error", "Sharing is not available on your platform");
        }
      }

      await FileSystem.deleteAsync(filename, { idempotent: true });
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save QR Code");
    }
  };

  const handleSaveQR = () => {
    if (!qrCodeUrl) {
      Alert.alert("Error", "No QR code available to save");
      return;
    }
    saveBase64Image(qrCodeUrl);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      <View style={styles.container}>
        <FormComponent
          label="Username"
          value={username}
          onChangeText={setUsername}
        />
        <FormComponent
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <FormComponent
          label="Address"
          value={address}
          onChangeText={setAddress}
        />
        <FormComponent
          label="photo Url"
          value={photoUrl}
          onChangeText={setPhotoUrl}
        />
        <Button title="Submit Details" onPress={handleForm} />
        {qrCodeUrl && (
          <View style={styles.qrCodeContainer}>
            <Text style={styles.qrLabel}>Your QR Code:</Text>
            <Image source={{ uri: qrCodeUrl }} style={styles.qrCode} />
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleSaveQR}
            >
              <Text style={styles.downloadButtonText}>
                {Platform.OS === "ios" ? "Share QR Code" : "Save QR Code"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formConatiner: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCode: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  downloadButton: {
    marginTop: 15,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    width: "80%",
  },
  downloadButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DetailsScreen;
