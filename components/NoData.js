import React, { Component } from 'react'
import { Image, Text, View, StyleSheet, Dimensions } from 'react-native'

class NoData extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{position: 'relative', top: 10}}>
                        <Text style={{fontSize: 10}}>내가 여행을 안간건 아닌데...</Text>
                        <Text style={{fontSize: 10}}>돈이 없는 것도 아니고...</Text>
                    </View>
                    <View style={{position: 'relative', left: 10}}>
                        <Image source={require('../assets/images/no-data.png')} style={styles.imageStyle}></Image>
                    </View>
                </View>
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
        width: Dimensions.get('window').width / 6,
        height: Dimensions.get('window').height / 7,
        resizeMode: 'contain'
    }
})

export default NoData