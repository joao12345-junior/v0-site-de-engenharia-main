// app/administrador/_components/components/config_role.tsx
import { useState } from "react";

interface ConfigRowProps {
	label: string;
	desc: string;
	enabled: boolean;
	// [ADICIONADO] Callback opcional — chamado quando o toggle muda.
	// O `?` torna a prop opcional: componentes que não precisam
	// saber sobre mudanças (como page-config) continuam funcionando
	// sem alteração. É uma adição não-breaking.
	onToggle?: (value: boolean) => void;
}

export function ConfigRow({
	label,
	desc,
	enabled: initEnabled,
	onToggle,
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
				onClick={() => {
					// [MUDANÇA] Antes: só atualizava o estado interno.
					// Agora: calcula o novo valor, atualiza o estado,
					// E notifica o pai via onToggle (se fornecido).
					//
					// [CONCEITO] `onToggle?.(newValue)` — optional chaining em chamada:
					// O `?.` verifica se onToggle existe antes de chamá-lo.
					// Sem isso, chamar uma função undefined causaria erro em runtime.
					// É equivalente a: if (onToggle) onToggle(newValue)
					const newValue = !on;
					setOn(newValue);
					onToggle?.(newValue);
				}}
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
				/>
			</button>
		</div>
	);
}
