import { useState } from 'react'
import { Search, BookOpen, ExternalLink, Tag, Brain, Zap, ChevronRight } from 'lucide-react'

const categories = ['All', 'Guidelines', 'Case Studies', 'Research Papers', 'Treatment Protocols', 'Anatomy']

const articles = [
  { id: 1, title: 'Lumbar Disc Herniation: Clinical Guidelines 2024', category: 'Guidelines',        tags: ['Lumbar','Disc','Guidelines'],         excerpt: 'Updated clinical guidelines for diagnosis and management of lumbar disc herniation including conservative and surgical approaches.', date: 'Jan 2024', reads: 342, relevance: 98 },
  { id: 2, title: 'AI-Assisted Spine Imaging: Systematic Review',     category: 'Research Papers',   tags: ['AI','Imaging','MRI'],                 excerpt: 'Comprehensive systematic review of AI and machine learning applications in spine imaging and diagnosis with performance benchmarks.', date: 'Mar 2024', reads: 218, relevance: 95 },
  { id: 3, title: 'Grade III Spondylolisthesis: Surgical Outcomes',   category: 'Case Studies',      tags: ['Surgery','Spondylolisthesis'],        excerpt: 'Multi-center case study examining surgical outcomes for Grade III spondylolisthesis in patients aged 50–70 years.', date: 'Feb 2024', reads: 156, relevance: 87 },
  { id: 4, title: 'Conservative Management: Physical Therapy',        category: 'Treatment Protocols',tags: ['Physical Therapy','Conservative'],   excerpt: 'Evidence-based physical therapy protocols for non-surgical management of lumbar spine conditions including exercise programs.', date: 'Dec 2023', reads: 421, relevance: 82 },
  { id: 5, title: 'Cervical Spine Anatomy & Biomechanics',            category: 'Anatomy',           tags: ['Cervical','Anatomy'],                 excerpt: 'Detailed atlas of cervical spine anatomy with clinical correlations and common pathological presentations with imaging examples.', date: 'Nov 2023', reads: 287, relevance: 75 },
  { id: 6, title: 'MRI vs X-Ray in Disc Assessment',                 category: 'Research Papers',   tags: ['MRI','X-ray','Comparison'],          excerpt: 'Head-to-head comparison of MRI and X-ray imaging modalities for disc space assessment and severity grading accuracy.', date: 'Apr 2024', reads: 193, relevance: 91 },
]

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || a.category === cat
    return matchSearch && matchCat
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Knowledge Base</h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>RAG-powered medical knowledge retrieval for clinical decisions</p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Brain size={20} color="#6366F1" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ask a clinical question or search medical literature..."
          style={{ width: '100%', paddingLeft: '52px', paddingRight: '160px', paddingTop: '16px', paddingBottom: '16px', fontSize: '15px', fontFamily: 'inherit', border: '2px solid #E2E8F0', borderRadius: '16px', background: 'white', outline: 'none', lineHeight: '1.5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          onFocus={e => { e.target.style.borderColor = '#818CF8'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
        />
        <button className="btn btn-primary" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '10px 20px' }}>
          <Zap size={15} /> AI Search
        </button>
      </div>

      {/* AI Suggestion */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px 24px', background: 'linear-gradient(135deg,#EEF2FF,#E0F2FE)', border: '1px solid #C7D2FE', borderRadius: '18px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Brain size={18} color="white" />
        </div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#3730A3' }}>AI Recommendation</p>
          <p style={{ fontSize: '14px', color: '#475569', marginTop: '6px', lineHeight: '1.6' }}>
            Based on your recent patient (Rohit Kumar, Grade II Lumbar Disc), here are relevant articles on conservative management and progression monitoring.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: '9px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
            border: cat === c ? 'none' : '1.5px solid #E2E8F0',
            background: cat === c ? 'linear-gradient(135deg,#4F46E5,#6366F1)' : 'white',
            color: cat === c ? 'white' : '#64748B', cursor: 'pointer',
            boxShadow: cat === c ? '0 4px 14px rgba(79,70,229,0.3)' : 'none',
            transition: 'all 0.2s', fontFamily: 'inherit'
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {filtered.map(article => (
          <div key={article.id} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={18} color="#4F46E5" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: '1.4' }}>{article.title}</h3>
                  <span style={{ display: 'inline-block', marginTop: '6px', padding: '3px 12px', background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{article.category}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#4F46E5' }}>{article.relevance}%</p>
                <p style={{ fontSize: '11px', color: '#94A3B8' }}>relevance</p>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '14px' }}>{article.excerpt}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {article.tags.map(tag => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', background: '#F1F5F9', color: '#64748B', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>
                  <Tag size={10} />{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>{article.date} · {article.reads} reads</p>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Read More <ExternalLink size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
