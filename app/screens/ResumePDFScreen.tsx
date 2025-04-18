import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, Platform, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigators/AppNavigator';

// Import Pdf conditionally to handle cases where the module might not be available
let Pdf: any;
try {
  Pdf = require('react-native-pdf').default;
} catch (error) {
  console.warn('react-native-pdf is not available:', error);
  // Pdf will be undefined, we'll handle this case in the component
}

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

  // If Pdf component is not available (e.g., on web), show a message with a link
  if (!Pdf) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>PDF viewer is not available on this platform.</Text>
        <Text
          style={styles.link}
          onPress={() => {
            const url = 'https://pbradygeorgen.com/resume.pdf';
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                Linking.openURL(url);
              } else {
                console.log("Don't know how to open URI: " + url);
              }
            });
          }}
        >
          Open PDF in browser
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {pdfSource ? (
        <Pdf
          source={pdfSource}
          style={styles.pdf}
          onError={(error: any) => {
            console.error('PDF error:', error);
            setError('Error displaying PDF: ' + (error.toString ? error.toString() : 'Unknown error'));
          }}
          onLoadComplete={(numberOfPages: number) => {
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
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
    padding: 10
  }
});
