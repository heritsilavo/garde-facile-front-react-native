import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  activeTabLabel: {
    color: '#007AFF',
  },
  card: {
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 24,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  congeItem: {
    marginVertical: 16,
  },
  congeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  congeDescription: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  congeDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  listItemDescription: {
    fontSize: 14,
    color: '#555',
  },
  infoButton: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  infoButtonLabel: {
    color: '#007AFF',
    fontSize: 14,
  },
  outlinedButton: {
    borderColor: '#007AFF',
    borderWidth: 2,
    marginVertical: 16,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 16,
    marginBottom: 4,
  },
});