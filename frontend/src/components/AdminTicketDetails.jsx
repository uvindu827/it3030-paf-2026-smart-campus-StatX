import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Send, Paperclip } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminTicketDetails() {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const LOGGED_IN_USER_ID = 12; 
  const { id } = useParams();

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('jwtToken') || '';
  };

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setTicketDetails(null);
      return;
    }

    const fetchTicketDetails = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`http://localhost:8080/api/tickets/${id}`, { headers });
        if (response.ok) {
          const data = await response.json();
          setTicketDetails(data);
        } else {
          setTicketDetails(null);
        }
      } catch (error) {
        console.error("API Error fetching ticket:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value; 
    const previousStatus = ticketDetails.status;
    setTicketDetails({ ...ticketDetails, status: newStatus });

    try {
      const payload = { 
        status: newStatus,
        rejectedReason: "", 
        resolutionNotes: "" 
      };

      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:8080/api/tickets/${ticketDetails.id}/status`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        toast.success("Status updated successfully! 🏆");
      } else {
        throw new Error("Backend validation failed.");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      setTicketDetails({ ...ticketDetails, status: previousStatus });
      toast.error("Failed to update. Check backend constraints.");
    }
  };

  const handleDeleteComment = async (commentId, authorId) => {
    if (authorId !== LOGGED_IN_USER_ID) {
      toast.warning("You can only delete your own comments!");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}?userId=${LOGGED_IN_USER_ID}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok || response.status === 204) {
        setTicketDetails({
          ...ticketDetails,
          comments: ticketDetails.comments.filter(c => c.id !== commentId)
        });
        toast.success("Note deleted successfully! 🗑️");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);

    try {
      const payload = { authorUserId: LOGGED_IN_USER_ID, commentText: newComment };
      const token = getAuthToken();

      const response = await fetch(`http://localhost:8080/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setTicketDetails(updatedTicket); 
        setNewComment(""); 
        toast.success("Note added! 🔒");
      }
    } catch (error) {
      console.error("API Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getDisplayUrl = (path) => {
    if (!path) return "";
    // This regex splits by forward slash OR backslash to grab just the end filename
    const fileName = path.split(/[\\/]/).pop();
    return `http://localhost:8080/uploads/tickets/${fileName}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col min-h-[700px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-bold animate-pulse">Loading...</div>
        ) : !ticketDetails ? (
          <div className="flex items-center justify-center h-full">No ticket found.</div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div className="max-w-xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{ticketDetails.category} Incident</h1>
                <p className="text-sm text-slate-500 mb-4">{ticketDetails.description}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">{ticketDetails.category}</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${ticketDetails.priority === 'CRITICAL' || ticketDetails.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {ticketDetails.priority} PRIORITY
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-900 font-mono text-sm font-bold">
                   <Clock className="w-5 h-5" /> {formatDate(ticketDetails.createdAt)}
                 </div>
              </div>
            </div>

            {/* ✨ SUPER-SAFE ATTACHMENTS SECTION ✨ */}
            {ticketDetails.attachments && ticketDetails.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> ATTACHMENTS
                </h3>
                <div className="flex flex-wrap gap-4">
                  {ticketDetails.attachments.map((attachment, index) => {
                    // 1. Try to find the path in any possible field name
                    const rawPath = attachment.filePath || attachment.path || (typeof attachment === 'string' ? attachment : null);
                    
                    if (!rawPath) return null; // Skip if we can't find a path

                    // 2. Extract just the filename (e.g., "1-screenshot.png")
                    const fileName = rawPath.split(/[\\/]/).pop();
                    const fullImageUrl = `http://localhost:8080/uploads/tickets/${fileName}`;

                    return (
                      <a 
                        key={attachment.id || index} 
                        href={fullImageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="relative overflow-hidden rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md">
                          <img 
                            src={fullImageUrl} 
                            alt={`Attachment ${index + 1}`} 
                            className="max-h-48 w-auto object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              console.error("Image failed to load:", fullImageUrl);
                              e.target.src = "https://placehold.co/200x150?text=Image+Not+Found";
                            }} 
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            

            <div className="flex justify-between items-center border-y border-slate-100 py-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">Status:</span>
                <select 
                  value={ticketDetails.status?.toUpperCase() || 'OPEN'} 
                  onChange={handleStatusChange} 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-400 mb-4 tracking-wider">COMMENTS</h3>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {ticketDetails.comments?.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded-xl p-4 flex gap-4 relative">
                   <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold">U{comment.authorUserId}</div>
                   <div className="flex-1">
                     <div className="flex justify-between mb-1">
                       <span className="text-sm font-bold">User {comment.authorUserId}</span>
                       <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                     </div>
                     <p className="text-sm text-slate-600">{comment.commentText}</p>
                   </div>
                   {comment.authorUserId === LOGGED_IN_USER_ID && (
                     <button onClick={() => handleDeleteComment(comment.id, comment.authorUserId)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                   )}
                </div>
              ))}
            </div>

            <div className="relative">
               <input 
                 type="text" 
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                 placeholder="Add a note..." 
                 className="w-full bg-slate-100 rounded-xl pl-4 pr-12 py-4 text-sm" 
               />
               <button onClick={handleAddComment} className="absolute right-4 top-4 text-indigo-600"><Send className="w-5 h-5" /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}