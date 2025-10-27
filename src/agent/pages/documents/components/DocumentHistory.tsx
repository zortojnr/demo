import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Clock, 
  User, 
  FileText, 
  Eye, 
  Download, 
  RotateCcw,
  X,
  GitBranch,
  Calendar,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import type { DocumentVersion, AuditLogEntry } from '../types';

interface DocumentHistoryProps {
  versions: DocumentVersion[];
  auditLog: AuditLogEntry[];
  onClose: () => void;
  onRevertVersion: (versionId: string) => void;
  onCompareVersions: (version1Id: string, version2Id: string) => void;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  versions,
  auditLog,
  onClose,
  onRevertVersion,
  onCompareVersions
}) => {
  const [activeTab, setActiveTab] = useState<'versions' | 'audit'>('versions');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showRevertConfirm, setShowRevertConfirm] = useState<string | null>(null);

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  const handleRevert = (versionId: string) => {
    onRevertVersion(versionId);
    setShowRevertConfirm(null);
  };

  const latestVersionNumber = Math.max(...versions.map(v => v.version));

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <FileText className="w-4 h-4" />;
      case 'edited': return <FileText className="w-4 h-4" />;
      case 'signed': return <FileText className="w-4 h-4" />;
      case 'shared': return <FileText className="w-4 h-4" />;
      case 'downloaded': return <Download className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-green-600 bg-green-100';
      case 'edited': return 'text-blue-600 bg-blue-100';
      case 'signed': return 'text-purple-600 bg-purple-100';
      case 'shared': return 'text-orange-600 bg-orange-100';
      case 'downloaded': return 'text-gray-600 bg-gray-100';
      case 'viewed': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Document History</h2>
              <p className="text-sm text-gray-500">Version control and audit trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('versions')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'versions'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <GitBranch className="w-4 h-4" />
              <span>Versions ({versions.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'audit'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Audit Log ({auditLog.length})</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'versions' && (
            <div className="space-y-4">
              {/* Compare Actions */}
              {selectedVersions.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        2 versions selected for comparison
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCompare}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Compare Versions
                      </button>
                      <button
                        onClick={() => setSelectedVersions([])}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Version List */}
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white border rounded-xl p-4 hover:shadow-md transition-all ${
                      selectedVersions.includes(version.id)
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedVersions.includes(version.id)}
                          onChange={() => handleVersionSelect(version.id)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            (version.version === latestVersionNumber) ? 'bg-emerald-100' : 'bg-gray-100'
                          }`}>
                            <span className={`text-xs font-bold ${
                              (version.version === latestVersionNumber) ? 'text-emerald-600' : 'text-gray-600'
                            }`}>
                              v{version.version}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">
                                Version {version.version}
                                {(version.version === latestVersionNumber) && (
                                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                    Current
                                  </span>
                                )}
                              </h4>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{version.createdBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                              </div>
                              {/* Removed size display - not present in DocumentVersion */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {!(version.version === latestVersionNumber) && (
                          <button
                            onClick={() => setShowRevertConfirm(version.id)}
                            className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {version.changesSummary && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{version.changesSummary}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              {auditLog.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActionColor(entry.action)}`}>
                      {getActionIcon(entry.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 capitalize">{entry.action}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.details || ''}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{entry.userId}</span>
                        </div>
                        {entry.ipAddress && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{entry.ipAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Revert Confirmation Modal */}
        <AnimatePresence>
          {showRevertConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Revert to Previous Version</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to revert to this version? This will create a new version with the previous content.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleRevert(showRevertConfirm)}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Revert Version
                  </button>
                  <button
                    onClick={() => setShowRevertConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DocumentHistory;