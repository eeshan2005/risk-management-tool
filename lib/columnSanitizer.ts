// Utility to sanitize column names for Supabase compatibility
export const sanitizeColumnName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
};

// Specific mapping for known problematic columns
const COLUMN_MAPPING: Record<string, string> = {
  "Sr#": "sr_no",
  "Business Process": "business_process",
  "Date Risk Identified": "date_risk_identified",
  "Risk Description": "risk_description",
  Threats: "threats",
  Vulnerabilities: "vulnerabilities",
  "Existing Controls": "existing_controls",
  "Risk Owner": "risk_owner",
  "Controls / Clause No": "controls_clause_no",
  "ISO 27001: 2022 Controls Reference": "iso_27001_2022_controls_reference",
  Confidentiality: "confidentiality",
  Integrity: "integrity",
  Availability: "availability",
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
  "Risk Treatment Option": "risk_treatment_option",
};

// Date column names that should be cleaned
const DATE_COLUMNS = [
  "date_risk_identified",
  "planned_mitigation_completion_date",
  "actual_mitigation_completion_date",
  "target_date",
  "due_date",
];

// Integer column names that should be cleaned
const INTEGER_COLUMNS = [
  "confidentiality",
  "integrity",
  "availability",
  "vulnerability_rating",
  "threat_frequency",
  "threat_impact",
  "max_cia_value",
  "threat_value",
  "risk_value",
  "revised_vulnerability_rating",
  "revised_threat_frequency",
  "revised_threat_impact",
  "revised_threat_value",
  "revised_risk_value",
];

// Clean date values - convert invalid dates to null
const cleanDateValue = (value: any): string | null => {
  if (!value) return null;

  const stringValue = String(value).trim();

  // List of invalid date representations including dash character
  const invalidDates = [
    "NA",
    "N/A",
    "na",
    "n/a",
    "NULL",
    "null",
    "",
    "undefined",
    "-",
  ];

  if (invalidDates.includes(stringValue.toLowerCase()) || stringValue === "") {
    return null;
  }

  return stringValue;
};

// Clean integer values - convert invalid integers to null
const cleanIntegerValue = (value: any): number | null => {
  if (!value) return null;

  const stringValue = String(value).trim();

  // List of invalid integer representations including dash character
  const invalidIntegers = [
    "NA",
    "N/A",
    "na",
    "n/a",
    "NULL",
    "null",
    "",
    "undefined",
    "-",
  ];

  if (
    invalidIntegers.includes(stringValue.toLowerCase()) ||
    stringValue === ""
  ) {
    return null;
  }

  const num = Number(stringValue);
  return isNaN(num) ? null : num;
};

// Map raw CSV data to sanitized column names
export const sanitizeDataForSupabase = (data: any[]): any[] => {
  if (!data || data.length === 0) return data;

  return data.map((row) => {
    const sanitizedRow: any = {};
    Object.keys(row).forEach((key) => {
      // Use specific mapping if available, otherwise sanitize
      const sanitizedKey = COLUMN_MAPPING[key] || sanitizeColumnName(key);

      let value = row[key];

      // Handle null/undefined values
      if (value === null || value === undefined || value === "") {
        value = null;
      }

      // Special handling for date columns
      if (DATE_COLUMNS.includes(sanitizedKey)) {
        value = cleanDateValue(value);
      }

      // Special handling for integer columns
      if (INTEGER_COLUMNS.includes(sanitizedKey)) {
        value = cleanIntegerValue(value);
      }

      sanitizedRow[sanitizedKey] = value;
    });
    return sanitizedRow;
  });
};

// Get mapping of original column names to sanitized names
export const getColumnMapping = (
  originalHeaders: string[],
): Record<string, string> => {
  const mapping: Record<string, string> = {};
  originalHeaders.forEach((header) => {
    mapping[header] = COLUMN_MAPPING[header] || sanitizeColumnName(header);
  });
  return mapping;
};
