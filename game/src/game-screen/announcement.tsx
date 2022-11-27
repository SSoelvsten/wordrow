import React from 'react';
import './announcement.scss';

interface AnnouncementProps {
    key?: string | number
    text: string
}

const Announcement = ({ key, text }: AnnouncementProps) => (
    <div className="Announcement" key={key}>
        <div className="Text">{text}</div>
    </div>
);

export default Announcement;