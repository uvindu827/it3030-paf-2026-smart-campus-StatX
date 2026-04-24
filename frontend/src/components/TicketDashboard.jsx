import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Clock, ShieldAlert, Send, Paperclip } from 'lucide-react';

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
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const LOGGED_IN_USER_ID = 12; // Simulating the logged-in user for ownership checks
  const { id } = useParams(); // This grabs the ID directly from the URL!
  //const TEST_TICKET_ID = 5; // Change this if your test ticket ID was different!

  // ==========================================
  // API CONNECTORS
  // ==========================================

  // 1. GET API - Fetch real ticket data on load
  /*useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/tickets/${TEST_TICKET_ID}`);
        if (response.ok) {
          const data = await response.json();
          setTicketDetails(data);
        } else {
          console.error("Failed to fetch ticket. Does ID", TEST_TICKET_ID, "exist?");
        }
      } catch (error) {
        console.error("API Error fetching ticket:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetails();
  }, []);*/

  // 1. GET API - Fetch real ticket data on load
useEffect(() => {
  // If there's no ID in the URL, stop loading and just show the empty state
  if (!id) {
    setIsLoading(false);
    setTicketDetails(null);
    return;
  }

  const fetchTicketDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTicketDetails(data);
      } else {
        console.error("Failed to fetch ticket. Does ID", id, "exist?");
        setTicketDetails(null);
      }
    } catch (error) {
      console.error("API Error fetching ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchTicketDetails();
}, [id]); // The array [id] tells React to re-run this if the URL changes

  // 2. POST API - Create Ticket with Files
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
        alert("Success! Ticket created perfectly via API.");
        setFormData({ resourceId: '', reporterUserId: '', contactDetails: '', category: 'Electrical', priority: 'High', description: '' });
        setFiles([]);
        // Optional: Refresh the ticket details to show the new one
      } else {
        alert(`Ticket creation failed: ${response.status}`);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. PATCH API - Update Status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    // Optimistic UI update
    setTicketDetails({ ...ticketDetails, status: newStatus });

    try {
      // Matches TicketStatusUpdateRequestDTO
      const payload = {
        status: newStatus.toUpperCase().replace(' ', '_'),
        rejectedReason: null,
        resolutionNotes: null
      };

      const response = await fetch(`http://localhost:8080/api/tickets/${ticketDetails.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error("Failed to update status on backend.");
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // 4. DELETE API - Delete Comment
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
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // 5. POST API - Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Don't submit empty comments!
    setIsSubmittingComment(true);

    try {
      const payload = {
        authorUserId: LOGGED_IN_USER_ID,
        commentText: newComment
      };

      const response = await fetch(`http://localhost:8080/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Our backend returns the fully updated ticket, so we just overwrite the state!
        const updatedTicket = await response.json();
        setTicketDetails(updatedTicket); 
        setNewComment(""); // Clear the input box
      } else {
        alert("Failed to post comment.");
      }
    } catch (error) {
      console.error("API Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
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

  // Helper to format dates cleanly
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Create Ticket Form (Unchanged UI) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
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

        {/* RIGHT COLUMN: Real Ticket Details */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col h-[850px]">
          
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-500 font-bold animate-pulse">
              Loading real ticket data from backend...
            </div>
          ) : !ticketDetails ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              No ticket found for ID {id}. Create one first!
            </div>
          ) : (
            <>
              {/* Header mapped to DTO */}
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-xl">
                  {/* Using category as title since there is no title field, and showing description snippet */}
                  <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">{ticketDetails.category} Incident</h1>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ticketDetails.description}</p>
                  
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">{ticketDetails.category}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${ticketDetails.priority === 'CRITICAL' || ticketDetails.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {ticketDetails.priority} PRIORITY
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase">
                      Resource: {ticketDetails.resourceId}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end">
                   <span className="text-xs font-bold text-slate-400 mb-1">REPORTED AT</span>
                   <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-900 font-mono text-sm font-bold">
                     <Clock className="w-5 h-5" />
                     {formatDate(ticketDetails.createdAt)}
                   </div>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex justify-between items-center border-y border-slate-100 py-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">Status:</span>
                  <select 
                    value={ticketDetails.status || 'OPEN'} 
                    onChange={handleStatusChange} 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <span className="text-sm text-slate-400 flex items-center gap-1">
                   Reporter ID: {ticketDetails.reportedByUserId} | {ticketDetails.preferredContactDetails}
                </span>
              </div>

              {/* Attachments mapping */}
              <div className="mb-8">
                 <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider">EVIDENCE ATTACHMENTS ({ticketDetails.attachments?.length || 0})</h3>
                 <div className="flex gap-4">
                    {ticketDetails.attachments?.length > 0 ? (
                      ticketDetails.attachments.map((file) => (
                        <div key={file.id} className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer" title={file.filePath}>
                          <Paperclip className="w-6 h-6 mb-1" />
                          <span className="text-[8px] font-bold truncate w-16 text-center">ID: {file.id}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">No attachments provided.</span>
                    )}
                 </div>
              </div>

              {/* Comments mapping */}
              <h3 className="text-xs font-bold text-slate-400 mb-4 tracking-wider">ACTIVITY LOGS & COMMENTS</h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-200">
                {ticketDetails.comments?.length > 0 ? (
                  ticketDetails.comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 rounded-xl p-4 flex gap-4 border border-slate-100 relative group">
                       <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          U{comment.authorUserId}
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-bold text-slate-800">User {comment.authorUserId}</span>
                           <span className="text-xs text-slate-400 font-medium">{formatDate(comment.createdAt)}</span>
                         </div>
                         <p className="text-sm text-slate-600 leading-relaxed">{comment.commentText}</p>
                       </div>
                       
                       {/* DELETE BUTTON (Shows up if it's the user's comment) */}
                       {comment.authorUserId === LOGGED_IN_USER_ID && (
                         <button 
                           onClick={() => handleDeleteComment(comment.id, comment.authorUserId)}
                           className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                           title="Delete Comment"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 text-sm py-4 italic">No comments yet.</div>
                )}
              </div>

              {/* Add Note Input */}
              <div className="mt-auto relative">
                 <input 
                   type="text" 
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                   placeholder="Add a secure internal note..." 
                   disabled={isSubmittingComment}
                   className="w-full bg-slate-100 rounded-xl pl-4 pr-12 py-4 text-sm border-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" 
                 />
                 <button 
                   onClick={handleAddComment}
                   disabled={isSubmittingComment || !newComment.trim()}
                   className="absolute right-4 top-4 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                 >
                   <Send className="w-5 h-5" />
                 </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}