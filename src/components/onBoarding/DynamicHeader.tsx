import { Text } from 'react-native';
import React from 'react';

interface Props {
  label: string;
  fieldName: string;
}

const DynamicHeader = ({ label, fieldName }: Props) => {
  const headerStyles: object = {
    fontSize: fieldName === 'header_1' ? 22 : 16,
    fontWeight: fieldName === 'header_1' ? 'bold' : 'medium',
    color: fieldName === 'header_1' ? '#1A1A2E' : '#868E96',
  };

  return <Text style={headerStyles}>{label}</Text>;
};

export default DynamicHeader;
