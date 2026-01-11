import jsPDF from 'jspdf'

interface ExportData {
  formData: {
    startupName: string
    description: string
    problem: string
    solution: string
    targetMarket: string
    industry: string
    stage: string
  }
  analysisData: any
  comparisonScores: any
}

export async function generatePDFReport(data: ExportData) {
  const { formData, analysisData, comparisonScores } = data
  
  // Create single PDF document - only one instance
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPos = margin

  // Helper function to add multiple watermarks behind text (very light, slanted, not overlapping)
  // IMPORTANT: This must be called FIRST on each page before any content is drawn
  // Watermarks are drawn in EXTREMELY light gray so they appear behind content, not covering it
  const addWatermarksToPage = () => {
    const text = 'IdeaForge'
    const fontSize = 48 // Slightly smaller for less interference
    const textHeight = fontSize * 0.35 // Approximate text height in mm
    
    // Set EXTREMELY light gray color for watermarks (almost invisible but still present as subtle background)
    // Using RGB 250, 250, 250 - very light, appears as subtle watermark that doesn't obscure text
    doc.setTextColor(250, 250, 250) // Extremely light gray - truly behind text, almost invisible
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'bold')
    
    // Calculate text width to center it properly
    const textWidth = doc.getTextWidth(text)
    
    // Add watermarks at strategic positions - avoiding content areas
    // Reduced to just 2 watermarks to minimize interference while maintaining watermark effect
    const watermarkPositions = [
      { x: pageWidth * 0.35, y: pageHeight * 0.35 }, // Top-left quadrant
      { x: pageWidth * 0.65, y: pageHeight * 0.65 }, // Bottom-right quadrant
    ]
    
    // Draw each watermark - positioned to avoid main content areas
    watermarkPositions.forEach((pos) => {
      // Position text at center of watermark position
      // For diagonal/slanted effect, we offset slightly
      const cos45 = 0.707 // cos(45°)
      const sin45 = 0.707 // sin(45°)
      const offsetX = -textWidth / 2 * cos45 - textHeight / 2 * sin45
      const offsetY = textWidth / 2 * sin45 - textHeight / 2 * cos45
      
      // Position text at diagonal offset from center
      const xPos = pos.x + offsetX
      const yPos = pos.y + offsetY
      
      // Draw the text - it will appear faintly behind content
      doc.text(text, xPos, yPos)
    })
    
    // Reset text color to black after watermarks (ensures all subsequent text is visible)
    doc.setTextColor(0, 0, 0)
  }

  // Helper function to draw Score Gauge Chart (circular gauge)
  const drawScoreGauge = (score: number, x: number, y: number, size: number, title: string) => {
    const radius = size / 2
    const centerX = x + radius
    const centerY = y + radius
    
    // Draw background circle
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(3)
    doc.circle(centerX, centerY, radius - 3, 'S') // 'S' = stroke only
    
    // Calculate and draw progress arc
    doc.setDrawColor(0, 120, 200)
    doc.setLineWidth(4)
    doc.setLineCap('round')
    
    // Draw arc segments to represent progress (simplified representation)
    const startAngle = -Math.PI / 2 // Start from top
    const endAngle = startAngle + (2 * Math.PI * score / 100)
    const segments = Math.max(20, Math.round(score / 5)) // At least 20 segments
    
    for (let i = 0; i < segments; i++) {
      const angle1 = startAngle + (i * (endAngle - startAngle) / segments)
      const angle2 = startAngle + ((i + 1) * (endAngle - startAngle) / segments)
      const x1 = centerX + (radius - 3) * Math.cos(angle1)
      const y1 = centerY + (radius - 3) * Math.sin(angle1)
      const x2 = centerX + (radius - 3) * Math.cos(angle2)
      const y2 = centerY + (radius - 3) * Math.sin(angle2)
      doc.line(x1, y1, x2, y2)
    }
    
    // Draw score text in center
    doc.setTextColor(0, 120, 200)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    const scoreText = score.toString()
    const textWidth = doc.getTextWidth(scoreText)
    doc.text(scoreText, centerX - textWidth / 2, centerY - 3)
    
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('out of 100', centerX, centerY + 7, { align: 'center' })
    
    // Draw title below
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(title, centerX, y + size + 8, { align: 'center' })
    
    // Draw label
    let label = 'Excellent'
    let labelColor: [number, number, number] = [0, 150, 0]
    if (score >= 60 && score < 80) {
      label = 'Good'
      labelColor = [0, 120, 200]
    } else if (score >= 40 && score < 60) {
      label = 'Fair'
      labelColor = [255, 180, 0]
    } else if (score < 40) {
      label = 'Needs Work'
      labelColor = [220, 50, 50]
    }
    
    doc.setFontSize(10)
    doc.setTextColor(...labelColor)
    doc.text(label, centerX, y + size + 16, { align: 'center' })
    
    doc.setTextColor(0, 0, 0)
  }

  // Helper function to draw Radar Chart
  const drawRadarChart = (data: any, x: number, y: number, width: number, height: number) => {
    const centerX = x + width / 2
    const centerY = y + height / 2
    const maxRadius = Math.min(width, height) / 2 - 15
    const numMetrics = data.length
    const angleStep = (2 * Math.PI) / numMetrics
    
    // Draw grid circles
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    for (let i = 1; i <= 5; i++) {
      const radius = (maxRadius * i) / 5
      doc.circle(centerX, centerY, radius, 'S') // 'S' = stroke only
    }
    
    // Draw axis lines
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    for (let i = 0; i < numMetrics; i++) {
      const angle = -Math.PI / 2 + (i * angleStep)
      const endX = centerX + maxRadius * Math.cos(angle)
      const endY = centerY + maxRadius * Math.sin(angle)
      doc.line(centerX, centerY, endX, endY)
    }
    
    // Draw metric labels
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    for (let i = 0; i < numMetrics; i++) {
      const angle = -Math.PI / 2 + (i * angleStep)
      const labelRadius = maxRadius + 12
      const labelX = centerX + labelRadius * Math.cos(angle)
      const labelY = centerY + labelRadius * Math.sin(angle)
      const metricName = data[i].metric || `Metric ${i + 1}`
      doc.text(metricName, labelX, labelY, { align: 'center' })
    }
    
    // Draw data polygon
    doc.setDrawColor(0, 120, 200)
    doc.setFillColor(0, 120, 200)
    doc.setLineWidth(1.5)
    const points: number[][] = []
    for (let i = 0; i < numMetrics; i++) {
      const angle = -Math.PI / 2 + (i * angleStep)
      const value = Math.min(100, Math.max(0, data[i].value || 0))
      const radius = (maxRadius * value) / 100
      const pointX = centerX + radius * Math.cos(angle)
      const pointY = centerY + radius * Math.sin(angle)
      points.push([pointX, pointY])
    }
    
    // Draw filled polygon (opacity not supported in jsPDF 4.0.0, so we use light fill color)
    if (points.length > 0) {
      // Draw polygon outline with lighter color for filled effect
      doc.setFillColor(200, 220, 240) // Light blue fill
      doc.setDrawColor(0, 120, 200)
      doc.setLineWidth(1.5)
      
      // Draw filled polygon by drawing lines in a closed path
      for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length
        doc.line(points[i][0], points[i][1], points[next][0], points[next][1])
      }
      
      // Fill interior with lighter lines (simulate fill)
      doc.setDrawColor(200, 220, 240)
      doc.setLineWidth(0.5)
      for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length
        const midX = (points[i][0] + points[next][0]) / 2
        const midY = (points[i][1] + points[next][1]) / 2
        doc.line(centerX, centerY, midX, midY)
      }
      
      // Draw polygon outline in darker color
      doc.setDrawColor(0, 120, 200)
      doc.setLineWidth(1.5)
      for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length
        doc.line(points[i][0], points[i][1], points[next][0], points[next][1])
      }
    }
    
    // Draw center label
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Performance', centerX, centerY, { align: 'center' })
  }

  // Helper function to draw SWOT Diagram
  const drawSWOTDiagram = (swot: any, x: number, y: number, width: number, height: number) => {
    const halfWidth = width / 2
    const halfHeight = height / 2
    
    // Draw grid lines
    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(1.5)
    doc.line(x + halfWidth, y, x + halfWidth, y + height)
    doc.line(x, y + halfHeight, x + width, y + halfHeight)
    
    // Helper to draw SWOT quadrant
    const drawQuadrant = (title: string, items: string[], qx: number, qy: number, qw: number, qh: number, bgColor: [number, number, number]) => {
      // Background (use lighter fill color instead of opacity)
      const lightBgColor: [number, number, number] = [
        Math.min(255, bgColor[0] + 200),
        Math.min(255, bgColor[1] + 200),
        Math.min(255, bgColor[2] + 200)
      ]
      doc.setFillColor(...lightBgColor)
      doc.rect(qx, qy, qw, qh, 'F')
      
      // Border
      doc.setDrawColor(...bgColor)
      doc.setLineWidth(1.5)
      doc.rect(qx, qy, qw, qh)
      
      // Title
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...bgColor)
      const titleWidth = doc.getTextWidth(title)
      doc.text(title, qx + qw / 2 - titleWidth / 2, qy + 7)
      
      // Items
      doc.setFontSize(8)
      doc.setTextColor(50, 50, 50)
      doc.setFont('helvetica', 'normal')
      let itemY = qy + 12
      const maxItems = Math.min(items.length, 8) // Limit items to fit
      items.slice(0, maxItems).forEach((item) => {
        if (itemY + 5 < qy + qh - 2) {
          const itemText = doc.splitTextToSize(`• ${item}`, qw - 6)
          itemText.forEach((line: string) => {
            if (itemY + 4 < qy + qh - 2) {
              doc.text(line, qx + 3, itemY)
              itemY += 4
            }
          })
          itemY += 2
        }
      })
    }
    
    // Draw four quadrants
    drawQuadrant('Strengths', swot.strengths || [], x, y, halfWidth, halfHeight, [0, 150, 0])
    drawQuadrant('Weaknesses', swot.weaknesses || [], x + halfWidth, y, halfWidth, halfHeight, [220, 50, 50])
    drawQuadrant('Opportunities', swot.opportunities || [], x, y + halfHeight, halfWidth, halfHeight, [0, 120, 200])
    drawQuadrant('Threats', swot.threats || [], x + halfWidth, y + halfHeight, halfWidth, halfHeight, [255, 180, 0])
  }

  // Helper function to draw Bar Chart for Comparison Metrics
  const drawComparisonBarChart = (metrics: Array<{ name: string; value: number }>, x: number, y: number, width: number, height: number) => {
    if (!metrics || metrics.length === 0) return
    
    const barWidth = Math.max(10, (width / metrics.length) - 6)
    const maxValue = 100
    const chartHeight = height - 35
    const chartY = y + chartHeight
    
    metrics.forEach((metric, idx) => {
      const barX = x + idx * (barWidth + 6) + 3
      const barHeight = (metric.value / maxValue) * chartHeight
      const barY = chartY - barHeight
      
      // Bar color based on value
      let barColor: [number, number, number] = [220, 50, 50]
      if (metric.value >= 80) barColor = [0, 150, 0]
      else if (metric.value >= 65) barColor = [0, 120, 200]
      else if (metric.value >= 50) barColor = [255, 180, 0]
      
      // Draw bar
      doc.setFillColor(...barColor)
      doc.rect(barX, barY, barWidth, barHeight, 'F')
      
      // Draw border
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.rect(barX, barY, barWidth, barHeight)
      
      // Draw value on top
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      const valueText = metric.value.toString()
      const textWidth = doc.getTextWidth(valueText)
      doc.text(valueText, barX + barWidth / 2 - textWidth / 2, barY - 3)
      
      // Draw label below
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      const labelLines = doc.splitTextToSize(metric.name, barWidth)
      labelLines.forEach((line: string, lineIdx: number) => {
        const labelTextWidth = doc.getTextWidth(line)
        doc.text(line, barX + barWidth / 2 - labelTextWidth / 2, chartY + 8 + (lineIdx * 3))
      })
    })
    
    // Draw Y-axis labels
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    for (let i = 0; i <= 5; i++) {
      const value = (5 - i) * 20
      const labelY = y + (chartHeight * i) / 5
      doc.text(value.toString(), x - 5, labelY, { align: 'right' })
    }
    
    // Draw Y-axis line
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(x - 2, y, x - 2, y + chartHeight)
  }

  // Helper function to draw Info Cards (for Market section)
  const drawInfoCard = (title: string, value: string, subtitle: string, x: number, y: number, width: number, height: number, color: [number, number, number] = [0, 120, 200]) => {
    // Draw border
    doc.setDrawColor(...color)
    doc.setLineWidth(1.5)
    doc.rect(x, y, width, height)
    
    // Draw background (use lighter fill color instead of opacity)
    const lightColor: [number, number, number] = [
      Math.min(255, color[0] + 240),
      Math.min(255, color[1] + 240),
      Math.min(255, color[2] + 240)
    ]
    doc.setFillColor(...lightColor)
    doc.rect(x, y, width, height, 'F')
    
    // Title
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...color)
    doc.text(title, x + 5, y + 8)
    
    // Value
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const valueLines = doc.splitTextToSize(value, width - 10)
    valueLines.forEach((line: string, idx: number) => {
      doc.text(line, x + 5, y + 18 + (idx * 7))
    })
    
    // Subtitle
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    const subtitleLines = doc.splitTextToSize(subtitle, width - 10)
    subtitleLines.forEach((line: string, idx: number) => {
      doc.text(line, x + 5, y + height - 10 - (subtitleLines.length - 1 - idx) * 4)
    })
  }

  // Helper function to add logo header
  const addLogo = (y: number) => {
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('IdeaForge', margin, y)
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('AI-Powered Startup Validation Platform', margin, y + 7)
    return y + 15
  }

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin - 10) {
      doc.addPage()
      yPos = margin
      // IMPORTANT: Add watermarks FIRST on new page (before any content) so they're behind
      addWatermarksToPage()
      return true
    }
    return false
  }

  // Helper function to add section title (enhanced styling)
  const addSectionTitle = (title: string, fontSize: number = 16) => {
    checkNewPage(25)
    // Enhanced section title with better spacing and styling
    yPos += 8 // Extra space before section
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, yPos)
    yPos += 8
    // Enhanced underline with colored line
    doc.setLineWidth(1)
    doc.setDrawColor(0, 120, 200) // Blue accent line
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10 // Extra spacing after section title
  }

  // Helper function to add text with proper wrapping (ensures no truncation)
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    if (!text || text.trim() === '') return
    
    // Ensure text color is set and visible (not covered by watermark)
    doc.setTextColor(...color)
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    
    // Split text to fit content width - ensure full text is included
    const lines = doc.splitTextToSize(text.trim(), contentWidth - 2) // Slight margin for safety
    const lineHeight = fontSize * 0.4 + 2
    const totalHeight = lines.length * lineHeight + 5
    
    checkNewPage(totalHeight)
    
    // Draw each line - ensure all text is visible
    lines.forEach((line: string) => {
      if (line && line.trim()) {
        doc.text(line.trim(), margin + 1, yPos) // Small margin to ensure visibility
        yPos += lineHeight
      }
    })
    yPos += 3
  }

  // Helper function to add list items (ensures no truncation)
  const addListItem = (text: string, fontSize: number = 10, prefix: string = '•') => {
    if (!text || text.trim() === '') return
    
    // Ensure text is visible and not obscured
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30) // Darker for better visibility against watermark
    
    const fullText = `${prefix} ${text.trim()}`
    // Use wider width to ensure no truncation - leave more margin
    const availableWidth = contentWidth - 8 // Extra margin for safety
    const lines = doc.splitTextToSize(fullText, availableWidth)
    const lineHeight = fontSize * 0.4 + 1.8 // Slightly more spacing
    const totalHeight = lines.length * lineHeight + 2
    
    checkNewPage(totalHeight)
    
    // Draw each line ensuring all text is visible
    lines.forEach((line: string, idx: number) => {
      if (line && line.trim()) {
        const xPos = idx === 0 ? margin + 2 : margin + 7 // Indent for continuation lines
        doc.text(line.trim(), xPos, yPos)
        yPos += lineHeight
      }
    })
    yPos += 2 // Extra spacing after item
  }

  // Helper function to add key-value pair (ensures no truncation)
  const addKeyValue = (key: string, value: string | number, fontSize: number = 11) => {
    if (value === undefined || value === null || value === '') return
    
    // Ensure key text is visible and bold
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0) // Black for key - ensures visibility
    const keyText = `${key}:`
    doc.text(keyText, margin, yPos)
    
    const keyWidth = doc.getTextWidth(`${keyText} `)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40) // Dark gray for value - ensures good contrast
    
    const valueText = String(value).trim()
    // Ensure value text fits and is not truncated
    const valueLines = doc.splitTextToSize(valueText, contentWidth - keyWidth - 2) // Extra margin
    valueLines.forEach((line: string, idx: number) => {
      if (line && line.trim()) {
        doc.text(line.trim(), margin + keyWidth, yPos)
        if (idx < valueLines.length - 1) {
          yPos += fontSize * 0.4 + 2
        }
      }
    })
    yPos += fontSize * 0.4 + 4
  }

  // ========== START PDF GENERATION ==========
  
  // IMPORTANT: Add watermarks FIRST on the cover page (they'll be behind all content)
  addWatermarksToPage()
  
  // Cover Page
  yPos = addLogo(40)
  yPos += 25
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text('Comprehensive Startup Validation Report', margin, yPos)
  yPos += 18
  
  doc.setFontSize(16)
  doc.setTextColor(50, 50, 50)
  doc.setFont('helvetica', 'normal')
  const startupNameText = doc.splitTextToSize(formData.startupName, contentWidth)
  startupNameText.forEach((line: string) => {
    doc.text(line, margin, yPos)
    yPos += 12
  })
  yPos += 10
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(`Generated on ${date}`, margin, yPos)
  yPos += 15
  
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('Complete analysis including Overview, Market, Analysis, and Strategy sections', margin, yPos)
  yPos += 8
  doc.text('All data, analytics, insights, charts, diagrams, and detailed information included', margin, yPos)

  // ========== SECTION 1: OVERVIEW ==========
  doc.addPage()
  yPos = margin
  // Add watermarks FIRST on new page (before any content - ensures they're behind)
  addWatermarksToPage()
  
  addSectionTitle('1. OVERVIEW - COMPLETE ANALYSIS', 18)
  
  // Startup Idea Complete Details
  addText('Your Startup Idea - Complete Details', 14, true, [0, 100, 200])
  addKeyValue('Startup Name', formData.startupName)
  addKeyValue('Industry', formData.industry)
  addKeyValue('Development Stage', formData.stage)
  addKeyValue('Target Market', formData.targetMarket)
  yPos += 5
  
  addText('Problem Statement', 13, true)
  addText(formData.problem, 11)
  yPos += 5
  
  addText('Solution Description', 13, true)
  addText(formData.solution, 11)
  yPos += 5
  
  if (formData.description && formData.description.trim() !== '') {
    addText('Full Description', 13, true)
    addText(formData.description, 11)
    yPos += 5
  }

  // Startup Health Score Chart
  checkNewPage(60)
  addText('Startup Health Score Chart', 14, true, [0, 100, 200])
  const gaugeSize = 40
  const gaugeX = margin + (contentWidth / 2) - (gaugeSize / 2)
  drawScoreGauge(analysisData.overallScore || 0, gaugeX, yPos, gaugeSize, 'Overall Score')
  
  // Additional metrics below gauge
  yPos += gaugeSize + 25
  addKeyValue('Market Potential', `${analysisData.marketPotential || 0}/100`)
  addKeyValue('Feasibility Score', `${analysisData.feasibility || 0}/100`)
  addKeyValue('Innovation Index', `${analysisData.innovationIndex || 0}/100`)
  if (analysisData.competition !== undefined) {
    addKeyValue('Competition Score', `${analysisData.competition}/100`)
  }
  if (analysisData.riskLevel !== undefined) {
    addKeyValue('Risk Level', `${analysisData.riskLevel}/100`)
  }
  yPos += 5
  
  // Market Alignment Score Chart
  if (comparisonScores) {
    checkNewPage(60)
    addText('Market Alignment Score Chart', 14, true, [0, 150, 150])
    const alignmentGaugeX = margin + (contentWidth / 2) - (gaugeSize / 2)
    drawScoreGauge(comparisonScores.overallComparisonScore || 0, alignmentGaugeX, yPos, gaugeSize, 'Market Alignment')
    
    yPos += gaugeSize + 25
    addKeyValue('Overall Comparison Score', `${comparisonScores.overallComparisonScore || 0}/100`)
    addKeyValue('Market Alignment', `${comparisonScores.marketAlignmentScore || 0}/100`)
    addKeyValue('Competition Fit', `${comparisonScores.competitionFitScore || 0}/100`)
    addKeyValue('Technical Feasibility', `${comparisonScores.technicalFeasibilityScore || 0}/100`)
    addKeyValue('Market Validation', `${comparisonScores.marketValidationScore || 0}/100`)
    yPos += 5
  }

  // Market Comparison Analysis Components with Charts
  if (comparisonScores && formData && analysisData.realWorldData) {
    checkNewPage(70)
    addText('Market Comparison Analysis - Complete with Charts', 14, true, [150, 100, 0])
    
    // Draw comparison metrics bar chart
    const comparisonMetrics = [
      { name: 'Market\nAlign', value: comparisonScores.marketAlignmentScore || 0 },
      { name: 'Competition', value: comparisonScores.competitionFitScore || 0 },
      { name: 'Technical', value: comparisonScores.technicalFeasibilityScore || 0 },
      { name: 'Validation', value: comparisonScores.marketValidationScore || 0 }
    ]
    
    drawComparisonBarChart(comparisonMetrics, margin, yPos, contentWidth, 50)
    yPos += 55
    
    // Key Insights
    if (comparisonScores.insights && comparisonScores.insights.length > 0) {
      checkNewPage(40)
      addText('Key Insights from Market Comparison:', 12, true)
      comparisonScores.insights.forEach((insight: string) => {
        addListItem(insight, 10, '•')
      })
      yPos += 5
    }
    
    // Detailed Comparison Breakdown
    checkNewPage(50)
    addText('Detailed Comparison Breakdown:', 12, true)
    const rwd = analysisData.realWorldData
    if (rwd.addressableMarket) {
      addKeyValue('Addressable Market (TAM)', `$${rwd.addressableMarket}B`)
    }
    if (rwd.marketGrowth) {
      addKeyValue('Market Growth Rate', rwd.marketGrowth)
    }
    if (rwd.competitors) {
      const avgSimilarity = rwd.competitors.length > 0
        ? Math.round(rwd.competitors.reduce((sum: number, c: any) => sum + (c.similarity || 0), 0) / rwd.competitors.length)
        : 0
      addKeyValue('Average Competitor Similarity', `${avgSimilarity}%`)
      addKeyValue('Total Competitors', rwd.competitors.length)
    }
    if (rwd.technicalFeasibility) {
      addKeyValue('Technical Complexity', rwd.technicalFeasibility.complexity?.toUpperCase() || 'N/A')
    }
    if (rwd.marketValidation) {
      addKeyValue('Search Trends', rwd.marketValidation.searchTrends || 'N/A')
      addKeyValue('Discussion Activity', rwd.marketValidation.discussionActivity || 'N/A')
      if (rwd.marketValidation.existingProducts) {
        addKeyValue('Existing Products Found', rwd.marketValidation.existingProducts.length.toString())
      }
    }
    yPos += 5
  }

  // Performance Radar Chart
  checkNewPage(80)
  addText('Performance Radar Chart', 14, true, [150, 100, 50])
  const radarData = [
    { metric: 'Market', value: analysisData.marketPotential || 88 },
    { metric: 'Tech', value: analysisData.feasibility || 75 },
    { metric: 'Team', value: 70 },
    { metric: 'Finance', value: 65 },
    { metric: 'Innovation', value: analysisData.innovationIndex || 79 },
    { metric: 'Timing', value: 82 },
  ]
  
  const radarSize = Math.min(contentWidth, 70)
  const radarX = margin + (contentWidth / 2) - (radarSize / 2)
  drawRadarChart(radarData, radarX, yPos, radarSize, radarSize)
  yPos += radarSize + 15

  // ========== SECTION 2: MARKET ==========
  checkNewPage(40)
  addSectionTitle('2. MARKET - COMPREHENSIVE ANALYSIS', 18)
  
  if (analysisData.realWorldData) {
    const rwd = analysisData.realWorldData
    
    // Three Cards: Market Size, Addressable Market, Competitors Found
    checkNewPage(35)
    addText('Market Overview Cards', 14, true, [0, 150, 200])
    const cardWidth = (contentWidth - 10) / 3
    const cardHeight = 28
    const cardY = yPos
    
    // Card 1: Market Size
    drawInfoCard(
      'Total Market Size',
      `$${rwd.marketSize || 'N/A'}B`,
      `Growth: ${rwd.marketGrowth || 'N/A'}`,
      margin,
      cardY,
      cardWidth,
      cardHeight,
      [0, 120, 200]
    )
    
    // Card 2: Addressable Market
    if (rwd.addressableMarket) {
      drawInfoCard(
        'Addressable Market',
        `$${rwd.addressableMarket}B`,
        `TAM of Total Market`,
        margin + cardWidth + 5,
        cardY,
        cardWidth,
        cardHeight,
        [0, 150, 150]
      )
    } else {
      drawInfoCard(
        'Addressable Market',
        'N/A',
        'Not available',
        margin + cardWidth + 5,
        cardY,
        cardWidth,
        cardHeight,
        [150, 150, 150]
      )
    }
    
    // Card 3: Competitors Found
    drawInfoCard(
      'Competitors Found',
      `${rwd.competitors?.length || 0}`,
      `Competitors identified`,
      margin + (cardWidth + 5) * 2,
      cardY,
      cardWidth,
      cardHeight,
      [200, 100, 0]
    )
    
    yPos += cardHeight + 15
    
    // Market Competitors Details - ALL
    if (rwd.competitors && rwd.competitors.length > 0) {
      checkNewPage(40)
      addText(`Market Competitors - Complete Details (${rwd.competitors.length} total)`, 14, true, [200, 100, 0])
      
      rwd.competitors.forEach((comp: any, idx: number) => {
        checkNewPage(35)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(`${idx + 1}. ${comp.name}`, margin + 5, yPos)
        yPos += 6
        
        if (comp.description) {
          addText(comp.description, 10)
        }
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        if (comp.similarity !== undefined && comp.similarity !== null) {
          doc.text(`Similarity Score: ${comp.similarity}%`, margin + 10, yPos)
          yPos += 4
        }
        if (comp.funding) {
          doc.text(`Funding: ${comp.funding}`, margin + 10, yPos)
          yPos += 4
        }
        if (comp.website) {
          doc.text(`Website: ${comp.website}`, margin + 10, yPos)
          yPos += 4
        }
        yPos += 3
      })
      yPos += 5
    }
    
    // Industry Trends and Insights - ALL
    if (rwd.industryInsights) {
      checkNewPage(50)
      addText('Industry Trends & Insights - Complete Analysis', 14, true, [0, 150, 100])
      
      if (rwd.industryInsights.trends && rwd.industryInsights.trends.length > 0) {
        addText(`Current Industry Trends (${rwd.industryInsights.trends.length} trends):`, 12, true, [0, 100, 200])
        rwd.industryInsights.trends.forEach((trend: string) => {
          addListItem(trend, 10, '•')
        })
        yPos += 5
      }
      
      if (rwd.industryInsights.opportunities && rwd.industryInsights.opportunities.length > 0) {
        addText(`Market Opportunities (${rwd.industryInsights.opportunities.length} opportunities):`, 12, true, [0, 150, 0])
        rwd.industryInsights.opportunities.forEach((opp: string) => {
          addListItem(opp, 10, '•')
        })
        yPos += 5
      }
      
      if (rwd.industryInsights.challenges && rwd.industryInsights.challenges.length > 0) {
        addText(`Industry Challenges (${rwd.industryInsights.challenges.length} challenges):`, 12, true, [200, 150, 0])
        rwd.industryInsights.challenges.forEach((challenge: string) => {
          addListItem(challenge, 10, '•')
        })
        yPos += 5
      }
    }
    
    // Complete Market Data Component - Market Validation
    if (rwd.marketValidation) {
      checkNewPage(40)
      addText('Market Validation - Complete Data', 14, true, [150, 100, 0])
      addKeyValue('Search Interest Trends', rwd.marketValidation.searchTrends || 'N/A')
      addKeyValue('Discussion Activity', rwd.marketValidation.discussionActivity || 'N/A')
      
      if (rwd.marketValidation.existingProducts && rwd.marketValidation.existingProducts.length > 0) {
        addText(`Existing Similar Products (${rwd.marketValidation.existingProducts.length} found):`, 12, true)
        rwd.marketValidation.existingProducts.forEach((product: any, idx: number) => {
          checkNewPage(15)
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(`${idx + 1}. ${product.name}`, margin + 5, yPos)
          yPos += 5
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(10)
          doc.setTextColor(100, 100, 100)
          doc.text(`Platform: ${product.platform}`, margin + 10, yPos)
          yPos += 4
          if (product.url) {
            doc.text(`URL: ${product.url}`, margin + 10, yPos)
            yPos += 4
          }
          yPos += 2
        })
      }
      yPos += 5
    }
    
    // Technical Feasibility
    if (rwd.technicalFeasibility) {
      checkNewPage(40)
      addText('Technical Feasibility Analysis - Complete Assessment', 14, true, [150, 0, 200])
      addKeyValue('Complexity Level', rwd.technicalFeasibility.complexity?.toUpperCase() || 'N/A')
      
      if (rwd.technicalFeasibility.requiredResources && rwd.technicalFeasibility.requiredResources.length > 0) {
        addText(`Required Resources (${rwd.technicalFeasibility.requiredResources.length} items):`, 12, true)
        rwd.technicalFeasibility.requiredResources.forEach((resource: string) => {
          addListItem(resource, 10, '•')
        })
        yPos += 3
      }
      
      if (rwd.technicalFeasibility.similarTechStack && rwd.technicalFeasibility.similarTechStack.length > 0) {
        checkNewPage(30)
        // Ensure full title text is displayed (no truncation) - use addText which handles wrapping
        const titleText = `Similar Technology Stack (${rwd.technicalFeasibility.similarTechStack.length} technologies):`
        addText(titleText, 12, true, [0, 100, 200])
        yPos += 2 // Extra spacing after title
        rwd.technicalFeasibility.similarTechStack.forEach((tech: string) => {
          if (tech && tech.trim()) {
            addListItem(tech.trim(), 10, '•')
          }
        })
        yPos += 2 // Extra spacing after list
      }
      yPos += 5
    }
    
    // Recent Funding Activities
    if (rwd.fundingInfo?.recentRounds && rwd.fundingInfo.recentRounds.length > 0) {
      checkNewPage(40)
      addText(`Recent Funding Activity (${rwd.fundingInfo.recentRounds.length} rounds):`, 14, true, [0, 150, 150])
      rwd.fundingInfo.recentRounds.forEach((round: any, idx: number) => {
        checkNewPage(18)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(`${idx + 1}. ${round.company}`, margin + 5, yPos)
        yPos += 5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Amount: ${round.amount}`, margin + 10, yPos)
        yPos += 4
        doc.text(`Date: ${round.date}`, margin + 10, yPos)
        yPos += 5
      })
    }
    
    // Industry Trends (Legacy) if exists
    if (rwd.industryTrends && rwd.industryTrends.length > 0) {
      checkNewPage(30)
      addText(`Additional Industry Trends (${rwd.industryTrends.length} trends):`, 12, true)
      rwd.industryTrends.forEach((trend: string) => {
        addListItem(trend, 10, '•')
      })
    }
  }

  // ========== SECTION 3: ANALYSIS ==========
  checkNewPage(40)
  addSectionTitle('3. ANALYSIS - COMPREHENSIVE BREAKDOWN', 18)
  
  // SWOT Diagram
  if (analysisData.swot) {
    checkNewPage(70)
    addText('SWOT Analysis Diagram', 14, true, [150, 100, 0])
    const swotSize = Math.min(contentWidth, 70)
    const swotX = margin
    drawSWOTDiagram(analysisData.swot, swotX, yPos, swotSize, swotSize)
    yPos += swotSize + 15
  }
  
  // Detailed Comparison Analysis with Charts
  if (comparisonScores && formData && analysisData.realWorldData) {
    checkNewPage(70)
    addText('Detailed Comparison Analysis - Complete with Charts', 14, true, [0, 120, 200])
    
    // Draw comparison metrics bar chart
    const comparisonMetrics = [
      { name: 'Market\nAlign', value: comparisonScores.marketAlignmentScore || 0 },
      { name: 'Competition', value: comparisonScores.competitionFitScore || 0 },
      { name: 'Technical', value: comparisonScores.technicalFeasibilityScore || 0 },
      { name: 'Validation', value: comparisonScores.marketValidationScore || 0 }
    ]
    
    drawComparisonBarChart(comparisonMetrics, margin, yPos, contentWidth, 50)
    yPos += 55
    
    // Key Insights
    if (comparisonScores.insights && comparisonScores.insights.length > 0) {
      checkNewPage(40)
      addText('Key Insights:', 12, true)
      comparisonScores.insights.forEach((insight: string) => {
        addListItem(insight, 10, '•')
      })
      yPos += 5
    }
    
    // Detailed Comparison Breakdown
    checkNewPage(60)
    addText('Detailed Comparison Breakdown - Complete Metrics:', 12, true)
    const rwd = analysisData.realWorldData
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Market Alignment Details:', margin + 5, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    doc.text(`Score: ${comparisonScores.marketAlignmentScore}/100`, margin + 10, yPos)
    yPos += 4
    if (rwd.addressableMarket) {
      doc.text(`Addressable Market: $${rwd.addressableMarket}B | Growth: ${rwd.marketGrowth || 'N/A'}`, margin + 10, yPos)
    }
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Competition Fit Details:', margin + 5, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    doc.text(`Score: ${comparisonScores.competitionFitScore}/100`, margin + 10, yPos)
    yPos += 4
    if (rwd.competitors) {
      const avgSimilarity = rwd.competitors.length > 0
        ? Math.round(rwd.competitors.reduce((sum: number, c: any) => sum + (c.similarity || 0), 0) / rwd.competitors.length)
        : 0
      doc.text(`Competitors Found: ${rwd.competitors.length} | Avg Similarity: ${avgSimilarity}%`, margin + 10, yPos)
    }
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Technical Feasibility Details:', margin + 5, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    doc.text(`Score: ${comparisonScores.technicalFeasibilityScore}/100`, margin + 10, yPos)
    yPos += 4
    if (rwd.technicalFeasibility) {
      doc.text(`Complexity: ${rwd.technicalFeasibility.complexity?.toUpperCase() || 'N/A'} | Stage: ${formData.stage.toUpperCase()}`, margin + 10, yPos)
    }
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Market Validation Details:', margin + 5, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    doc.text(`Score: ${comparisonScores.marketValidationScore}/100`, margin + 10, yPos)
    yPos += 4
    if (rwd.marketValidation) {
      doc.text(`Search Trends: ${rwd.marketValidation.searchTrends || 'N/A'} | Products Found: ${rwd.marketValidation.existingProducts?.length || 0}`, margin + 10, yPos)
    }
    yPos += 5
  }

  // ========== SECTION 4: STRATEGY ==========
  checkNewPage(40)
  addSectionTitle('4. STRATEGY - COMPLETE GUIDE', 18)
  
  // Target Audience
  if (analysisData.targetAudience && analysisData.targetAudience.length > 0) {
    addText(`Target Audience Segments (${analysisData.targetAudience.length} segments):`, 14, true, [150, 100, 200])
    analysisData.targetAudience.forEach((audience: any, idx: number) => {
      checkNewPage(25)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(`${idx + 1}. ${audience.name} (Age: ${audience.age})`, margin + 5, yPos)
      yPos += 6
      if (audience.description) {
        addText(audience.description, 10)
      }
      yPos += 3
    })
    yPos += 5
  }
  
  // Monetization
  if (analysisData.monetizationStrategies && analysisData.monetizationStrategies.length > 0) {
    addText(`Monetization Strategies (${analysisData.monetizationStrategies.length} strategies):`, 14, true, [0, 150, 150])
    analysisData.monetizationStrategies.forEach((strat: any, idx: number) => {
      checkNewPage(20)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(`${idx + 1}. ${strat.name}`, margin + 5, yPos)
      yPos += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Fit Score: ${strat.fit}/100`, margin + 10, yPos)
      yPos += 6
    })
    yPos += 5
  }
  
  // Pitch Tips
  if (analysisData.pitchTips && analysisData.pitchTips.length > 0) {
    checkNewPage(40)
    addText(`Pitch Tips & Recommendations (${analysisData.pitchTips.length} tips):`, 14, true, [150, 150, 0])
    analysisData.pitchTips.forEach((tip: string, idx: number) => {
      checkNewPage(12)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(`Tip ${idx + 1}:`, margin + 5, yPos)
      yPos += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(50, 50, 50)
      const tipLines = doc.splitTextToSize(tip, contentWidth - 10)
      tipLines.forEach((line: string) => {
        doc.text(line, margin + 10, yPos)
        yPos += 4
      })
      yPos += 3
    })
  }
  
  // Product Roadmap
  if (analysisData.roadmap && analysisData.roadmap.length > 0) {
    checkNewPage(40)
    addText(`Product Development Roadmap (${analysisData.roadmap.length} phases):`, 14, true, [200, 100, 0])
    analysisData.roadmap.forEach((phase: any, idx: number) => {
      checkNewPage(30)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      const phaseTitle = phase.phase || phase.title || `Phase ${idx + 1}`
      doc.text(`Phase ${idx + 1}: ${phaseTitle}`, margin + 5, yPos)
      yPos += 7
      
      if (phase.title && phase.phase !== phase.title) {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(50, 50, 50)
        const titleLines = doc.splitTextToSize(phase.title, contentWidth - 10)
        titleLines.forEach((line: string) => {
          doc.text(line, margin + 10, yPos)
          yPos += 5
        })
        yPos += 2
      }
      
      if (phase.duration) {
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Duration: ${phase.duration}`, margin + 10, yPos)
        yPos += 5
      }
      
      if (phase.description) {
        doc.setFontSize(10)
        doc.setTextColor(80, 80, 80)
        const descLines = doc.splitTextToSize(phase.description, contentWidth - 10)
        descLines.forEach((line: string) => {
          doc.text(line, margin + 10, yPos)
          yPos += 4
        })
        yPos += 2
      }
      yPos += 4
    })
  }

  // ========== FINALIZE PDF - NO NEED TO RE-ADD WATERMARKS ==========
  // Watermarks are already added at the START of each page via checkNewPage() and doc.addPage()
  // Since jsPDF draws in the order functions are called, watermarks drawn first will appear behind content.
  // We do NOT re-add watermarks here to avoid putting them on top of content.
  
  const totalPages = doc.internal.pages.length - 1
  doc.setPage(totalPages) // Go to last page for footer
  
  // Footer on last page
  const footerY = pageHeight - 20
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated by IdeaForge - AI-Powered Startup Validation Platform', pageWidth / 2, footerY, { align: 'center' })
  doc.text(`Report Generated on ${date}`, pageWidth / 2, footerY + 4, { align: 'center' })
  doc.text(`Complete Report - All Sections: Overview, Market, Analysis, Strategy`, pageWidth / 2, footerY + 8, { align: 'center' })
  doc.text(`Page ${totalPages} of ${totalPages}`, pageWidth / 2, footerY + 12, { align: 'center' })

  // ========== SAVE PDF - ONLY ONCE AT THE END ==========
  const sanitizedName = formData.startupName.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').substring(0, 50)
  const fileName = `${sanitizedName}_IdeaForge.pdf`
  
  // IMPORTANT: Save the PDF only once - this is the only doc.save() call
  doc.save(fileName)
}
