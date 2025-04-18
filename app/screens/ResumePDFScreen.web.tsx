import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigators/AppNavigator';

type ResumePDFScreenProps = NativeStackScreenProps<AppStackParamList, 'ResumePDFScreen'>;

export default function ResumePDFScreen({ route }: ResumePDFScreenProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default to a fallback URI if none is provided
  const pdfUrl = route.params?.uri || 'https://pbradygeorgen.com/resume.pdf';
  
  useEffect(() => {
    // Set loading to false after a short delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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
      <iframe
        src={pdfUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Resume PDF"
        onError={() => setError('Failed to load PDF')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('window').height,
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
