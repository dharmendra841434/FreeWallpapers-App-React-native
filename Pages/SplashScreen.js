import React from "react";
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../Colors';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const SplashScreen = () => {

    const navigation = useNavigation();

    setTimeout(() => {

        navigation.replace("Tab");

    }, 5000);
    return (
        <LinearGradient colors={["#020024", "#081782", "#00d4ff"]} style={styles.linearGradient}>
            <StatusBar barStyle='light-content' backgroundColor="#020024" />
            <Animatable.View animation="flipInX" iterationCount={1} direction="alternate" duration={3000} style={styles.logo}>
                <ImageBackground style={{ flex: 1 }} source={require("../assets/images.png")} />
            </Animatable.View>
            <Animatable.Text
                animation="zoomInUp"
                iterationCount={1}
                direction="alternate"
                duration={3000}
                style={styles.logotxt}>FreeWallp</Animatable.Text>
            <View style={{ height: 80, width: 80, marginStart: 140, marginTop: 60 }}>
                <LottieView source={require('../assets/loading.json')} autoPlay loop />
            </View>
            <Text style={styles.info}>Developed By : Dharmendra Kumar</Text>
        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 150,
        marginStart: 110

    },
    logotxt: {
        fontSize: 30,
        color: Colors.primarycolor,
        fontWeight: 'bold',
        marginTop: 30,
        marginStart: 120
    },
    info: {

        marginTop: 160,
        marginStart: 60,

    }
});

export default SplashScreen;