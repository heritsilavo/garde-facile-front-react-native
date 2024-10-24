import { StyleSheet, Touchable, View } from 'react-native'
import React, { useContext } from 'react'
import { Divider, Icon, Text, useTheme } from 'react-native-paper'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import HelpBox from '../../../ConfigurerContratPage/components/HelpBox'
import { getMonthName } from '../../../../../utils/date'
import { NavigationContext } from '@react-navigation/native'

const DeclarationScreen = () => {
    const { fonts, colors } = useTheme()
    const navigation = useContext(NavigationContext);

    return (
        <View>
            <Text style={[fonts.titleLarge, styles.title, { color: colors.primary }]}>Déclaration</Text>
            <TouchableOpacity onPress={()=>navigation?.navigate("CurrentMonthDeclaration")} style={[styles.button]}>
                <Text style={[fonts.bodyLarge]}>Déclaration {getMonthName(new Date())}</Text>
                <Icon source="chevron-right" size={20}></Icon>
            </TouchableOpacity>
            <Divider style={{ marginHorizontal: styles.button.marginHorizontal, marginBottom:0 }}></Divider>
            <TouchableOpacity style={[styles.button, {marginTop:0}]}>
                <Text style={[fonts.bodyLarge]}>Historique des déclaration</Text>
                <Icon source="chevron-right" size={20}></Icon>
            </TouchableOpacity>

            <HelpBox style={{marginTop:20, marginHorizontal:styles.button.marginHorizontal}} text="Visualisez à tout moment la déclaration. Elle s'actualize à fur et à merure que vous ajoutez des événements. Vous pouvez valider votre déclaration du 25 du mois encours au 05 du mois suivant"></HelpBox>
        </View>
    )
}

export default DeclarationScreen

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginTop: 15
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 15,
        paddingVertical: 20,
        backgroundColor: "white",
        paddingHorizontal: 10
    }
})