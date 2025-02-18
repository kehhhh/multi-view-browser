import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const windowOptions = [
  { count: 2, title: 'Basic', description: 'Perfect for simple multitasking' },
  { count: 4, title: 'Multi', description: 'Enhanced productivity with quad view' },
  { count: 6, title: 'Pro', description: 'Professional grade multitasking' },
  { count: 8, title: 'Ultra', description: 'Maximum efficiency with octa view' },
];

interface SelectionScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SelectionScreen({ navigation }: SelectionScreenProps) {
  const [selectedCount, setSelectedCount] = useState(2);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196f3', '#1976d2']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Your Setup</Text>
        <Text style={styles.subtitle}>Select number of windows to begin</Text>
      </LinearGradient>

      {/* Ad Placeholder - Banner */}
      <View style={styles.adBanner}>
        <Text style={styles.adText}>Advertisement Banner</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.optionsContainer}>
          {windowOptions.map((option) => (
            <TouchableOpacity
              key={option.count}
              style={[
                styles.optionCard,
                selectedCount === option.count && styles.selectedCard
              ]}
              onPress={() => {
                setSelectedCount(option.count);
                navigation.navigate('Browser', { initialWindowCount: option.count });
              }}
            >
              <View style={styles.optionHeader}>
                <Text style={[
                  styles.optionTitle,
                  selectedCount === option.count && styles.selectedText
                ]}>
                  {option.title}
                </Text>
                <View style={[
                  styles.countBadge,
                  selectedCount === option.count && styles.selectedBadge
                ]}>
                  <Text style={[
                    styles.countText,
                    selectedCount === option.count && styles.selectedCountText
                  ]}>
                    {option.count} Windows
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.optionDescription,
                selectedCount === option.count && styles.selectedText
              ]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ad Placeholder - Rectangle */}
        <View style={styles.adRectangle}>
          <Text style={styles.adText}>Advertisement Rectangle</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 16,
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
    marginVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    color: '#666',
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#2196f3',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  countBadge: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  selectedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  countText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  selectedCountText: {
    color: '#fff',
  },
}); 