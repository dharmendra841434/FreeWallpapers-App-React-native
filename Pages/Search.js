import React, { useState, useEffect } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    ImageBackground,
    PermissionsAndroid,
    Platform,
    Modal,
    TouchableOpacity,
    RefreshControl,
    TextInput
} from 'react-native';
import Colors from '../Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Share from 'react-native-share';
import CustomisableAlert from "react-native-customisable-alert";
import { showAlert } from "react-native-customisable-alert";
import RNFetchBlob from 'react-native-fetch-blob';




const MySearch = () => {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [imageName, setimageName] = useState("");
    const [anim, setanim] = useState(false);
    const [num, setnum] = useState(2);
    const [page, setpage] = useState(1);
    const [Refreshing, setRefreshing] = useState(false);
    const [visible, setvisible] = useState(false);
    const [imgUrl, setimgUrl] = useState("");
    const [btncolor, setbtncolor] = useState(true);

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
                    console.log("permission Granted");

                    function fatchedImages() {
                        let date = new Date();
                        let secound = date.toString();
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


    const navigation = useNavigation();

    const getImages = async () => {

        const myname = imageName;
        console.log(myname);
        try {
            const response = await fetch('https://api.unsplash.com/search/photos?query=' + myname + '&per_page=30&orientation=portrait&page=' + page + '&client_id=Kuq0YvHVf9tSreemEBBu3U9X-h1V9FF8Llv6l5UxYlo');
            const json = await response.json();
            setData(json.results);
            console.log(data);
        } catch (error) {
            showAlert({
                title: "Something went wrong !!",
                message: 'Try Again',
                alertType: 'error',
            })
        } finally {
            console.log(data.map(download));

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

    useEffect(() => { setLoading(false); setanim(true) })
    useFocusEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View>{anim ? <Animatable.View animation="slideInDown"
                    iterationCount={1}
                    style={styles.searchcontainer}>
                    <TextInput selectionColor="black" style={styles.input} placeholder="Search" onChangeText={(name) => { setimageName(name) }} />
                    <TouchableOpacity style={styles.searchbtn} onPress={() => { getImages(); }}>
                        <Icon name="search" size={30} color="white" />
                    </TouchableOpacity>
                </Animatable.View> : null}
                </View>
            )
        })
    }

    );

    const ModalPoup = ({ visible, children }) => {
        const [show, setshow] = useState(visible);
        useEffect(() => {
            toggleModel();

        }, [visible])
        const toggleModel = () => {
            if (visible) {
                setshow(true);
            } else {
                setshow(false);
            }
        };
        return (
            <Modal transparent visible={show}>
                <View style={styles.modalBackgroud} >{children}</View>
            </Modal>
        )
    };


    return (
        <View style={styles.screen}>
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
            {isLoading ? <ActivityIndicator style={{ marginTop: 380, }} /> : (
                <FlatList
                    data={data}
                    numColumns={num}
                    refreshControl={
                        <RefreshControl
                            refreshing={Refreshing}
                            onRefresh={Refresh}
                        />
                    }
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.imgcontainer}
                            onPress={() => {
                                setvisible(true);
                                setimgUrl(item.urls.regular);
                            }}
                        >
                            <ImageBackground style={{ flex: 1 }} source={{ uri: item.urls.regular }} />
                        </TouchableOpacity>
                    )}
                />
            )}
            <View>
                <ModalPoup visible={visible} >
                    <View style={styles.container} >
                        <ImageBackground source={{ uri: imgUrl }} style={{ flex: 1, overflow: 'hidden' }}>
                            <TouchableOpacity style={styles.cross} onPress={() => { setvisible(false) }}>
                                <Icon name="times" size={40} color="white" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', }}>
                                <TouchableOpacity onPress={() => { shareImage(); }}
                                    style={{ marginStart: 40, marginTop: 530 }}>
                                    <Icon name="share-alt" size={35} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { downloadImages(imgUrl); }}
                                    activeOpacity={0.6}
                                    style={{ marginStart: 200, marginTop: 530 }}>
                                    <Icon name="download" size={35} color="white" />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                </ModalPoup>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchcontainer: {
        height: 50,
        width: 330,
        position: 'relative',
        backgroundColor: "gray",
        margin: 20,
        marginTop: 60,
        flexDirection: 'row',
        opacity: 0.7,
        borderRadius: 10,
        elevation: 8

    },
    input: {
        flex: 1,
        paddingStart: 20,
        color: 'black',
        fontSize: 18,
    },
    searchbtn: {
        width: 60,
        height: 50,
        backgroundColor: Colors.primarycolor,
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgcontainer: {
        height: 300,
        width: '49%',
        margin: 2
    },
    modalBackgroud: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",

    },
    container: {
        width: "95%",
        height: "90%",
        borderColor: 'yellow',
        borderWidth: 3,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginVertical: 35,
        marginHorizontal: 10,
        borderRadius: 15
    },
    cross: {
        marginStart: 290,
    }

});

export default MySearch;