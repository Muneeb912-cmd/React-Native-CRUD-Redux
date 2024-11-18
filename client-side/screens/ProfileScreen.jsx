import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Alert, Modal } from "react-native";
import { Appbar } from "react-native-paper";
import ProfileCardLayout from "../components/ProfileCardLayout";
import ProfileSettings from "../components/ProfileSettings";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateUserData from "../components/UpdateUserData";
import { useSelector } from "react-redux";

const clearStackAndGoToLogin = (navigation) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "LoginSignup" }],
    })
  );
};

const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();
  const currentUser=useSelector((state) => state.users.currentUser)

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("user_data");
      if (value !== null) {
        const parsedUserData = JSON.parse(value);
        setUserData(parsedUserData);
      }
    } catch (e) {
      throw e;
    }
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "#4285F4" }}>
        <Appbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
          color="white"
        />
        <Appbar.Content
          title="Profile Screen"
          titleStyle={{ color: "white" }}
        />
        <Appbar.Action
          icon={"logout"}
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to logout?", [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: async () => {
                  try {
                    await AsyncStorage.clear();
                  } catch (e) {
                    throw e;
                  } finally {
                    clearStackAndGoToLogin(navigation);
                  }
                },
              },
            ]);
          }}
          color="white"
        />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 10 }}>
        <ProfileCardLayout userData={currentUser} showModal={showModal} />
        <ProfileSettings />
      </View>

      <Modal
        visible={visible}
        animationType="slide" 
        transparent
      >
        <UpdateUserData userData={currentUser} hideModal={hideModal}/>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const containerStyle = { padding: 20 };
