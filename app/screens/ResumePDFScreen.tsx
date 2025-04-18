import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigators/AppNavigator';

type ResumePDFScreenProps = NativeStackScreenProps<AppStackParamList, 'ResumePDFScreen'>;

export default function ResumePDFScreen({ route }: ResumePDFScreenProps) {
  // Default to a fallback URI if none is provided
  const uri = route.params?.uri || 'https://pbradygeorgen.com/resume.pdf';
  const source = { uri, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        style={styles.pdf}
        onError={(error) => {
          console.error('PDF error:', error);
        }}
        onLoadComplete={(numberOfPages) => {
          console.log(`PDF loaded with ${numberOfPages} pages`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
