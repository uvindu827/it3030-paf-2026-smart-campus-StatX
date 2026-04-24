import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Send, Paperclip } from 'lucide-react';

export default function AdminTicketDetails() {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const LOGGED_IN_USER_ID = 12; 
  const { id } = useParams();

  useEffect(() => {
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
    setTicketDetails({ ...ticketDetails, status: newStatus });

    try {
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
      
      if (!response.ok) alert("Failed to update status.");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);

    try {
      const payload = { authorUserId: LOGGED_IN_USER_ID, commentText: newComment };

      const response = await fetch(`http://localhost:8080/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setTicketDetails(updatedTicket); 
        setNewComment(""); 
      } else {
        alert("Failed to post comment.");
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
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800 flex justify-center pt-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col min-h-[700px]">
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-bold animate-pulse">
            Loading ticket data...
          </div>
        ) : !ticketDetails ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            No ticket found for ID {id}.
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div className="max-w-xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">{ticketDetails.category} Incident</h1>
                <p className="text-sm text-slate-500 mb-4">{ticketDetails.description}</p>
                
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
  );
}