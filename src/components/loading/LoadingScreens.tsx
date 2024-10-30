import { View, StyleSheet } from "react-native";
import LottieView from 'lottie-react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('./loading.json')}
        autoPlay
        loop
        style={styles.animation}
        speed={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  animation: {
    width:  50,
    height: 50, 
  }
});