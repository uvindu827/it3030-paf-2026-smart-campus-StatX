import React, { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Clock, ShieldAlert, Send } from 'lucide-react';

export default function TicketDashboard() {
  // ==========================================
  // STATE: POST TICKET FORM (Left Column)
  // ==========================================
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

  // ==========================================
  // STATE: GET TICKET DETAILS (Right Column)
  // ==========================================
  // Using dummy data initially to match the design, but setup for the API fetch
  const [ticketDetails, setTicketDetails] = useState({
    id: 1,
    status: 'In Progress',
    comments: [
      { id: 101, authorId: 1, authorName: 'Systems Controller', text: 'Ticket acknowledged. Technician assigned to rack A-4 for diagnostic testing. Expecting initial report within 30 minutes.', time: '1H AGO' },
      { id: 102, authorId: 2, authorName: 'Administrator (You)', text: 'I have personally verified the power surge in block B. It seems to have cascaded to the rack level. Proceed with caution on power cycles.', time: '15M AGO' },
      { id: 103, authorId: 3, authorName: 'Network Technician', text: 'Arrival at site confirmed. Initial visual inspection shows charred port on switch 3. Requesting replacement unit from inventory.', time: 'JUST NOW' }
    ]
  });

  const LOGGED_IN_USER_ID = 2; // Simulating the logged-in user for ownership checks

  // ==========================================
  // API CONNECTORS
  // ==========================================

  // 1. POST API - Create Ticket with Files
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    
    // Extracting just the numbers because Spring Boot expects 'Long' (e.g., changes "UID-2204" to 2204)
    const cleanResourceId = parseInt(formData.resourceId.replace(/\D/g, '')) || 1;
    const cleanUserId = parseInt(formData.reporterUserId.replace(/\D/g, '')) || 1;

    // These must EXACTLY match TicketCreateRequestDTO fields
    data.append('resourceId', cleanResourceId); 
    data.append('reportedByUserId', cleanUserId);
    data.append('preferredContactDetails', formData.contactDetails);
    data.append('category', formData.category);
    data.append('priority', formData.priority.toUpperCase());
    data.append('description', formData.description);

    // CRITICAL FIX: Your controller specifically looks for "attachments", not "files"!
    files.forEach(file => {
      data.append('attachments', file); 
    });

    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        body: data, // fetch automatically handles the multipart/form-data boundary
      });
      
      if (response.ok) {
        alert("Success! Ticket created perfectly via API.");
        // Reset form
        setFormData({ resourceId: '', reporterUserId: '', contactDetails: '', category: 'Electrical', priority: 'High', description: '' });
        setFiles([]);
      } else {
        const errorText = await response.text();
        console.error("Backend Error:", errorText);
        alert(`Ticket creation failed: ${response.status}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to backend POST API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. PATCH API - Update Status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setTicketDetails({ ...ticketDetails, status: newStatus });

    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketDetails.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toUpperCase().replace(' ', '_') })
      });
      if (!response.ok) console.error("Failed to update status on backend.");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // 3. DELETE API - Delete Comment (Ownership Check)
  const handleDeleteComment = async (commentId, authorId) => {
    if (authorId !== LOGGED_IN_USER_ID) {
      alert("403 Forbidden: You can only delete your own comments!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}?userId=${LOGGED_IN_USER_ID}`, {
        method: 'DELETE'
      });
      
      if (response.ok || response.status === 204) {
        setTicketDetails({
          ...ticketDetails,
          comments: ticketDetails.comments.filter(c => c.id !== commentId)
        });
        alert("Comment deleted successfully!");
      } else if (response.status === 403) {
        alert("403 Forbidden: Backend blocked the deletion!");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // UI Handlers
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      alert("Maximum 3 images allowed!");
      return;
    }
    setFiles(Array.from(e.target.files));
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Create Ticket Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6 text-indigo-900">
            <ShieldAlert className="text-red-500" />
            <h2 className="text-xl font-bold">Report an Incident</h2>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">RESOURCE ID</label>
                <input type="text" name="resourceId" value={formData.resourceId} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. SRV-9021" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">REPORTER USER ID</label>
                <input type="text" name="reporterUserId" value={formData.reporterUserId} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="UID-2204" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CONTACT DETAILS</label>
              <input type="email" name="contactDetails" value={formData.contactDetails} onChange={handleInputChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="admin@campus-central.edu" />
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
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-indigo-500" placeholder="Detail the nature of the architectural failure or security breach..."></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ATTACH EVIDENCE (MAX 3 IMAGES)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Drop images here or <span className="text-indigo-600">Browse</span></span>
                  <span className="text-xs text-slate-400 mt-1">JPG, PNG UP TO 10MB</span>
                </label>
                {files.length > 0 && <div className="mt-2 text-xs text-green-600 font-bold">{files.length} file(s) selected</div>}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Ticket Details */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col h-[850px]">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">Main Campus Core <br/>Switch Failure: Rack A-4</h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">NETWORK</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">HIGH PRIORITY</span>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
               <span className="text-xs font-bold text-slate-400 mb-1">RESOLUTION TIMER</span>
               <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-900 font-mono text-xl font-bold">
                 <Clock className="w-5 h-5" />
                 01:42:55
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-y border-slate-100 py-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Status:</span>
              <select value={ticketDetails.status} onChange={handleStatusChange} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <span className="text-sm text-slate-400 flex items-center gap-1">
               <Clock className="w-4 h-4" /> Reported 2 hours ago
            </span>
          </div>

          {/* Attachments (Dummy UI) */}
          <div className="mb-8">
             <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider">ATTACHMENTS</h3>
             <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-900 rounded-xl shadow-inner border border-slate-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 opacity-50 flex items-center justify-center text-[8px] text-white">IMG_1.jpg</div>
                </div>
                <div className="w-20 h-20 bg-slate-900 rounded-xl shadow-inner border border-slate-200 overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-[8px] text-white">IMG_2.jpg</div>
                </div>
             </div>
          </div>

          {/* Activity Logs / Comments */}
          <h3 className="text-xs font-bold text-slate-400 mb-4 tracking-wider">ACTIVITY LOGS & COMMENTS</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-200">
            {ticketDetails.comments.map((comment) => (
              <div key={comment.id} className="bg-slate-50 rounded-xl p-4 flex gap-4 border border-slate-100 relative group">
                 <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {comment.authorName.substring(0, 2).toUpperCase()}
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-sm font-bold text-slate-800">{comment.authorName}</span>
                     <span className="text-xs text-slate-400 font-medium">{comment.time}</span>
                   </div>
                   <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                 </div>
                 
                 {/* DELETE BUTTON (Shows up if it's the user's comment) */}
                 {comment.authorId === LOGGED_IN_USER_ID && (
                   <button 
                     onClick={() => handleDeleteComment(comment.id, comment.authorId)}
                     className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                     title="Delete Comment"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
              </div>
            ))}
          </div>

          {/* Add Note Input */}
          <div className="mt-auto relative">
             <input type="text" placeholder="Add a secure internal note..." className="w-full bg-slate-100 rounded-xl pl-4 pr-12 py-4 text-sm border-none focus:ring-2 focus:ring-indigo-500" />
             <button className="absolute right-4 top-4 text-indigo-600 hover:text-indigo-800">
               <Send className="w-5 h-5" />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}