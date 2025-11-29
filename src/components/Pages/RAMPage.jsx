import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Search, ArrowRight } from 'lucide-react';
import { useSimulatorContext } from '../../context/SimulatorContext';

export function RAMPage() {
    const navigate = useNavigate();
    const { sim, memory } = useSimulatorContext(); // Get reactive memory state
    const [searchTerm, setSearchTerm] = useState('');

    // Get all memory entries
    const memoryEntries = useMemo(() => {
        if (!memory) return [];
        return Object.entries(memory).map(([addr, val]) => ({
            address: parseInt(addr),
            value: val
        })).sort((a, b) => a.address - b.address);
    }, [memory]); // Depend on reactive memory state

    const filteredEntries = useMemo(() => {
        if (!searchTerm) return memoryEntries;
        const term = searchTerm.toLowerCase();
        return memoryEntries.filter(entry =>
            `0x${entry.address.toString(16)}`.includes(term) ||
            entry.address.toString().includes(term)
        );
    }, [memoryEntries, searchTerm]);

    return (
        <section className="view active">
            <div className="view-header">
                <button className="btn-back" onClick={() => navigate('/simulator')}>← Back to System</button>
                <h2>Main Memory (RAM)</h2>
            </div>
            <div className="ram-container glass-panel">
                <div className="ram-controls">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            id="ramSearch"
                            placeholder="Search Address (e.g., 0x100)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ram-stats">
                        <span>Used Blocks: <strong>{memoryEntries.length}</strong></span>
                    </div>
                </div>

                <div className="ram-grid-wrapper">
                    {memoryEntries.length === 0 ? (
                        <div className="empty-state">
                            <Database size={64} style={{ marginBottom: '24px', opacity: 0.3, color: '#3b82f6' }} />
                            <h3>Memory Empty</h3>
                            <p>No data has been written to RAM yet. Run a simulation with <code>SW</code> instructions or cache evictions to see data here.</p>
                        </div>
                    ) : (
                        <div className="ram-data-grid">
                            {filteredEntries.map((entry) => (
                                <div key={entry.address} className="ram-block">
                                    <div className="ram-addr">0x{entry.address.toString(16).toUpperCase().padStart(3, '0')}</div>
                                    <div className={`ram-val ${typeof entry.value === 'string' ? 'string' : 'number'}`}>
                                        {typeof entry.value === 'string' ? `"${entry.value}"` : entry.value}
                                    </div>
                                </div>
                            ))}
                            {filteredEntries.length === 0 && (
                                <div className="no-results">
                                    No memory blocks found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .ram-container {
                    padding: 24px;
                    height: calc(100vh - 140px);
                    display: flex;
                    flex-direction: column;
                }
                
                .ram-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                
                .search-box {
                    position: relative;
                    width: 300px;
                }
                
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }
                
                .search-box input {
                    width: 100%;
                    padding: 10px 12px 10px 40px;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-primary);
                    outline: none;
                }
                
                .search-box input:focus {
                    border-color: var(--accent-color);
                }
                
                .ram-stats {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                
                .ram-grid-wrapper {
                    flex: 1;
                    overflow-y: auto;
                    background: rgba(0,0,0,0.1);
                    border-radius: 12px;
                    padding: 16px;
                }
                
                .ram-data-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 12px;
                }
                
                .ram-block {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    transition: all 0.2s;
                }
                
                .ram-block:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                    border-color: var(--accent-color);
                }
                
                .ram-addr {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                
                .ram-val {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--accent-color);
                    word-break: break-all;
                }
                
                .ram-val.string {
                    color: #a5b4fc; /* Light Indigo for strings */
                }
                
                .ram-val.number {
                    color: #34d399; /* Emerald for numbers */
                }
                
                .empty-state, .no-results {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--text-secondary);
                    text-align: center;
                }
            `}</style>
        </section>
    );
}
