import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getMonthName, Mois } from '../../../utils/date'
import { CustomTab } from '../../../components/CongesScreen/CustomTab';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { NavigationContext } from '@react-navigation/native';
import CompteurTab from '../../../components/DeclarationScreen/CompteurTab';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import DeclarationTab from '../../../components/DeclarationScreen/DeclarationTab';

const CurrentMonthDeclaration = () => {

    const [currentMonth, setCurrentMonth] = useState<Mois>({ monthIndex: 0, year: 0 });
    const theme = useTheme()
    const [activeTab, setActiveTab] = useState<"COMPTEUR" | "DECLARATION">("COMPTEUR")
    const navigation = useContext(NavigationContext);
    const [refreshCompteurs, setRefreshCompteur] = useState(new Date());
    const [refreshDeclarations, setRefreshDeclaration] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function () {
        setIsLoading(true)
        const today = new Date();
        setCurrentMonth({ monthIndex: today.getMonth() + 1, year: today.getFullYear() })
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction onPress={() => navigation?.goBack()} />
                <Appbar.Content titleStyle={[theme.fonts.titleMedium]} title={`Déclaration ${getMonthName(new Date())} ${(new Date()).getFullYear()}`}></Appbar.Content>
            </Appbar.Header>

            <View style={styles.tabContainer}>
                <CustomTab
                    label="COMPTEUR"
                    isActive={activeTab === "COMPTEUR"}
                    onPress={() => { setActiveTab("COMPTEUR");setRefreshCompteur(new Date()) }}
                    theme={theme}
                />
                <CustomTab
                    label="DÉCLARATION"
                    isActive={activeTab === "DECLARATION"}
                    onPress={() => { setActiveTab("DECLARATION");setRefreshDeclaration(new Date()) }}
                    theme={theme}
                />
            </View>

            {activeTab == "COMPTEUR" && <CompteurTab month={currentMonth} refresh={refreshCompteurs}></CompteurTab>}
            {activeTab == "DECLARATION" && <DeclarationTab month={currentMonth} refresh={refreshDeclarations}></DeclarationTab>}
        </View>
    )
}

export default CurrentMonthDeclaration

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appBar: {

    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    }
})
