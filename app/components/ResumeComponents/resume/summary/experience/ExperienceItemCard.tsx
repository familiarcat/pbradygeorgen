import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface ExperienceItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const EducationItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  // console.log("EducationItemCard", resume)
  return (
    <View style={[styles.itemCard]}>
      {resume.Experience && (
        <View style={[renderTextColor(4, getBaseHueForResume(4))]}>
          <Text
            style={[
              styles.header,
              renderTextColor(3, getBaseHueForResume(3)),
              renderIndentation(1),
            ]}
          >
            {resume.Experience.title}
          </Text>
          {resume.Companies && resume.Companies.length > 0 && (
            <ResponsiveGrid>
              {resume.Companies.map((company, index) => (
                <View
                  key={company.id}
                  style={[
                    renderIndentation(2),
                    renderTextColor(1, getBaseHueForResume(index)),
                    { width: "100%" },
                  ]}
                >
                  <Text
                    style={[
                      renderIndentation(1),
                      styles.header,
                      renderTextColor(3, getBaseHueForResume(3)),
                    ]}
                  ></Text>
                  <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                    {company.name}
                  </Text>
                  {resume.Engagements.filter((e) => e.companyID === company.id).map(
                    (engagement, index) => (
                      <Text
                        key={engagement.id}
                        style={[
                          renderIndentation(1),
                          renderTextColor(3, getBaseHueForResume(index)),
                        ]}
                      >
                        {engagement.client} (
                        <View>
                          <Text>
                            {new Date(engagement.startDate ?? "").getFullYear()} -{" "}
                            {engagement.endDate
                              ? new Date(engagement.endDate).getFullYear()
                              : "Present"}
                          </Text>
                        </View>
                        )
                      </Text>
                    ),
                  )}
                </View>
              ))}
            </ResponsiveGrid>
          )}
        </View>
      )}

      {/* {resume.Education && (
        <View style={[renderTextColor(4, getBaseHueForResume(4))]}>
          <Text
            style={[
              renderIndentation(1),
              styles.header,
              renderTextColor(3, getBaseHueForResume(3)),
            ]}
          >
            {resume.Education.summary}
          </Text>
          {resume.Schools && resume.Schools.length > 0 && (
            <View>
              <ResponsiveGrid>
                {resume.Schools.map((school, index) => (
                  <View
                    key={school.id}
                    style={[renderIndentation(2), renderTextColor(1, getBaseHueForResume(index))]}
                  >
                    <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                      {school.name}
                    </Text>

                    {resume.Degrees.filter((d) => d.schoolID === school.id).map((degree, index) => (
                      <Text
                        key={degree.id}
                        style={[
                          renderIndentation(1),
                          renderTextColor(3, getBaseHueForResume(index)),
                        ]}
                      >
                        {degree.major}(
                        {degree.startYear ? new Date(degree.startYear).getFullYear() : "N/A"} -{" "}
                        {degree.endYear ? new Date(degree.endYear).getFullYear() : "N/A"})
                      </Text>
                    ))}
                  </View>
                ))}
              </ResponsiveGrid>
            </View>
          )}
        </View>
      )} */}
    </View>
  )
}

// Styles for ReferenceItemCard
const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minWidth: "100%", // Minimum width from responsive grid
    // maxWidth: 200, // Maximum width from responsive grid
    width: "100%",
    height: "100%",
    // padding: 15,
    backgroundColor: "rgba(255,0,255,0)",
    fontColor: "rgba(255,0,255,1)",
    borderRadius: 8,
  },
  header: {
    // Correct style for the header
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "blue",
    fontSize: 16,
    fontWeight: "700",
  },
  phone: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    letterSpacing: 0.16,
    fontWeight: "400",
  },
})
export default EducationItemCard

// import React from "react"
// import { StyleSheet, Text, View, Dimensions } from "react-native"
// import { ExpandedResume } from "../../../../types" // Assuming this includes necessary types
// import { useDataContext } from "app/components/DataContext"
// import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

// interface ExperienceItemCardType {
//   resume: ExpandedResume
// }

// const ExperienceItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
//   const { getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()

//   return (
// <View style={styles.itemCard}>
//   {resume.Experience && (
//     <>
//       <Text
//         style={[
//           styles.header,
//           renderTextColor(3, getBaseHueForResume(3)),
//           renderIndentation(1),
//         ]}
//       >
//         {resume.Experience.title}
//       </Text>
//       {resume.Companies && resume.Companies.length > 0 && (
//         <ResponsiveGrid>
//           {resume.Companies.map((company, index) => (
//             <View
//               key={company.id}
//               style={[renderIndentation(2), renderTextColor(1, getBaseHueForResume(index))]}
//             >
//               <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
//                 {company.name}
//               </Text>
//               {resume.Engagements.filter((e) => e.companyID === company.id).map(
//                 (engagement, index) => (
//                   <Text
//                     key={engagement.id}
//                     style={[
//                       renderIndentation(1),
//                       renderTextColor(3, getBaseHueForResume(index)),
//                     ]}
//                   >
//                     {engagement.client} (
//                     <View>
//                       <Text>
//                         {new Date(engagement.startDate ?? "").getFullYear()} -{" "}
//                         {engagement.endDate
//                           ? new Date(engagement.endDate).getFullYear()
//                           : "Present"}
//                       </Text>
//                     </View>
//                     )
//                   </Text>
//                 ),
//               )}
//             </View>
//           ))}
//         </ResponsiveGrid>
//       )}
//     </>
//   )}
// </View>
//   )
// }

// const styles = StyleSheet.create({
//   itemCard: {
//     flexDirection: "column",
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     minWidth: "100%", // Minimum width from responsive grid
//     // maxWidth: 200, // Maximum width from responsive grid
//     width: "100%",
//     height: "100%",
//     // padding: 15,
//     backgroundColor: "rgba(255,0,255,0)",
//     fontColor: "rgba(255,0,255,1)",
//     borderRadius: 8,
//   },
//   header: {
//     // Correct style for the header
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   email: {
//     color: "blue",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   phone: {
//     color: "rgba(48,64,80,1)",
//     fontSize: 16,
//     letterSpacing: 0.16,
//     fontWeight: "400",
//   },
// })

// export default ExperienceItemCard
