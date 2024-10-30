import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { ActivityIndicator, useTheme } from "react-native-paper";
import HelpBox from "../components/HelpBox";
import { getListeJourFerieByText, JourFerie } from "../../../../utils/ListeJoursFerie";
import LoadingScreen from "../../../../components/loading/LoadingScreens";
import { getAllCodePostaux } from "../../../../utils/codepostaux";
import { getJourFeriesByCodePostale } from "../../../../utils/jourferie";

interface RenderStep7Props {
  setStep: (step: number) => void;
  setCodePostateAndJourFerie: (codePostale: string, jourFerie: string[]) => void;
}

interface PostalCodeItem {
  id: string;
  title: string;
}

const SEARCH_DEBOUNCE_TIME = 600;
const MAX_POSTAL_CODE_SUGGESTIONS = 50;
const MIN_SEARCH_LENGTH = 2;

const HolidayItem = React.memo(({
  holiday,
  isSelected,
  onToggle
}: {
  holiday: JourFerie;
  isSelected: boolean;
  onToggle: (type: string) => void;
}) => {
  const { fonts } = useTheme()
  return (
    <TouchableOpacity
      style={[styles.holidayItem, isSelected && styles.selectedHoliday]}
      onPress={() => onToggle(holiday.type)}
    >
      <Text style={[styles.label, fonts.bodyMedium]}>{holiday.text}</Text>
    </TouchableOpacity>
  )
});

const RenderStep7: React.FC<RenderStep7Props> = ({ setStep, setCodePostateAndJourFerie }) => {
  // State management
  const [state, setState] = useState({
    codePostale: "",
    codePostaleValide: false,
    selectedHolidays: [] as string[],
    isLoading: true,
    listeCodesPostaux: [] as string[],
    searchQuery: "",
    listeJourFerie: [] as JourFerie[],
    loadingJourFerie: true,
  });
  const { fonts } = useTheme()

  // Memoized postal codes filtering
  const formattedPostalCodes = useMemo<PostalCodeItem[]>(() => {
    if (state.searchQuery.length < MIN_SEARCH_LENGTH) return [];

    return state.listeCodesPostaux
      .filter(code => code.includes(state.searchQuery))
      .slice(0, MAX_POSTAL_CODE_SUGGESTIONS)
      .map(code => ({
        id: code,
        title: code,
      }));
  }, [state.listeCodesPostaux, state.searchQuery]);

  // Fetch postal codes on mount
  useEffect(() => {
    let mounted = true;

    const fetchPostalCodes = async () => {
      try {
        const list = await getAllCodePostaux();
        if (mounted) {
          setState(prev => ({
            ...prev,
            listeCodesPostaux: list,
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('Failed to fetch postal codes:', error);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchPostalCodes();
    return () => { mounted = false; };
  }, []);

  // Fetch holidays when postal code changes
  useEffect(() => {
    if (!state.codePostale) return;

    const fetchHolidays = async () => {
      setState(prev => ({ ...prev, loadingJourFerie: true }));
      try {
        const liste = await getJourFeriesByCodePostale(
          state.codePostale,
          new Date().getFullYear()
        );
        const listeJourFeries = getListeJourFerieByText(liste);
        setState(prev => ({
          ...prev,
          listeJourFerie: listeJourFeries,
          loadingJourFerie: false
        }));
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
        setState(prev => ({ ...prev, loadingJourFerie: false }));
      }
    };

    fetchHolidays();
  }, [state.codePostale]);

  const handleSelectPostalCode = useCallback((item: any) => {
    setState(prev => ({
      ...prev,
      codePostale: item?.title || "",
      codePostaleValide: !!item
    }));
  }, []);

  const toggleHolidaySelection = useCallback((holidayType: string) => {
    setState(prev => ({
      ...prev,
      selectedHolidays: prev.selectedHolidays.includes(holidayType)
        ? prev.selectedHolidays.filter(item => item !== holidayType)
        : [...prev.selectedHolidays, holidayType]
    }));
  }, []);

  const handleContinue = useCallback(() => {
    setCodePostateAndJourFerie(state.codePostale, state.selectedHolidays);
    setStep(8);
  }, [state.codePostale, state.selectedHolidays, setCodePostateAndJourFerie, setStep]);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={true}
      >
        <Text style={[styles.title, fonts.titleLarge]}>Jours Fériées</Text>
        <Text style={[styles.subtitle, fonts.bodyMedium]}>
          Ajouter les jours feriées où l'enfant sera gardé
        </Text>

        <HelpBox
          text="Les jours fériés chômés sont rémunérés sauf s'ils tombent lors d'une période d'absence. Si travaillés, ils sont majorés de 10%. Le 1er mai est majoré de 100%."
        />

        <Text style={[styles.subtitle, { marginTop: 20 }, fonts.bodyMedium]}>
          Code Postale de l'assistant:
        </Text>

        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          initialValue={{ id: state.codePostale }}
          onSelectItem={handleSelectPostalCode}
          onChangeText={(text) => setState(prev => ({ ...prev, searchQuery: text }))}
          dataSet={formattedPostalCodes}
          useFilter={false}
          debounce={SEARCH_DEBOUNCE_TIME}
          suggestionsListMaxHeight={200}
          textInputProps={{
            placeholder: "ex: 75001",
            style: styles.inputText,
            maxLength: 5,
          }}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: state.codePostaleValide ? "#ccc" : "red" }
          ]}
        />

        {!state.codePostaleValide && (
          <Text style={[styles.errorText, fonts.bodySmall]}>
            le code postale est invalide
          </Text>
        )}

        {!state.loadingJourFerie ? (
          <>
            <Text style={[styles.title2, fonts.titleMedium]}>Sélectionnez les jours fériés</Text>
            {state.listeJourFerie.map(holiday => (
              <HolidayItem
                key={holiday.type}
                holiday={holiday}
                isSelected={state.selectedHolidays.includes(holiday.type)}
                onToggle={toggleHolidaySelection}
              />
            ))}
          </>
        ) : (
          null
        )}
      </ScrollView>

      <TouchableOpacity
        disabled={!state.codePostaleValide}
        style={[
          styles.button,
          { backgroundColor: state.codePostaleValide ? "#0058c4" : "#b8cce6" }
        ]}
        onPress={handleContinue}
      >
        <Text style={[styles.buttonText, fonts.bodyMedium]}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  holidayItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },
  selectedHoliday: {
    backgroundColor: "#70a3c4",
    color: "white"
  },
  label: {
    fontSize: 16,
    color: "black",
  },
  button: {
    backgroundColor: "#007AFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 0,
  },
  inputText: {
    color: "black",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default React.memo(RenderStep7);