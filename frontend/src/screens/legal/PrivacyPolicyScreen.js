import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title, Subheading, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = () => {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>Privacy Policy</Title>
          <Text style={styles.lastUpdated}>Last updated: March 22, 2025</Text>
          
          <Subheading style={styles.sectionHeading}>1. Introduction</Subheading>
          <Text style={styles.paragraph}>
            Welcome to Campaign Manager. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            We respect your privacy and are committed to protecting your personal data. Please read this privacy policy carefully.
          </Text>
          
          <Subheading style={styles.sectionHeading}>2. Information We Collect</Subheading>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Personal Information:</Text> We collect information that you provide directly to us, including your name, email address, 
            and any other information you choose to provide when you register for an account, use our services, or communicate with us.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Usage Information:</Text> We automatically collect certain information about your device and how you interact with our services, 
            including IP address, device type, browser type, operating system, pages visited, and time spent on those pages.
          </Text>
          
          <Subheading style={styles.sectionHeading}>3. How We Use Your Information</Subheading>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide, maintain, and improve our services</Text>
          <Text style={styles.bulletPoint}>• Process transactions and send related information</Text>
          <Text style={styles.bulletPoint}>• Send administrative messages, updates, and security alerts</Text>
          <Text style={styles.bulletPoint}>• Respond to your comments, questions, and requests</Text>
          <Text style={styles.bulletPoint}>• Monitor and analyze trends, usage, and activities</Text>
          
          <Subheading style={styles.sectionHeading}>4. Data Security</Subheading>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. 
            However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </Text>
          
          <Subheading style={styles.sectionHeading}>5. Data Retention</Subheading>
          <Text style={styles.paragraph}>
            We will retain your information only for as long as necessary to fulfill the purposes for which we collected it, 
            including to satisfy any legal, accounting, or reporting requirements.
          </Text>
          
          <Subheading style={styles.sectionHeading}>6. Your Rights</Subheading>
          <Text style={styles.paragraph}>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </Text>
          <Text style={styles.bulletPoint}>• Access to your personal data</Text>
          <Text style={styles.bulletPoint}>• Correction of inaccurate data</Text>
          <Text style={styles.bulletPoint}>• Deletion of your data</Text>
          <Text style={styles.bulletPoint}>• Restriction of processing</Text>
          <Text style={styles.bulletPoint}>• Data portability</Text>
          
          <Subheading style={styles.sectionHeading}>7. Children's Privacy</Subheading>
          <Text style={styles.paragraph}>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
          </Text>
          
          <Subheading style={styles.sectionHeading}>8. Changes to This Privacy Policy</Subheading>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date.
          </Text>
          
          <Subheading style={styles.sectionHeading}>9. Contact Us</Subheading>
          <Text style={styles.paragraph}>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
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

export default PrivacyPolicyScreen;
