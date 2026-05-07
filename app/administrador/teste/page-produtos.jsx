// Produtos Futuros — reuses ProjectDetail in product mode
function ProductCard({ p, onOpen }) {
  const tipoIcon = { 'Kit': Ic.Box, 'Sistema': Ic.Bolt, 'Equipamento': Ic.Cog, 'Componente': Ic.Tag };
  const I = tipoIcon[p.tipo] || Ic.Box;
  return (
    <button onClick={onOpen} className="card-pop" style={{padding: 0, display: 'flex', flexDirection: 'column', textAlign: 'left', cursor: 'pointer'}}
      onMouseEnter={e => { e.currentTarget.style.transform='translate(-1px,-1px)'; e.currentTarget.style.boxShadow='4px 4px 0 0 #000';}}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='';}}>
      <div style={{aspectRatio: '4/3', background: p.capa ? `url(${p.capa}) center/cover` : 'var(--bg-3)', position:'relative', borderBottom:'1px solid var(--border)', display: 'grid', placeItems: 'center'}}>
        {!p.capa && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--muted-2)'}}>
          <I size={42} stroke={1.2}/>
          <span style={{fontSize: 10, letterSpacing: '0.1em'}}>{p.tipo.toUpperCase()}</span>
        </div>}
        <span style={{position:'absolute', top: 8, left: 8, fontSize: 10, fontFamily: 'var(--font)', fontWeight: 600, background: 'rgba(0,0,0,0.7)', color:'#fff', padding: '3px 8px', border: '1px solid var(--border-2)'}}>{p.sku}</span>
      </div>
      <div style={{padding: 14}}>
        <div style={{fontSize: 13, fontWeight: 700, marginBottom: 6, lineHeight: 1.3}}>{p.nome}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--muted)'}}>
          <span>Lançamento {p.lancamento}</span>
          <span className={'chip ' + (p.status === 'Aprovado' ? 'green' : p.status === 'Protótipo' ? 'warn' : '')}>{p.status}</span>
        </div>
      </div>
    </button>
  );
}

function PageProdutos({ accent, produtos, setProdutos }) {
  const [open, setOpen] = React.useState(null);
  const updateOpen = (updater) => setProdutos(prev => prev.map(p => p.id === open ? updater(p) : p));
  const openProd = produtos.find(p => p.id === open);
  return (
    <PageContainer>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
        <div className="label-eyebrow">— Catálogo · {produtos.length} produtos em desenvolvimento</div>
        <div style={{display: 'flex', gap: 10}}>
          <button className="btn-ghost"><Ic.Filter size={14}/> Tipo</button>
          <button className="btn-primary"><Ic.Plus size={14}/> Novo Produto</button>
        </div>
      </div>
      <div className="grid-cards-sm" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16}}>
        {produtos.map(p => <ProductCard key={p.id} p={p} onOpen={() => setOpen(p.id)}/>)}
      </div>
      {openProd && <ProjectDetail project={openProd} onClose={() => setOpen(null)} onUpdate={updateOpen} accent={accent} isProd/>}
    </PageContainer>
  );
}

window.PageProdutos = PageProdutos;
