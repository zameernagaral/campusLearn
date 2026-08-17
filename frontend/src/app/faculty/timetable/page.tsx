'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle, ArrowLeft, Mic, MicOff, Camera, MonitorUp, Users, Upload, X, FileText } from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function FacultyTimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday');
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [isUploadingTimetable, setIsUploadingTimetable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [classes, setClasses] = useState([
    { id: 1, subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', type: 'Lecture', batch: 'CS-A', room: 'Room 204', status: 'Live Now', day: 'Monday', attendance: 45 },
    { id: 2, subject: 'Computer Networks', time: '11:15 AM - 12:15 PM', type: 'Lecture', batch: 'CS-B', room: 'Room 201', status: 'Upcoming', day: 'Monday', attendance: 0 },
    { id: 3, subject: 'Advanced DBMS', time: '02:00 PM - 03:00 PM', type: 'Lecture', batch: 'MTech', room: 'Room 302', status: 'Upcoming', day: 'Monday', attendance: 0 },
    { id: 4, subject: 'Database Management Systems', time: '09:00 AM - 10:00 AM', type: 'Lecture', batch: 'CS-B', room: 'Room 204', status: 'Upcoming', day: 'Tuesday', attendance: 0 },
    { id: 5, subject: 'DBMS Lab', time: '10:15 AM - 12:15 PM', type: 'Lab', batch: 'CS-A', room: 'Lab 2', status: 'Upcoming', day: 'Tuesday', attendance: 0 },
    { id: 6, subject: 'Computer Networks', time: '10:00 AM - 11:00 AM', type: 'Lecture', batch: 'CS-A', room: 'Room 201', status: 'Upcoming', day: 'Wednesday', attendance: 0 },
  ]);

  const displayedClasses = classes.filter(c => c.day === activeDay);

  const handleStartClass = (subject: string) => {
    setActiveClass(subject);
    toast.success(`Started live session for ${subject}`);
  };

  const handleUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsUploadingTimetable(false);
      setFile(null);
      setClasses(prev => [
        ...prev,
        { id: Math.random(), subject: 'Advanced Algorithms', time: '01:00 PM - 02:00 PM', type: 'Lecture', batch: 'CS-A', room: 'Room 401', status: 'Upcoming', day: 'Monday', attendance: 0 },
        { id: Math.random(), subject: 'Data Science Lab', time: '02:00 PM - 04:00 PM', type: 'Lab', batch: 'CS-B', room: 'Lab 3', status: 'Upcoming', day: 'Tuesday', attendance: 0 }
      ]);
      toast.success('Timetable parsed and 2 new classes synced successfully!');
    }, 2000);
  };

 if (activeClass) {
 return (
 <DashboardLayout requiredRole="faculty">
 <button onClick={() => setActiveClass(null)} className="btn btn-ghost mb-4 flex items-center gap-2">
 <ArrowLeft size={16} /> End Class
 </button>
 <div className="card overflow-hidden bg-zinc-950 flex flex-col h-[70vh]">
 <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-white">
 <div>
 <h2 className="font-bold">{activeClass} - Live Session</h2>
 <p className="text-xs text-gray-400 mt-1 flex items-center gap-2"><Users size={12} /> 42 Students Joined</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> REC
 </div>
 </div>
 </div>
 <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
 <div className="absolute top-4 right-4 grid grid-cols-2 gap-2">
 <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">Student 1</div>
 <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">Student 2</div>
 <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">Student 3</div>
 <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">+39 more</div>
 </div>
 
 <div className="w-64 h-64 rounded-full bg-gray-800 flex items-center justify-center border-4 border-indigo-500">
 <Camera size={64} className="text-gray-500" />
 </div>
 <p className="text-gray-400 mt-6 font-medium">Your Camera is Off</p>
 </div>
 <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center gap-4">
 <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"><MicOff size={20} /></button>
 <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"><Camera size={20} /></button>
 <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"><MonitorUp size={20} /></button>
 <button onClick={() => { setActiveClass(null); toast.success('Class ended automatically. Attendance logged.'); }} className="px-6 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold hover:bg-red-600">End Meeting</button>
 </div>
 </div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout requiredRole="faculty">
 <Toaster position="top-right" />
 
      {isUploadingTimetable && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
            <button disabled={isProcessing} onClick={() => { setIsUploadingTimetable(false); setFile(null); }} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
              <Upload size={24} className="text-orange-500" /> Upload Timetable
            </h2>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Upload your department's timetable in CSV or Excel format. Our AI will automatically parse and sync it to your schedule.
            </p>
            
            <div className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 ${file ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-orange-500/50'}`}>
              {isProcessing ? (
                <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              ) : (
                <FileText size={32} className={file ? 'text-orange-500' : 'text-zinc-400'} />
              )}
              
              <p className={`text-sm font-medium text-center ${file ? 'text-orange-700 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-300'}`}>
                {isProcessing ? 'Processing AI Data...' : (file ? file.name : 'Drag and drop your file here')}
              </p>
              
              {!isProcessing && (
                <>
                  {!file && <p className="text-xs text-zinc-500">CSV, XLSX (Max 5MB)</p>}
                  <input type="file" className="hidden" id="timetable-upload" accept=".csv,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
                  <label htmlFor="timetable-upload" className="mt-4 px-6 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                    {file ? 'Change File' : 'Browse Files'}
                  </label>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button disabled={isProcessing} onClick={() => { setIsUploadingTimetable(false); setFile(null); }} className="px-6 py-3 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button 
                disabled={!file || isProcessing}
                onClick={handleUpload} 
                className="px-6 py-3 rounded-xl font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                {isProcessing ? 'Parsing...' : 'Sync Timetable'}
              </button>
            </div>
          </div>
        </div>
      )}

 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Teaching Schedule</h1>
 <p className="text-muted mt-1">Manage your classes and start live lectures</p>
 </div>
 <button onClick={() => setIsUploadingTimetable(true)} className="btn btn-outline flex items-center gap-2">
 <Upload size={18} /> Upload Timetable
 </button>
 </div>

 <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
 {days.map((day, idx) => (
 <button
 key={day}
 onClick={() => setActiveDay(day)}
 className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-all ${activeDay === day ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface border-border hover:border-primary/30'}`}
 >
 <span className="text-xs font-medium uppercase opacity-80 mb-1">{day.substring(0, 3)}</span>
 <span className="text-xl font-bold">0{idx + 5}</span>
 </button>
 ))}
 </div>

 <div className="space-y-4">
 {displayedClasses.length === 0 ? (
 <div className="card p-10 text-center text-muted">No classes scheduled for you on {activeDay}. Enjoy your day!</div>
 ) : (
 displayedClasses.map((cls) => (
 <div key={cls.id} className={`card p-5 border-l-4 ${cls.status === 'Live Now' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-zinc-300 dark:border-zinc-700'}`}>
 <div className="flex justify-between items-start">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cls.status === 'Live Now' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
 {cls.status === 'Live Now' && <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1 animate-pulse"></span>}
 {cls.status}
 </span>
 <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">{cls.type}</span>
 <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">{cls.batch}</span>
 </div>
 <h3 className="text-xl font-bold mt-2">{cls.subject}</h3>
 <p className="text-muted text-sm mt-1">Batch: {cls.batch} • Room: {cls.room}</p>
 </div>
 <div className="text-right">
 <p className="font-bold flex items-center justify-end gap-1"><Clock size={16} /> {cls.time}</p>
 {cls.status === 'Live Now' ? (
 <p className="text-sm text-green-600 font-medium flex items-center justify-end gap-1 mt-1"><Users size={14} /> {cls.attendance} expected</p>
 ) : (
 <p className="text-sm text-muted flex items-center justify-end gap-1 mt-1"><MapPin size={16} /> {cls.room}</p>
 )}
 </div>
 </div>
 
 {cls.status === 'Live Now' && (
 <div className="mt-4 pt-4 border-t border-border flex justify-end">
 <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" className="btn btn-primary flex items-center gap-2">
 <Video size={18} /> Start Class (GMeet)
 </a>
 </div>
 )}
 </div>
 ))
 )}
 </div>
 </DashboardLayout>
 );
}
