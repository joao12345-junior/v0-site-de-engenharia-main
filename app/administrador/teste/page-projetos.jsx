// Projetos Futuros — listagem + upload de fotos
const { useState: useStateP, useRef: useRefP } = React;

function CategoryIcon({ cat, accent }) {
  const m = { 'Comercial': Ic.Bolt, 'Residencial': Ic.Building, 'Saúde': Ic.Drop };
  const I = m[cat] || Ic.Building;
  return <I size={14} stroke={1.8}/>;
}

function StatusChip({ s }) {
  const map = { 'Em projeto': 'red', 'Aprovação': 'warn', 'Pré-projeto': '' };
  return <span className={'chip ' + (map[s]||'')}>{s}</span>;
}

function PhotoSlot({ url, idx, onRemove }) {
  return (
    <div style={{position: 'relative', aspectRatio: '4/3', background: 'var(--bg-3)', border: '1px solid var(--border)', overflow: 'hidden'}}>
      <img src={url} alt={'foto '+idx} style={{width:'100%', height:'100%', objectFit: 'cover'}}/>
      <button onClick={onRemove} style={{position:'absolute', top:6, right:6, padding: 4, background:'rgba(0,0,0,0.7)', color:'#fff', border:'1px solid #fff'}}><Ic.X size={11}/></button>
      {idx === 0 && <span style={{position:'absolute', bottom: 6, left: 6, fontSize: 9, background: 'var(--primary)', color:'#fff', padding: '2px 6px', fontWeight: 600}}>CAPA</span>}
    </div>
  );
}

function ProjectCard({ p, onOpen, accent }) {
  return (
    <button onClick={onOpen} className="card-pop" style={{padding: 0, display: 'flex', flexDirection: 'column', textAlign: 'left', cursor: 'pointer', transition: 'transform .1s, box-shadow .1s'}}
      onMouseEnter={e => { e.currentTarget.style.transform='translate(-1px,-1px)'; e.currentTarget.style.boxShadow='4px 4px 0 0 #000';}}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='';}}>
      <div style={{aspectRatio: '16/9', background: p.capa ? `url(${p.capa}) center/cover` : 'var(--bg-3)', position: 'relative', borderBottom: '1px solid var(--border)'}}>
        {!p.capa && <div style={{position:'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--muted-2)', flexDirection: 'column', gap: 6}}>
          <Ic.Image size={28} stroke={1.4}/>
          <span style={{fontSize: 10, letterSpacing: '0.1em'}}>SEM CAPA · CLIQUE PARA ENVIAR</span>
        </div>}
        <span style={{position:'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 600, background: 'var(--primary)', color:'#fff', padding: '3px 8px'}}>{p.categoria.toUpperCase()}</span>
        <span style={{position:'absolute', top: 8, right: 8, fontSize: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4}}>
          <Ic.Image size={10}/> {p.fotos}
        </span>
      </div>
      <div style={{padding: 14}}>
        <div style={{fontSize: 13, fontWeight: 700, marginBottom: 4}}>{p.nome}</div>
        <div style={{fontSize: 11, color: 'var(--muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6}}>
          <Ic.MapPin size={11}/> {p.cidade}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <StatusChip s={p.status}/>
          <span style={{fontSize: 10, color: 'var(--muted)'}}>{p.area}</span>
        </div>
      </div>
    </button>
  );
}

function ProjectDetail({ project, onClose, onUpdate, accent, isProd=false }) {
  const fileInputRef = useRefP();
  const [drag, setDrag] = useStateP(false);

  const handleFiles = (files) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto = reader.result;
        onUpdate(prev => {
          const photos = [...(prev.photos || []), newPhoto];
          return { ...prev, photos, fotos: photos.length, capa: prev.capa || newPhoto };
        });
      };
      reader.readAsDataURL(f);
    });
  };

  const photos = project.photos || [];

  return (
    <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', justifyContent: 'flex-end'}} onClick={onClose}>
      <div className="detail-panel" onClick={e=>e.stopPropagation()} style={{width: 720, maxWidth: '95vw', height: '100%', background: 'var(--bg)', borderLeft: '1px solid var(--border)', boxShadow: '-8px 0 24px rgba(0,0,0,0.4)', overflow: 'auto'}}>
        <div style={{padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2}}>
          <div>
            <div className="label-eyebrow">— {isProd ? 'Produto' : 'Projeto'} {isProd ? project.sku : project.id.toUpperCase()}</div>
            <h2 style={{fontSize: 20, fontWeight: 700, marginTop: 6, letterSpacing: '-0.01em'}}>{project.nome}</h2>
            <div style={{fontSize: 12, color: 'var(--muted)', marginTop: 4}}>
              {isProd ? `${project.tipo} · lançamento ${project.lancamento}` : `${project.cliente} · ${project.cidade}`}
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{padding: 8, border: '1px solid var(--border)'}}><Ic.X size={14}/></button>
        </div>

        <div style={{padding: 24}}>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${drag ? accent : 'var(--border-2)'}`,
              padding: 32, marginBottom: 20, textAlign: 'center', cursor: 'pointer',
              background: drag ? 'var(--primary-soft)' : 'var(--bg-2)',
              transition: 'all .15s',
            }}>
            <Ic.Upload size={28} stroke={1.4} />
            <div style={{fontWeight: 700, marginTop: 10, fontSize: 14}}>Arraste fotos aqui ou clique para enviar</div>
            <div style={{fontSize: 11, color: 'var(--muted)', marginTop: 6}}>JPG, PNG, WEBP · até 10MB cada · múltiplos arquivos</div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{display: 'none'}} onChange={e => handleFiles(e.target.files)} />
          </div>

          {/* Photos grid */}
          <div className="label-eyebrow" style={{marginBottom: 12}}>— Galeria · {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</div>
          {photos.length === 0 ? (
            <div className="empty">Nenhuma foto enviada ainda. Arraste arquivos para a área acima.</div>
          ) : (
            <div className="grid-cards-sm" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24}}>
              {photos.map((url, i) => (
                <PhotoSlot key={i} url={url} idx={i} onRemove={() => {
                  onUpdate(prev => {
                    const newPhotos = prev.photos.filter((_, j) => j !== i);
                    return { ...prev, photos: newPhotos, fotos: newPhotos.length, capa: i === 0 ? newPhotos[0] : prev.capa };
                  });
                }}/>
              ))}
            </div>
          )}

          {/* Meta fields */}
          <div className="label-eyebrow" style={{marginBottom: 12, marginTop: 16}}>— Detalhes</div>
          <div className="grid-2col" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
            {isProd ? <>
              <Field label="Nome do produto" value={project.nome}/>
              <Field label="SKU" value={project.sku}/>
              <Field label="Tipo" value={project.tipo}/>
              <Field label="Lançamento" value={project.lancamento}/>
              <Field label="Status" value={project.status}/>
              <Field label="Preço estimado" value={project.preco}/>
            </> : <>
              <Field label="Nome do projeto" value={project.nome}/>
              <Field label="Cliente" value={project.cliente}/>
              <Field label="Cidade / UF" value={project.cidade}/>
              <Field label="Categoria" value={project.categoria}/>
              <Field label="Status" value={project.status}/>
              <Field label="Prazo estimado" value={project.prazo}/>
              <Field label="Área (m²)" value={project.area}/>
            </>}
          </div>

          <div style={{marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 18}}>
            <button className="btn-ghost"><Ic.Eye size={14}/> Pré-visualizar no site</button>
            <button className="btn-primary"><Ic.Check size={14}/> Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4}}>{label}</div>
      <input className="input" defaultValue={value} />
    </div>
  );
}

function PageProjetos({ accent, projetos, setProjetos }) {
  const [filter, setFilter] = useStateP('todos');
  const [open, setOpen] = useStateP(null);
  const cats = ['todos', 'Comercial', 'Residencial', 'Saúde'];
  const list = projetos.filter(p => filter === 'todos' || p.categoria === filter);

  const updateOpen = (updater) => {
    setProjetos(prev => prev.map(p => p.id === open ? updater(p) : p));
  };
  const openProject = list.find(p => p.id === open) || projetos.find(p => p.id === open);

  return (
    <PageContainer>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 14, flexWrap: 'wrap'}}>
        <div className="filter-row" style={{display: 'flex', gap: 8}}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={filter === c ? '' : 'btn-ghost'}
              style={{
                padding: '7px 14px',
                background: filter === c ? accent : 'transparent',
                color: filter === c ? '#fff' : 'var(--fg-2)',
                border: `1px solid ${filter === c ? accent : 'var(--border)'}`,
                fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
              }}>{c}</button>
          ))}
        </div>
        <div style={{display: 'flex', gap: 10, flexShrink: 0}}>
          <button className="btn-ghost" style={{whiteSpace: 'nowrap'}}><Ic.Filter size={14}/> Filtros</button>
          <button className="btn-primary" style={{whiteSpace: 'nowrap'}}><Ic.Plus size={14}/> Novo Projeto</button>
        </div>
      </div>

      <div className="grid-cards" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16}}>
        {list.map(p => <ProjectCard key={p.id} p={p} onOpen={() => setOpen(p.id)} accent={accent} />)}
      </div>

      {openProject && <ProjectDetail project={openProject} onClose={() => setOpen(null)} onUpdate={updateOpen} accent={accent}/>}
    </PageContainer>
  );
}

window.PageProjetos = PageProjetos;
window.ProjectDetail = ProjectDetail;
window.Field = Field;
window.StatusChip = StatusChip;
