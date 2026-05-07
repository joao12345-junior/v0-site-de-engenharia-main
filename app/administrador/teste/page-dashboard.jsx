// Dashboard page
const { useState: useStateD, useMemo: useMemoD } = React;

function Stat({ label, value, sub, accent, icon: I }) {
  return (
    <div className="card-pop" style={{padding: 18, position: 'relative', overflow: 'hidden'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10}}>
        <div className="label-eyebrow" style={{color: accent || 'var(--primary)'}}>{label}</div>
        {I && <I size={16} stroke={1.6} />}
      </div>
      <div style={{fontSize: 32, fontWeight: 700, lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em'}}>{value}</div>
      <div style={{fontSize: 11, color: 'var(--muted)'}}>{sub}</div>
    </div>
  );
}

function MiniSpark({ data, accent }) {
  const max = Math.max(...data);
  const w = 200, h = 50;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i*step},${h - (v/max)*h}`).join(' ');
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display: 'block'}}>
      <polyline points={areaPoints} fill={accent} opacity="0.12"/>
      <polyline points={points} fill="none" stroke={accent} strokeWidth="2"/>
      {data.map((v, i) => <circle key={i} cx={i*step} cy={h - (v/max)*h} r="1.5" fill={accent}/>)}
    </svg>
  );
}

function ActivityChart({ data, accent }) {
  const w = 760, h = 220, pad = { l: 32, r: 12, t: 12, b: 28 };
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
  const series = ['emails', 'propostas', 'projetos'];
  const colors = { emails: 'var(--muted)', propostas: accent, projetos: 'var(--info)' };
  const max = Math.max(...data.flatMap(d => series.map(s => d[s])));
  const step = cw / (data.length - 1);
  return (
    <div className="card-pop" style={{padding: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <div>
          <div className="label-eyebrow">— Últimas 12 semanas</div>
          <h3 style={{fontSize: 16, fontWeight: 700, marginTop: 6}}>Atividade do escritório</h3>
        </div>
        <div style={{display: 'flex', gap: 14, fontSize: 11}}>
          {series.map(s => <div key={s} style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <span style={{width: 10, height: 2, background: colors[s]}}></span>
            <span style={{textTransform: 'capitalize', color: 'var(--muted)'}}>{s}</span>
          </div>)}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{display: 'block'}}>
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <g key={t}>
            <line x1={pad.l} y1={pad.t + ch*t} x2={pad.l+cw} y2={pad.t + ch*t} stroke="var(--border)" strokeDasharray="2 4"/>
            <text x={pad.l-6} y={pad.t + ch*t + 4} fontSize="9" fill="var(--muted)" textAnchor="end">{Math.round(max*(1-t))}</text>
          </g>
        ))}
        {series.map(s => {
          const pts = data.map((d, i) => `${pad.l + i*step},${pad.t + ch - (d[s]/max)*ch}`).join(' ');
          return <polyline key={s} points={pts} fill="none" stroke={colors[s]} strokeWidth="1.8"/>;
        })}
        {data.map((d, i) => series.map(s =>
          <circle key={s+i} cx={pad.l + i*step} cy={pad.t + ch - (d[s]/max)*ch} r="2" fill={colors[s]}/>
        ))}
        {data.map((d, i) =>
          <text key={i} x={pad.l + i*step} y={h-8} fontSize="9" fill="var(--muted)" textAnchor="middle">{d.semana}</text>
        )}
      </svg>
    </div>
  );
}

function PageDashboard({ accent, onNav }) {
  const tot = SEED;
  const inboxNew = tot.emails.filter(e => e.folder === 'inbox' && !e.read).length;
  const propPend = tot.propostas.filter(p => p.status === 'Em análise').length;
  const propTotal = tot.propostas.filter(p => p.status === 'Aprovada').reduce((s,p) => s + p.valor, 0);
  return (
    <PageContainer>
      <div className="grid-stat-4" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20}}>
        <Stat label="Projetos Ativos" value={tot.projetosFuturos.length} sub={`+2 este mês · ${tot.projetosFuturos.filter(p=>p.status==='Aprovação').length} em aprovação`} icon={Ic.Folder}/>
        <Stat label="Propostas Pendentes" value={propPend} sub={`${tot.propostas.filter(p=>p.status==='Aprovada').length} aprovadas no trimestre`} icon={Ic.Doc}/>
        <Stat label="Inbox" value={inboxNew} sub={`não lidos · ${tot.emails.filter(e=>e.folder==='inbox').length} no total`} icon={Ic.Mail}/>
        <Stat label="Receita Aprovada" value={'R$ ' + (propTotal/1000).toFixed(0) + 'k'} sub="propostas aprovadas · 90d" icon={Ic.Activity}/>
      </div>

      <div className="grid-2-1" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20}}>
        <ActivityChart data={tot.atividade} accent={accent}/>

        <div className="card-pop" style={{padding: 20}}>
          <div className="label-eyebrow">— Acessos rápidos</div>
          <h3 style={{fontSize: 16, fontWeight: 700, marginTop: 6, marginBottom: 14}}>Ações</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
            {[
              { id: 'projetos', label: 'Subir foto', icon: Ic.Upload },
              { id: 'emails', label: 'Novo e-mail', icon: Ic.Send },
              { id: 'propostas', label: 'Nova proposta', icon: Ic.Doc },
              { id: 'produtos', label: 'Novo produto', icon: Ic.Box },
              { id: 'conteudo', label: 'Editar site', icon: Ic.Globe },
              { id: 'usuarios', label: 'Convidar', icon: Ic.User },
            ].map(a => {
              const I = a.icon;
              return <button key={a.label} onClick={() => onNav(a.id)} className="btn-ghost" style={{padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, border: '1px solid var(--border)', textAlign: 'left'}}>
                <I size={16}/>
                <span style={{fontSize: 12}}>{a.label}</span>
              </button>;
            })}
          </div>
        </div>
      </div>

      <div className="grid-2-1" style={{display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16}}>
        {/* Last activity */}
        <div className="card-pop">
          <div style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div className="label-eyebrow">— Tempo real</div>
              <h3 style={{fontSize: 15, fontWeight: 700, marginTop: 4}}>Últimas ações</h3>
            </div>
            <button onClick={() => onNav('logs')} className="btn-ghost" style={{fontSize: 11, padding: '5px 10px', border: '1px solid var(--border)'}}>Ver todos →</button>
          </div>
          <div>
            {tot.logs.slice(0,7).map((l, i) => {
              const tcolor = { email: 'var(--muted)', upload: 'var(--info)', proposta: 'var(--primary)', sistema: 'var(--muted)', produto: 'var(--warn)', conteudo: 'var(--success)', auth: 'var(--muted-2)' }[l.tipo];
              return (
                <div key={l.id} style={{padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < 6 ? '1px solid var(--border)' : 'none'}}>
                  <span style={{fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', width: 40}}>{l.hora}</span>
                  <span style={{width: 6, height: 6, background: tcolor, flexShrink: 0}}></span>
                  <span style={{fontSize: 12, flex: 1}}>{l.acao}</span>
                  <span style={{fontSize: 10, color: 'var(--muted)'}}>{l.user}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending proposals */}
        <div className="card-pop">
          <div style={{padding: '16px 20px', borderBottom: '1px solid var(--border)'}}>
            <div className="label-eyebrow">— Demandam atenção</div>
            <h3 style={{fontSize: 15, fontWeight: 700, marginTop: 4}}>Propostas pendentes</h3>
          </div>
          <div>
            {tot.propostas.filter(p => p.status === 'Em análise' || p.status === 'Rascunho').map((p, i, arr) => (
              <div key={p.id} style={{padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < arr.length-1 ? '1px solid var(--border)' : 'none'}}>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 12, fontWeight: 600, marginBottom: 2}}>{p.numero} · {p.cliente}</div>
                  <div style={{fontSize: 10, color: 'var(--muted)'}}>{p.projeto} · vence {p.vencimento}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>{fmtBRL(p.valor)}</div>
                  <span className={'chip ' + (p.status === 'Em análise' ? 'warn' : '')} style={{fontSize: 9, marginTop: 2}}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

window.PageDashboard = PageDashboard;
