import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5EBDD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5E3A1C',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
    backgroundColor: '#FFF8F0',
    borderRadius: 8,
    color: '#5E3A1C',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8D3B9',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#C2A275',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#D2B48C',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#5E3A1C',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    color: '#5E3A1C',
    textAlign: 'center',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#FFF8F0',
    overflow: 'hidden'
}
});
