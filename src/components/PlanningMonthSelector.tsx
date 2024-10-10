import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { generateMonths, generateMonthsAsync, Month } from '../utils/date';
import { Body as Contrat } from '../pages/connected/ConfigurerContratPage/classes';
import Toast from 'react-native-toast-message';

interface SelectedMonth {
  year: number;
  monthIndex: number;
}

interface PlanningMonthSelectorProps {
  contrat: Contrat;
  selectedMonth: SelectedMonth;
  setSelectedMonth: React.Dispatch<React.SetStateAction<SelectedMonth>>
}

const PlanningMonthSelector: React.FC<PlanningMonthSelectorProps> = ({ contrat, selectedMonth, setSelectedMonth }) => {
  const { fonts } = useTheme(); // Accéder aux polices du thème
  const [months, setMonths] = useState<Month[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [isLoading, setIsLoadin] = useState(true)

  const ITEM_WIDTH = (Dimensions.get('window').width / 3);
  const ITEM_OFFSET = ITEM_WIDTH;

  const getMonths = async function () {
      setIsLoadin(true)
      generateMonthsAsync().then(function (months:Month[]) {
        setMonths(months)
      }).catch(function (error:any) {
          Toast.show({
            type:'error',
            visibilityTime: 1500,
            autoHide:true,
            text1: "impossible de generer les Mois"
          })
      }).finally(function () {
        setIsLoadin(false)
      })
  }

  useEffect(() => {
    getMonths()
  }, [contrat]);

  useEffect(() => {
    if (flatListRef.current && months.length > 0) {
      const index = months.findIndex(
        month => month.year === selectedMonth.year && month.monthIndex === selectedMonth.monthIndex
      );
      if (index !== -1) {
        flatListRef.current.scrollToOffset({
          offset: index * ITEM_WIDTH,
          animated: true
        });
      }
    }
  }, [selectedMonth, months]);

  const handleMonthSelect = (month: Month) => {
    setSelectedMonth({ year: month.year, monthIndex: month.monthIndex });
  };

  const renderItem = ({ item }: { item: Month }) => {
    const isSelected = item.year === selectedMonth.year && item.monthIndex === selectedMonth.monthIndex;
    const currentDate = new Date();
    const isCurrentMonth = item.year === currentDate.getFullYear() && item.monthIndex === (currentDate.getMonth() +1);//+1 car  currentDate.getMonth() est zero based

    return (
      <TouchableOpacity
        onPress={() => handleMonthSelect(item)}
        style={[
          styles.monthContainer,
          isSelected && styles.selectedMonth,
          isCurrentMonth && styles.currentMonth
        ]}
      >
        <Text style={[
          styles.monthText,
          isSelected && styles.selectedText,
          isCurrentMonth && styles.currentMonthText,
          { ...fonts.bodyMedium }
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  if (months.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={months}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.year}-${item.monthIndex}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.flatListContent,
          { paddingHorizontal: ITEM_OFFSET }
        ]}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
        onScrollToIndexFailed={() => { }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: 50,
  },
  flatListContent: {
    // Peut contenir des styles supplémentaires
  },
  monthContainer: {
    width: Dimensions.get('window').width / 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  selectedMonth: {
    borderColor: '#FFA500', // Orange doux
  },
  currentMonth: {
    borderColor: '#4CAF50', // Vert doux
  },
  monthText: {
    color: '#333', // Couleur de texte par défaut
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFA500', // Orange doux
    fontWeight: 'bold',
  },
  currentMonthText: {
    color: '#4CAF50', // Vert doux
    fontWeight: 'bold',
  },
});

export default PlanningMonthSelector;
