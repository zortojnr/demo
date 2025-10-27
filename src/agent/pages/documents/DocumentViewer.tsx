import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Edit3,
  Eye,
  Download,
  Share2,
  Send,
  History,
  Save,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Copy,
  Printer,
  Mail,
  Link,
  Bot,
  Lightbulb,
  Shield,
  RefreshCw,
  X,
  Check,
  PenTool
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDocuments, documentTypeLabels } from './mockData';
import type { Document, DocumentVersion, AuditLogEntry } from './types';
import DocumentHistory from './components/DocumentHistory';
import VersionComparison from './components/VersionComparison';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ESignature from './components/ESignature';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
  onSuggestionApply: (suggestion: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, documentContent, onSuggestionApply }) => {
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    type: 'clause' | 'phrasing' | 'risk' | 'improvement';
    title: string;
    description: string;
    suggestion: string;
    confidence: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && documentContent) {
      generateSuggestions();
    }
  }, [isOpen, documentContent]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuggestions([
      {
        id: '1',
        type: 'clause',
        title: 'Add Termination Clause',
        description: 'Consider adding a standard termination clause for better legal protection.',
        suggestion: 'Either party may terminate this agreement with 30 days written notice.',
        confidence: 85
      },
      {
        id: '2',
        type: 'phrasing',
        title: 'Improve Clarity',
        description: 'This section could be more specific about payment terms.',
        suggestion: 'Payment shall be due within 30 days of invoice date via bank transfer or certified check.',
        confidence: 92
      },
      {
        id: '3',
        type: 'risk',
        title: 'Risk Assessment',
        description: 'Missing liability limitation clause may expose parties to unnecessary risk.',
        suggestion: 'Total liability under this agreement shall not exceed the total amount paid.',
        confidence: 78
      },
      {
        id: '4',
        type: 'improvement',
        title: 'Professional Enhancement',
        description: 'Consider adding a force majeure clause for unforeseen circumstances.',
        suggestion: 'Neither party shall be liable for delays caused by circumstances beyond their reasonable control.',
        confidence: 70
      }
    ]);
    setIsLoading(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'clause': return Shield;
      case 'phrasing': return Edit3;
      case 'risk': return AlertCircle;
      case 'improvement': return Lightbulb;
      default: return Bot;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'clause': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'phrasing': return 'text-green-600 bg-green-50 border-green-200';
      case 'risk': return 'text-red-600 bg-red-50 border-red-200';
      case 'improvement': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Document analysis & suggestions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-gray-600">Analyzing document...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">Found {suggestions.length} suggestions</p>
            </div>

            {suggestions.map((suggestion) => {
              const Icon = getSuggestionIcon(suggestion.type);
              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-2 ${getSuggestionColor(suggestion.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <span className="text-xs px-2 py-1 bg-white rounded-full">
                          {suggestion.confidence}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{suggestion.description}</p>
                      <div className="bg-white p-3 rounded-lg text-xs font-mono text-gray-800 mb-3">
                        {suggestion.suggestion}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSuggestionApply(suggestion.suggestion)}
                          className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Apply</span>
                        </button>
                        <button className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <button
              onClick={generateSuggestions}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-emerald-300 hover:text-emerald-600 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Analysis</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DocumentViewer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState<{ version1: DocumentVersion; version2: DocumentVersion } | null>(null);
  const [showESignature, setShowESignature] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareAllowEdit, setShareAllowEdit] = useState(false);
  const [shareExpiresIn, setShareExpiresIn] = useState<'7d' | '30d' | 'never'>('7d');
  const [shareJustSent, setShareJustSent] = useState(false);

  // Mock versioning data
  const mockVersions: DocumentVersion[] = [
    {
      id: 'v1',
      version: 1.0,
      content: 'Initial document content (v1).',
      createdAt: '2024-01-15T10:00:00Z',
      createdBy: 'John Smith',
      changesSummary: 'Initial document creation'
    },
    {
      id: 'v2',
      version: 1.1,
      content: 'Updated content reflecting price and closing date changes (v2).',
      createdAt: '2024-01-16T14:30:00Z',
      createdBy: 'Jane Doe',
      changesSummary: 'Updated purchase price and closing date'
    },
    {
      id: 'v3',
      version: 1.2,
      content: 'Added home warranty clause and appliances inclusion (v3).',
      createdAt: '2024-01-17T09:15:00Z',
      createdBy: 'John Smith',
      changesSummary: 'Added home warranty clause and appliances inclusion'
    }
  ];

  const mockAuditLog: AuditLogEntry[] = [
    {
      id: 'audit1',
      documentId: id || '',
      action: 'created',
      details: 'Document created from Purchase Agreement template',
      timestamp: '2024-01-15T10:00:00Z',
      userId: 'john-smith',
      userName: 'John Smith',
      ipAddress: '192.168.1.100'
    },
    {
      id: 'audit2',
      documentId: id || '',
      action: 'edited',
      details: 'Purchase price updated from ₦350,000 to ₦375,000',
      timestamp: '2024-01-16T14:30:00Z',
      userId: 'jane-doe',
      userName: 'Jane Doe',
      ipAddress: '192.168.1.101'
    },
    {
      id: 'audit3',
      documentId: id || '',
      action: 'shared',
      details: 'Document viewed by client',
      timestamp: '2024-01-16T16:45:00Z',
      userId: 'client-portal',
      userName: 'Client Portal',
      ipAddress: '203.0.113.45'
    },
    {
      id: 'audit4',
      documentId: id || '',
      action: 'edited',
      details: 'Added home warranty and appliances clauses',
      timestamp: '2024-01-17T09:15:00Z',
      userId: 'john-smith',
      userName: 'John Smith',
      ipAddress: '192.168.1.100'
    },
    {
      id: 'audit5',
      documentId: id || '',
      action: 'shared',
      details: 'Document shared with buyer via email',
      timestamp: '2024-01-17T11:30:00Z',
      userId: 'john-smith',
      userName: 'John Smith',
      ipAddress: '192.168.1.100'
    }
  ];

  useEffect(() => {
    // Find document by ID
    const foundDocument = mockDocuments.find(doc => doc.id === id);
    if (foundDocument) {
      setDocument(foundDocument);
      setDocumentContent(foundDocument.content || '');
    }
  }, [id]);

  const handleContentChange = (content: string) => {
    setDocumentContent(content);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasUnsavedChanges(false);
    setIsSaving(false);
    
    // Update document
    if (document) {
      setDocument({
        ...document,
        content: documentContent,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleSuggestionApply = (suggestion: string) => {
    const newContent = documentContent + '\n\n' + suggestion;
    setDocumentContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleRevertVersion = (versionId: string) => {
    const version = mockVersions.find(v => v.id === versionId);
    if (version) {
      // In real app, this would load the version content
      setDocumentContent(`Reverted to version ${version.version} content...`);
      setHasUnsavedChanges(true);
      setShowHistory(false);
    }
  };

  const handleCompareVersions = (version1Id: string, version2Id: string) => {
    const version1 = mockVersions.find(v => v.id === version1Id);
    const version2 = mockVersions.find(v => v.id === version2Id);
    
    if (version1 && version2) {
      setComparisonVersions({ version1, version2 });
      setShowVersionComparison(true);
      setShowHistory(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setShowPreview(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    setIsEditing(false);
  };

  const exportToPDF = async () => {
    if (!contentRef.current) {
      alert('Nothing to export. Switch to preview to export.');
      return;
    }
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      } else {
        // Handle multi-page
        let remainingHeight = imgHeight;
        let y = 0;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, 'PNG', 0, y ? 0 : position, imgWidth, imgHeight);
          remainingHeight -= pageHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            y = 0;
          }
        }
      }
      pdf.save(`${document?.name || 'document'}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('Failed to export PDF.');
    }
  };

  const handleShareEmailSend = () => {
    if (!shareEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareEmail)) {
      alert('Enter a valid email address.');
      return;
    }
    // Mock email send
    setShareJustSent(true);
    setTimeout(() => setShareJustSent(false), 3000);
  };

  const handleCopyLink = async () => {
    const link = `https://app.realestateprp.com/shared/doc/${document?.id || 'unknown'}`;
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard');
    } catch {
      alert(`Copy failed. Please copy this link manually:\n${link}`);
    }
  };

  const handleESignatureComplete = (signatures: any[]) => {
    // In real app, this would save signatures to the document
    console.log('Signatures completed:', signatures);
    setShowESignature(false);
    // Update document status to signed
    if (document) {
      setDocument({ ...document, status: 'signed' });
    }
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Document not found</h3>
          <p className="text-gray-600 mb-6">The document you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/agent/documents')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'generated': return 'bg-blue-100 text-blue-700';
      case 'sent': return 'bg-yellow-100 text-yellow-700';
      case 'signed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/agent/documents')}
              className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{document.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{document.createdBy}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(document.updatedAt).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{document.type}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </motion.button>
            )}

            <button
              onClick={toggleEdit}
              className={`p-2 rounded-xl transition-colors ${
                isEditing ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Edit Document"
            >
              <Edit3 className="w-5 h-5" />
            </button>

            <button
              onClick={togglePreview}
              className={`p-2 rounded-xl transition-colors ${
                showPreview ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Preview Document"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowAI(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowHistory(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="Version History"
            >
              <History className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowESignature(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="E-Signature"
            >
              <PenTool className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={exportToPDF}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="Share Document"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="Send for Signature"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Document Metadata */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Document Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <p className="text-sm text-gray-900">{document.clientName || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <p className="text-sm text-gray-900">{document.propertyAddress || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <p className="text-sm text-gray-900 capitalize">{documentTypeLabels[document.type]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <p className="text-sm text-gray-900">{document.metadata?.size || '—'}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {document.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                    {tag}
                  </span>
                )) || (
                  <p className="text-sm text-gray-500">No tags added</p>
                )}
              </div>
            </div>

            {/* Versions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Versions</h3>
              <div className="space-y-2">
                {document.versions?.slice(0, 3).map((version, index) => (
                  <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">v{version.version}</p>
                      <p className="text-xs text-gray-600">{new Date(version.createdAt).toLocaleDateString()}</p>
                    </div>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No versions available</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Duplicate Document</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Document</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Link className="w-4 h-4" />
                  <span>Generate Share Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Document Editor/Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          {isEditing && (
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <strong>B</strong>
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <em>I</em>
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <u>U</u>
                  </button>
                </div>
                <div className="w-px h-6 bg-gray-300" />
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>Normal</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <div className="w-px h-6 bg-gray-300" />
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Insert Field
                </button>
              </div>
            </div>
          )}

          {/* Document Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isEditing ? (
              <div className="max-w-4xl mx-auto">
                <textarea
                  ref={editorRef}
                  value={documentContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full min-h-[600px] p-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-mono text-sm leading-relaxed"
                  placeholder="Start typing your document content..."
                />
              </div>
            ) : showPreview ? (
              <div className="max-w-4xl mx-auto">
                <div ref={contentRef} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
                  <div className="prose prose-lg max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                      {documentContent || 'No content available. Click Edit to add content.'}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div ref={contentRef} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
                  <div className="prose prose-lg max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                      {documentContent || 'No content available. Click Edit to add content.'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <AnimatePresence>
          {showAI && (
            <AIAssistant
              isOpen={showAI}
              onClose={() => setShowAI(false)}
              documentContent={documentContent}
              onSuggestionApply={handleSuggestionApply}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Share Document</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share via Email</label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={handleShareEmailSend}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                  {shareJustSent && (
                    <p className="text-xs text-emerald-600 mt-2">Email sent successfully!</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={`https://app.realestateprp.com/shared/doc/${document?.id || 'abc123'}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <label className="text-xs text-gray-700">Link expiry</label>
                    <select
                      value={shareExpiresIn}
                      onChange={(e) => setShareExpiresIn(e.target.value as any)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="7d">7 days</option>
                      <option value="30d">30 days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Allow editing</span>
                    <button
                      onClick={() => setShareAllowEdit(!shareAllowEdit)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${shareAllowEdit ? 'bg-emerald-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shareAllowEdit ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Export</span>
                    <button
                      onClick={exportToPDF}
                      className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document History Modal */}
      <AnimatePresence>
        {showHistory && (
          <DocumentHistory
            versions={mockVersions}
            auditLog={mockAuditLog}
            onClose={() => setShowHistory(false)}
            onRevertVersion={handleRevertVersion}
            onCompareVersions={handleCompareVersions}
          />
        )}
      </AnimatePresence>

      {/* Version Comparison Modal */}
      <AnimatePresence>
        {showVersionComparison && comparisonVersions && (
          <VersionComparison
            version1={comparisonVersions.version1}
            version2={comparisonVersions.version2}
            onClose={() => {
              setShowVersionComparison(false);
              setComparisonVersions(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* E-Signature Modal */}
      <AnimatePresence>
        {showESignature && document && (
          <ESignature
            documentId={document.id}
            documentTitle={document.name}
            onClose={() => setShowESignature(false)}
            onComplete={handleESignatureComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentViewer;