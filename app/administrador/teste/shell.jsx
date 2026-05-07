// Layout shell — sidebar + topbar
const { useState, useEffect, useMemo, useRef } = React;

function Sidebar({ active, onNav, collapsed, badges, accent, mobileOpen, onMobileClose }) {
  const groups = [
    { title: 'Visão Geral', items: [
      { id: 'dashboard', label: 'Dashboard', icon: Ic.Dashboard },
      { id: 'atividade', label: 'Atividade', icon: Ic.Activity },
    ]},
    { title: 'Gestão', items: [
      { id: 'projetos', label: 'Projetos Futuros', icon: Ic.Folder, badge: badges.projetos },
      { id: 'produtos', label: 'Produtos Futuros', icon: Ic.Box, badge: badges.produtos },
      { id: 'emails', label: 'E-mails', icon: Ic.Mail, badge: badges.emails },
      { id: 'propostas', label: 'Propostas', icon: Ic.Doc, badge: badges.propostas },
    ]},
    { title: 'Site', items: [
      { id: 'conteudo', label: 'Conteúdo', icon: Ic.Globe },
      { id: 'clientes', label: 'Clientes', icon: Ic.Building },
    ]},
    { title: 'Sistema', items: [
      { id: 'usuarios', label: 'Usuários', icon: Ic.Users },
      { id: 'logs', label: 'Logs', icon: Ic.Database },
      { id: 'config', label: 'Configurações', icon: Ic.Cog },
    ]},
  ];
  return (
    <>
      <aside className={'app-sidebar' + (mobileOpen ? ' open' : '')} style={{
        width: collapsed ? 64 : 248,
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-2)',
        display: 'flex', flexDirection: 'column',
        transition: 'width .2s, transform .25s',
        flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{padding: collapsed ? '18px 12px' : '18px 18px', borderBottom: '1px solid var(--border)', display:'flex', alignItems:'center', gap: 10}}>
          <div style={{width: 36, height: 36, background: accent, color: '#fff', display:'grid', placeItems:'center', fontWeight: 800, fontSize: 14, boxShadow: 'var(--shadow-sm)', flexShrink: 0}}>OP</div>
          {!collapsed && <div style={{lineHeight: 1.1, flex: 1}}>
            <div style={{fontWeight: 700, fontSize: 13}}>Optare</div>
            <div style={{fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>/administrador</div>
          </div>}
          <button onClick={onMobileClose} className="btn-ghost mobile-menu-btn" style={{padding: 6, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, minHeight: 32, flexShrink: 0}}><Ic.X size={14}/></button>
        </div>

        <nav style={{flex: 1, overflowY: 'auto', padding: '12px 0'}}>
          {groups.map(g => (
            <div key={g.title} style={{marginBottom: 14}}>
              {!collapsed && <div style={{fontSize: 10, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '6px 18px 6px'}}>— {g.title}</div>}
              {g.items.map(it => {
                const isActive = active === it.id;
                const I = it.icon;
                return (
                  <button key={it.id} onClick={() => { onNav(it.id); onMobileClose && onMobileClose(); }}
                    title={collapsed ? it.label : ''}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: collapsed ? '10px 0' : '9px 18px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      color: isActive ? 'var(--primary)' : 'var(--fg-2)',
                      background: isActive ? 'var(--primary-soft)' : 'transparent',
                      borderLeft: isActive ? `3px solid var(--primary)` : '3px solid transparent',
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                    }}>
                    <I size={17} stroke={isActive ? 2 : 1.6}/>
                    {!collapsed && <span style={{flex: 1, textAlign: 'left'}}>{it.label}</span>}
                    {!collapsed && it.badge ? (
                      <span style={{fontSize: 10, background: 'var(--primary)', color: '#fff', padding: '1px 6px', minWidth: 18, textAlign: 'center'}}>{it.badge}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{borderTop: '1px solid var(--border)', padding: collapsed ? '12px 8px' : '12px 14px', display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{width: 32, height: 32, background: 'var(--card-2)', border: '1px solid var(--border)', color: 'var(--primary)', display:'grid', placeItems:'center', fontSize: 11, fontWeight: 700, flexShrink: 0}}>MB</div>
          {!collapsed && <div style={{flex: 1, lineHeight: 1.2, minWidth: 0}}>
            <div style={{fontSize: 12, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Marcelo Berny</div>
            <div style={{fontSize: 10, color: 'var(--muted)'}}>admin · sócio</div>
          </div>}
          {!collapsed && <button className="btn-ghost" style={{padding:6, border:'1px solid var(--border)'}} title="Sair"><Ic.Logout size={14}/></button>}
        </div>
      </aside>
      <div className={'mobile-overlay' + (mobileOpen ? ' open' : '')} onClick={onMobileClose}></div>
    </>
  );
}

function Topbar({ title, subtitle, breadcrumb, theme, onTheme, onSearch, notifications=3, onMobileMenu }) {
  return (
    <header className="app-topbar" style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      padding: '14px 28px',
      display: 'flex', alignItems: 'center', gap: 20,
      position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(6px)',
    }}>
      <button onClick={onMobileMenu} className="btn-ghost mobile-menu-btn" style={{padding: 8, border: '1px solid var(--border)', flexShrink: 0}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>

      <div style={{flex: 1, minWidth: 0}}>
        {breadcrumb && <div style={{fontSize: 11, color: 'var(--muted)', marginBottom: 2}} className="hide-mobile">{breadcrumb}</div>}
        <h1 style={{fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{title}</h1>
        {subtitle && <div style={{fontSize: 12, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} className="hide-mobile">{subtitle}</div>}
      </div>

      <div className="topbar-search" style={{position: 'relative', width: 280}}>
        <Ic.Search size={14} style={{position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none'}}/>
        <input className="input input-with-icon input-with-kbd" placeholder="Buscar..." style={{fontSize: 12}} onChange={e => onSearch && onSearch(e.target.value)}/>
        <kbd className="kbd-hint" style={{position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--muted)', border: '1px solid var(--border)', padding: '1px 5px'}}>⌘K</kbd>
      </div>

      <div className="topbar-actions" style={{display: 'flex', gap: 10}}>
        <button className="btn-ghost btn-icon-only" style={{padding: 8, border: '1px solid var(--border)', position: 'relative'}} title="Notificações">
          <Ic.Bell size={16}/>
          {notifications > 0 && <span style={{position: 'absolute', top: -4, right: -4, background: 'var(--primary)', color: '#fff', fontSize: 9, padding: '1px 4px', minWidth: 16, textAlign: 'center', fontWeight: 700}}>{notifications}</span>}
        </button>

        <button className="btn-ghost btn-icon-only" style={{padding: 8, border: '1px solid var(--border)'}} onClick={onTheme} title="Alternar tema">
          {theme === 'dark' ? <Ic.Sun size={16}/> : <Ic.Moon size={16}/>}
        </button>

        <button className="btn-primary"><Ic.Plus size={14}/><span className="topbar-newbtn-label">Novo</span></button>
      </div>
    </header>
  );
}

function PageContainer({ children, pad=true }) {
  return <div className={pad ? 'page-pad' : ''} style={{padding: pad ? '24px 28px' : 0, flex: 1, overflowY: 'auto'}}>{children}</div>;
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.PageContainer = PageContainer;
