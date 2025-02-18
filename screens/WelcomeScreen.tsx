import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const features = [
  {
    icon: 'grid-outline',
    title: 'Multiple Views',
    description: 'Open up to 100 windows simultaneously for efficient multitasking'
  },
  {
    icon: 'play-circle-outline',
    title: 'Video Support',
    description: 'Automatic video detection for YouTube, Vimeo, and more'
  },
  {
    icon: 'layers-outline',
    title: 'Flexible Layout',
    description: 'Switch between grid and stack layouts for optimal viewing'
  },
  {
    icon: 'color-palette-outline',
    title: 'Dark Mode',
    description: 'Easy on the eyes with beautiful dark mode support'
  }
];

interface WelcomeScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#2196f3', '#1976d2']}
          style={styles.header}
        >
          <Text style={styles.title}>Multi-View Browser</Text>
          <Text style={styles.subtitle}>
            The Ultimate Multi-Window Experience
          </Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('Selection')}
          >
            <Text style={styles.playButtonText}>Watch Now!</Text>
            <Ionicons name="videocam" size={24} color="#2196f3" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Ad Placeholder 1 - Banner */}
        <View style={styles.adBanner}>
          <Text style={styles.adText}>Advertisement Banner</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Ionicons name={feature.icon as any} size={32} color="#2196f3" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ad Placeholder 2 - Rectangle */}
        <View style={styles.adRectangle}>
          <Text style={styles.adText}>Advertisement Rectangle</Text>
        </View>

        {/* Ad Placeholder 3 - Interstitial hint */}
        <Text style={styles.adHint}>
          Note: Full-screen ads may appear during usage
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  adBanner: {
    height: 60,
    backgroundColor: '#e0e0e0',
    margin: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adRectangle: {
    height: 250,
    backgroundColor: '#e0e0e0',
    margin: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    color: '#666',
    fontSize: 16,
  },
  adHint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
  },
  featuresContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196f3',
    marginRight: 8,
  },
}); 