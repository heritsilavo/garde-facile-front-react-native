import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing lamp icon

interface HelpBoxPropsType {
    text: string,
    style?: Object
}

const HelpBox = ({text,style}:HelpBoxPropsType) => {
  return (
    <View style={{...styles.container,...style}}>
      <View style={styles.iconContainer}>
        <Icon name="lightbulb-o" size={20} color="#f57c00" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {text}
        </Text>
        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Plus d'infos</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderColor: '#f57c00',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF8E1',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    color: '#1E88E5',
    fontWeight: 'bold',
  },
});

export default HelpBox;
