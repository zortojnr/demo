import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  User, 
  Bot, 
  CheckCircle,
  Download,
  Send,
  Eye,
  Edit3,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { templates, mockClients, mockProperties, documentTypeLabels } from './mockData';
import type { Template } from './types';
import AIDrafting from './components/AIDrafting';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Choose Template', icon: FileText },
    { number: 2, title: 'Fill Key Fields', icon: User },
    { number: 3, title: 'AI Draft', icon: Bot },
    { number: 4, title: 'Review & Sign', icon: CheckCircle }
  ];

  return (
    <div className="w-full lg:w-64 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Document</h3>
      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isClickable = currentStep >= step.number;

          return (
            <motion.div
              key={step.number}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-50 border-2 border-emerald-200' 
                  : isCompleted 
                    ? 'bg-gray-50 hover:bg-gray-100' 
                    : 'bg-gray-50 opacity-60'
              }`}
              onClick={() => isClickable && onStepClick(step.number)}
              whileHover={isClickable ? { scale: 1.02 } : {}}
              whileTap={isClickable ? { scale: 0.98 } : {}}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isActive 
                  ? 'bg-emerald-500 text-white' 
                  : isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-300 text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isActive ? 'text-emerald-700' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  Step {step.number}
                </p>
                <p className={`text-xs ${
                  isActive ? 'text-emerald-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] }}
          />
        </div>
      </div>
    </div>
  );
};

const NewDocument: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [generatedContent, setGeneratedContent] = useState<string>('');

  // Animation variants with top-to-bottom direction
  const stepVariants = {
    initial: { 
      opacity: 0, 
      y: -20,  // Start from top
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      y: 0,    // Move to center
      scale: 1,
      transition: {
        duration: 0.4,
      ease: [0, 0, 0.58, 1] as [number, number, number, number]
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,   // Exit downward
      scale: 0.95,
      transition: {
        duration: 0.3,
      ease: [0.42, 0, 1, 1] as [number, number, number, number]
      }
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || (step === 2 && selectedTemplate) || (step === 3 && selectedTemplate && Object.keys(formData).length > 0)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    handleNext();
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
              <p className="text-gray-600">Select from our professional document templates</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200 ${
                    selectedTemplate?.id === template.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-emerald-300 hover:shadow-lg'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      template.type === 'sales_contract' ? 'bg-blue-100 text-blue-600' :
                      template.type === 'inspection_report' ? 'bg-green-100 text-green-600' :
                      template.type === 'marketing_proposal' ? 'bg-purple-100 text-purple-600' :
                      template.type === 'tenancy_agreement' ? 'bg-orange-100 text-orange-600' :
                      template.type === 'invoice' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{documentTypeLabels[template.type]}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fill Key Fields</h2>
              <p className="text-gray-600">Provide the essential information for your document</p>
            </div>

            {selectedTemplate && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedTemplate.name}</h3>
                    <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />
                      )}
                      
                      {field.type === 'number' && (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          />
                        </div>
                      )}
                      
                      {field.type === 'date' && (
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          />
                        </div>
                      )}
                      
                      {field.type === 'select' && field.options && (
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          value={formData[field.name] || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                          rows={3}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />
                      )}
                      
                      {field.placeholder && (
                        <p className="text-xs text-gray-500">{field.placeholder}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Select Options */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Client</label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        onChange={(e) => {
                          const client = mockClients.find(c => c.id === e.target.value);
                          if (client) {
                            handleFieldChange('client_name', client.name);
                            handleFieldChange('client_email', client.email);
                            handleFieldChange('client_phone', client.phone);
                          }
                        }}
                      >
                        <option value="">Select a client</option>
                        {mockClients.map((client) => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Property</label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        onChange={(e) => {
                          const property = mockProperties.find(p => p.id === e.target.value);
                          if (property) {
                            handleFieldChange('property_address', property.address);
                            handleFieldChange('property_type', property.type);
                            handleFieldChange('property_price', property.price);
                          }
                        }}
                      >
                        <option value="">Select a property</option>
                        {mockProperties.map((property) => (
                          <option key={property.id} value={property.id}>{property.address}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {selectedTemplate && (
              <AIDrafting
                template={selectedTemplate}
                formData={formData}
                onDraftGenerated={(content) => {
                  setGeneratedContent(content);
                }}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Finalize</h2>
              <p className="text-gray-600">Review your document and prepare for signing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Preview */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <div className="bg-white p-6 rounded-lg shadow-sm min-h-[300px]">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {generatedContent || 'No content generated yet. Please complete the previous steps.'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Document Metadata & Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter document name"
                        defaultValue={selectedTemplate ? `${selectedTemplate.name} - ${new Date().toLocaleDateString()}` : ''}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Add tags (comma separated)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <motion.button
                      className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </motion.button>
                    
                    <motion.button
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-5 h-5" />
                      <span>Send for Signature</span>
                    </motion.button>
                    
                    <motion.button
                      className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="w-5 h-5" />
                      <span>Save as Draft</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/agent/documents')}
              className="p-2 text-gray-500 hover:bg-white hover:text-gray-700 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Document</h1>
              <p className="text-gray-600">Create professional documents with AI assistance</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stepper */}
          <Stepper 
            currentStep={currentStep} 
            totalSteps={4} 
            onStepClick={handleStepClick}
          />

          {/* Step Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <motion.button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                }`}
                whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </motion.button>

              <div className="flex items-center space-x-3">
                <motion.button
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save as Draft
                </motion.button>
                
                {currentStep < 4 ? (
                  <motion.button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !selectedTemplate) ||
                      (currentStep === 2 && Object.keys(formData).length === 0) ||
                      (currentStep === 3 && !generatedContent)
                    }
                    className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                      (currentStep === 1 && !selectedTemplate) ||
                      (currentStep === 2 && Object.keys(formData).length === 0) ||
                      (currentStep === 3 && !generatedContent)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                    whileHover={
                      !((currentStep === 1 && !selectedTemplate) ||
                        (currentStep === 2 && Object.keys(formData).length === 0) ||
                        (currentStep === 3 && !generatedContent))
                        ? { scale: 1.02 } : {}
                    }
                    whileTap={
                      !((currentStep === 1 && !selectedTemplate) ||
                        (currentStep === 2 && Object.keys(formData).length === 0) ||
                        (currentStep === 3 && !generatedContent))
                        ? { scale: 0.98 } : {}
                    }
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDocument;