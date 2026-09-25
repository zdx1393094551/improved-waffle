import React from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowDown, ArrowUpRight, Code2, Menu, Share2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import './styles.css'

function ThreadsBackground() {
  useEffect(() => {
    const canvas = document.querySelector('.threads-bg')
    const ctx = canvas.getContext('2d')
    const colors = ['#b10606', '#390775', '#8a93a6']
    let width = 0; let height = 0; let frame = 0; let raf; let lastPaint = 0; let heroVisible = true
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width * ratio; canvas.height = height * ratio
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = (now = 0) => {
      // The video already supplies motion in the hero; pause this second animation there.
      if (heroVisible) return
      // Keep the atmospheric threads close to 30fps; the rest of the interface stays crisp at 60fps.
      if (now - lastPaint < 32) { raf = requestAnimationFrame(draw); return }
      lastPaint = now
      frame += 0.004; ctx.clearRect(0, 0, width, height); ctx.globalCompositeOperation = 'screen'
      const count = Math.max(14, Math.min(26, Math.round(width / 60)))
      for (let i = 0; i < count; i += 1) {
        const y = (i / count) * height * 1.25 - height * .1
        const sway = 45 + (i % 5) * 16; const drift = Math.sin(frame * (1 + i * .025) + i) * 24
        ctx.beginPath(); ctx.moveTo(-60, y + drift)
        ctx.bezierCurveTo(width * .24, y - sway + drift, width * .56, y + sway + drift, width + 60, y + Math.sin(frame + i) * 34)
        ctx.strokeStyle = colors[i % colors.length]; ctx.globalAlpha = .18 + (i % 4) * .025; ctx.lineWidth = i % 6 === 0 ? 1.35 : .7; ctx.stroke()
      }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(draw)
    }
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting
      if (!heroVisible && !document.hidden) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
    }, { threshold: 0.18 })
    const hero = document.querySelector('.hero')
    if (hero) heroObserver.observe(hero)
    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(draw)
    }
    resize(); raf = requestAnimationFrame(draw); window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVisibility); heroObserver.disconnect() }
  }, [])
  return <canvas className="threads-bg" aria-hidden="true" />
}

const nav = [
  ['能力概览', 'profile'],
  ['技术栈', 'strengths'],
  ['项目实践', 'projects'],
  ['个人经历', 'about'],
]

const strengths = [
  {
    no: '01',
    title: '音乐 · 节奏',
    text: '吉他七级、架子鼓七级。多年练习让我拥有稳定的节奏感、专注力，以及和乐队成员配合的意识；音乐也是我保持创造力的重要方式。',
    tags: ['吉他 VII', '架子鼓 VII', '节奏感'],
    image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80',
    alt: '一把电吉他的局部特写',
  },
  {
    no: '02',
    title: '舞蹈 · 表达',
    text: '校街舞社成员。舞蹈训练让我更懂得节奏、空间和身体控制，也让我在团队排练与舞台表达中建立自信。',
    tags: ['街舞', '舞台表现', '团队协作'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=80',
    alt: '舞者在舞台上的动态剪影',
  },
  {
    no: '03',
    title: '跆拳道 · 自律',
    text: '校跆拳道代表队成员。蓝红带训练阶段让我学会在压力下保持专注，以纪律、耐力和行动力完成目标，并尊重每一次对练。',
    tags: ['校代表队', '自律', '执行力'],
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=900&q=80',
    alt: '跆拳道训练中的运动员',
  },
  {
    no: '04',
    title: '计算机 · 逻辑',
    text: '对代码与底层原理保持强烈好奇。正在系统学习编程基础、网页开发与算法思维，善于拆解问题，把新想法快速做成可验证的作品。',
    tags: ['CS', '创新思考', '持续学习'],
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    alt: '屏幕上的代码与键盘',
  },
]

function OrbitButton({ href, label = '了解更多', compact = false }) {
  return (
    <a className={`simple-action ${compact ? 'compact' : ''}`} href={href} aria-label={label}>
      <ArrowUpRight size={compact ? 17 : 20} />
    </a>
  )
}

function RevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible') })
    }, { threshold: .14 })
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])
  return null
}

