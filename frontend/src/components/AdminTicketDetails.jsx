import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Send, Paperclip } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminTicketDetails() {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // --- LOGGED IN USER LOGIC ---
  // Get userId from localStorage, parse it, and provide a fallback (1) if not found
  const LOGGED_IN_USER_ID = parseInt(localStorage.getItem('userId')) || 1; 
  
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
    // Now LOGGED_IN_USER_ID is defined and usable here
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
      // Using the variable from localStorage
      const payload = { 
        authorUserId: LOGGED_IN_USER_ID, 
        commentText: newComment 
      };
      
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

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col min-h-[700px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-indigo-500 font-bold animate-pulse flex-col gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            Loading Dashboard...
          </div>
        ) : !ticketDetails ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-bold">No ticket found.</div>
        ) : (
          <>
            {/* --- Header Section --- */}
            <div className="bg-white rounded-2xl p-6 mb-8 text-slate-800 relative overflow-hidden shadow-sm border-2 border-indigo-100">
              <div className="relative z-10 flex justify-between items-start">
                <div className="max-w-xl">
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black rounded-full uppercase tracking-wider">
                      {ticketDetails.category}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm ${ticketDetails.priority === 'CRITICAL' || ticketDetails.priority === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                      {ticketDetails.priority} PRIORITY
                    </span>
                  </div>
                  <h1 className="text-3xl font-black mb-2 tracking-tight text-indigo-950">{ticketDetails.category} Incident</h1>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{ticketDetails.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-600 font-mono text-xs font-bold shadow-sm border border-slate-200">
                    <Clock className="w-4 h-4 text-indigo-400" /> {formatDate(ticketDetails.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Status Selection --- */}
            <div className="flex justify-between items-center border-y border-slate-100 py-5 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status:</span>
                <select 
                  value={ticketDetails.status?.toUpperCase() || 'OPEN'} 
                  onChange={handleStatusChange} 
                  className="border rounded-xl px-4 py-2 text-sm font-bold outline-none cursor-pointer transition-all shadow-sm bg-slate-50"
                >
                  <option value="OPEN">🔵 Open</option>
                  <option value="IN_PROGRESS">🟠 In Progress</option>
                  <option value="RESOLVED">🟢 Resolved</option>
                  <option value="CLOSED">⚫ Closed</option>
                </select>
              </div>
            </div>

            {/* --- Timeline / Comments --- */}
            <h3 className="text-[11px] font-black text-slate-400 mb-6 tracking-widest flex items-center gap-2 uppercase">
              Activity Timeline
            </h3>
            
            <div className="flex-1 overflow-y-auto mb-6 relative pl-2 pr-2">
              <div className="absolute left-[25px] top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>
              
              <div className="space-y-6 relative z-10">
                {ticketDetails.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-white border-4 border-slate-50 text-indigo-600 flex items-center justify-center text-xs font-black shadow-sm z-10 ring-1 ring-slate-200">
                      U{comment.authorUserId}
                    </div>
                    
                    <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-none p-5 relative">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-slate-800">User {comment.authorUserId}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {comment.commentText}
                      </p>
                      
                      {/* Using the defined LOGGED_IN_USER_ID here */}
                      {comment.authorUserId === LOGGED_IN_USER_ID && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id, comment.authorUserId)} 
                          className="absolute right-4 bottom-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Input Section --- */}
            <div className="relative mt-2">
               <input 
                 type="text" 
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                 placeholder="Type a resolution note..." 
                 className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-5 pr-16 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" 
                 disabled={isSubmittingComment}
               />
               <button 
                 onClick={handleAddComment} 
                 disabled={isSubmittingComment || !newComment.trim()}
                 className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl flex items-center justify-center disabled:bg-slate-300"
               >
                 {isSubmittingComment ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Send className="w-4 h-4 ml-0.5" />
                 )}
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}