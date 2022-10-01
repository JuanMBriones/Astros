import * as React from 'react';
import { ViewState} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';


const appointments = [{
  title: 'Website Re-Design Plan',
  startDate: new Date(2022, 4, 2, 9, 35),
  endDate: new Date(2022, 4, 2, 11, 30),
  id: 0,
  rRule: 'FREQ=DAILY;COUNT=3',
  exDate: '20180628T063500Z,20180626T063500Z',
  color: "#ff0000",
}, {
  title: 'Book Flights to San Fran for Sales Trip',
  startDate: new Date(2022, 4, 2, 12, 11),
  endDate: new Date(2022, 4, 2, 13, 0),
  id: 1,
  rRule: 'FREQ=DAILY;COUNT=4',
  exDate: '20180627T091100Z',
  color: "#ffccff",
}, {
  title: 'Install New Router in Dev Room',
  startDate: new Date(2022, 4, 2, 13, 30),
  endDate: new Date(2022, 4, 2, 14, 35),
  id: 2,
  rRule: 'FREQ=DAILY;COUNT=5',
  color: "#ff9747", 
}];

const resources = [{
  fieldName: 'id',
  title: 'Id',
  instances: [
    { id: 0, color: '#9575cd' },
    { id: 1, color: '#2196f3' },
    { id: 2, color: '#00796b' },
  ],
}];

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
    };
  }

  render() {
    const { data } = this.state;

    return (
        <Scheduler
          data={data}
        >
          <ViewState
            defaultCurrentDate="2022-05-01"
          />
          <WeekView
            startDayHour={7}
            endDayHour={22}
          />
          <Appointments />
          <Resources
            data={resources}
          />
        </Scheduler>
    );
  }
}