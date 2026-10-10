import React, { useState, useEffect } from 'react';
import { X, Database, Terminal, Table, Play, CheckCircle, RefreshCw } from 'lucide-react';
import { fetchSqlSchema, executeSqlQuery } from '../services/api.ts';
import { SqlQueryResult } from '../types/index.ts';

interface MysqlStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MysqlStudioModal: React.FC<MysqlStudioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'console' | 'tables' | 'schema'>('console');
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [queryInput, setQueryInput] = useState<string>('SELECT * FROM drives WHERE date_category = "Today";');
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSqlSchema()
      .then((data) => setSchemaSql(data.schemaSql))
      .catch((err) => console.error(err));
    // Run default query
    handleRunQuery('SELECT * FROM drives;');
  }, []);

  const handleRunQuery = async (sqlToRun?: string) => {
    const q = sqlToRun || queryInput;
    setIsRunning(true);
    setErrorMsg(null);
    try {
      const res = await executeSqlQuery(q);
      setQueryResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Execution error');
      setQueryResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 text-slate-100 w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">MySQL Database Studio</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded">
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Database: <span className="text-blue-400">spothire_db</span> · Node.js Backend Engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-950/80 px-4 pt-2 border-b border-slate-800 space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-t-lg font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'console'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive SQL Console</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-t-lg font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'tables'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Live Relational Tables</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-t-lg font-semibold flex items-center space-x-1.5 transition ${
              activeTab === 'schema'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Schema DDL</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 font-sans">
          {activeTab === 'console' && (
            <div className="space-y-3">
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-semibold mr-1">Quick SQL Queries:</span>
                <button
                  type="button"
                  onClick={() => {
                    const q = 'SELECT * FROM drives;';
                    setQueryInput(q);
                    handleRunQuery(q);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700"
                >
                  SELECT * FROM drives
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const q = 'SELECT * FROM interview_passes;';
                    setQueryInput(q);
                    handleRunQuery(q);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700"
                >
                  SELECT * FROM interview_passes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const q = 'SELECT * FROM referrals;';
                    setQueryInput(q);
                    handleRunQuery(q);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700"
                >
                  SELECT * FROM referrals
                </button>
              </div>

              {/* Query Input Box */}
              <div className="relative">
                <textarea
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Enter standard MySQL statement..."
                />
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => handleRunQuery()}
                  className="absolute right-2.5 bottom-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 shadow-sm transition disabled:opacity-50"
                >
                  {isRunning ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  <span>Run Query</span>
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs font-mono">
                  Error: {errorMsg}
                </div>
              )}

              {/* Tabular Output */}
              {queryResult && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{queryResult.rows.length} rows returned</span>
                    </span>
                    <span>Query execution time: {queryResult.executionTimeMs}ms</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-56 bg-slate-950">
                    <table className="w-full text-left border-collapse text-[11px] font-mono">
                      <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-300">
                        <tr>
                          {queryResult.columns.map((col) => (
                            <th key={col} className="p-2 font-bold whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {queryResult.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            {queryResult.columns.map((col) => (
                              <td key={col} className="p-2 whitespace-nowrap">
                                {typeof row[col] === 'object'
                                  ? JSON.stringify(row[col])
                                  : String(row[col] ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Relational schema tables actively synchronized between Node.js API and MySQL database:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    setActiveTab('console');
                    setQueryInput('SELECT * FROM drives;');
                    handleRunQuery('SELECT * FROM drives;');
                  }}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-mono font-bold text-blue-400">drives</div>
                  <div className="text-[11px] text-slate-400">Daily walk-in drives & open positions</div>
                  <span className="text-[10px] text-emerald-400 font-mono block">Primary Key: id</span>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('console');
                    setQueryInput('SELECT * FROM interview_passes;');
                    handleRunQuery('SELECT * FROM interview_passes;');
                  }}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-mono font-bold text-blue-400">interview_passes</div>
                  <div className="text-[11px] text-slate-400">Reserved passes, QR tokens & stage tracker</div>
                  <span className="text-[10px] text-emerald-400 font-mono block">FK: drive_id</span>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('console');
                    setQueryInput('SELECT * FROM referrals;');
                    handleRunQuery('SELECT * FROM referrals;');
                  }}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-mono font-bold text-blue-400">referrals</div>
                  <div className="text-[11px] text-slate-400">Fast-Track Pass invites & bookings</div>
                  <span className="text-[10px] text-emerald-400 font-mono block">Unique: ref_code</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>SQL DDL Schema (/src/db/mysql-schema.sql)</span>
                <span className="font-mono text-emerald-400">MySQL 8.0+ Compatible</span>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                {schemaSql || '-- Loading schema...'}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
