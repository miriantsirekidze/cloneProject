import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import { Country } from '../types'; 
import NotificationService from '../../services/NotificationService';

const { width } = Dimensions.get('window');

interface CountryComponentProps {
  country: Country;
}

const CountryComponent = ({ country }: CountryComponentProps) => {
  const currency = country.currencies ? Object.values(country.currencies)[0] : undefined;
  const currencyLabel = currency ? `${currency.name} / ${currency.symbol}` : 'N/A';
  const population = country.population.toLocaleString('en-US')

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{country.name.common}</Text>
            <Text style={styles.flag}>{country.flag}</Text>
          </View>
          <Text>{country.subregion || ''}</Text>
        </View>
        
        <Text style={styles.text}>
          Capital: <Text style={styles.subText}>{country.capital?.[0] || 'N/A'}</Text>
        </Text>
        
        <Text style={styles.text}>
          Population: <Text style={styles.subText}>{population}</Text>
        </Text>
        
        <Text style={styles.text}>
          Currency: <Text style={styles.subText}>{currencyLabel}</Text>
        </Text>
        
        <Text style={styles.text}>
          Timezone(s): <Text style={styles.subText}>{country.timezones[0]}</Text>
        </Text>
        
        <Text style={styles.text}>
          Flag description:{' '}
          <Text style={styles.subText}>
            {country.flags.alt || 'No description available'}
          </Text>
        </Text>
      </View>
      <Button 
      title="Show"
      onPress={() => {
        NotificationService.displayLocalNotification(
          country.name.common, 
          `capital: ${country.capital}`, 
          { userId: 123 }
        ); 
      }}
    />
    </View>
  );
};

export default CountryComponent;

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    minHeight: width * 0.5,
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
  },
  flag: {
    fontSize: 18,
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    marginTop: 5,
  },
  subText: {
    fontWeight: '400',
  },
});