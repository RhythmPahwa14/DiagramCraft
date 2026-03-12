import { useState } from "react";

const THEMES = [
  { value: 'default', label: 'Default', color: '#4A90E2' },
  { value: 'forest', label: 'Forest', color: '#52B788' },
  { value: 'dark', label: 'Dark', color: '#374151' },
  { value: 'neutral', label: 'Neutral', color: '#94A3B8' },
  { value: 'base', label: 'Base', color: '#F59E0B' },
  { value: 'custom', label: 'Custom', color: 'linear-gradient(135deg, #FFB6C1 0%, #B0E0E6 50%, #DDA0DD 100%)' },
];

const COLOR_OPTIONS = [
  { key: 'primaryColor', label: 'Primary Color', description: 'Main element color' },
  { key: 'primaryTextColor', label: 'Primary Text', description: 'Text color in primary elements' },
  { key: 'secondaryColor', label: 'Secondary Color', description: 'Secondary elements' },
  { key: 'secondaryTextColor', label: 'Secondary Text', description: 'Text in secondary elements' },
  { key: 'tertiaryColor', label: 'Tertiary Color', description: 'Accent color' },
  { key: 'tertiaryTextColor', label: 'Tertiary Text', description: 'Text in tertiary elements' },
  { key: 'mainBkg', label: 'Node Background', description: 'Background for nodes' },
  { key: 'secondBkg', label: 'Secondary Background', description: 'Alt background' },
  { key: 'lineColor', label: 'Line Color', description: 'Connecting lines' },
  { key: 'primaryBorderColor', label: 'Primary Border', description: 'Main borders' },
  { key: 'nodeBorder', label: 'Node Border', description: 'Node outlines' },
  { key: 'textColor', label: 'General Text', description: 'Overall text color' },
  { key: 'labelColor', label: 'Label Text', description: 'Arrow/edge label text' },
  { key: 'labelTextColor', label: 'Label Text Color', description: 'Additional label text setting' },
  { key: 'edgeLabelColor', label: 'Edge Label Color', description: 'Text color on arrow labels' },
  { key: 'edgeLabelBackground', label: 'Label Background', description: 'Background for edge labels' },
  { key: 'background', label: 'Canvas Background', description: 'Overall background' },
  { key: 'clusterBkg', label: 'Cluster Background', description: 'Subgraph background' },
  { key: 'clusterBorder', label: 'Cluster Border', description: 'Subgraph border' },
];

