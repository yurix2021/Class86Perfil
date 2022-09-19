import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";
import firebase from '../config'
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: []
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
  }

  fetchStories = () => {
    firebase
      .ref("/posts/")
      .on(
        "value",
        snapshot => {
          let stories = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              stories.push({
                key: key,
                value: snapshot.val()[key]
              });
            });
          }
          this.setState({ stories: stories });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log("La lectura falló: " + errorObject.code);
        }
      );
  }

  fetchUser = () => {
    let theme;
    firebase
      .ref("/users/HIxeXreDeIWEDwzd20lFWh64Mtx1/")
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };


  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

keyExtractor = (item, index) => index.toString();

    render() {
      if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
        return (
            <View style={this.state.light_theme ? styles.containerLight : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}>
              </Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>App narrar Historias</Text>
            </View>
          </View>
          {!this.state.stories[0] ? (
            <View style={styles.noStories}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.noStoriesTextLight
                    : styles.noStoriesText
                }
              >
                No hay historias disponibles
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.stories}
                renderItem={this.renderItem}
              />
            </View>
          )}
          <View style={{ flex: 0.08 }} />
        </View>
        )
      }
    }
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#ffffcc"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
    appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  }
});

