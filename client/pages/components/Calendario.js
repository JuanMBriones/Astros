/* eslint-disable require-jsdoc */
import React, {useState, useEffect} from 'react';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import axios from 'axios';

// prueba

const resources = [{
  fieldName: 'id',
  title: 'Id',
  instances: [
    {id: 0, color: '#9575cd'},
    {id: 1, color: '#2196f3'},
    {id: 2, color: '#00796b'},
  ],
}];

export default function Demo() {
  const [appointments, setAppointments] = useState([
    {
      title: 'Materia 1',
      startDate: '2022-05-01T09:45',
      endDate: '2022-05-01T11:00',
      id: 0,
    },
    {
      title: 'Website Re-Design Plan',
      startDate: new Date(2022, 4, 2, 9, 35),
      endDate: new Date(2022, 4, 2, 11, 30),
      id: 0,
      rRule: 'FREQ=DAILY;COUNT=3',
      exDate: '20180628T063500Z,20180626T063500Z',
      color: '#ff0000',
    }, {
      title: 'Book Flights to San Fran for Sales Trip',
      startDate: new Date(2022, 4, 2, 12, 11),
      endDate: new Date(2022, 4, 2, 13, 0),
      id: 1,
      rRule: 'FREQ=DAILY;COUNT=4',
      exDate: '20180627T091100Z',
      color: '#ffccff',
    }, {
      title: 'Install New Router in Dev Room',
      startDate: new Date(2022, 4, 2, 13, 30),
      endDate: new Date(2022, 4, 2, 14, 35),
      id: 2,
      rRule: 'FREQ=DAILY;COUNT=5',
      color: '#ff9747',
    },
  ]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        'http://localhost:3001/api/horarioProf/',
        {
          params: {
            profesor: 'L00000000',
          },
        },
      );
      console.log(res.data.horarioProf);

      const materias = res.data.horarioProf;
      let id = 0;
      // map the data to the format that the scheduler needs
      const mappedData = materias.map((materia) => {
        console.log(materia);
        return {
          title: materia.materia,
          startDate: materia.horario[0].horario_semana[0].hora_inicio,
          endDate: materia.horario[0].horario_semana[0].hora_fin,
          color: '#ff0000',
          id: id++,
        };
      });
      console.log(mappedData);
      setAppointments(mappedData);
      // setAppointments(res.data);
    };

    getData();
  }, []);


  return (
    <Scheduler
      data={appointments}

    >
      <ViewState
        defaultCurrentDate="2022-02-08"

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
