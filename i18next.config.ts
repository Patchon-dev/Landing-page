export default {
  locales: [
    "en",
    "de",
    "fr",
    "es",
    "nl",
    "it",
    "pt"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "src/lib/locales/{{language}}/{{namespace}}.json"
  }
}