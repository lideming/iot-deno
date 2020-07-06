// Node & NPM sucks!
// Deno rocks!

import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import { RoutesBase } from "./RoutesBase.ts";
import { DataSetRoutes } from "./DataSetRoutes.ts";
import { config } from "./config.ts";

export class WebServer {
    app = new Application();
    router = new Router();
    routes: RoutesBase[] = [new DataSetRoutes()];

    async run() {
        this.routes.forEach(x => x.addToRouter(this.router));

        this.app.addEventListener('error', (e) => {
            console.warn('Web server error:', e.error);
            if (e.context?.respond == false) {
                e.context.response.body = null;
                e.context.response.status = Status.InternalServerError;
            }
        });

        this.app.use(this.router.routes());

        this.app.addEventListener('listen', (e) => {
            console.log(`HTTP server listening... (${e.hostname}:${e.port})`);
        });

        await this.app.listen({ hostname: config.httpHost, port: config.httpPort });
    }
}