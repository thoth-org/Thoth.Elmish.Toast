import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitpod = process.env.GITPOD_WORKSPACE_ID != null

// Detect isProd
const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            ignored: [
                "**/*.fs"
            ]
        },
        hmr: {
            clientPort: isGitpod ? 443 : undefined,
        }
    },
    base: isProd ? "/Thoth.Elmish.Toast/" : "/",
})