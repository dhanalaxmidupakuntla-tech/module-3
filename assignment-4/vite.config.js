import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig(({ command, mode }) => {
  // plugins: mocha helpers + react. Add cloudflare only for build/preview
  const basePlugins = [...mochaPlugins(process.env), react()];
  const plugins = [...basePlugins];
  // Don't register the Cloudflare worker plugin during `vite dev` because
  // it mounts the worker and can intercept Vite's module requests, causing
  // 404s for virtual modules. Enable it only for build/preview.
  if (command !== 'serve') {
    plugins.push(cloudflare());
  }
  // During `vite dev`, if the worker isn't mounted we should avoid returning
  // the SPA HTML page for API calls (which causes JSON parse errors in tools
  // like React DevTools). Add a small dev-only middleware that returns JSON
  // 404 for `/api/*` so callers receive JSON instead of `index.html`.
  if (command === 'serve') {
    const devApiFallback = {
      name: 'dev-api-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            if (req.url && req.url.startsWith('/api/')) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'dev: no worker mounted' }));
              return;
            }
          } catch (e) {
            // swallow errors and continue to next
          }
          next();
        });
      },
    };

    plugins.push(devApiFallback);
  }
  return {
    optimizeDeps: {
      exclude: ["@getmocha/users-service/backend"],
    },
    ssr: {
      noExternal: ["@getmocha/users-service/backend"],
    },
    server: {
      allowedHosts: true,
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins,
  };
});
