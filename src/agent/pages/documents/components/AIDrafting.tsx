import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot,
  Wand2,
  RefreshCw,
  CheckCircle,
  Copy,
  Edit3,
  Brain,
  FileText,
  Eye,
  EyeOff,
  Clock,
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import type { Template } from '../types';

interface AIDraftingProps {
  template: Template;
  formData: Record<string, any>;
  onDraftGenerated: (content: string, metadata: any) => void;
  onBack: () => void;
  onNext: () => void;
}

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  speed = 30, 
  onComplete, 
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  return (
    <div className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-emerald-500 ml-1"
        />
      )}
    </div>
  );
};

const AIDrafting: React.FC<AIDraftingProps> = ({
  template,
  formData,
  onDraftGenerated,
  onBack,
  onNext
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generationStage, setGenerationStage] = useState<'idle' | 'analyzing' | 'drafting' | 'reviewing' | 'complete'>('idle');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    tone: 'professional',
    length: 'standard',
    complexity: 'medium',
    includeDisclaimer: true,
    includeLegalClauses: true,
    customInstructions: ''
  });
  const [generationMetadata, setGenerationMetadata] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const generateContent = async () => {
    setIsGenerating(true);
    setGenerationStage('analyzing');
    setGeneratedContent('');

    // Stage 1: Analyzing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGenerationStage('drafting');

    // Mock AI generation based on template and form data
    const mockContent = generateMockContent();
    
    // Stage 2: Drafting with typing animation
    await new Promise(resolve => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < mockContent.length) {
          setGeneratedContent(prev => prev + mockContent[index]);
          index++;
        } else {
          clearInterval(typingInterval);
          resolve(void 0);
        }
      }, 20);
    });

    setGenerationStage('reviewing');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setGenerationStage('complete');
    setIsGenerating(false);

    // Calculate metadata
    const words = mockContent.split(' ').length;
    const readTime = Math.ceil(words / 200); // Average reading speed
    setWordCount(words);
    setEstimatedReadTime(readTime);

    const metadata = {
      wordCount: words,
      estimatedReadTime: readTime,
      generatedAt: new Date().toISOString(),
      aiSettings: aiSettings,
      template: template.name,
      confidence: 0.92
    };

    setGenerationMetadata(metadata);
    onDraftGenerated(mockContent, metadata);
  };

  const generateMockContent = (): string => {
    const templateType = template.name.toLowerCase();
    const clientName = formData.client_name || 'Client';
    const propertyAddress = formData.property_address || 'Property Address';
    const amount = formData.amount || formData.sale_price || formData.rent_amount || '₦0';
    const date = formData.date || formData.closing_date || formData.move_in_date || new Date().toLocaleDateString();

    switch (templateType) {
      case 'sales contract':
        return `RESIDENTIAL SALES CONTRACT

This Sales Contract ("Agreement") is entered into on ${date} between ${formData.seller_name || 'Seller'} ("Seller") and ${clientName} ("Buyer") for the purchase of the property located at ${propertyAddress}.

PROPERTY DESCRIPTION
The property being sold is a residential property located at ${propertyAddress}, including all fixtures, improvements, and appurtenances thereto.

PURCHASE PRICE AND TERMS
The total purchase price for the property is ${amount}. The Buyer agrees to pay a deposit of ${formData.deposit || '₦500,000'} upon signing this agreement, with the balance due at closing on ${date}.

FINANCING CONTINGENCY
This agreement is contingent upon the Buyer obtaining financing in the amount of ${amount} at an interest rate not to exceed ${formData.interest_rate || '15%'} per annum.

INSPECTION PERIOD
The Buyer shall have ${formData.inspection_period || '10'} days from the date of this agreement to conduct inspections of the property. If unsatisfactory conditions are discovered, the Buyer may terminate this agreement.

CLOSING
The closing shall take place on or before ${date} at a location mutually agreed upon by both parties. At closing, the Seller shall deliver a warranty deed conveying clear and marketable title to the property.

SPECIAL TERMS
${formData.special_terms || 'No special terms apply to this agreement.'}

LEGAL DISCLAIMER
This agreement constitutes the entire agreement between the parties and may only be modified in writing signed by both parties. This agreement shall be governed by the laws of Nigeria.

By signing below, both parties acknowledge they have read, understood, and agree to be bound by the terms of this agreement.

_________________________                    _________________________
Seller Signature                             Buyer Signature

_________________________                    _________________________
Date                                         Date`;

      case 'tenancy agreement':
        return `RESIDENTIAL TENANCY AGREEMENT

This Tenancy Agreement is made between ${formData.landlord || 'Landlord'} ("Landlord") and ${clientName} ("Tenant") for the rental of the property located at ${propertyAddress}.

RENTAL TERMS
The monthly rent is ${amount}, due on the ${formData.due_date || '1st'} of each month. The lease term begins on ${date} and continues for ${formData.lease_term || '12 months'}.

SECURITY DEPOSIT
The Tenant shall pay a security deposit of ${formData.deposit || amount} prior to occupancy. This deposit will be returned within 30 days of lease termination, less any deductions for damages or unpaid rent.

UTILITIES AND SERVICES
${formData.utilities_clause || 'Tenant is responsible for electricity, water, and internet services. Landlord is responsible for property maintenance and security.'}

PROPERTY USE
The property shall be used solely as a private residence. No commercial activities are permitted without written consent from the Landlord.

MAINTENANCE AND REPAIRS
The Landlord agrees to maintain the property in habitable condition. The Tenant agrees to report any maintenance issues promptly and maintain the property in good condition.

TERMINATION
Either party may terminate this agreement with ${formData.notice_period || '30'} days written notice. Early termination by the Tenant may result in forfeiture of the security deposit.

GOVERNING LAW
This agreement shall be governed by the laws of Nigeria and any disputes shall be resolved through arbitration.

_________________________                    _________________________
Landlord Signature                           Tenant Signature

_________________________                    _________________________
Date                                         Date`;

      case 'property inspection report':
        return `PROPERTY INSPECTION REPORT

Inspector: ${formData.inspector_name || 'Professional Inspector'}
Property Address: ${propertyAddress}
Inspection Date: ${date}
Report Date: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
This comprehensive inspection was conducted to assess the current condition of the property located at ${propertyAddress}. The inspection covered structural elements, electrical systems, plumbing, HVAC, and general property conditions.

STRUCTURAL ASSESSMENT
Foundation: ${formData.foundation_condition || 'Good condition with no visible cracks or settling issues.'}
Roof: ${formData.roof_condition || 'Excellent condition with recent maintenance evident.'}
Walls: ${formData.wall_condition || 'Structurally sound with minor cosmetic wear.'}

ELECTRICAL SYSTEMS
The electrical system appears to be in ${formData.electrical_condition || 'good working order'}. All outlets and switches tested functional. ${formData.electrical_notes || 'No safety concerns identified.'}

PLUMBING SYSTEMS
Water pressure: ${formData.water_pressure || 'Adequate throughout the property'}
Drainage: ${formData.drainage_condition || 'All drains functioning properly'}
Fixtures: ${formData.fixture_condition || 'All fixtures in working condition'}

HVAC SYSTEMS
${formData.hvac_assessment || 'Air conditioning and ventilation systems are functioning within normal parameters.'}

ISSUES IDENTIFIED
${formData.issues_found || 'Minor cosmetic issues noted but no major structural or safety concerns identified.'}

RECOMMENDATIONS
${formData.recommendations || '1. Regular maintenance of HVAC systems\n2. Periodic inspection of roof and gutters\n3. Monitor plumbing for any future issues'}

CONCLUSION
The property is in ${formData.overall_condition || 'good condition'} and suitable for ${formData.intended_use || 'residential occupancy'}.

Inspector Signature: _________________________
Date: ${new Date().toLocaleDateString()}`;

      case 'marketing proposal':
        return `REAL ESTATE MARKETING PROPOSAL

Prepared for: ${clientName}
Property: ${propertyAddress}
Prepared by: Homekey Global Investment Ltd
Date: ${date}

EXECUTIVE SUMMARY
This comprehensive marketing proposal outlines our strategic approach to marketing your property at ${propertyAddress}. Our proven methodology combines traditional and digital marketing channels to maximize exposure and achieve optimal results.

PROPERTY OVERVIEW
Property Type: ${formData.property_type || 'Residential'}
Target Market: ${formData.target_market || 'Young professionals and families'}
Estimated Value: ${amount}
Marketing Timeline: ${formData.timeline || '90 days'}

MARKETING STRATEGY
${formData.campaign_scope || 'Our multi-channel approach includes professional photography, virtual tours, social media marketing, and targeted advertising campaigns.'}

DELIVERABLES
${formData.deliverables || '• Professional photography and virtual tour\n• Listing on major property portals\n• Social media marketing campaign\n• Print advertising in local publications\n• Email marketing to our database\n• Regular progress reports'}

TIMELINE
Phase 1 (Days 1-14): Property preparation and photography
Phase 2 (Days 15-60): Active marketing campaign
Phase 3 (Days 61-90): Review and strategy adjustment

INVESTMENT
Total Marketing Investment: ${formData.cost || '₦500,000'}
Expected ROI: ${formData.expected_roi || '300%'}

ABOUT HOMEKEY GLOBAL
With over 10 years of experience in the Nigerian real estate market, we have successfully marketed over 1,000 properties with an average time on market of 45 days.

We look forward to partnering with you to achieve exceptional results for your property.

Best regards,
Homekey Global Investment Ltd`;

      case 'invoice':
        return `INVOICE

Invoice Number: ${formData.invoice_number || 'INV-' + Date.now()}
Date: ${date}
Due Date: ${formData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

BILL TO:
${clientName}
${formData.client_address || ''}
${formData.client_phone || ''}
${formData.client_email || ''}

FROM:
Homekey Global Investment Ltd
Lagos, Nigeria
info@homekeyglobal.com
+234 XXX XXX XXXX

DESCRIPTION OF SERVICES
${formData.items || 'Real estate consultation and property management services'}

AMOUNT DUE: ${amount}

PAYMENT TERMS
${formData.payment_instructions || 'Payment is due within 30 days of invoice date. Please remit payment via bank transfer to the account details provided below.'}

BANK DETAILS
Bank: First Bank of Nigeria
Account Name: Homekey Global Investment Ltd
Account Number: XXXXXXXXXX
Sort Code: XXXXXX

Thank you for your business!`;

      default:
        return `DOCUMENT CONTENT

This document has been generated based on the template "${template.name}" and the information you provided.

Client: ${clientName}
Property: ${propertyAddress}
Date: ${date}
Amount: ${amount}

Please review the content above and make any necessary modifications before finalizing the document.`;
    }
  };

  const regenerateContent = () => {
    setGeneratedContent('');
    setGenerationStage('idle');
    setGenerationMetadata(null);
    generateContent();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'analyzing': return Brain;
      case 'drafting': return Edit3;
      case 'reviewing': return Eye;
      case 'complete': return CheckCircle;
      default: return Bot;
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'analyzing': return 'Analyzing template and data...';
      case 'drafting': return 'Generating document content...';
      case 'reviewing': return 'Reviewing and optimizing...';
      case 'complete': return 'Generation complete!';
      default: return 'Ready to generate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Document Generation</h2>
        <p className="text-gray-600">
          Our AI will generate a professional {template.name.toLowerCase()} based on your information
        </p>
      </div>

      {/* Generation Status */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generation Status</h3>
          {generationMetadata && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{wordCount} words</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{estimatedReadTime} min read</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            generationStage === 'complete' ? 'bg-green-100' : 'bg-emerald-100'
          }`}>
            {isGenerating ? (
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
            ) : (
              React.createElement(getStageIcon(generationStage), {
                className: `w-6 h-6 ${generationStage === 'complete' ? 'text-green-600' : 'text-emerald-600'}`
              })
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{getStageText(generationStage)}</p>
            {isGenerating && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: generationStage === 'analyzing' ? '25%' : 
                           generationStage === 'drafting' ? '75%' : 
                           generationStage === 'reviewing' ? '90%' : '100%'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <button
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">AI Generation Settings</span>
          </div>
          {showAdvancedOptions ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {showAdvancedOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={aiSettings.tone}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <select
                    value={aiSettings.length}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="concise">Concise</option>
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complexity</label>
                  <select
                    value={aiSettings.complexity}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, complexity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Include Legal Disclaimer</label>
                  <button
                    onClick={() => setAiSettings(prev => ({ ...prev, includeDisclaimer: !prev.includeDisclaimer }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      aiSettings.includeDisclaimer ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      aiSettings.includeDisclaimer ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Include Standard Legal Clauses</label>
                  <button
                    onClick={() => setAiSettings(prev => ({ ...prev, includeLegalClauses: !prev.includeLegalClauses }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      aiSettings.includeLegalClauses ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      aiSettings.includeLegalClauses ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions</label>
                <textarea
                  value={aiSettings.customInstructions}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                  placeholder="Add any specific instructions for the AI..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  rows={3}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Generated Document</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title={showPreview ? "Hide Preview" : "Show Preview"}
                >
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={regenerateContent}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {showPreview ? (
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div 
                ref={contentRef}
                className="bg-gray-50 p-6 rounded-xl font-mono text-sm text-gray-800 leading-relaxed max-h-96 overflow-y-auto"
              >
                <TypingAnimation
                  text={generatedContent}
                  speed={isGenerating ? 20 : 0}
                  className="whitespace-pre-wrap"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        <div className="flex items-center space-x-4">
          {!generatedContent ? (
            <motion.button
              onClick={generateContent}
              disabled={isGenerating}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Document</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={onNext}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Continue to Review</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDrafting;