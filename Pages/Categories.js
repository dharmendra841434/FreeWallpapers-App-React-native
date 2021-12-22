import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    ActivityIndicator, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import Colors from '../Colors';
import { useNavigation } from '@react-navigation/native'

const Data = [
    {
        key: 1,
        Name: 'Nature',
        url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
    },
    {
        key: 2,
        Name: 'Animals',
        url: 'https://images.unsplash.com/photo-1519664824562-b4bc73f9795a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80'
    },
    {
        key: 3,
        Name: 'Science',
        url: 'https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=417&q=80'
    },
    {
        key: 4,
        Name: 'Coding',
        url: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
    },
    {
        key: 5,
        Name: 'City',
        url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    },
    {
        key: 6,
        Name: 'Cars',
        url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
    },
    {
        key: 7,
        Name: 'Electronics',
        url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    },
    {
        key: 8,
        Name: 'Birds',
        url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=425&q=80'
    }]

const Categories = () => {
    const [isLoading, setLoading] = useState(true);
    const [clmn, setclmn] = useState(2);
    const navigation = useNavigation();
    return (
        <View style={styles.screen}>
            <StatusBar barStyle='dark-content' backgroundColor="white" />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={Data}
                numColumns={clmn}
                keyExtractor={(item, index) => item.key}
                renderItem={({ item }) => (
                    <View style={styles.RenderViewStyle}>
                        <ImageBackground
                            style={styles.imgback}
                            source={{ uri: item.url }} >
                            <TouchableOpacity activeOpacity={0.7}
                                onPress={() => {
                                    setTimeout(() => {
                                        navigation.navigate("Items", {
                                            CatName: item.Name,
                                        })
                                    }, 10)

                                }}
                                style={styles.overlay}>
                                <Text style={{ color: 'white', fontSize: 25 }}>{item.Name}</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "white"
    },
    RenderViewStyle: {
        flex: 1,
        width: "100%",
        margin: 5,
        overflow: 'hidden',
        borderRadius: 15,
        height: 200,
    },
    imgback: {
        width: "100%", height: "100%",
        borderRadius: 15,
        overflow: 'hidden',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Categories;