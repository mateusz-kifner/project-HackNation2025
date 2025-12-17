import fsp from "node:fs/promises";
// import { db } from "./db";
import { cacheService } from "./api/cache/service";

async function run() {
	for (let i = 0; i < 100; i++) {
		cacheService.getAllWithPKD(["" + i]).then((data) => {
			if (data.length === 0) {
				return;
			}
			fsp
				.writeFile(`./public/db_static/${i}.json`, JSON.stringify(data))
				.then(() => {})
				.catch(console.log);
		});
	}
}

run().catch(console.log);
