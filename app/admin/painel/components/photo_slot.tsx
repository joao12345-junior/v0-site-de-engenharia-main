import { Ic } from "../lib/icons";

interface PhotoSlotProps {
	url: string;
	idx: number;
	onRemove: () => void;
}

export function PhotoSlot({ url, idx, onRemove }: PhotoSlotProps) {
	return (
		<div
			style={{
				position: "relative",
				aspectRatio: "4/3",
				background: "var(--bg-3)",
				border: "1px solid var(--border)",
				overflow: "hidden",
			}}
		>
			<img
				src={url}
				alt={"foto " + idx}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
			<button
				onClick={onRemove}
				style={{
					position: "absolute",
					top: 6,
					right: 6,
					padding: 4,
					background: "rgba(0,0,0,0.7)",
					color: "#fff",
					border: "1px solid #fff",
				}}
			>
				<Ic.X size={11} />
			</button>
			{idx === 0 && (
				<span
					style={{
						position: "absolute",
						bottom: 6,
						left: 6,
						fontSize: 9,
						background: "var(--primary)",
						color: "#fff",
						padding: "2px 6px",
						fontWeight: 600,
					}}
				>
					CAPA
				</span>
			)}
		</div>
	);
}
