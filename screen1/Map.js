import * as React from 'react'

import MapView from 'react-native-maps';

const Map = ({route}) => {
  return (
    <View style = {{flex:1, justifyContent:'center', alignContent: 'center'}}>
      <MapView style={styles.map} />
      <StatusBar style="auto" />
    </View>
  )
}

export default Map
const styles = StyleSheet.create({

  map: {
    width: '100%',
    height: '100%',
  },
});