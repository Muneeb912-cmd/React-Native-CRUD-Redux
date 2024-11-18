import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Switch, Text } from "react-native-paper";
import * as Notifications from "expo-notifications";

const SwitchSettings = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to enable notifications for this app to receive notifications."
      );
    } else {
      console.log("Notification permission granted!");
    }
  };

  const onToggleSwitch = async () => {
    if (!isSwitchOn) {
      await requestNotificationPermission();
    }
    setIsSwitchOn(!isSwitchOn);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setIsSwitchOn(status === "granted");
    })();
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 16 }}>Notifications</Text>
      <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
    </View>
  );
};

export default SwitchSettings;
