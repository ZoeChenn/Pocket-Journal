import getConfig from 'next/config';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import { HashLoader } from 'react-spinners';

const { publicRuntimeConfig } = getConfig();
const CLIENT_ID = publicRuntimeConfig.CLIENT_ID;
const API_KEY = publicRuntimeConfig.API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const CalendarTaskList = ({ currentMonth }) => {
  const [ events, setEvents ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const loadGapiClient = async () => {
      const gapiScript = await import('gapi-script');
      const gapi = gapiScript.gapi;
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();

      await new Promise((resolve) => {
        gapi.load('client:auth2', resolve);
      });

      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: SCOPES,
      });

      await gapi.client.load('calendar', 'v3');

      const auth2 = gapi.auth2.getAuthInstance();
      if (!auth2.isSignedIn.get()) {
        auth2.signIn();
      }

      const userCalendarResponse = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfMonth,
        timeMax: endOfMonth,
        showDeleted: false,
        singleEvents: true,
        maxResults: 200,
        orderBy: 'startTime',
      });

      const taiwanHolidaysCalendarId = 'zh-tw.taiwan#holiday@group.v.calendar.google.com';
      const taiwanHolidaysResponse = await gapi.client.calendar.events.list({
        calendarId: taiwanHolidaysCalendarId,
        timeMin: startOfMonth,
        timeMax: endOfMonth,
        showDeleted: false,
        singleEvents: true,
        maxResults: 200,
        orderBy: 'startTime',
        locale: 'zh-TW',
      });

      const combinedEvents = userCalendarResponse.result.items.concat(taiwanHolidaysResponse.result.items);
      setEvents(combinedEvents);
      setIsLoading(false);
    };

    loadGapiClient().catch(error => {
      console.error('Error fetching Google Calendar data:', error);
      setIsLoading(false);
    });
  }, [ currentMonth ]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return format(parseISO(dateStr), 'MM-dd EEEE', { locale: zhTW });
  };

  const formatTime = (startDateStr, endDateStr, isAllDay) => {
    if (isAllDay) return '整天';
    return `${format(parseISO(startDateStr), 'HH:mm', { locale: zhTW })} - ${format(parseISO(endDateStr), 'HH:mm', { locale: zhTW })}`;
  };

  const groupEventsByDate = (events) => {
    return events.reduce((acc, event) => {
      const date = event.start.date || event.start.dateTime.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  };
  
  const renderEvents = () => {
    const groupedEvents = groupEventsByDate(events);
    return Object.entries(groupedEvents).map(([date, events]) => {
      const formattedDate = formatDate(events[0].start.dateTime || events[0].start.date);
      return (
        <div key={ date } className="event-group mb-8 cursor-default">
          <div className="event-date mb-2 font-bold">{ formattedDate }</div>
          { events.map((event, index) => (
            <div key={ index } className="event-item">
              <span className="event-time font-light pr-2">{ formatTime(event.start.dateTime, event.end.dateTime, event.start.date && !event.start.dateTime) }</span>
              <span className="event-summary font-light border-l-2 border-orange-400 pl-2">{event.summary}</span>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="tasks px-6 py-6">
      { isLoading ? (<HashLoader
        color="#d67e36"
        loading
        size={ 28 }
        className='m-auto'
      />
      ): (
        events.length > 0 ? renderEvents() : <p>No events.</p> 
      )}
    </div>
  );
  };
  
export default CalendarTaskList;
