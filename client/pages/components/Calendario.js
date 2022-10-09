/* eslint-disable require-jsdoc */
import React, {useState, useEffect} from 'react';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';


const resources = [{
  fieldName: 'id',
  title: 'Id',
  instances: [
    {id: 0, color: '#9575cd'},
    {id: 1, color: '#2196f3'},
    {id: 2, color: '#00796b'},
  ],
}];

let setApp;
let setApp2;

function mats(ar) {
  setApp2();
  setApp(ar);
  setApp2();
  setApp(ar);
}

function Calendario() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments([]);
  }, []);

  setApp2 = function() {
    setAppointments([]);
  };

  setApp = function(ar) {
    let id = 0;
    const mappedData = [];

    ar.map((materia) => {
      materia.horario[0].horario_semana.map((horarioSemana) => {
        const horaInicio = new Date(horarioSemana.hora_inicio);
        const horaFin = new Date(horarioSemana.hora_fin);
        const dia = horarioSemana.dia;
        mappedData.push( {
          title: materia.materia,
          startDate: new Date(2022, 7, dia,
            horaInicio.getUTCHours(), horaInicio.getUTCMinutes()),
          endDate: new Date(2022, 7, dia,
            horaFin.getUTCHours(), horaFin.getUTCMinutes()),
          color: '#ff0000',
          id: id,
        });
      });
      id++;
    });


    console.log('materias mapeadas');
    console.log(mappedData);
    setAppointments(mappedData);
  };

  return (
    <Scheduler
      data={appointments}
      locale="es-ES"
    >
      <ViewState
        defaultCurrentDate="2022-08-01"
      />
      <WeekView
        startDayHour={7}
        endDayHour={22}
        excludedDays={[0, 6]}
      />
      <Appointments />
      <Resources
        data={resources}
      />
    </Scheduler>
  );
}

export {Calendario, mats};
