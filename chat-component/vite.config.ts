import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx']
    }),
  ],
  css: {
    postcss: {
      plugins: []
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EntirelyReactChatComponent',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom',
        '@fluentui/react-components',
        '@fluentui/react-icons',
        '@microsoft/ai-chat-protocol',
        '@azure/core-auth',
        'mermaid',
        'react-markdown',
        'react-textarea-autosize',
        'remark-gfm'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fluentui/react-components': 'FluentUI',
          '@fluentui/react-icons': 'FluentUIIcons',
          '@microsoft/ai-chat-protocol': 'AIChatProtocol',
          '@azure/core-auth': 'AzureCoreAuth',
          'mermaid': 'mermaid',
          'react-markdown': 'ReactMarkdown',
          'react-textarea-autosize': 'TextareaAutosize',
          'remark-gfm': 'remarkGfm'
        },
      },
    },
    cssCodeSplit: false,
    
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
