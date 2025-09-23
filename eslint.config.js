const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "src/generated/**/*",
      "**/node_modules/**",
      ".next/**",
      "out/**",
      "build/**"
    ]
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];