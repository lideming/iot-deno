
import { Router } from "https://deno.land/x/oak/mod.ts";
import { RoutesBase } from "./RoutesBase.ts";
import { getISODate } from "./util.ts";
import { dataSets } from "./DataSet.ts";

export class DataSetRoutes extends RoutesBase {
    addToRouter(router: Router) {
        super.addToRouter(router);
        router.get("/iot/api/dataset/:set/:date", async (ctx) => {
            let { set: setStr, date: dateStr } = ctx.params;
            const set = dataSets.get(setStr);
            if (!set) throw new Error('invalid dataset name');
            if (!dateStr) throw new Error('invalid date');
            if (dateStr == 'last') {
                ctx.response.body = await set.getLast();
            } else {
                const date = (dateStr == 'today') ? new Date() : new Date(dateStr);
                ctx.response.body = await set.readAll(date);
            }
            ctx.response.type = 'text';
        });
    }
}
