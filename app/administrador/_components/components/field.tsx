interface FieldProps {
	label: string;
	value?: string | number;
	onchange?: () => void;
}

export function Field({ label, value, onchange }: FieldProps) {
	return (
		<div>
			<div
				style={{
					fontSize: 10,
					color: "var(--muted)",
					textTransform: "uppercase",
					letterSpacing: "0.08em",
					marginBottom: 4,
				}}
			>
				{label}
			</div>
			<input className="input" defaultValue={value} onChange={() => onchange} />
		</div>
	);
}
