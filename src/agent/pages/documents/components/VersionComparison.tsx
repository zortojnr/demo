import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  GitBranch, 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  Minus,
  Eye,
  Download
} from 'lucide-react';
import type { DocumentVersion } from '../types';

interface VersionComparisonProps {
  version1: DocumentVersion;
  version2: DocumentVersion;
  onClose: () => void;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

const VersionComparison: React.FC<VersionComparisonProps> = ({
  version1,
  version2,
  onClose
}) => {
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');

  useEffect(() => {
    // Mock diff generation - in real app, this would use a proper diff algorithm
    generateDiff();
  }, [version1, version2]);

  const generateDiff = () => {
    // Mock content for demonstration
    const content1 = `PURCHASE AGREEMENT

Property Address: 123 Main Street, Anytown, ST 12345
Purchase Price: ₦350,000
Buyer: John Smith
Seller: Jane Doe

Terms and Conditions:
1. This agreement is contingent upon buyer obtaining financing
2. Property inspection must be completed within 10 days
3. Closing date is scheduled for March 15, 2024
4. Earnest money deposit of ₦5,000 required

Additional Terms:
- Property sold "as is"
- Buyer responsible for all closing costs`;

    const content2 = `PURCHASE AGREEMENT

Property Address: 123 Main Street, Anytown, ST 12345
Purchase Price: ₦375,000
Buyer: John Smith
Seller: Jane Doe

Terms and Conditions:
1. This agreement is contingent upon buyer obtaining financing
2. Property inspection must be completed within 7 days
3. Closing date is scheduled for March 20, 2024
4. Earnest money deposit of ₦7,500 required
5. Seller will provide home warranty

Additional Terms:
- Property sold "as is"
- Buyer responsible for all closing costs
- Includes all appliances`;

    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');
    
    const diff: DiffLine[] = [];
    let i = 0, j = 0;

    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        diff.push({
          type: 'added',
          content: lines2[j],
          lineNumber2: j + 1
        });
        j++;
      } else if (j >= lines2.length) {
        diff.push({
          type: 'removed',
          content: lines1[i],
          lineNumber1: i + 1
        });
        i++;
      } else if (lines1[i] === lines2[j]) {
        diff.push({
          type: 'unchanged',
          content: lines1[i],
          lineNumber1: i + 1,
          lineNumber2: j + 1
        });
        i++;
        j++;
      } else {
        // Simple diff logic - in real app, use proper LCS algorithm
        if (lines1[i].includes('₦350,000') && lines2[j].includes('₦375,000')) {
          diff.push({
            type: 'removed',
            content: lines1[i],
            lineNumber1: i + 1
          });
          diff.push({
            type: 'added',
            content: lines2[j],
            lineNumber2: j + 1
          });
          i++;
          j++;
        } else if (lines1[i].includes('10 days') && lines2[j].includes('7 days')) {
          diff.push({
            type: 'removed',
            content: lines1[i],
            lineNumber1: i + 1
          });
          diff.push({
            type: 'added',
            content: lines2[j],
            lineNumber2: j + 1
          });
          i++;
          j++;
        } else if (lines1[i].includes('March 15') && lines2[j].includes('March 20')) {
          diff.push({
            type: 'removed',
            content: lines1[i],
            lineNumber1: i + 1
          });
          diff.push({
            type: 'added',
            content: lines2[j],
            lineNumber2: j + 1
          });
          i++;
          j++;
        } else if (lines1[i].includes('₦5,000') && lines2[j].includes('₦7,500')) {
          diff.push({
            type: 'removed',
            content: lines1[i],
            lineNumber1: i + 1
          });
          diff.push({
            type: 'added',
            content: lines2[j],
            lineNumber2: j + 1
          });
          i++;
          j++;
        } else if (lines2[j].includes('Seller will provide home warranty')) {
          diff.push({
            type: 'added',
            content: lines2[j],
            lineNumber2: j + 1
          });
          j++;
        } else if (lines2[j].includes('Includes all appliances')) {
          diff.push({
            type: 'added',
            content: lines2[j],
            lineNumber2: j + 1
          });
          j++;
        } else {
          diff.push({
            type: 'unchanged',
            content: lines1[i],
            lineNumber1: i + 1,
            lineNumber2: j + 1
          });
          i++;
          j++;
        }
      }
    }

    setDiffLines(diff);
  };

  const getDiffStats = () => {
    const added = diffLines.filter(line => line.type === 'added').length;
    const removed = diffLines.filter(line => line.type === 'removed').length;
    return { added, removed };
  };

  const stats = getDiffStats();

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Version Comparison</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-red-200 rounded"></span>
                  <span>{stats.removed} deletions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-green-200 rounded"></span>
                  <span>{stats.added} additions</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'unified'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unified
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Version Headers */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 p-4 bg-red-50 border-r border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Version {version1.version}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{version1.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(version1.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Version {version2.version}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{version2.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(version2.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'side-by-side' ? (
            <div className="flex h-[60vh]">
              <div className="flex-1 overflow-y-auto border-r border-gray-200">
                <div className="font-mono text-sm">
                  {diffLines.map((line, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        line.type === 'removed'
                          ? 'bg-red-50'
                          : line.type === 'unchanged'
                          ? 'bg-white'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="w-12 px-2 py-1 text-gray-400 text-right border-r border-gray-200 bg-gray-50">
                        {line.lineNumber1 || ''}
                      </div>
                      <div className="flex-1 px-4 py-1">
                        {(line.type === 'removed' || line.type === 'unchanged') && (
                          <span className={line.type === 'removed' ? 'text-red-800' : 'text-gray-800'}>
                            {line.content}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="font-mono text-sm">
                  {diffLines.map((line, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        line.type === 'added'
                          ? 'bg-green-50'
                          : line.type === 'unchanged'
                          ? 'bg-white'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="w-12 px-2 py-1 text-gray-400 text-right border-r border-gray-200 bg-gray-50">
                        {line.lineNumber2 || ''}
                      </div>
                      <div className="flex-1 px-4 py-1">
                        {(line.type === 'added' || line.type === 'unchanged') && (
                          <span className={line.type === 'added' ? 'text-green-800' : 'text-gray-800'}>
                            {line.content}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] overflow-y-auto">
              <div className="font-mono text-sm">
                {diffLines.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      line.type === 'added'
                        ? 'bg-green-50'
                        : line.type === 'removed'
                        ? 'bg-red-50'
                        : 'bg-white'
                    }`}
                  >
                    <div className="w-4 px-2 py-1 flex items-center justify-center">
                      {line.type === 'added' && <Plus className="w-3 h-3 text-green-600" />}
                      {line.type === 'removed' && <Minus className="w-3 h-3 text-red-600" />}
                    </div>
                    <div className="w-12 px-2 py-1 text-gray-400 text-right border-r border-gray-200 bg-gray-50">
                      {line.lineNumber1 || line.lineNumber2 || ''}
                    </div>
                    <div className="flex-1 px-4 py-1">
                      <span
                        className={
                          line.type === 'added'
                            ? 'text-green-800'
                            : line.type === 'removed'
                            ? 'text-red-800'
                            : 'text-gray-800'
                        }
                      >
                        {line.content}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VersionComparison;