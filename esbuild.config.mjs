import { build } from 'esbuild';

// build({
//   entryPoints: ['src/main.ts'],
//   //bundle: true,
//   platform: 'node',
//   format: 'esm',
//   outdir: 'dist',
//   // external: [
//   //   '@nestjs/websockets',
//   //   '@nestjs/websockets/socket-module',
//   //   '@nestjs/microservices',
//   //   '@nestjs/microservices/microservices-module',
//   //   '@apollo/subgraph',
//   //   'ts-morph',
//   //   'class-transformer/storage',
//   // ],
//   logLevel: 'info',
// }).catch(() => process.exit(1));

build({
  entryPoints: ['src/**/*.ts'], // Inclui todos os arquivos .ts no src
  outdir: 'dist',
  platform: 'node',
  format: 'cjs', // Usa CommonJS
  bundle: false, // Preserva a estrutura de pastas
  sourcemap: true, // Gera arquivos .map para depuração
  tsconfig: 'tsconfig.build.json', // Usa o tsconfig do NestJS
  outExtension: { '.js': '.js' },
  logLevel: 'info',
}).catch(() => process.exit(1));
