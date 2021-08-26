import React from 'react';

const DateContext = React.createContext(new Date(Date.now()).toISOString());

export default DateContext;
