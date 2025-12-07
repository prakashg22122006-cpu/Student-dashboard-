
import React, { useState } from 'react';
import { useData, getTodayString } from '../hooks/useData';
import { View } from '../../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface EventItem {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'goal' | 'task';
  date: string;
  color: string;
}

export const CalendarView: React.FC = () => {
  const { exams, assignments, goals, tasks } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayString());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Aggregate all events
  const getAllEvents = (): EventItem[] => {
    const items: EventItem[] = [];

    exams.forEach(e => items.push({
      id: e.id,
      title: `Exam: ${e.courseName}`,
      type: 'exam',
      date: e.date,
      color: 'bg-red-500'
    }));

    assignments.forEach(a => items.push({
      id: a.id,
      title: `Due: ${a.title}`,
      type: 'assignment',
      date: a.dueDate,
      color: 'bg-blue-500'
    }));

    goals.forEach(g => {
      if (g.deadline) {
        items.push({
          id: g.id,
          title: `Goal: ${g.title}`,
          type: 'goal',
          date: g.deadline,
          color: 'bg-green-500'
        });
      }
    });

    tasks.forEach(t => {
      if (t.dueDate && !t.completed) {
        items.push({
          id: t.id,
          title: t.title,
          type: 'task',
          date: t.dueDate,
          color: 'bg-purple-500'
        });
      }
    });

    return items;
  };

  const allEvents = getAllEvents();

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(e => e.date === dateStr);
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDate(null);
  };

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
          <p className="text-slate-500 dark:text-gray-400">Schedule & Planner.</p>
        </div>
        <div className="flex space-x-2 bg-white dark:bg-[#1E1E1E] rounded-lg p-1 border border-slate-200 dark:border-gray-800">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><i className="ti ti-chevron-left"></i></button>
          <span className="px-4 py-2 font-bold min-w-[140px] text-center dark:text-white">{MONTHS[month]} {year}</span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><i className="ti ti-chevron-right"></i></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-4">
          <div className="grid grid-cols-7 mb-4">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 dark:bg-slate-800/20 rounded-lg"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(day);
              const isToday = dateStr === getTodayString();
              const isSelected = dateStr === selectedDate;

              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square relative rounded-lg border transition-all flex flex-col items-center justify-start pt-2 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 dark:bg-primary/20 z-10 ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1E1E1E]' 
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                  } ${isToday ? 'bg-slate-100 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-gray-300'}`}
                >
                  <span className="text-sm">{day}</span>
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                    {dayEvents.slice(0, 4).map((ev, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full ${ev.color}`}></div>
                    ))}
                    {dayEvents.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="w-full lg:w-80 bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-5 h-fit">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {selectedDate ? new Date(selectedDate).toDateString() : 'Select a date'}
          </h3>
          
          <div className="space-y-3">
             {selectedDate && (() => {
               const events = allEvents.filter(e => e.date === selectedDate);
               if (events.length === 0) return <p className="text-sm text-slate-500 italic">No events scheduled.</p>;
               
               return events.map(e => (
                 <div key={e.id} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                   <div className={`w-3 h-3 rounded-full ${e.color}`}></div>
                   <div className="text-sm text-slate-800 dark:text-gray-200 truncate">
                     {e.title}
                   </div>
                 </div>
               ));
             })()}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Exams</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Assign.</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Goals</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
