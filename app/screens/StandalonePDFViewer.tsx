import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator, Linking, Platform, TouchableOpacity } from 'react-native';

export default function StandalonePDFViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a fixed PDF URL
  const pdfUrl = 'https://pbradygeorgen.com/resume.pdf';
  
  useEffect(() => {
    console.log('StandalonePDFViewer mounted');
    
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => {
      console.log('StandalonePDFViewer unmounted');
      clearTimeout(timer);
    };
  }, []);
  
  const openPDFInBrowser = () => {
    Linking.canOpenURL(pdfUrl).then(supported => {
      if (supported) {
        Linking.openURL(pdfUrl);
      } else {
        setError("Cannot open PDF URL");
      }
    });
  };
  
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
        <TouchableOpacity style={styles.button} onPress={openPDFInBrowser}>
          <Text style={styles.buttonText}>Try opening in browser</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // For native platforms, we'll show a message with a link to open the PDF in a browser
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.title}>Brady Georgen Resume</Text>
      <Text style={styles.subtitle}>The PDF viewer is optimized for web viewing.</Text>
      <TouchableOpacity style={styles.button} onPress={openPDFInBrowser}>
        <Text style={styles.buttonText}>Open PDF in Browser</Text>
      </TouchableOpacity>
      <Text style={styles.info}>
        You can view this resume at{'\n'}
        <Text style={styles.link} onPress={openPDFInBrowser}>
          pbradygeorgen.com
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#ffffff',
    height: Dimensions.get('window').height,
    width: '100%',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555'
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
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  info: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555'
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline'
  }
});
