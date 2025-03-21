import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LegalFooter = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <Text
        style={[styles.link, { color: theme.colors.primary }]}
        onPress={() => navigation.navigate('PrivacyPolicy')}
      >
        Privacy Policy
      </Text>
      <Text style={styles.separator}>|</Text>
      <Text
        style={[styles.link, { color: theme.colors.primary }]}
        onPress={() => navigation.navigate('TermsOfService')}
      >
        Terms of Service
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 'auto',
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    marginHorizontal: 10,
    color: '#777',
  }
});

export default LegalFooter;
