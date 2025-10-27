import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  PenTool, 
  Type, 
  Upload, 
  Download, 
  Send, 
  Check, 
  User, 
  Mail,
  FileText,
  RotateCcw,
  Save
} from 'lucide-react';

interface Signature {
  id: string;
  type: 'drawn' | 'typed' | 'uploaded';
  data: string;
  timestamp: Date;
  signer: string;
}

interface SignatureField {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  assignedTo?: string;
  signed?: boolean;
  signature?: Signature;
}

interface ESignatureProps {
  documentId: string;
  documentTitle: string;
  onClose: () => void;
  onComplete: (signatures: Signature[]) => void;
}

const ESignature: React.FC<ESignatureProps> = ({
  documentTitle,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'sign' | 'review' | 'complete'>('setup');
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
  const [currentSignature, setCurrentSignature] = useState<Signature | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [signers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Client' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Agent' }
  ]);
  const [selectedSigner, setSelectedSigner] = useState(signers[0].id);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  // Mock document content
  const mockDocumentContent = `
    REAL ESTATE PURCHASE AGREEMENT
    
    This agreement is made between the Buyer and Seller for the purchase of the property located at:
    123 Main Street, Anytown, State 12345
    
    Purchase Price: ₦350,000
    
    Terms and Conditions:
    1. The buyer agrees to purchase the property for the stated price
    2. Closing date shall be within 30 days of acceptance
    3. Property is sold "as is" condition
    
    Buyer Signature: _________________ Date: _________
    
    Seller Signature: _________________ Date: _________
    
    Agent Signature: _________________ Date: _________
  `;

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let signatureData = '';
    let type: 'drawn' | 'typed' | 'uploaded' = 'drawn';
    
    if (signatureMode === 'draw') {
      signatureData = canvas.toDataURL();
      type = 'drawn';
    } else if (signatureMode === 'type') {
      signatureData = typedSignature;
      type = 'typed';
    }
    
    const signature: Signature = {
      id: Date.now().toString(),
      type,
      data: signatureData,
      timestamp: new Date(),
      signer: signers.find(s => s.id === selectedSigner)?.name || 'Unknown'
    };
    
    setCurrentSignature(signature);
  };

  const addSignatureField = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentStep !== 'setup') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newField: SignatureField = {
      id: Date.now().toString(),
      x,
      y,
      width: 15,
      height: 4,
      required: true,
      assignedTo: selectedSigner
    };
    
    setSignatureFields([...signatureFields, newField]);
  };

  const removeSignatureField = (fieldId: string) => {
    setSignatureFields(signatureFields.filter(field => field.id !== fieldId));
  };

  const proceedToSigning = () => {
    if (signatureFields.length === 0) {
      alert('Please add at least one signature field');
      return;
    }
    setCurrentStep('sign');
  };

  const completeSignature = () => {
    const signatures = signatureFields
      .filter(field => field.signature)
      .map(field => field.signature!);
    
    onComplete(signatures);
    setCurrentStep('complete');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">E-Signature Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">{documentTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[
              { key: 'setup', label: 'Setup Fields', icon: FileText },
              { key: 'sign', label: 'Sign Document', icon: PenTool },
              { key: 'review', label: 'Review', icon: Check },
              { key: 'complete', label: 'Complete', icon: Send }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['setup', 'sign', 'review'].indexOf(currentStep) > ['setup', 'sign', 'review'].indexOf(step.key);
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-emerald-600 text-white' :
                    isActive ? 'bg-emerald-100 text-emerald-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Document Preview */}
          <div className="flex-1 p-6 overflow-auto">
            <div 
              ref={documentRef}
              className="relative bg-white border border-gray-200 rounded-lg p-8 min-h-[600px] cursor-crosshair"
              onClick={currentStep === 'setup' ? addSignatureField : undefined}
            >
              <div className="whitespace-pre-line text-sm text-gray-800 leading-relaxed">
                {mockDocumentContent}
              </div>
              
              {/* Signature Fields */}
              {signatureFields.map((field) => (
                <div
                  key={field.id}
                  className="absolute border-2 border-dashed border-emerald-500 bg-emerald-50 flex items-center justify-center group"
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    width: `${field.width}%`,
                    height: `${field.height}%`
                  }}
                >
                  {field.signature ? (
                    <div className="w-full h-full flex items-center justify-center">
                      {field.signature.type === 'drawn' ? (
                        <img src={field.signature.data} alt="Signature" className="max-w-full max-h-full" />
                      ) : (
                        <span className="text-xs font-signature text-gray-800">{field.signature.data}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">
                      {field.assignedTo ? signers.find(s => s.id === field.assignedTo)?.name : 'Sign Here'}
                    </span>
                  )}
                  
                  {currentStep === 'setup' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSignatureField(field.id);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 p-6 overflow-auto">
            {currentStep === 'setup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Signature Fields</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Click on the document to add signature fields where signers need to sign.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Signer</label>
                  <select
                    value={selectedSigner}
                    onChange={(e) => setSelectedSigner(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {signers.map((signer) => (
                      <option key={signer.id} value={signer.id}>
                        {signer.name} ({signer.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Signers</h4>
                  <div className="space-y-2">
                    {signers.map((signer) => (
                      <div key={signer.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{signer.name}</p>
                          <p className="text-xs text-gray-500">{signer.email}</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {signer.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={proceedToSigning}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Proceed to Signing
                </button>
              </div>
            )}

            {currentStep === 'sign' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Signature</h3>
                </div>

                {/* Signature Mode Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'draw', label: 'Draw', icon: PenTool },
                    { key: 'type', label: 'Type', icon: Type },
                    { key: 'upload', label: 'Upload', icon: Upload }
                  ].map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.key}
                        onClick={() => setSignatureMode(mode.key as any)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          signatureMode === mode.key
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Signature Input */}
                {signatureMode === 'draw' && (
                  <div className="space-y-4">
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <canvas
                        ref={canvasRef}
                        width={280}
                        height={120}
                        className="w-full border border-gray-200 rounded bg-white cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={clearCanvas}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                      <button
                        onClick={saveSignature}
                        className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                )}

                {signatureMode === 'type' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type your signature</label>
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-2xl font-signature text-center text-gray-800">
                        {typedSignature || 'Your signature will appear here'}
                      </p>
                    </div>
                    <button
                      onClick={saveSignature}
                      disabled={!typedSignature.trim()}
                      className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Signature
                    </button>
                  </div>
                )}

                {currentSignature && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-emerald-700 mb-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Signature Created</span>
                    </div>
                    <p className="text-xs text-emerald-600">
                      Click on a signature field in the document to apply this signature.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setCurrentStep('review')}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Review Document
                </button>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Complete</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Review all signatures and complete the signing process.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Signature Status</h4>
                  {signatureFields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          field.signature ? 'bg-emerald-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm text-gray-900">
                          Signature {index + 1}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        field.signature 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {field.signature ? 'Signed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={completeSignature}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Complete Signing</span>
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'complete' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Signed!</h3>
                  <p className="text-sm text-gray-600">
                    All signatures have been collected successfully. The document is now complete.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed PDF</span>
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email to All Parties</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ESignature;