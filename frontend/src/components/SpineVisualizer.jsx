import React, { useState } from 'react'
import { Eye, EyeOff, AlertTriangle, Layers, Activity, CheckCircle2 } from 'lucide-react'
import { SPINE_PROFILES } from '../data/spineScanProfiles'

export default function SpineVisualizer({
  imageUrl = '/sample_lateral_xray.jpg',
  landmarks = null,
  profile = null,
  anomalyLabel = null,
  showControls = true,
  interactive = true,
  maxHeight = '540px',
  revealedCount = null,
}) {
  const [showCenterline, setShowCenterline] = useState(true)
  const [showOutlines, setShowOutlines] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showAnomalyGlow, setShowAnomalyGlow] = useState(true)
  const [activeNode, setActiveNode] = useState(null)

  // Determine active landmarks
  const activeLandmarks = landmarks || profile?.landmarks || SPINE_PROFILES.lumbar_lateral.landmarks
  const visibleLandmarks = revealedCount !== null
    ? activeLandmarks.slice(0, revealedCount)
    : activeLandmarks

  // Curvature centerline SVG path
  const centerPathD = activeLandmarks.length > 0
    ? `M ${activeLandmarks[0].cx} ${activeLandmarks[0].cy} ` +
      activeLandmarks.slice(1).map(p => `L ${p.cx} ${p.cy}`).join(' ')
    : ''

  // Anomaly point
  const highlightLm = visibleLandmarks.find(lm => lm.highlight)

  const displayAnomalyText = anomalyLabel ||
    profile?.metrics?.targetAnomaly ||
    (highlightLm ? `${highlightLm.label}: ${highlightLm.status}` : 'Pathology Identified')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Visualizer Frame */}
      <div
        style={{
          width: '100%',
          maxHeight,
          background: '#030712',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid rgba(0, 191, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 191, 255, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Relative image canvas container */}
        <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', maxHeight }}>
          {/* Underneath Spine X-Ray Image */}
          <img
            src={imageUrl}
            alt="Spine Radiograph"
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight,
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />

          {/* SVG Plotted Overlay */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-alert" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Vertebra Outlines (Thin Blue Lines) */}
          {showOutlines &&
            visibleLandmarks
              .filter(lm => lm.box)
              .map(lm => {
                const isSelected = activeNode?.id === lm.id
                return (
                  <g key={`box-${lm.id}`}>
                    <rect
                      x={lm.box.x}
                      y={lm.box.y}
                      width={lm.box.w}
                      height={lm.box.h}
                      rx="0.5"
                      fill={isSelected ? 'rgba(0, 210, 255, 0.12)' : 'rgba(0, 180, 255, 0.03)'}
                      stroke={isSelected ? '#00D2FF' : '#38BDF8'}
                      strokeWidth={isSelected ? '0.5' : '0.28'}
                      strokeOpacity={isSelected ? 0.95 : 0.65}
                    />
                  </g>
                )
              })}

          {/* 2. Spinal Curvature Centerline */}
          {showCenterline && centerPathD && (
            <path
              d={centerPathD}
              fill="none"
              stroke="#7EBA8C"
              strokeWidth="0.32"
              strokeDasharray="0.8 0.4"
              strokeOpacity="0.85"
            />
          )}

          {/* 3. Horizontal Connector lines from Landmark to Label Badge */}
          {showLabels &&
            visibleLandmarks.map(lm => {
              const badgeX = lm.side === 'left' ? 26.5 : 73.5
              const isSelected = activeNode?.id === lm.id
              return (
                <line
                  key={`conn-${lm.id}`}
                  x1={lm.cx}
                  y1={lm.cy}
                  x2={badgeX}
                  y2={lm.cy}
                  stroke={lm.color}
                  strokeWidth={isSelected ? '0.45' : '0.25'}
                  strokeOpacity={isSelected ? 1 : 0.75}
                />
              )
            })}

          {/* 4. Pathology Alert Pulsing Ring for target anomaly */}
          {showAnomalyGlow && highlightLm && (
            <g>
              <circle
                cx={highlightLm.cx}
                cy={highlightLm.cy}
                r="3.2"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="0.4"
                strokeOpacity="0.8"
                filter="url(#glow-alert)"
              >
                <animate attributeName="r" values="2;4.4;2" dur="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* 5. Center Landmarks (Vertebra Circles & Disc Diamonds) */}
          {visibleLandmarks.map(lm => {
            const isHovered = activeNode?.id === lm.id
            if (lm.type === 'vertebra') {
              return (
                <g key={`node-${lm.id}`}>
                  {/* Subtle outer glow ring */}
                  <circle
                    cx={lm.cx}
                    cy={lm.cy}
                    r={isHovered ? 1.6 : 1.15}
                    fill={lm.color}
                    fillOpacity="0.25"
                  />
                  {/* Main solid circle */}
                  <circle
                    cx={lm.cx}
                    cy={lm.cy}
                    r={isHovered ? 1.0 : 0.75}
                    fill={lm.color}
                    stroke="#FFFFFF"
                    strokeWidth="0.22"
                  />
                  {/* White center point */}
                  <circle cx={lm.cx} cy={lm.cy} r="0.25" fill="#FFFFFF" />
                </g>
              )
            } else {
              // Disc Diamond (rotated square)
              const dSize = isHovered ? 1.05 : 0.8
              return (
                <g key={`node-${lm.id}`}>
                  <rect
                    x={lm.cx - dSize}
                    y={lm.cy - dSize}
                    width={dSize * 2}
                    height={dSize * 2}
                    transform={`rotate(45 ${lm.cx} ${lm.cy})`}
                    fill={lm.color}
                    stroke="#FFFFFF"
                    strokeWidth="0.22"
                  />
                  <circle cx={lm.cx} cy={lm.cy} r="0.22" fill="#FFFFFF" />
                </g>
              )
            }
          })}
        </svg>

        {/* 6. HTML Overlay for Badges */}
        {showLabels &&
          visibleLandmarks.map(lm => {
            const isHovered = activeNode?.id === lm.id
            const isLeft = lm.side === 'left'

            return (
              <div
                key={`badge-${lm.id}`}
                onMouseEnter={() => interactive && setActiveNode(lm)}
                onMouseLeave={() => interactive && setActiveNode(null)}
                style={{
                  position: 'absolute',
                  top: `${lm.cy}%`,
                  left: isLeft ? '26.5%' : '73.5%',
                  transform: isLeft ? 'translate(-100%, -50%)' : 'translate(0%, -50%)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  background: 'rgba(10, 16, 30, 0.94)',
                  border: `1.5px solid ${lm.color}`,
                  color: '#FFFFFF',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  boxShadow: isHovered
                    ? `0 0 14px ${lm.color}, 0 2px 8px rgba(0,0,0,0.8)`
                    : lm.highlight
                    ? '0 0 12px rgba(244,63,94,0.6)'
                    : '0 2px 8px rgba(0,0,0,0.6)',
                  cursor: interactive ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: isHovered ? 20 : 10,
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <span>{lm.label}</span>
                <span style={{ color: lm.color, fontSize: '10.5px', opacity: 0.95 }}>{lm.score}</span>
              </div>
            )
          })}

        {/* 7. Top-Left Legend matching reference media_1793113286450.png */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(8, 12, 22, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '10px 14px',
            backdropFilter: 'blur(10px)',
            zIndex: 15,
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          {/* Vertebra */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#00D2FF',
                border: '1.5px solid #FFFFFF',
                boxShadow: '0 0 6px #00D2FF',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F1F5F9' }}>Vertebra</span>
          </div>

          {/* Disc */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                background: '#00A3FF',
                border: '1.5px solid #FFFFFF',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 6px #00A3FF',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F1F5F9' }}>Disc</span>
          </div>

          {/* Vertebra outline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '14px',
                height: '2px',
                background: '#38BDF8',
                borderRadius: '1px',
                boxShadow: '0 0 4px #38BDF8',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#CBD5E1' }}>
              Vertebra outline (thin lines)
            </span>
          </div>
        </div>

        {/* 8. Top-Right Pathology Badge */}
        {highlightLm && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.45)',
              borderRadius: '999px',
              padding: '5px 12px',
              backdropFilter: 'blur(8px)',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#F43F5E',
                boxShadow: '0 0 8px #F43F5E',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF708F', letterSpacing: '0.02em' }}>
              {displayAnomalyText}
            </span>
          </div>
        )}

        {/* 9. Active Hovered Landmark Tooltip */}
        {activeNode && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(10, 15, 26, 0.95)',
              border: `1.5px solid ${activeNode.color}`,
              borderRadius: '10px',
              padding: '8px 16px',
              backdropFilter: 'blur(8px)',
              zIndex: 25,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              minWidth: '280px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: activeNode.type === 'vertebra' ? '50%' : '1px',
                transform: activeNode.type === 'vertebra' ? 'none' : 'rotate(45deg)',
                background: activeNode.color,
                boxShadow: `0 0 8px ${activeNode.color}`,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>{activeNode.label} Landmark</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: activeNode.highlight ? 'rgba(244,63,94,0.2)' : 'rgba(34,197,94,0.18)',
                    color: activeNode.highlight ? '#F43F5E' : '#22C55E',
                    border: `1px solid ${activeNode.highlight ? 'rgba(244,63,94,0.4)' : 'rgba(34,197,94,0.3)'}`,
                  }}
                >
                  {activeNode.status}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{activeNode.desc}</p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Interactive Controls Strip */}
      {showControls && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '8px 14px',
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px solid rgba(133, 57, 83, 0.15)',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="var(--primary, #853953)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark, #1E293B)' }}>
              Spine Overlay Controls:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowOutlines(!showOutlines)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: showOutlines ? '#00D2FF' : 'rgba(100,116,139,0.3)',
                background: showOutlines ? 'rgba(0, 210, 255, 0.12)' : 'transparent',
                color: showOutlines ? '#0284C7' : 'var(--text-muted, #64748B)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showOutlines ? '✓ Vertebra Outlines' : 'Outlines Off'}
            </button>

            <button
              onClick={() => setShowCenterline(!showCenterline)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: showCenterline ? '#22C55E' : 'rgba(100,116,139,0.3)',
                background: showCenterline ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                color: showCenterline ? '#16A34A' : 'var(--text-muted, #64748B)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showCenterline ? '✓ Spinal Centerline' : 'Centerline Off'}
            </button>

            <button
              onClick={() => setShowLabels(!showLabels)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: showLabels ? '#853953' : 'rgba(100,116,139,0.3)',
                background: showLabels ? 'rgba(133, 57, 83, 0.12)' : 'transparent',
                color: showLabels ? '#853953' : 'var(--text-muted, #64748B)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showLabels ? '✓ Landmark Labels' : 'Labels Off'}
            </button>

            <button
              onClick={() => setShowAnomalyGlow(!showAnomalyGlow)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: showAnomalyGlow ? '#F43F5E' : 'rgba(100,116,139,0.3)',
                background: showAnomalyGlow ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                color: showAnomalyGlow ? '#E11D48' : 'var(--text-muted, #64748B)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showAnomalyGlow ? '✓ Pathology Alert' : 'Pathology Off'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
