import React, { Component } from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'

class ImageScreen extends Component {
  render() {
    const uri = this.props.navigation.getParam('uri') || ''
    if(!uri) return null
    return (
      <View style={styles.container}>
        <Image 
          source={{uri:uri}}
          resizeMode='contain'
          style={{
            flex: 1, 
            width: Dimensions.get('window').width, 
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
})

export default ImageScreen
