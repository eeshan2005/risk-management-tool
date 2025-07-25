/**
 * Mapping between CSV headers (used in UI) and database column names (snake_case)
 */
export const csvToDbColumnMap: Record<string, string> = {
  "Sr#": "sr_no",
  "Business Process": "business_process",
  "Date Risk Identified": "date_risk_identified",
  "Risk Description": "risk_description",
  "Threats": "threats",
  "Vulnerabilities": "vulnerabilities",
  "Existing Controls": "existing_controls",
  "Risk Owner": "risk_owner",
  "Controls / Clause No": "controls_clause_no",
  "ISO 27001: 2022 Controls Reference": "iso_27001_2022_controls_reference",
  "Confidentiality": "confidentiality",
  "Integrity": "integrity",
  "Availability": "availability",
  "Max CIA Value": "max_cia_value",
  "Vulnerability Rating": "vulnerability_rating",
  "Threat Frequency": "threat_frequency",
  "Threat Impact": "threat_impact",
  "Threat Value": "threat_value",
  "Risk Value": "risk_value",
  "Planned Mitigation Completion Date": "planned_mitigation_completion_date",
  "Risk Treatment Action": "risk_treatment_action",
  "Revised Vulnerability Rating": "revised_vulnerability_rating",
  "Revised Threat Frequency": "revised_threat_frequency",
  "Revised Threat Impact": "revised_threat_impact",
  "Revised Threat Value": "revised_threat_value",
  "Revised Risk Value": "revised_risk_value",
  "Actual Mitigation Completion Date": "actual_mitigation_completion_date",
  "Risk Treatment Option": "risk_treatment_option"
};

/**
 * Maps CSV data to database column format
 * @param data The CSV data with UI-friendly headers
 * @returns The same data with database-friendly column names
 */
export function mapCsvDataToDbColumns(data: Record<string, any>): Record<string, any> {
  const mappedData: Record<string, any> = {};
  
  // Map known fields using the mapping dictionary
  Object.entries(data).forEach(([key, value]) => {
    if (csvToDbColumnMap[key]) {
      mappedData[csvToDbColumnMap[key]] = value;
    } else {
      // Keep original key for any fields not in the mapping
      mappedData[key] = value;
    }
  });
  
  return mappedData;
}

/**
 * Create a reverse mapping from DB columns to CSV headers
 */
export const dbColumnToCsvMap: Record<string, string> = Object.entries(csvToDbColumnMap).reduce(
  (acc, [csvHeader, dbColumn]) => {
    acc[dbColumn] = csvHeader;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Maps database column data to CSV header format
 * @param data The database data with snake_case column names
 * @returns The same data with UI-friendly headers
 */
export function mapDbColumnsToCsvData(data: Record<string, any>): Record<string, any> {
  const mappedData: Record<string, any> = {};
  
  // Map known fields using the reverse mapping dictionary
  Object.entries(data).forEach(([key, value]) => {
    if (dbColumnToCsvMap[key]) {
      mappedData[dbColumnToCsvMap[key]] = value;
    } else {
      // Keep original key for any fields not in the mapping
      mappedData[key] = value;
    }
  });
  
  return mappedData;
}