import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShieldAlert, UploadCloud, X, Loader2 } from "lucide-react"; // Added missing imports
import { toast } from 'react-toastify';

export default function CreateTicket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 1. Get Info from URL and LocalStorage
  const resourceIdFromUrl = searchParams.get('resId') || '';
  const resourceName = searchParams.get('resName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userId = localStorage.getItem('userId') || '12'; 

  const [formData, setFormData] = useState({
    resourceId: resourceIdFromUrl, // Initialize with URL param
    reporterUserId: userId,        // Initialize with LocalStorage ID
    contactDetails: userEmail,
    category: 'Electrical',
    priority: 'Medium',
    description: ''
  });
  
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resourceId) {
      toast.error("No resource selected!");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();

    data.append('resourceId', formData.resourceId); 
    data.append('reportedByUserId', formData.reporterUserId);
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
        toast.success("Success! Ticket created perfectly. 🚀");
        navigate('/home'); // Redirect after success
      } else {
        toast.error(`Ticket creation failed: ${response.status}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Network error. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      toast.warning("Maximum 3 images allowed! 📸");
      return;
    }
    setFiles([...files, ...selectedFiles].slice(0, 3)); 
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800 flex justify-center items-start pt-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
        
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-5">
          <div className="bg-red-50 p-3 rounded-xl">
            <ShieldAlert className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Report an Incident</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Reporting for: <span className="text-indigo-600">{resourceName || "General Maintenance"}</span>
            </p>
          </div>
        </div>

        {/* ONLY ONE FORM TAG HERE */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider">RESOURCE ID</label>
              <input type="text" name="resourceId" value={formData.resourceId} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider">REPORTER ID</label>
              <input type="text" name="reporterUserId" value={formData.reporterUserId} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider">CONTACT DETAILS</label>
            <input type="email" name="contactDetails" value={formData.contactDetails} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="admin@campus.edu" required />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider">CATEGORY</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 cursor-pointer">
                <option value="Electrical">⚡ Electrical</option>
                <option value="Network">🌐 Network</option>
                <option value="Facilities">🏢 Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider">PRIORITY</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 cursor-pointer">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider">DESCRIPTION</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Detail the issue..." required></textarea>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 mb-2 tracking-wider flex justify-between">
              <span>ATTACH EVIDENCE</span>
              <span className={files.length === 3 ? "text-red-500" : "text-slate-400"}>{files.length}/3 MAX</span>
            </label>
            
            {files.length < 3 && (
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl p-8 text-center hover:bg-indigo-50 transition-colors cursor-pointer relative">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-600">Click to upload images</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {isSubmitting ? <><Loader2 className="animate-spin" /> Submitting...</> : 'Submit Incident Report'}
          </button>
        </form>
      </div>
    </div>
  );
}