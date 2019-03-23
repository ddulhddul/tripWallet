import React, { Component } from 'react'
import { Image, View, StyleSheet, Dimensions } from 'react-native'

class NoData extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/images/no-data.png')} style={styles.imageStyle}></Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: Dimensions.get('window').width / 3,
        resizeMode: 'contain'
    }
})

export default NoData
