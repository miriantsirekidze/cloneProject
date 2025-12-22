import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { getCountries } from '../utils';
import { CountryApiResponse } from '../types';
import CountryComponent from './CountryComponent';

const CountryList = () => {
  const [data, setData] = useState<CountryApiResponse>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCountries();
        setData(result);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        style={styles.flatList}
        keyExtractor={item => item.cca2}
        renderItem={({ item }) => <CountryComponent country={item} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default CountryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 40,
    gap: 15,
  },
  flatList: {
    alignSelf: 'center',
  },
});
