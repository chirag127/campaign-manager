import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title, Subheading, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsOfServiceScreen = () => {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>Terms of Service</Title>
          <Text style={styles.lastUpdated}>Last updated: March 22, 2025</Text>
          
          <Subheading style={styles.sectionHeading}>1. Agreement to Terms</Subheading>
          <Text style={styles.paragraph}>
            By accessing or using Campaign Manager, you agree to be bound by these Terms of Service. If you do not agree to these
            Terms, you may not access or use the Service.
          </Text>
          
          <Subheading style={styles.sectionHeading}>2. Description of Service</Subheading>
          <Text style={styles.paragraph}>
            Campaign Manager is a platform designed to help users create, manage, and track marketing campaigns across
            various platforms. Our service includes tools for campaign creation, lead management, analytics, and reporting.
          </Text>
          
          <Subheading style={styles.sectionHeading}>3. Account Registration and Security</Subheading>
          <Text style={styles.paragraph}>
            To use certain features of the Service, you must register for an account. You agree to provide accurate,
            current, and complete information during registration and to keep your account information updated.
          </Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </Text>
          
          <Subheading style={styles.sectionHeading}>4. User Conduct</Subheading>
          <Text style={styles.paragraph}>
            You agree not to:
          </Text>
          <Text style={styles.bulletPoint}>• Use the Service in any way that violates applicable laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</Text>
          <Text style={styles.bulletPoint}>• Interfere with or disrupt the Service or servers or networks connected to the Service</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to any part of the Service</Text>
          <Text style={styles.bulletPoint}>• Use any robot, spider, crawler, scraper, or other automated means to access the Service</Text>
          
          <Subheading style={styles.sectionHeading}>5. Intellectual Property</Subheading>
          <Text style={styles.paragraph}>
            The Service and its original content, features, and functionality are owned by Campaign Manager and are
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Text>
          
          <Subheading style={styles.sectionHeading}>6. User Content</Subheading>
          <Text style={styles.paragraph}>
            You retain ownership of any content you submit to the Service. By submitting content, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display
            such content for the purpose of providing and improving the Service.
          </Text>
          
          <Subheading style={styles.sectionHeading}>7. Termination</Subheading>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or
            liability, for any reason, including if you breach these Terms. Upon termination, your right to use the
            Service will immediately cease.
          </Text>
          
          <Subheading style={styles.sectionHeading}>8. Limitation of Liability</Subheading>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, in no event shall Campaign Manager be liable for any indirect, punitive,
            incidental, special, consequential damages, or any damages whatsoever arising out of or connected with the use
            or inability to use the Service.
          </Text>
          
          <Subheading style={styles.sectionHeading}>9. Changes to Terms</Subheading>
          <Text style={styles.paragraph}>
            We reserve the right to modify or replace these Terms at any time. It is your responsibility to check these
            Terms periodically for changes. Your continued use of the Service following the posting of any changes
            constitutes acceptance of those changes.
          </Text>
          
          <Subheading style={styles.sectionHeading}>10. Governing Law</Subheading>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the
            Company is established, without regard to its conflict of law provisions.
          </Text>
          
          <Subheading style={styles.sectionHeading}>11. Contact Us</Subheading>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.paragraph}>
            Email: support@campaignmanager.com
          </Text>
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
    marginBottom: 5,
  },
  lastUpdated: {
    fontStyle: 'italic',
    marginBottom: 20,
  },
  sectionHeading: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 20,
  },
  bulletPoint: {
    marginLeft: 15,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default TermsOfServiceScreen;
