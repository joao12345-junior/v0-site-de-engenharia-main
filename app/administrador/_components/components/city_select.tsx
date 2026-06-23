"use client";

import { useMemo, useState } from "react";
import estadosCidades from "@/public/JSON/outros/estados-cidades.json";

interface CitySelectProps {
	value: string;
	onChange: (value: string) => void;
	estado: string;
	disabled?: boolean;
}

export function CitySelect({
	value,
	onChange,
	estado,
	disabled = false,
}: CitySelectProps) {
	const [open, setOpen] = useState(false);

	const filteredCities = useMemo(() => {
		if (!estado) return [];

		const cities =
			estadosCidades.estados.find((e) => e.sigla === estado)?.cidades ?? [];

		if (!value) return cities;

		return cities.filter((c) => c.toLowerCase().includes(value.toLowerCase()));
	}, [estado, value]);

	return (
		<div style={{ position: "relative" }}>
			<input
				className="input"
				value={value}
				disabled={disabled || !estado}
				placeholder={estado ? "Cidade" : "Selecione um estado"}
				onChange={(e) => {
					onChange(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
			/>

			{open && !disabled && estado && filteredCities.length > 0 && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						background: "var(--bg-2)",
						border: "1px solid var(--border)",
						maxHeight: 220,
						overflowY: "auto",
						zIndex: 50,
					}}
				>
					{filteredCities.map((city) => (
						<div
							key={city}
							onMouseDown={(e) => {
								e.preventDefault();
								onChange(city);
								setOpen(false);
							}}
							style={{
								padding: "8px 10px",
								cursor: "pointer",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "var(--bg-3)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "transparent";
							}}
						>
							{city}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
