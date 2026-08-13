import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const monthlyData = [
  { month: 'Jan', analyses: 28, reports: 12 },
  { month: 'Feb', analyses: 35, reports: 18 },
  { month: 'Mar', analyses: 42, reports: 22 },
  { month: 'Apr', analyses: 38, reports: 19 },
  { month: 'May', analyses: 56, reports: 28 },
]

const severityData = [
  { name: 'Grade I',   value: 38, color: '#10B981' },
  { name: 'Grade II',  value: 31, color: '#F59E0B' },
  { name: 'Grade III', value: 21, color: '#EF4444' },
  { name: 'Grade IV',  value: 10, color: '#7C3AED' },
]

const scanTypeData = [
  { type: 'X-ray', lumbar: 45, cervical: 12, thoracic: 8  },
  { type: 'MRI',   lumbar: 38, cervical: 22, thoracic: 15 },
  { type: 'CT',    lumbar: 12, cervical: 5,  thoracic: 4  },
]

const kpis = [
  { label: 'Total Analyses',    value: '199',   change: '+18%', up: true,  color: '#4F46E5' },
  { label: 'Avg. Accuracy',     value: '95.2%', change: '+1.3%',up: true,  color: '#059669' },
  { label: 'Avg. Response',     value: '11.8s', change: '-0.4s',up: true,  color: '#0891B2' },
  { label: 'High Risk Cases',   value: '31',    change: '+4',   up: false, color: '#DC2626' },
]

const ttStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px', padding: '10px 14px' }

export default function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1300px' }} className="animate-fadeIn">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Analytics</h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginTop: '6px' }}>Insights into patient outcomes and system performance</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
        {kpis.map(({ label, value, change, up, color }) => (
          <div key={label} style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
            <p style={{ fontSize: '32px', fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: up ? '#059669' : '#DC2626', marginTop: '8px' }}>
              {up ? '▲' : '▼'} {change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Area + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Monthly Activity Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gAnalyses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06B6D4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }} />
              <Area type="monotone" dataKey="analyses" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gAnalyses)" name="Analyses" />
              <Area type="monotone" dataKey="reports"  stroke="#06B6D4" strokeWidth={2.5} fill="url(#gReports)"  name="Reports"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                {severityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={ttStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            {severityData.map(({ name, value, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '999px', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#64748B' }}>{name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', marginLeft: 'auto' }}>{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Scan Type by Region</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={scanTypeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={ttStyle} />
            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }} />
            <Bar dataKey="lumbar"   name="Lumbar"   fill="#4F46E5" radius={[6,6,0,0]} />
            <Bar dataKey="cervical" name="Cervical" fill="#06B6D4" radius={[6,6,0,0]} />
            <Bar dataKey="thoracic" name="Thoracic" fill="#10B981" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
