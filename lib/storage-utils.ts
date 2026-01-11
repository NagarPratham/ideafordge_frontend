/**
 * Utility functions for managing local storage of validation data
 */

export interface ValidationDataEntry {
  id: string
  timestamp: string
  formData: {
    startupName: string
    description: string
    problem: string
    solution: string
    targetMarket: string
    industry: string
    stage: string
  }
  analysisResult: any | null
}

const STORAGE_KEY = "ideaForgeValidationData"
const LATEST_KEY = "ideaForgeLatestData"

/**
 * Save validation data entry to localStorage
 */
export function saveValidationData(entry: ValidationDataEntry): void {
  try {
    const existingData = getAllValidationData()
    existingData.push(entry)
    
    // Keep only the last 50 entries to prevent localStorage overflow
    const recentData = existingData.slice(-50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentData))
    localStorage.setItem(LATEST_KEY, JSON.stringify(entry))
  } catch (error) {
    console.error("Error saving validation data:", error)
  }
}

/**
 * Get all stored validation data entries
 */
export function getAllValidationData(): ValidationDataEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading validation data:", error)
    return []
  }
}

/**
 * Get the latest validation data entry
 */
export function getLatestValidationData(): ValidationDataEntry | null {
  try {
    const data = localStorage.getItem(LATEST_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading latest validation data:", error)
    return null
  }
}

/**
 * Get validation data entry by ID
 */
export function getValidationDataById(id: string): ValidationDataEntry | null {
  const allData = getAllValidationData()
  return allData.find(entry => entry.id === id) || null
}

/**
 * Delete a validation data entry by ID
 */
export function deleteValidationData(id: string): void {
  try {
    const allData = getAllValidationData()
    const filteredData = allData.filter(entry => entry.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData))
    
    // If we deleted the latest entry, update latest to the most recent remaining entry
    const latestData = getLatestValidationData()
    if (latestData && latestData.id === id) {
      const sorted = filteredData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      if (sorted.length > 0) {
        localStorage.setItem(LATEST_KEY, JSON.stringify(sorted[0]))
      } else {
        localStorage.removeItem(LATEST_KEY)
      }
    }
  } catch (error) {
    console.error("Error deleting validation data:", error)
  }
}

/**
 * Clear all validation data
 */
export function clearAllValidationData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LATEST_KEY)
  } catch (error) {
    console.error("Error clearing validation data:", error)
  }
}
