import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigators/AppNavigator';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

type ResumePDFScreenProps = NativeStackScreenProps<AppStackParamList, 'ResumePDFScreen'>;

export default function ResumePDFScreen({ route, navigation }: ResumePDFScreenProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  // Default to a fallback URI if none is provided
  const pdfUrl = route?.params?.uri || 'https://pbradygeorgen.com/resume.pdf';

  // This effect runs when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('ResumePDFScreen focused');

      // Force the component to stay focused
      if (!isFocused) {
        console.log('ResumePDFScreen lost focus, attempting to regain');
      }

      // Prevent automatic navigation to other screens
      const unsubscribe = () => {
        console.log('ResumePDFScreen unfocused');
      };

      return unsubscribe;
    }, [isFocused])
  );

  useEffect(() => {
    console.log('ResumePDFScreen mounted');

    // Set loading to false after a short delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      console.log('ResumePDFScreen unmounted');
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // For web, we use an iframe to display the PDF
  return (
    <View style={styles.container}>
      <View style={styles.pdfContainer}>
        <iframe
          src={pdfUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Resume PDF"
          onError={() => {
            console.error('Failed to load PDF');
            setError('Failed to load PDF');
          }}
          onLoad={() => {
            console.log('PDF loaded successfully');
            setLoading(false);
          }}
          sandbox="allow-same-origin allow-scripts"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('window').height,
    width: '100%',
    position: 'relative',
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20
  }
});
