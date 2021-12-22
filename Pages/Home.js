import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    Dimensions,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    ImageBackground,
    PermissionsAndroid,
    Platform,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import CustomisableAlert from "react-native-customisable-alert";
import { showAlert } from "react-native-customisable-alert";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import RNFetchBlob from 'react-native-fetch-blob';


const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;


const Home = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [btncolor, setbtncolor] = useState(true);
    const [hidebtns, sethidebtns] = useState(true);
    const [page, setpage] = useState(1);
    const [Refreshing, setRefreshing] = useState(false);
    const viewshotRef = useRef();

    async function shareImage() {
        const ImageUri = await viewshotRef.current.capture();
        try {
            var base64Data = `data:image/png;base64,` + ImageUri;
            const res = await Share.open({ message: 'dharmendra', url: base64Data })
        } catch (error) {
            setbtncolor(true);
            showAlert({
                title: "Sharing is Cancle",
                message: 'Try Again',
                alertType: 'error',
            })
        }
    };

    const getImages = async () => {
        try {
            const response = await fetch('https://api.unsplash.com/photos?page=' + page + '&per_page=100&client_id=Kuq0YvHVf9tSreemEBBu3U9X-h1V9FF8Llv6l5UxYlo');
            const json = await response.json();
            setData(json);
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

    async function downloadImages(url) {

        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: 'Storage Permission Required',
                    message: 'App needs acess to your storage to download Photos'
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("permission Granted");

                    function fatchedImages() {
                        let date = new Date();
                        let ImageURL = url;
                        let ext = getExtention(ImageURL);
                        ext = '.' + ext[0];
                        //config and fs from fatchblob
                        const { config, fs } = RNFetchBlob
                        let PictureDir = fs.dirs.PictureDir;
                        const digit = parseInt((1 + (Math.random() * (10000 - 1))));

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
                                    message: 'Thank you',
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
    const Refresh = () => {
        setRefreshing(true);
        setpage(page + 1);
        if (page === 1) {
            ToastAndroid.show("Refresh Again", ToastAndroid.SHORT);

        }
        getImages();
        setRefreshing(false)
    };

    useEffect(() => {
        getImages();

    }, [])

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
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
                <ViewShot ref={viewshotRef} options={{ format: 'png', quality: 1.0, result: 'base64' }} >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        horizontal
                        pagingEnabled
                        refreshControl={
                            <RefreshControl
                                refreshing={Refreshing}
                                onRefresh={Refresh}
                            />
                        }
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <View>

                                <ImageBackground style={{
                                    width: devicewidth, height: deviceheight,
                                    justifyContent: 'space-evenly',
                                    flexDirection: 'column',
                                }} source={{ uri: item.urls.regular }}
                                >
                                    {hidebtns ? (
                                        <View style={styles.container}>
                                            <Animatable.View animation="slideInDown" iterationCount={6} direction="alternate" duration={3000} style={styles.refreshanim}>
                                                <Text style={{ color: '#f7b34d' }}> Pull Down To Load New Images</Text>
                                                <Icon name="caret-down" size={60} color="#f7b34d" />
                                            </Animatable.View>
                                            <Animatable.View animation="slideInLeft" iterationCount={6} direction='normal' duration={3000} style={styles.nextanim}>
                                                <Icon name="caret-right" size={60} color="#f7b34d" />
                                            </Animatable.View>
                                            <SafeAreaView style={styles.icons}>
                                                <TouchableOpacity onPress={() => { shareImage() }}
                                                    activeOpacity={0.6} style={styles.shareicon}>
                                                    <Icon name="share-alt" size={40} color="white" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { downloadImages(item.links.download) }}
                                                    activeOpacity={0.6}
                                                    style={styles.downloadicon}>
                                                    <Icon name="download" size={40} color="white" />
                                                </TouchableOpacity>
                                            </SafeAreaView>
                                        </View>
                                    ) : (<ActivityIndicator />)}

                                </ImageBackground>

                            </View>
                        )}
                    />
                </ViewShot>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    shareicon: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: deviceheight - 650,
        width: devicewidth - 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    container: {
        flexDirection: "column",
        marginVertical: 200

    },
    downloadicon: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: deviceheight - 650,
        width: devicewidth - 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,


    },
    icons: {
        width: devicewidth,
        flexDirection: 'row',
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 50,
    },
    refreshanim: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 150
    },
    nextanim: {
        width: devicewidth - 300,
        marginBottom: 200,
        marginStart: 600,

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
export default Home;