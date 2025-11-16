// jest.config.cjs

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      // 1. Aponta para o tsconfig do seu app
      tsconfig: '<rootDir>/tsconfig.app.json', 
      
      // 2. 🌟 A CORREÇÃO CRÍTICA 🌟
      // Sobrescreve as regras do tsconfig SÓ para o Jest
      compilerOptions: {
        "module": "CommonJS",           // Converte 'import' para 'require'
        "verbatimModuleSyntax": false   // Desliga a regra que causa o erro TS1295
      }
    }], 
  },
  
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};