const COLOR_PRESETS = {
  pastel: {
    name: 'Soft Pastel',
    colors: {
      primaryColor: '#F8BBD0',
      primaryTextColor: '#1A1A1A',
      secondaryColor: '#C5E1A5',
      secondaryTextColor: '#1A1A1A',
      tertiaryColor: '#FFCCBC',
      tertiaryTextColor: '#1A1A1A',
      primaryBorderColor: '#F06292',
      lineColor: '#757575',
      background: '#FAFAFA',
      mainBkg: '#FFF0F5',
      secondBkg: '#F0F4C3',
      nodeBorder: '#E91E63',
      clusterBkg: '#FCE4EC',
      clusterBorder: '#F48FB1',
      textColor: '#1A1A1A',
      labelColor: '#1A1A1A',
      labelTextColor: '#1A1A1A',
      edgeLabelBackground: 'rgba(0,0,0,0)',
      edgeLabelColor: '#1A1A1A',
      git0: '#E1BEE7',
      git1: '#B2DFDB',
      git2: '#FFE0B2',
      git3: '#FFCCBC',
      git4: '#C5E1A5',
      git5: '#F8BBD0',
      git6: '#BBDEFB',
      git7: '#E6EE9C',
    }
  },
  ocean: {
    name: 'Ocean Breeze',
    colors: {
      primaryColor: '#B2EBF2',
      primaryTextColor: '#004D40',
      secondaryColor: '#C8E6C9',
      secondaryTextColor: '#1B5E20',
      tertiaryColor: '#E0F2F1',
      tertiaryTextColor: '#00695C',
      primaryBorderColor: '#26C6DA',
      lineColor: '#607D8B',
      background: '#F1F8F9',
      mainBkg: '#E0F7FA',
      secondBkg: '#E8F5E9',
      nodeBorder: '#00ACC1',
      clusterBkg: '#E0F2F1',
      clusterBorder: '#4DB6AC',
      textColor: '#1A1A1A',
      labelColor: '#1A1A1A',
      labelTextColor: '#1A1A1A',
      edgeLabelBackground: 'rgba(0,0,0,0)',
      edgeLabelColor: '#1A1A1A',
      git0: '#B2EBF2',
      git1: '#C8E6C9',
      git2: '#E0F2F1',
      git3: '#B2DFDB',
      git4: '#C5E1A5',
      git5: '#80DEEA',
      git6: '#A5D6A7',
      git7: '#B2DFDB',
    }
  },
  sunset: {
    name: 'Warm Sunset',
    colors: {
      primaryColor: '#FFCCBC',
      primaryTextColor: '#3E2723',
      secondaryColor: '#FFE0B2',
      secondaryTextColor: '#4E342E',
      tertiaryColor: '#FFCCBC',
      tertiaryTextColor: '#3E2723',
      primaryBorderColor: '#FF7043',
      lineColor: '#8D6E63',
      background: '#FFF8F5',
      mainBkg: '#FBE9E7',
      secondBkg: '#FFF3E0',
      nodeBorder: '#FF5722',
      clusterBkg: '#FFF0E8',
      clusterBorder: '#FFAB91',
      textColor: '#1A1A1A',
      labelColor: '#1A1A1A',
      labelTextColor: '#1A1A1A',
      edgeLabelBackground: 'rgba(0,0,0,0)',
      edgeLabelColor: '#1A1A1A',
      git0: '#FFCCBC',
      git1: '#FFE0B2',
      git2: '#FFAB91',
      git3: '#FFCCBC',
      git4: '#FFE0B2',
      git5: '#FFF3E0',
      git6: '#FBE9E7',
      git7: '#FFCCBC',
    }
  },
  nature: {
    name: 'Fresh Nature',
    colors: {
      primaryColor: '#C5E1A5',
      primaryTextColor: '#1B5E20',
      secondaryColor: '#DCEDC8',
      secondaryTextColor: '#33691E',
      tertiaryColor: '#E8F5E9',
      tertiaryTextColor: '#2E7D32',
      primaryBorderColor: '#9CCC65',
      lineColor: '#689F38',
      background: '#F9FBF7',
      mainBkg: '#E8F5E9',
      secondBkg: '#F1F8E9',
      nodeBorder: '#7CB342',
      clusterBkg: '#F1F8E9',
      clusterBorder: '#AED581',
      textColor: '#1A1A1A',
      labelColor: '#1A1A1A',
      labelTextColor: '#1A1A1A',
      edgeLabelBackground: 'rgba(0,0,0,0)',
      edgeLabelColor: '#1A1A1A',
      git0: '#C5E1A5',
      git1: '#DCEDC8',
      git2: '#E8F5E9',
      git3: '#AED581',
      git4: '#C5E1A5',
      git5: '#DCEDC8',
      git6: '#A5D6A7',
      git7: '#C8E6C9',
    }
  },
  lavender: {
    name: 'Lavender Dream',
    colors: {
      primaryColor: '#E1BEE7',
      primaryTextColor: '#4A148C',
      secondaryColor: '#D1C4E9',
      secondaryTextColor: '#311B92',
      tertiaryColor: '#F3E5F5',
      tertiaryTextColor: '#6A1B9A',
      primaryBorderColor: '#BA68C8',
      lineColor: '#8E24AA',
      background: '#FAF8FC',
      mainBkg: '#F3E5F5',
      secondBkg: '#EDE7F6',
      nodeBorder: '#AB47BC',
      clusterBkg: '#F3E5F5',
      clusterBorder: '#CE93D8',
      textColor: '#1A1A1A',
      labelColor: '#1A1A1A',
      labelTextColor: '#1A1A1A',
      edgeLabelBackground: 'rgba(0,0,0,0)',
      edgeLabelColor: '#1A1A1A',
      git0: '#E1BEE7',
      git1: '#D1C4E9',
      git2: '#F3E5F5',
      git3: '#CE93D8',
      git4: '#E1BEE7',
      git5: '#D1C4E9',
      git6: '#B39DDB',
      git7: '#E1BEE7',
    }
  },
};

