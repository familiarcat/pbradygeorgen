import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator } from 'react-native';

export default function StandalonePDFViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a fixed PDF URL for the standalone viewer
  const pdfUrl = 'https://pbradygeorgen.com/resume.pdf';

  useEffect(() => {
    console.log('StandalonePDFViewer mounted');

    // Set loading to false after a short delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      console.log('StandalonePDFViewer unmounted');
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading PDF...</Text>
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
          sandbox="allow-same-origin allow-scripts allow-forms"
          allowFullScreen
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    margin: 20,
    fontSize: 16,
    fontWeight: 'bold'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333'
  }
});