function ScrollProgress() {
  useEffect(() => {
    const bar = document.querySelector('.scroll-progress')
    if (!bar) return undefined
    const update = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      bar.style.transform = `scaleX(${max > 0 ? root.scrollTop / max : 0})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="scroll-progress" aria-hidden="true" />
}

function Header() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('top')
      setSolid(hero ? hero.getBoundingClientRect().bottom <= 90 : false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  return (
    <header className={solid ? 'header solid' : 'header'}>
      <a className="brand" href="#top" aria-label="返回顶部"><span>ZD</span><b>/ 01</b></a>
      <nav className={open ? 'nav open' : 'nav'}>
        {nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <a className="header-cta" href="mailto:17789264031@163.com">与我联系 <ArrowUpRight size={16} /></a>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="切换菜单">{open ? <X /> : <Menu />}</button>
    </header>
  )
}

function Hero() {
  useEffect(() => {
    const video = document.querySelector('.hero video')
    if (!video) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.08 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return (
    <section className="hero" id="top">
      <video autoPlay muted playsInline preload="auto" poster="" disablePictureInPicture aria-hidden="true" onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = 0.82
      }} onTimeUpdate={(event) => {
        if (event.currentTarget.currentTime >= 10) {
          event.currentTarget.currentTime = 0.04
          event.currentTarget.playbackRate = 0.82
          event.currentTarget.play().catch(() => {})
        }
      }}>
        <source src="/hero-robot.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade" />
      <div className="hero-grid" />
      <aside className="hero-rail">
        <div className="rail-menu"><Menu size={18}/><span>菜单</span></div>
        <div className="rail-share"><span>分享</span><Share2 size={15}/></div>
      </aside>
      <div className="hero-content shell">
        <div className="hero-name" aria-label="赵渡霄">
          <span>ZHAO</span><strong>DUXIAO</strong>
          <small>计算机学生 / 创作者</small>
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><span /> COMPUTER SCIENCE & TECHNOLOGY / 2026</p>
          <h1 className="geno-title personal-title"><small>赵渡霄 · 大一学生 · 计算机科学与技术</small><b>BUILDING</b><span>WITH LOGIC</span></h1>
          <p className="hero-cn">用代码书写未来，用热爱感受生活。</p>
        </div>
        <div className="hero-actions" aria-label="首屏导航">
          <a className="hero-action hero-action-primary" href="#profile"><span><small>01 / PROFILE</small>查看能力档案</span><ArrowUpRight size={20}/></a>
          <a className="hero-action hero-action-secondary" href="#projects"><span><small>02 / PROJECTS</small>进入项目实践</span><ArrowUpRight size={20}/></a>
        </div>
        <div className="hero-motto" aria-label="个人理念"><span>用代码改写未来</span><i/> <span>用热爱感受生活</span></div>
        <div className="hero-pager"><b>01</b><i/><span>02</span></div>
      </div>
      <div className="hero-outline" aria-hidden="true">CREATE</div>
    </section>
  )
}

function About() {
  return (
    <section className="about section shell" id="about">
      <div className="section-mark"><span>03</span><p>个人经历 / ABOUT</p></div>
      <div className="about-layout" data-reveal>
        <div className="portrait" aria-label="个人形象占位图">
          <div className="portrait-code">思考<br />创造<br />迭代</div>
          <div className="portrait-orbit" />
          <Code2 size={74} strokeWidth={1} />
          <p>个人形象<br />即将更新</p>
        </div>
        <div className="about-copy">
          <p className="kicker">你好，我是一名大一新生。</p>
          <h2>真正的潜力，<br />应该被<span className="english-impact">MADE VISIBLE</span></h2>
          <p className="intro">就读于计算机科学与技术专业。我善于思考和创新，对技术始终保持旺盛的学习欲。吉他、架子鼓、舞蹈与跆拳道塑造了我的节奏感、表达力和执行力，也让我用更多元的视角理解问题。</p>
          <div className="meta">
            <div><small>身份</small><b>计算机专业 · 本科在读</b></div>
            <div><small>组织</small><b>校文艺部 / 街舞社</b></div>
            <div><small>校队</small><b>跆拳道代表队</b></div>
            <div><small>邮箱</small><b><a href="mailto:17789264031@163.com">17789264031@163.com</a></b></div>
            <div><small>手机</small><b><a href="tel:18740312786">187 4031 2786</a></b></div>
          </div>
          <div className="about-action"><OrbitButton href="#projects" label="继续查看我的项目" /><span>继续查看<br/>我的项目实践</span></div>
        </div>
      </div>
      <div className="stats" data-reveal>
        <div><strong>01</strong><span>主修专业 · 计算机科学与技术</span></div>
        <div><strong>04</strong><span>持续训练的核心能力方向</span></div>
        <div><strong>03</strong><span>正在沉淀的项目实践</span></div>
      </div>
      <div className="proof-strip" data-reveal>
        <span>LEARNING SIGNAL</span><b>Python</b><b>Algorithms</b><b>Web Basics</b><b>Independent Practice</b><small>持续构建中 / 01</small>
      </div>
    </section>
  )
}

function ProjectVisual({ type }) {
  if (type === 'terminal') return <div className="terminal"><div className="term-top"><i/><i/><i/></div><code><em>$</em> build --idea<br/><span>Analyzing possibility...</span><br/><em>✓</em> Prototype ready<br/><b>100%</b></code></div>
  if (type === 'music') return <div className="sound"><div className="disc"><span>07</span></div><div className="wave">{Array.from({length: 24}).map((_,i)=><i key={i} style={{height:`${18 + (i*17)%72}%`}} />)}</div><p>RHYTHM / SYSTEM</p></div>
  return <div className="strategy"><div className="motion-lines">{Array.from({length: 7}).map((_,i)=><i key={i} />)}</div><p>MOVE WITH<br/><b>DISCIPLINE.</b></p></div>
}

function Projects() {
  const cards = [
    {id:'001', title:'新生代码实验室', desc:'记录算法、网页与计算机基础学习的持续型数字档案。', tech:'Python · HTML / CSS · Git', type:'terminal', className:'wide'},
    {id:'002', title:'节奏可视化', desc:'把鼓点与音色转化为实时动态图形的创意编程概念。', tech:'JavaScript · Canvas · 交互', type:'music'},
    {id:'003', title:'动作训练日志', desc:'记录舞蹈与跆拳道训练进度、动作完成度和成长轨迹的工具概念。', tech:'产品思维 · 数据记录 · UI', type:'strategy'},
  ]
  return (
    <section className="projects section" id="projects">
      <div className="shell">
        <div className="section-mark light"><span>03</span><p>项目实践 / SELECTED PROJECTS</p></div>
        <div className="project-head"><h2>每一个项目<br /><span className="english-impact">IS A PROOF</span></h2><p>从问题定义到原型实现，记录我如何学习、拆解、验证并交付一个完整的计算机作品。</p></div>
        <div className="project-grid">
          {cards.map(card => <article className={`project-card ${card.className || ''}`} key={card.id} data-reveal>
            <div className="project-visual"><ProjectVisual type={card.type} /></div>
            <div className="project-info"><small>{card.id} / 概念项目</small><h3>{card.title}</h3><p>{card.desc}</p><span className="project-tech">{card.tech}</span><OrbitButton compact href="#profile" label={`进一步了解${card.title}`} /></div>
          </article>)}
        </div>
      </div>
    </section>
  )
}

function Strengths() {
  return (
    <section className="strengths section shell" id="strengths">
      <div className="section-mark"><span>02</span><p>技术栈 / SKILLS & METHODS</p></div>
      <div className="strength-head"><h2>把学习变成<br /><span className="english-impact">VISIBLE SKILLS</span></h2><p>兴趣带来专注，技术训练带来解决问题的路径。</p></div>
      <div className="strength-grid">{strengths.map(item => <article key={item.no} data-reveal>
        <div className="strength-image"><img src={item.image} alt={item.alt} loading="lazy" /></div><div className="strength-no">{item.no}</div><h3>{item.title}</h3><p>{item.text}</p><div className="tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div><OrbitButton compact href="#profile" label={`了解${item.title}`} />
      </article>)}</div>
    </section>
  )
}

function Profile() {
  return (
    <section className="contact profile-section" id="profile">
      <div className="contact-noise" />
      <div className="profile-outline" aria-hidden="true">PROFILE</div>
      <div className="shell contact-inner">
        <div className="section-mark light"><span>01</span><p>能力概览 / TECHNICAL PROFILE</p></div>
        <div className="profile-layout">
          <div className="profile-intro">
            <p className="profile-overline">计算机科学与技术 · 本科在读</p>
            <h2><span>赵渡霄</span><small>ZHAO DUXIAO / COMPUTER SCIENCE</small></h2>
            <p>我正在建立扎实的编程基础、算法思维与工程实践能力。面对问题，我习惯先拆解、再验证、持续迭代，把学习过程沉淀成可以运行和展示的成果。</p>
            <a className="profile-mail" href="#projects">查看项目实践 <ArrowUpRight size={18}/></a>
          </div>
          <div className="profile-details">
            <p className="profile-label">核心信息 / CORE DATA</p>
            <div className="profile-status"><span><i />持续学习中</span><span>FIRST YEAR / CS</span></div>
            <dl>
              <div><dt>姓名：</dt><dd>赵渡霄</dd></div>
              <div><dt>电话：</dt><dd><a href="tel:18740312786">187 4031 2786</a></dd></div>
              <div><dt>邮箱：</dt><dd><a href="mailto:17789264031@163.com">17789264031@163.com</a></dd></div>
              <div><dt>MBTI：</dt><dd>ENTJ</dd></div>
              <div><dt>擅长：</dt><dd>Python</dd></div>
              <div><dt>方向：</dt><dd>编程基础 · 算法思维 · 网页开发</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return <footer className="site-footer" id="contact"><div className="shell"><p>赵渡霄个人简历网站</p><p>© 2026 · 个人作品集</p><a href="#top">返回顶部 <ArrowUpRight size={14}/></a></div></footer>
}

function App(){ return <><ScrollProgress/><RevealObserver/><Header/><main><Hero/><Profile/><Strengths/><About/><Projects/></main><Footer/></> }

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
