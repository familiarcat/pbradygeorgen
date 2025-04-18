import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigators/AppNavigator';

type ResumePDFScreenProps = NativeStackScreenProps<AppStackParamList, 'ResumePDFScreen'>;

export default function ResumePDFScreen({ route }: ResumePDFScreenProps) {
  const [pdfSource, setPdfSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if a URI was provided in the route params
        if (route.params?.uri) {
          setPdfSource({ uri: route.params.uri, cache: true });
          setLoading(false);
          return;
        }

        // Different source handling based on platform
        if (Platform.OS === 'web') {
          // For web, we need to use a URL that's accessible
          setPdfSource({ uri: 'https://pbradygeorgen.com/resume.pdf', cache: true });
        } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
          // For native platforms, we can use the local asset
          // Use require for local assets
          setPdfSource(require('../../assets/pdfs/BradyGeorgenResume.pdf'));
        } else {
          // Fallback to remote URL for unknown platforms
          setPdfSource({ uri: 'https://pbradygeorgen.com/resume.pdf', cache: true });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try again later.');
        setLoading(false);

        // Fallback to remote URL if local loading fails
        setPdfSource({ uri: 'https://pbradygeorgen.com/resume.pdf', cache: true });
      }
    };

    loadPdf();
  }, [route.params?.uri]);

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

  return (
    <View style={styles.container}>
      {pdfSource ? (
        <Pdf
          source={pdfSource}
          style={styles.pdf}
          onError={(error) => {
            console.error('PDF error:', error);
            setError('Error displaying PDF: ' + (error.toString ? error.toString() : 'Unknown error'));
          }}
          onLoadComplete={(numberOfPages) => {
            console.log(`PDF loaded with ${numberOfPages} pages`);
          }}
        />
      ) : (
        <View style={[styles.container, styles.centered]}>
          <Text>No PDF source available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20
  }
});
