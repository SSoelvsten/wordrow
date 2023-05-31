import React, { ReactNode } from 'react';
import './announcement.scss';

interface AnnouncementProps {
  key?: string | number;
  children: ReactNode;
}

const Announcement = ({ key, children }: AnnouncementProps) => (
  <div className="Announcement" key={key}>
    <div className="Content">{children}</div>
  </div>
);

export default Announcement;
