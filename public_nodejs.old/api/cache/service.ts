import fsp from "fs/promises";

async function getAllWithPKD(pkds: string[]) {
	// const data = await db.query.cache_wskaznikow.findMany({
	// 	where: inArray(cache_wskaznikow.pkd, pkds),
	// });
	// // console.log(data);
	// if (!data)
	// 	throw new Error(
	// 		`[CacheService]: Could not find cache with id ${pkds.reduce((prev, next) => prev + ", " + next, "")}`,
	// 	);
	let outArr: any[] = [];
	for (const pkd of pkds) {
		const f = (await fsp.readFile(`./public/db_static/${pkd}.json`)).toString();
		const fobj = await JSON.parse(f);
		if (Array.isArray(fobj)) {
			outArr = [...outArr, ...fobj];
		}
	}
	return outArr;
}

export const cacheService = {
	getAllWithPKD,
};
