export interface BugExportData {
  publicId: string
  title: string
  affectedModule: string
  stepsToReproduce: string
  expectedBehavior: string
  actualBehavior: string
  severity: string
  deadline: string
  environment: string
  customerId?: string
}

/**
 * Generates a ClickUp-formatted Markdown block from bug report data.
 * The output is suitable for pasting directly into a ClickUp task description.
 */
export function generateClickUpMarkdown(bug: BugExportData): string {
  const severityLabel =
    bug.severity.charAt(0).toUpperCase() +
    bug.severity.slice(1).toLowerCase()

  const environmentLabel =
    bug.environment.charAt(0).toUpperCase() +
    bug.environment.slice(1).toLowerCase()

  // Format steps to reproduce as a numbered list if it isn't already
  const steps = bug.stepsToReproduce
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line, i) => {
      // If the line already starts with a number, keep it; otherwise number it
      if (/^\d+\./.test(line.trim())) return line.trim()
      return `${i + 1}. ${line.trim()}`
    })
    .join("\n")

  const customerSection = bug.customerId
    ? `\n**Customer ID / Name:** ${bug.customerId}`
    : ""

  return `## 🐛 Bug Report — ${bug.publicId}

**Title:** ${bug.title}
**Severity:** ${severityLabel}
**Deadline:** ${bug.deadline}
**Environment:** ${environmentLabel}${customerSection}
**Affected Module / Screen:** ${bug.affectedModule}

---

### Steps to Reproduce

${steps}

---

### Expected Behavior

${bug.expectedBehavior}

---

### Actual Behavior

${bug.actualBehavior}

---

*Exported from VectorOps — ${new Date().toLocaleString()}*`
}
