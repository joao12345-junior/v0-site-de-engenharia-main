// components/city_select.tsx
"use client";

import { useMemo, useState } from "react";

interface CitySelectProps {
	value: string;
	onChange: (value: string) => void;
	cidades: string[]; // [MUDANÇA] era `estado: string` → o componente recebia
	// o JSON inteiro e filtrava internamente. Agora recebe
	// só a lista já filtrada — Single Responsibility aplicado.
	disabled?: boolean;
}

export function CitySelect({
	value,
	onChange,
	cidades,
	disabled = false,
}: CitySelectProps) {
	const [open, setOpen] = useState(false);

	const filteredCities = useMemo(
		() =>
			cidades.filter((c) =>
				c.toLowerCase().includes((value ?? "").toLowerCase()),
			),
		[cidades, value],
	);

	return (
		<div style={{ position: "relative" }}>
			<input
				className="input"
				value={value}
				disabled={disabled || cidades.length === 0}
				placeholder={
					cidades.length === 0
						? "Selecione um estado primeiro"
						: "Digite a cidade"
				}
				onChange={(e) => {
					onChange(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
				style={{
					width: "100%",
					padding: "7px 10px",
					background: "var(--bg-2)",
					border: "1px solid var(--border)",
					color: "var(--fg)",
					fontSize: 13,
					opacity: disabled || cidades.length === 0 ? 0.6 : 1,
					cursor: disabled || cidades.length === 0 ? "not-allowed" : "text",
				}}
			/>
			{open && !disabled && filteredCities.length > 0 && (
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
							style={{ padding: "8px 10px", cursor: "pointer" }}
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
