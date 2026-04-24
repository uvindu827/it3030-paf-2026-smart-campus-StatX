import React, { useState } from 'react';
import { UploadCloud, ShieldAlert } from 'lucide-react';

export default function CreateTicket() {
  const [formData, setFormData] = useState({
    resourceId: '',
    reporterUserId: '',
    contactDetails: '',
    category: 'Electrical',
    priority: 'High',
    description: ''
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const LOGGED_IN_USER_ID = 12; // Simulating the logged-in user

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    const cleanResourceId = parseInt(formData.resourceId.replace(/\D/g, '')) || 1;
    const cleanUserId = parseInt(formData.reporterUserId.replace(/\D/g, '')) || LOGGED_IN_USER_ID;

    data.append('resourceId', cleanResourceId); 
    data.append('reportedByUserId', cleanUserId);
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
        alert("Success! Ticket created perfectly.");
        setFormData({ resourceId: '', reporterUserId: '', contactDetails: '', category: 'Electrical', priority: 'High', description: '' });
        setFiles([]);
      } else {
        alert(`Ticket creation failed: ${response.status}`);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      alert("Maximum 3 images allowed!");
      return;
    }
    setFiles(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800 flex justify-center items-start pt-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <ShieldAlert className="text-red-500" />
          <h2 className="text-xl font-bold">Report an Incident</h2>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">RESOURCE ID</label>
              <input type="text" name="resourceId" value={formData.resourceId} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 1" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">REPORTER USER ID</label>
              <input type="text" name="reporterUserId" value={formData.reporterUserId} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 12" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">CONTACT DETAILS</label>
            <input type="text" name="contactDetails" value={formData.contactDetails} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="admin@campus.edu" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORY</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500">
                <option>Electrical</option>
                <option>Network</option>
                <option>Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">PRIORITY</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="Detail the nature of the failure..." required></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">ATTACH EVIDENCE (MAX 3)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">Drop images here or <span className="text-indigo-600">Browse</span></span>
              </label>
              {files.length > 0 && <div className="mt-2 text-xs text-green-600 font-bold">{files.length} file(s) selected</div>}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}