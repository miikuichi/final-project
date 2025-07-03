// Test data parsing for debugging
const testRequestData = {
  id: 1,
  employeeId: 123,
  requestedBy: "John Smith",
  requestDate: "2025-01-01T10:00:00.000Z",
  status: "PENDING",
  reason: "Update contact information",
  originalData: JSON.stringify({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    department: "Engineering",
    position: "Software Developer"
  }),
  updatedData: JSON.stringify({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@newcompany.com",
    department: "Engineering",
    position: "Senior Software Developer"
  })
};

// Test the parsing function
const parseJsonData = (jsonString) => {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return {};
  }
};

console.log("Testing data parsing:");
console.log("Original data:", testRequestData.originalData);
console.log("Parsed original data:", parseJsonData(testRequestData.originalData));
console.log("Updated data:", testRequestData.updatedData);
console.log("Parsed updated data:", parseJsonData(testRequestData.updatedData));

export { testRequestData, parseJsonData };
