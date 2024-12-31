import React from "react";
import { ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { BentoContainer, BentoItem } from "../utility_components/Bento";
import { useResponsive } from "../utility_components/hooks/useResponsive";
import { SPACING } from "../utility_components/theme";
export default () => {
  const { isMd, isLg } = useResponsive();
  return (
    <ScrollView style={s.scroll}>
      <View style={s.container}>
        <BentoContainer
          direction="responsive"
          gap="lg"
          style={s.mainContainer}
          maxWidth={1400}
          adjustHeight
        >
          <BentoContainer
            direction="column"
            style={s.contentContainer}
            gap="lg"
            adjustHeight
          >
            <BentoItem style={s.header} padding="xl" adjustHeight>
              <Text style={s.headerText}>Bento Portfolio</Text>
              <Text style={s.subheaderText}>Responsive Design System</Text>
            </BentoItem>
            <BentoContainer
              direction="responsive"
              gap="lg"
              wrap={isLg}
              adjustHeight
            >
              <BentoContainer direction="column" gap="md" adjustHeight>
                <BentoItem minWidth={isMd ? 300 : undefined} adjustHeight>
                  <Text style={s.sectionTitle}>Experience</Text>
                  <BentoContainer direction="column" gap="md" adjustHeight>
                    <BentoItem adjustHeight>
                      <Text style={s.itemTitle}>Senior Developer</Text>
                      <Text style={s.itemSubtitle}>
                        Tech Corp • 2020-Present
                      </Text>
                      <Text style={s.detail}>
                        Leading front-end development initiatives
                      </Text>
                    </BentoItem>
                  </BentoContainer>
                </BentoItem>
              </BentoContainer>
              <BentoContainer direction="column" gap="md" adjustHeight>
                <BentoItem minWidth={isMd ? 300 : undefined} adjustHeight>
                  <Text style={s.sectionTitle}>Skills</Text>
                  <BentoContainer wrap gap="sm" adjustHeight>
                    <BentoItem style={s.skillItem} adjustHeight>
                      <Text style={s.detail}>React Native</Text>
                    </BentoItem>
                    <BentoItem style={s.skillItem} adjustHeight>
                      <Text style={s.detail}>TypeScript</Text>
                    </BentoItem>
                    <BentoItem style={s.skillItem} adjustHeight>
                      <Text style={s.detail}>Design Systems</Text>
                    </BentoItem>
                  </BentoContainer>
                </BentoItem>
              </BentoContainer>
            </BentoContainer>
          </BentoContainer>
          <BentoContainer
            direction="column"
            // style={[s.sidebar, { flex: isMd ? 0.4 : 1 }]}
            gap="lg"
            adjustHeight
          >
            <BentoItem adjustHeight>
              <Text style={s.sectionTitle}>Projects</Text>
              <BentoContainer direction="column" gap="md" adjustHeight>
                <BentoItem adjustHeight>
                  <Text style={s.itemTitle}>Design System</Text>
                  <Text style={s.detail}>Scalable component library</Text>
                </BentoItem>
              </BentoContainer>
            </BentoItem>
          </BentoContainer>
        </BentoContainer>
      </View>
    </ScrollView>
  );
};
const s = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: "#f0f0f0",
    minHeight: Platform.OS === "web" ? "100%" : "100%",
    alignItems: "center",
  },
  mainContainer: { minHeight: 600, width: "100%" },
  contentContainer: { flex: 1 },
  sidebar: { minWidth: 300 },
  header: { alignItems: "center", justifyContent: "center" },
  headerText: { fontSize: 32, fontWeight: "bold", marginBottom: SPACING.sm },
  subheaderText: { fontSize: 18, opacity: 0.8 },
  sectionTitle: { fontSize: 24, fontWeight: "bold", marginBottom: SPACING.md },
  itemTitle: { fontSize: 18, fontWeight: "600", marginBottom: SPACING.xs },
  itemSubtitle: { fontSize: 16, opacity: 0.7, marginBottom: SPACING.xs },
  detail: { fontSize: 16 },
  skillItem: { flex: 0, minWidth: 120 },
});