export default function PreviewCanvas({ diagramRef, onZoomIn, onZoomOut, onRefresh, theme, onThemeChange, customColors, onColorChange, onBulkColorChange }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleThemeSelect = (themeValue) => {
    onThemeChange(themeValue);
    setShowThemeMenu(false);
    if (themeValue === 'custom') {
      setShowColorPalette(true);
    }
  };

  const currentTheme = THEMES.find(t => t.value === theme) || THEMES[0];
  const isGradient = currentTheme.color.includes('gradient');

  return (
    <div className="flex-1 bg-white flex flex-col relative border-l border-slate-200">
      <div className="h-9 flex items-center px-4 bg-slate-50 border-b border-slate-200 justify-between">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Live Canvas
        </span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="p-1 hover:bg-slate-200 rounded text-slate-600 flex items-center gap-1"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Change Theme"
            >
              <span 
                className="size-3 rounded-full border border-slate-300" 
                style={isGradient ? { 
                  background: currentTheme.color 
                } : { 
                  backgroundColor: currentTheme.color 
                }}
              ></span>
              <span className="text-[10px] font-medium">{currentTheme.label}</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
                  {THEMES.map((t) => {
                    const isThemeGradient = t.color.includes('gradient');
                    return (
                      <button
                        key={t.value}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center gap-2 transition-colors ${
                          theme === t.value ? 'bg-slate-100' : ''
                        }`}
                        onClick={() => handleThemeSelect(t.value)}
                      >
                        <span 
                          className="size-3 rounded-full border border-slate-300" 
                          style={isThemeGradient ? { 
                            background: t.color 
                          } : { 
                            backgroundColor: t.color 
                          }}
                        ></span>
                        <span className="font-medium">{t.label}</span>
                        {theme === t.value && (
                          <span className="material-symbols-outlined text-xs ml-auto text-primary">check</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {theme === 'custom' && (
            <button
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              onClick={() => setShowColorPalette(!showColorPalette)}
              title="Customize Colors"
            >
              <span className="material-symbols-outlined text-sm">palette</span>
            </button>
          )}

          <div className="w-px h-4 bg-slate-300"></div>

          <button
            className="p-1 hover:bg-slate-200 rounded text-slate-600"
            onClick={onZoomIn}
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-sm">zoom_in</span>
          </button>
          <button
            className="p-1 hover:bg-slate-200 rounded text-slate-600"
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-sm">zoom_out</span>
          </button>
          <button
            className="p-1 hover:bg-slate-200 rounded text-slate-600"
            onClick={handleRefresh}
            title="Refresh"
          >
            <span 
              className="material-symbols-outlined text-sm"
              style={{
                display: 'inline-block',
                animation: isRefreshing ? 'rotate360 0.6s ease' : 'none'
              }}
            >
              refresh
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 dot-grid relative flex items-center justify-center p-12 overflow-auto">
        <div ref={diagramRef} className="diagram-container"></div>
      </div>

      {/* Color Palette Modal */}
      {showColorPalette && theme === 'custom' && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowColorPalette(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[85vh] bg-white rounded-xl shadow-2xl z-50 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Custom Color Palette</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize your diagram colors</p>
              </div>
              <button
                onClick={() => setShowColorPalette(false)}
                className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Color Presets */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Quick Presets</h4>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onBulkColorChange(preset.colors);
                      }}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 border border-slate-200 hover:border-primary transition-colors group"
                      title={preset.name}
                    >
                      <div className="flex gap-0.5">
                        <span className="w-3 h-6 rounded-l" style={{ backgroundColor: preset.colors.primaryColor }}></span>
                        <span className="w-3 h-6" style={{ backgroundColor: preset.colors.secondaryColor }}></span>
                        <span className="w-3 h-6 rounded-r" style={{ backgroundColor: preset.colors.tertiaryColor }}></span>
                      </div>
                      <span className="text-[9px] font-medium text-slate-600 group-hover:text-primary text-center leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Custom Colors</h4>
              <div className="grid grid-cols-1 gap-3">
                {COLOR_OPTIONS.map((option) => (
                  <div key={option.key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColors[option.key] || '#000000'}
                      onChange={(e) => onColorChange(option.key, e.target.value)}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer flex-shrink-0"
                      title={option.description}
                    />
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium text-slate-700 block">
                        {option.label}
                      </label>
                      <span className="text-xs text-slate-500">{option.description}</span>
                    </div>
                    <input
                      type="text"
                      value={customColors[option.key] || '#000000'}
                      onChange={(e) => onColorChange(option.key, e.target.value)}
                      className="w-24 px-2 py-1 text-xs border border-slate-300 rounded font-mono flex-shrink-0"
                      placeholder="#000000"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end items-center">
              <button
                onClick={() => setShowColorPalette(false)}
                className="px-6 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
