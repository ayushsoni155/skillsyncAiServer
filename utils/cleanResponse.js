const cleanResponse =(text)=> {
  try {
    // Remove triple backticks and language specifier if present (```json or ```)
    const cleaned = text
      .replace(/^```(?:json)?/i, '')  // remove starting ```
      .replace(/```$/, '')            // remove ending ```
      .trim();

    return cleaned;
  } catch (err) {
    console.error("Error cleaning response:", err.message);
    return "{}";
  }
}
module.exports = cleanResponse;