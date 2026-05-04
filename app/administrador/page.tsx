// app/administrador/page.tsx
// Server Component — busca dados diretamente do banco, sem chamadas de API
import { pool } from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
	Mail,
	ShieldAlert,
	TrendingUp,
	Clock,
	Building2,
	User,
	Phone,
	MessageSquare,
	Globe,
	Calendar,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Mensagem {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	company: string | null;
	subject: string;
	message: string;
	ip_address: string;
	created_at: Date;
}

interface Estatisticas {
	totalMensagens: number;
	mensagensHoje: number;
	tentativasBloqueadas: number;
	ultimaAtividade: Date | null;
}

// ─── Funções de busca no banco (Server-side) ──────────────────────────────────

async function buscarEstatisticas(): Promise<Estatisticas> {
	const [total, hoje, bloqueadas, ultima] = await Promise.all([
		pool.query(`SELECT COUNT(*) FROM site_optare_email.mensagens`),
		pool.query(
			`SELECT COUNT(*) FROM site_optare_email.mensagens
       WHERE created_at > NOW() - INTERVAL '24 hours'`,
		),
		pool.query(
			`SELECT COUNT(*) FROM site_optare_email.attempts
       WHERE created_at > NOW() - INTERVAL '24 hours'`,
		),
		pool.query(
			`SELECT created_at FROM site_optare_email.mensagens
       ORDER BY created_at DESC LIMIT 1`,
		),
	]);

	return {
		totalMensagens: Number(total.rows[0].count),
		mensagensHoje: Number(hoje.rows[0].count),
		tentativasBloqueadas: Number(bloqueadas.rows[0].count),
		ultimaAtividade: ultima.rows[0]?.created_at ?? null,
	};
}

async function buscarMensagens(): Promise<Mensagem[]> {
	const resultado = await pool.query(
		`SELECT id, name, email, phone, company, subject, message, ip_address, created_at
     FROM site_optare_email.mensagens
     ORDER BY created_at DESC
     LIMIT 50`,
	);
	return resultado.rows;
}

// ─── Utilitários de formatação ─────────────────────────────────────────────

function formatarData(data: Date): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(data));
}

function formatarDataRelativa(data: Date): string {
	const agora = new Date();
	const diff = agora.getTime() - new Date(data).getTime();
	const minutos = Math.floor(diff / 60000);
	const horas = Math.floor(minutos / 60);
	const dias = Math.floor(horas / 24);

	if (minutos < 1) return "agora mesmo";
	if (minutos < 60) return `há ${minutos} min`;
	if (horas < 24) return `há ${horas}h`;
	if (dias === 1) return "ontem";
	return `há ${dias} dias`;
}

// ─── Componentes de UI ─────────────────────────────────────────────────────

function CartaoEstatistica({
	icone: Icone,
	rotulo,
	valor,
	destaque = false,
}: {
	icone: React.ElementType;
	rotulo: string;
	valor: string | number;
	destaque?: boolean;
}) {
	return (
		<div
			className={`
        p-6 border border-border
        ${destaque ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}
      `}
		>
			<div className="flex items-center justify-between mb-4">
				<span
					className={`text-xs font-medium uppercase tracking-widest
          ${destaque ? "text-primary-foreground/70" : "text-muted-foreground"}`}
				>
					{rotulo}
				</span>
				<Icone
					className={`h-4 w-4 ${destaque ? "text-primary-foreground/70" : "text-muted-foreground"}`}
				/>
			</div>
			<p className="text-4xl font-bold">{valor}</p>
		</div>
	);
}

function LinhaTabela({ mensagem }: { mensagem: Mensagem }) {
	return (
		<tr className="border-b border-border hover:bg-muted/30 transition-colors group">
			<td className="px-4 py-4 text-xs text-muted-foreground font-mono">
				#{mensagem.id}
			</td>
			<td className="px-4 py-4">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 bg-primary/10 flex items-center justify-center flex-shrink-0">
						<span className="text-xs font-bold text-primary">
							{mensagem.name.charAt(0).toUpperCase()}
						</span>
					</div>
					<div>
						<p className="text-sm font-medium text-foreground leading-none">
							{mensagem.name}
						</p>
						<p className="text-xs text-muted-foreground mt-0.5">
							{mensagem.email}
						</p>
					</div>
				</div>
			</td>
			<td className="px-4 py-4">
				<span className="text-sm text-foreground">
					{mensagem.company ?? (
						<span className="text-muted-foreground italic">—</span>
					)}
				</span>
			</td>
			<td className="px-4 py-4 max-w-[220px]">
				<p className="text-sm text-foreground truncate">{mensagem.subject}</p>
				<p className="text-xs text-muted-foreground truncate mt-0.5">
					{mensagem.message}
				</p>
			</td>
			<td className="px-4 py-4">
				<span className="text-xs font-mono text-muted-foreground">
					{mensagem.ip_address}
				</span>
			</td>
			<td className="px-4 py-4 text-right">
				<p className="text-xs text-muted-foreground">
					{formatarDataRelativa(mensagem.created_at)}
				</p>
				<p className="text-xs text-muted-foreground/60 mt-0.5">
					{formatarData(mensagem.created_at)}
				</p>
			</td>
		</tr>
	);
}

