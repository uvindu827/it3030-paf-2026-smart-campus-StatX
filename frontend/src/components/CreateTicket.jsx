import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UploadCloud, ShieldAlert, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CreateTicket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 1. Get Resource Info from URL
  const resourceId = searchParams.get('resId');
  const resourceName = searchParams.get('resName');

  // 2. Get User Info from LocalStorage (Handling your specific keys)
  const userEmail = localStorage.getItem('userEmail') || '';
  // Note: Since your token/storage doesn't have numeric ID, we use 12 as fallback
  // In a real app, your login should save 'userId' to localStorage.
  const userId = localStorage.getItem('userId') || 12; 

  const [formData, setFormData] = useState({
    contactDetails: userEmail,
    category: 'Electrical',
    priority: 'Medium',
    description: ''
  });
  
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!resourceId) {
      toast.error("No resource selected!");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();

    data.append('resourceId', resourceId); 
    data.append('reportedByUserId', userId);
    data.append('preferredContactDetails', formData.contactDetails);
    data.append('category', formData.category);
    data.append('priority', formData.priority.toUpperCase());
    data.append('description', formData.description);

    files.forEach(file => {
      data.append('attachments', file); 
    });

    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        body: data, 
      });
      
      if (response.ok) {
        toast.success("Issue reported successfully! 🚀");
        setTimeout(() => navigate('/resources'), 2000); // Redirect back
      } else {
        const errData = await response.json();
        toast.error(`Failed: ${errData.message || response.status}`);
      }
    } catch (error) {
      toast.error("Connection error to server");
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      toast.warn("Maximum 3 images allowed!");
      return;
    }
    setFiles(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-start pt-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
          <ArrowLeft size={16} /> <span className="text-sm font-medium">Back to Resources</span>
        </button>

        <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <ShieldAlert className="text-red-500" />
          <h2 className="text-xl font-bold">Report an Incident</h2>
        </div>

        {/* Selected Resource Summary Box */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Target Resource</p>
          <p className="text-lg font-bold text-indigo-900">{resourceName || "Generic Resource"}</p>
          <p className="text-xs text-indigo-700">Resource ID: #{resourceId || "N/A"}</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">CONTACT EMAIL</label>
            <input 
              type="text" 
              name="contactDetails" 
              value={formData.contactDetails} 
              onChange={handleInputChange} 
              className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 border-none" 
              placeholder="your-email@campus.edu" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ISSUE CATEGORY</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none">
                <option>Electrical</option>
                <option>Network</option>
                <option>Facilities</option>
                <option>Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">URGENCY</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION OF THE ISSUE</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="4" 
              className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="What's wrong? Please be specific..." 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">PHOTO EVIDENCE (MAX 3)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">Click to <span className="text-indigo-600">Upload Images</span></span>
              </label>
              {files.length > 0 && (
                <div className="mt-2 flex gap-2 justify-center">
                  {files.map((f, i) => (
                    <span key={i} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded">File {i+1}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {isSubmitting ? 'Processing...' : 'Submit Incident Report'}
          </button>
        </form>
      </div>
    </div>
  );
}