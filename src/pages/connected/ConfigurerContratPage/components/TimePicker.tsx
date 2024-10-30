import React, { useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text, NativeEventEmitter, NativeModules } from "react-native";
import { TimePickerModal } from 'react-native-paper-dates';
import { Planning } from "../classes";
import { useTheme } from "react-native-paper";

export default function TimePicker({ placeholder, value, setValue }: { placeholder: string, setValue: Function, value: string | undefined }) {
    const [visible, setVisible] = React.useState(false);
    const [selectedTime, setSelectedTime] = React.useState<{ hours: number, minutes: number } | undefined>(undefined);
    const {fonts} = useTheme()
    const onDismiss = React.useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onConfirm = React.useCallback(
        ({ hours, minutes }: any) => {
            setVisible(false);
            setSelectedTime({ hours, minutes });
            setValue(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
        },
        [setValue]
    );

    const handlePress = () => {
        setVisible(true); // Open the modal when the TextInput is pressed
    };

    const myEventEmitter = new NativeEventEmitter(NativeModules.RCTDeviceInfo);

    useEffect(function () {
        if (!!value) {
            const [hours, minutes] = value.split(':');
            setSelectedTime({ hours: parseInt(hours), minutes: parseInt(minutes) })
        }
    }, [value])


    return (
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={[styles.buttonText, fonts.bodyMedium]}>
                    {selectedTime ? `${selectedTime.hours}:${selectedTime.minutes < 10 ? '0' : ''}${selectedTime.minutes}` : placeholder}
                </Text>
            </TouchableOpacity>
            <TimePickerModal
                visible={visible}
                onDismiss={onDismiss}
                onConfirm={onConfirm}
                hours={selectedTime?.hours || 0}
                minutes={selectedTime?.minutes || 0}
                inputFontSize={40}
                label=''
            />
        </View>
    );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1E90FF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2, // Shadow depth for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: 'white', // Text color for the button
        fontSize: 16, // Font size for the button text
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: '40%',
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        color: 'black',
    },
});