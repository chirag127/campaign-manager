import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const AppHeader = ({ title }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  // Determine the screen title based on the route
  const getScreenTitle = () => {
    if (title) return title;

    const routeName = route.name;
    switch (routeName) {
      case 'Dashboard':
        return 'Dashboard';
      case 'Campaigns':
        return 'Campaigns';
      case 'Leads':
        return 'Leads';
      case 'Platforms':
        return 'Platforms';
      default:
        return 'Campaign Manager';
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title={getScreenTitle()} />
      <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
        <Avatar.Text
          size={40}
          label={user?.name?.charAt(0) || 'U'}
          backgroundColor={theme.colors.primary}
        />
      </TouchableOpacity>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  profileButton: {
    marginRight: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default AppHeader;
