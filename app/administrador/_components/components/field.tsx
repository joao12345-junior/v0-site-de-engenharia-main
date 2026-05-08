interface FieldProps {
	label: string;
	value?: string | number;
}

export function Field({ label, value }: FieldProps) {
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
			<input className="input" defaultValue={value} />
		</div>
	);
}