// ─── Página principal (Server Component) ──────────────────────────────────────

export default async function AdministradorPage() {
	// Busca paralela — as duas queries rodam ao mesmo tempo
	const [estatisticas, mensagens] = await Promise.all([
		buscarEstatisticas(),
		buscarMensagens(),
	]);

	return (
		<>
			<Header />
			<main className="pt-20 min-h-screen bg-background">
				{/* Cabeçalho da área administrativa */}
				<section className="border-b border-border bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
						<div className="flex items-end justify-between">
							<div>
								<div className="flex items-center gap-2 text-xs text-primary mb-2 font-mono uppercase tracking-widest">
									<span className="h-px w-6 bg-primary" />
									Painel Administrativo
								</div>
								<h1 className="text-3xl font-bold tracking-tight text-foreground">
									Central de Mensagens
								</h1>
								<p className="mt-1 text-sm text-muted-foreground">
									Formulários de contato recebidos pelo site
								</p>
							</div>
							{estatisticas.ultimaAtividade && (
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									<span>
										Última mensagem{" "}
										{formatarDataRelativa(estatisticas.ultimaAtividade)}
									</span>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Cards de estatísticas */}
				<section className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
						<CartaoEstatistica
							icone={Mail}
							rotulo="Total recebido"
							valor={estatisticas.totalMensagens}
							destaque
						/>
						<CartaoEstatistica
							icone={TrendingUp}
							rotulo="Últimas 24h"
							valor={estatisticas.mensagensHoje}
						/>
						<CartaoEstatistica
							icone={ShieldAlert}
							rotulo="Bloqueadas hoje"
							valor={estatisticas.tentativasBloqueadas}
						/>
						<CartaoEstatistica
							icone={MessageSquare}
							rotulo="Exibindo agora"
							valor={`${mensagens.length} de ${estatisticas.totalMensagens}`}
						/>
					</div>
				</section>

				{/* Tabela de mensagens */}
				<section className="mx-auto max-w-7xl px-6 lg:px-8 pb-16">
					<div className="border border-border">
						{/* Cabeçalho da tabela */}
						<div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
							<h2 className="text-sm font-medium text-foreground">
								Mensagens recentes
							</h2>
							<span className="text-xs text-muted-foreground font-mono">
								{mensagens.length} registros
							</span>
						</div>

						{mensagens.length === 0 ? (
							// Estado vazio
							<div className="py-20 text-center">
								<Mail className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
								<p className="text-sm text-muted-foreground">
									Nenhuma mensagem recebida ainda.
								</p>
							</div>
						) : (
							// Tabela com dados
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-border bg-muted/30">
											<th className="px-4 py-3 text-left">
												<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
													ID
												</span>
											</th>
											<th className="px-4 py-3 text-left">
												<div className="flex items-center gap-1.5">
													<User className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
														Remetente
													</span>
												</div>
											</th>
											<th className="px-4 py-3 text-left">
												<div className="flex items-center gap-1.5">
													<Building2 className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
														Empresa
													</span>
												</div>
											</th>
											<th className="px-4 py-3 text-left">
												<div className="flex items-center gap-1.5">
													<MessageSquare className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
														Assunto
													</span>
												</div>
											</th>
											<th className="px-4 py-3 text-left">
												<div className="flex items-center gap-1.5">
													<Globe className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
														IP
													</span>
												</div>
											</th>
											<th className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-1.5">
													<Calendar className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
														Data
													</span>
												</div>
											</th>
										</tr>
									</thead>
									<tbody>
										{mensagens.map((mensagem) => (
											<LinhaTabela key={mensagem.id} mensagem={mensagem} />
										))}
									</tbody>
								</table>
							</div>
						)}

						{/* Rodapé da tabela */}
						{mensagens.length > 0 && (
							<div className="px-6 py-3 border-t border-border bg-card">
								<p className="text-xs text-muted-foreground">
									Exibindo as {mensagens.length} mensagens mais recentes. Para
									consultas avançadas, acesse o banco de dados diretamente.
								</p>
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
