// functions/.eslintrc.js
module.exports = {
  root: true, // Impede que configs de ESLint de pastas superiores afetem esta.
  env: {
    es6: true,
    node: true, // Essencial: Define globais do Node.js como require, module, process, etc.
  },
  parserOptions: {
    ecmaVersion: 2020, // Pode ajustar para a versão do Node das suas functions (ex: 2020 para Node 14+)
  },
  extends: [
    "eslint:recommended", // Regras recomendadas pelo ESLint
    "google", // Guia de estilo do Google (opcional, mas comum em projetos Firebase)
  ],
  rules: {
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    // Adicione ou modifique a regra para 'no-unused-vars'
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ], // Avisa sobre variáveis não usadas, mas permite prefixar com _ para ignorar
    // Se quiser ser mais permissivo para 'context' especificamente:
    // "no-unused-vars": ["warn", { "args": "after-used", "varsIgnorePattern": "^_", "argsIgnorePattern": "^context$" }],
    "object-curly-spacing": ["error", "always"], // Exemplo de outra regra (opcional)
    indent: ["error", 2], // Exemplo de outra regra (opcional)
    "max-len": ["warn", { code: 120 }], // Avisa sobre linhas muito longas (opcional)
  },
  globals: {
    // Se ainda precisar, pode adicionar globais aqui, mas 'node: true' em 'env' deve cobrir a maioria.
  },
};
