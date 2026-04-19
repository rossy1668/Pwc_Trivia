/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGithubPages = process.env.GH_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGithubPages ? '/Pwc_Trivia/' : '/',
})