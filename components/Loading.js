import React, { Component } from 'react'
import { Image, View, StyleSheet, Dimensions } from 'react-native'

class Loading extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/images/loading.png')} style={styles.imageStyle}></Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 99999999,
    },
    imageStyle: {
        width: Dimensions.get('window').width / 3,
        // height: Dimensions.get('window').height / 3,
        resizeMode: 'contain'
    }
})

export default Loading
