// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        minify: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'YourLibraryName',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format, entryName) => {
                if (format === 'umd') {
                    return `${entryName}.umd.js`;
                }
                if (format === 'cjs') {
                    return `${entryName}.cjs.js`;
                }
                return `${entryName}.es.js`;
            },
        },
    },
    plugins: [dts()],
});