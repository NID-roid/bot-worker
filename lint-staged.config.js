module.exports = {
  '*.{js,jsx,ts,tsx,yml,json}': [
    () => 'pnpm format',
    () => 'tsc -p tsconfig.json --noEmit',
    () => 'pnpm test',
  ],
};
