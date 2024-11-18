import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Appbar, Modal, Portal, Text, Button, Card } from "react-native-paper";
import CardLayout from "../components/CardLayout";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import UserDetailsCard from "../components/UserDetailsCard";
import { fetchUsers, setCurrentUser } from "../store/redux/usersDataReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [visible, setVisible] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const currentUser = useSelector((state) => state.users.currentUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector((state) =>
    state.users.ids.map((id) => state.users.entities[id])
  );

  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const modalPadding = isLandscape ? 80 : 20;
  const containerStyle = {
    padding: 20,
    paddingLeft: isLandscape ? 80 : 20,
    paddingRight: isLandscape ? 80 : 20,
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setTimeout(() => setVisible(false), 100);

  const checkCurrentUser = async () => {
    if (currentUser !== null) {
      console.log("hello2", currentUser);
      return;
    }
    try {
      const value = await AsyncStorage.getItem("user_data");
      if (value !== null) {
        const parsedUserData = JSON.parse(value);
        await dispatch(setCurrentUser(parsedUserData));
        const updatedUser = useSelector((state) => state.users.currentUser);
      }
    } catch (e) {
      throw e;
    }
  };
  

  useEffect(() => {
    dispatch(fetchUsers());
    checkCurrentUser();
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "#4285F4" }}>
        <Appbar.Content title="Home Screen" titleStyle={{ color: "white" }} />
        <Appbar.Action
          icon="account"
          onPress={() => {
            navigation.navigate("ProfileScreen");
          }}
          color="white"
        />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 10 }}>
        {users ? (
          <CardLayout
            dataList={users}
            setSelectedUser={setSelectedUser}
            showModal={showModal}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
        )}
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[
            containerStyle,
            { paddingLeft: modalPadding, paddingRight: modalPadding },
          ]}
          hideModalContentWhileAnimating={true}
        >
          <UserDetailsCard userData={selectedUser} />
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 2,
  },
});
