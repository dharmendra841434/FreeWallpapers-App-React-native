import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    Dimensions,
    StatusBar,
    StyleSheet,
    Image,
    ToastAndroid,
    Alert,
    ImageBackground,
    PermissionsAndroid,
    Platform,
    Modal,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import Colors from '../Colors';
import CustomisableAlert from "react-native-customisable-alert";
import { showAlert } from "react-native-customisable-alert";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import RNFetchBlob from 'react-native-fetch-blob';

const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;

const CategoriesItems = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [page, setpage] = useState(1);
    const [Refreshing, setRefreshing] = useState(false);
    const [category, setcategory] = useState("");
    const viewshotRef = useRef();
    const [btncolor, setbtncolor] = useState(true);
    const { CatName } = props.route.params;
    const navigation = useNavigation();

    async function shareImage() {
        try {
            const res = await Share.open({ message: 'dharmendra', url: "www.google.com" })
        } catch (error) {
            showAlert({
                title: "Sharing is Cancle",
                message: 'Try Again',
                alertType: 'error',
            })
        }
    };

    async function downloadImages(url) {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: 'Storage Permission Required',
                    message: 'App needs acess to your storage to download Photos'
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    function fatchedImages() {
                        let ImageURL = url;
                        let ext = getExtention(ImageURL);
                        ext = '.' + ext[0];
                        //config and fs from fatchblob
                        const { config, fs } = RNFetchBlob
                        let PictureDir = fs.dirs.PictureDir;
                        const digit = parseInt((1 + (Math.random() * (100 - 1))));

                        let options = {
                            fileCache: true,
                            addAndroidDownloads: {
                                useDownloadManager: true,
                                notification: true,
                                path: PictureDir + '/MyWall_' + digit + ".jpg",
                                description: 'Image'
                            }
                        }
                        config(options)
                            .fetch("GET", ImageURL)
                            .then(myres => {
                                setbtncolor(false);
                                showAlert({
                                    title: 'Download Sucessfull',
                                    message: 'thank you',
                                    alertType: 'success',
                                })

                            })
                    };
                    fatchedImages();

                } else {
                    showAlert({
                        title: "Permission not Granted!!",
                        message: 'Try Again',
                        alertType: 'error',
                    })
                }

            } catch (error) {
                showAlert({
                    title: "Downloading Failed",
                    message: 'Try Again',
                    alertType: 'error',
                })
            }
        }
        else {
            fatchedImages();
        }

    };

    const getExtention = filename => {
        // To get the file extension
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    };

    const getImages = async () => {
        try {
            const response = await fetch('https://api.unsplash.com/search/photos?query=' + category + '&per_page=30&orientation=portrait&page=' + page + '&client_id=Kuq0YvHVf9tSreemEBBu3U9X-h1V9FF8Llv6l5UxYlo');
            const json = await response.json();
            setData(json.results);
        } catch (error) {
            showAlert({
                title: "Something went wrong !!",
                message: 'Try Again',
                alertType: 'error',
            })
        } finally {
            setLoading(false);
        }
    };

    const Refresh = () => {
        setRefreshing(true);
        setpage(page + 1);
        if (page === 1) {
            ToastAndroid.show("Refresh Again", ToastAndroid.SHORT);
        }
        getImages();
        setRefreshing(false)
    };


    useFocusEffect(() => {
        getImages();
        setcategory(CatName);
        navigation.setOptions({
            title: category,
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Icon name="angle-double-left" style={{ marginEnd: 10 }}
                            size={60} color="#594202" />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    );
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <StatusBar barStyle='dark-content' backgroundColor="white" />
            <CustomisableAlert
                titleStyle={{
                    fontSize: 18,
                    fontWeight: "bold"
                }}
                btnStyle={{
                    borderRadius: 10,
                    backgroundColor: btncolor ? "red" : "black"
                }}

            />
            {isLoading ? <View style={{ height: 80, width: 80, marginStart: 140, marginTop: 260 }}>
                <LottieView source={require('../assets/loading.json')} autoPlay loop />
            </View> : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data}
                    refreshControl={
                        <RefreshControl
                            refreshing={Refreshing}
                            onRefresh={Refresh}
                        />
                    }
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                        <View>
                            <ImageBackground source={{ uri: item.urls.regular }}
                                style={{ width: "98%", height: 500, marginVertical: 8, marginEnd: 8, marginStart: 8 }}>
                                <SafeAreaView style={styles.icons}>
                                    <TouchableOpacity onPress={() => { shareImage(); }}
                                        style={styles.shareicon}>
                                        <Icon name="share-alt" size={30} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { downloadImages(item.urls.full) }}
                                        activeOpacity={0.6}
                                        style={styles.downloadicon}>
                                        <Icon name="download" size={30} color="white" />
                                    </TouchableOpacity>
                                </SafeAreaView>
                            </ImageBackground>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "white"
    },
    shareicon: {
        height: deviceheight - 650,
        width: devicewidth - 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    downloadicon: {
        height: deviceheight - 650,
        width: devicewidth - 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 210



    },
    icons: {
        width: devicewidth,
        flexDirection: 'row',
        height: 50,
        width: 345,
        alignItems: 'center',
        marginTop: 450,
    },
    modalBackgroud: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",

    },
    mcontainer: {
        width: "80%",
        flex: 1,
        borderColor: '#3BB54A',
        borderWidth: 5,
        backgroundColor: 'white',
        marginHorizontal: 40,
        marginVertical: 210,
        borderRadius: 10
    },
    img: {
        width: 100,
        height: 100,
        marginTop: 20,
        marginStart: 90
    },
    msg: {
        color: 'black',
        fontSize: 20,
        marginStart: 5,
        marginTop: 40

    },
    btnstyl: {
        backgroundColor: '#3BB54A',
        width: 100,
        height: 50,
        marginTop: 20,
        marginStart: 90,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }

});
export default CategoriesItems;
