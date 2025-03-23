import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title, Button, TextInput, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import showDialog from '../../utils/showDialog';

const DeleteAccountScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, deleteAccount } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      showDialog('Error', 'Please enter your password to confirm account deletion.');
      return;
    }

    showDialog(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const success = await deleteAccount(password);
              if (success) {
                showDialog('Success', 'Your account has been deleted successfully.');
                // Navigation will be handled by AuthContext
              }
            } catch (error) {
              console.error('Error deleting account:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Deleting account...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Title style={[styles.title, { color: theme.colors.error }]}>Delete Account</Title>

          <Text style={styles.paragraph}>
            We're sorry to see you go. Before you delete your account, please note:
          </Text>

          <Text style={styles.bulletPoint}>• All your campaigns will be permanently deleted</Text>
          <Text style={styles.bulletPoint}>• All your leads and contacts will be permanently deleted</Text>
          <Text style={styles.bulletPoint}>• Your platform connections will be removed</Text>
          <Text style={styles.bulletPoint}>• This action cannot be undone</Text>

          <Text style={styles.paragraph}>
            If you're having issues with the platform, please consider contacting our support team at support@campaignmanager.com before deleting your account.
          </Text>

          <Text style={[styles.paragraph, styles.bold]}>
            To confirm deletion, please enter your password:
          </Text>

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            contentStyle={styles.deleteButtonContent}
            color={theme.colors.error}
          >
            Delete My Account
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 20,
  },
  bulletPoint: {
    marginLeft: 15,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
  },
  deleteButton: {
    marginBottom: 15,
  },
  deleteButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});

export default DeleteAccountScreen;
