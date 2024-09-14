import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingScreen() {
    return <View style={{...styles.container,display:'flex', flexDirection:'column',alignContent:'center',justifyContent:'center',backgroundColor:'#f1f1f1'}}> 
        <ActivityIndicator size="large" color="#007AFF" />
    </View>    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      color:'black'
    },
  });