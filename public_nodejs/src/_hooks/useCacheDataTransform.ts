import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { env } from "@/env";

type Cache = {
	date: string;
	id: string;
	pkd: string | null;
	pkd_name: string | null;
	year: string | null;
	revenue: number | null;
	net_profit: number | null;
	investments: number | null;
	firms: number | null;
	profitable_firms: number | null;
	profit_margin: number | null;
	profitable_share: number | null;
	bank_debt: number | null;
	total_liab: number | null;
	leverage_bank_to_rev: number | null;
	leverage_tot_to_rev: number | null;
	invest_intensity: number | null;
	cagr_revenue: number | null;
	cagr_net_profit: number | null;
	cagr_investments: number | null;
	cagr_firms: number | null;
	profit_margin_std_3y: number | null;
	size_index: number | null;
	growth_index: number | null;
	profit_index: number | null;
	risk_index: number | null;
	outlook_index: number | null;
	current_index: number | null;
	future_index: number | null;
	main_index: number | null;
	class1: number | null;
	revenue_parameter: number | null;
	firms_parameter: number | null;
	growth_parameter: number | null;
	cagr_revenue_parameter: number | null;
	cagr_net_profit_parameter: number | null;
	profit_margin_parameter: number | null;
	profitable_share_parameter: number | null;
	leverage_bank_to_rev_parameter: number | null;
	leverage_tot_to_rev_parameter: number | null;
	profit_margin_std_3y_parameter: number | null;
	invest_intensity_parameter: number | null;
	cagr_investments_parameter: number | null;
	size_index_parameter: number | null;
	growth_index_parameter: number | null;
	profit_index_parameter: number | null;
	risk_index_parameter: number | null;
	growth_index_parameter2: number | null;
	profit_index_parameter2: number | null;
	risk_index_parameter2: number | null;
	future_growth_index_parameter: number | null;
	outlook_index_parameter: number | null;
	future_risk_index_parameter: number | null;
	current_index_parameter: number | null;
	future_index_parameter: number | null;
	prediction: boolean | null;
};

export type Level = "sektor" | "group";

async function fetchData(pkds: string[]) {
	const pending = pkds.map(async (pkd) => {
		try {
			console.log(`${env.SERVER_URL}/db_static/${pkd}.json`);
			const res = await fetch(`${env.SERVER_URL}/db_static/${pkd}.json`);
			const data = await res.text();
			const json = await JSON.parse(data);
			return json;
		} catch (_) {
			return [];
		}
	});
	const settled = await Promise.allSettled(pending);
	const data = settled
		.filter((val) => val.status === "fulfilled")
		.map((val) => val.value);

	return data.flat(1);
}

export function useCacheDataTransform(
	pkds: string[],
	valueColumn: string,
	initialLevel: Level = "group",
) {
	const query = useQuery(
		{
			queryKey: ["fetchPKDs", JSON.stringify(pkds)],
			queryFn: () => fetchData(pkds),
		},
		// orpc.cache_wskaznikow.queryOptions({ input: { pkds } }),
	);
	console.log(query.data);

	const [newData, legendX, legendY] = useMemo(() => {
		const groupByYear = Object.groupBy(query?.data ?? [], (val) => val.date);

		const newData: Record<number | string, any>[] = [];
		const legendX = [];
		let legendY = [];
		for (const group in groupByYear) {
			if (group.startsWith("S")) {
				continue;
			}
			legendX.push(group);
			const dataPoint: Record<any, any> = { year: group, date: group };
			for (const row of groupByYear[group as keyof typeof groupByYear] ?? []) {
				legendY.push(row.pkd ?? "");

				dataPoint[row.pkd ?? ""] = row[valueColumn as keyof typeof row];
			}
			newData.push(dataPoint);
		}
		legendY = [...new Set(legendY)];

		// console.log(newData);

		return [
			newData,
			legendX.map((val) => ({ id: val, label: val, enabled: true })),
			legendY
				.sort((v1, v2) => Number.parseFloat(v1) - Number.parseFloat(v2))
				.map((val) => ({ id: val, label: val, enabled: true })),
		];
	}, [query?.data, valueColumn]);

	return {
		...query,
		newData,
		legendX,
		legendY,
	};
}
