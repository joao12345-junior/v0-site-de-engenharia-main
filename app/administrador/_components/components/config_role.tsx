import { useState } from "react";

interface ConfigRowProps {
	label: string;
	desc: string;
	enabled: boolean;
}

export function ConfigRow({
	label,
	desc,
	enabled: initEnabled,
}: ConfigRowProps) {
	const [on, setOn] = useState(initEnabled);
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 14,
				padding: "8px 0",
				borderBottom: "1px dashed var(--border)",
			}}
		>
			<div>
				<div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
				<div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
			</div>
			<button
				onClick={() => setOn(!on)}
				style={{
					width: 38,
					height: 22,
					minHeight: 22,
					flexShrink: 0,
					background: on ? "var(--primary)" : "var(--bg-3)",
					border: "1px solid var(--border-2)",
					position: "relative",
					cursor: "pointer",
					padding: 0,
				}}
			>
				<span
					style={{
						position: "absolute",
						top: 2,
						left: on ? 18 : 2,
						width: 14,
						height: 14,
						background: "#fff",
						transition: "left .15s",
					}}
				></span>
			</button>
		</div>
	);
}
