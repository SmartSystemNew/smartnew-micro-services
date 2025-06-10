import { Injectable } from '@nestjs/common';
// import * as dayjs from 'dayjs';
// import * as utc from 'dayjs/plugin/utc';
// import * as timezone from 'dayjs/plugin/timezone';
// import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/pt-br';

//configure dayjs to use pt-BR locale and timezone

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat); // Ativa o customParseFormat
dayjs.locale('pt-br');

@Injectable()
export class DateService {
  dayjs(
    value: string | number | Date | dayjs.Dayjs,
    format?: dayjs.FormatObject,
  ): dayjs.Dayjs {
    return dayjs(value, format);
  }

  dayjsSubTree(
    value: string | number | Date | dayjs.Dayjs,
    format?: dayjs.FormatObject,
  ): dayjs.Dayjs {
    return dayjs(value, format).subtract(3, 'h');
  }

  dayjsAddTree(
    value: string | number | Date | dayjs.Dayjs,
    format?: dayjs.FormatObject,
  ): dayjs.Dayjs {
    return dayjs(value, format).add(3, 'h');
  }

  generateStartAndEndForDate(
    startDate: Date,
    endDate: Date,
  ): { start: Date; end: Date }[] {
    const months: { start: Date; end: Date }[] = [];

    if (startDate.getMonth() === endDate.getMonth()) {
      months.push({ start: startDate, end: endDate });
      return months;
    }

    // for (
    //   let month = startDate.getMonth();
    //   month <= endDate.getMonth();
    //   month++
    // ) {
    //   const firstDate = dayjs(startDate).set('month', month).startOf('month');

    //   // Check if the current month is the last month in the range
    //   const isLastMonth = endDate.getMonth() === month;
    //   let lastDate = dayjs(firstDate).endOf('month');

    //   if (isLastMonth) {
    //     // If the endDate is in the current month, adjust the lastDate
    //     const lastDateInMonth = new Date(lastDate.toDate().getTime());
    //     lastDateInMonth.setDate(endDate.getDate());
    //     lastDate = dayjs(lastDateInMonth);
    //   }

    //   const startOfMonth = firstDate.toDate();
    //   const endOfMonth = lastDate.subtract(3, 'h').toDate();

    //   months.push({ start: startOfMonth, end: endOfMonth });
    // }
    // return months;

    let start = dayjs(startDate);
    const end = dayjs(endDate);

    while (start.isBefore(end) || start.isSame(end, 'month')) {
      const firstDate = start.startOf('month');
      let lastDate = start.endOf('month');

      if (lastDate.isAfter(end) || lastDate.isSame(end, 'day')) {
        lastDate = end;
      }

      const startOfMonth = firstDate.toDate();
      const endOfMonth = lastDate.subtract(3, 'h').toDate();

      months.push({ start: startOfMonth, end: endOfMonth });

      start = start.add(1, 'month');
    }

    return months;
  }

  toMills(
    date: string | number | Date,
    timezone: string = 'America/Sao_Paulo',
  ): number {
    return dayjs(date).tz(timezone).valueOf();
  }

  getDays(start: Date, end: Date): { start: Date; end: Date }[] {
    let startDate = dayjs(start);
    const endDate = dayjs(end).endOf('day');
    const result: { start: Date; end: Date }[] = [];

    while (startDate <= endDate) {
      result.push({
        start: startDate.startOf('day').subtract(3, 'h').toDate(),
        end: startDate.endOf('day').subtract(3, 'h').toDate(),
      });
      startDate = startDate.add(1, 'day');
    }

    return result;
  }

  groupByDateForFinance(
    contasReceber: { date: dayjs.Dayjs; value: number }[],
    contasPagar: { date: dayjs.Dayjs; value: number }[],
  ): {
    date: string;
    totalReceive: number;
    totalExpress: number;
    netProfit: number;
  }[] {
    const contasAgrupadas: {
      [data: string]: { receber: number; pagar: number };
    } = {};

    // Processar contas a receber
    contasReceber.forEach((conta) => {
      const key = conta.date.add(3, 'h').format('DD/MM/YYYY');

      if (contasAgrupadas[key] === undefined) {
        contasAgrupadas[key] = { receber: conta.value, pagar: 0 };
      } else {
        contasAgrupadas[key].receber += conta.value;
      }
    });

    // Processar contas a pagar
    contasPagar.forEach((conta) => {
      const key = conta.date.add(3, 'h').format('DD/MM/YYYY');

      if (contasAgrupadas[key] === undefined) {
        contasAgrupadas[key] = { receber: 0, pagar: conta.value };
      } else {
        contasAgrupadas[key].pagar += conta.value;
      }
    });

    // Converter para o formato desejado
    const resultadoDiario = Object.keys(contasAgrupadas).map((data) => ({
      date: data,
      totalReceive: contasAgrupadas[data].receber * -1,
      totalExpress: contasAgrupadas[data].pagar,
      netProfit: contasAgrupadas[data].receber - contasAgrupadas[data].pagar,
    }));

    // Ordenar o resultado pela data

    return resultadoDiario;
  }

  parseDates(date: string | number) {
    let newDate: Date;
    // Verifica se a data é uma string
    if (typeof date === 'string' && date.includes('/')) {
      // Divide a string pelo separador '/'
      const parts = date.split('/');
      // Cria um novo objeto Date com as partes da data
      newDate = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0]),
      );
    } else if (typeof date === 'string' && date.includes('-')) {
      // Divide a string pelo separador '/'
      const parts = date.split('-');
      // Cria um novo objeto Date com as partes da data
      newDate = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0]),
      );
    } else if (typeof date === 'number') {
      // Cria um novo objeto Date a partir do número UNIX timestamp
      newDate = new Date(date * 1000); // Multiplica por 1000 para converter de segundos para milissegundos
    } else {
      // Se o tipo não for string ou número, exibe uma mensagem de erro
      console.error('Formato de data inválido para o objeto ' + date);
    }

    return newDate;
  }

  serviceOrderOpenTimeCheck(
    dateRequest: Date,
    statusClosed: string,
    dateClosed?: Date,
    datePrev?: Date,
  ): string | null {
    let flag = null;
    const currentDate = dayjs(new Date()).startOf('day').toDate();
    const request = dayjs(dateRequest).startOf('day').toDate();
    const prev = datePrev ? dayjs(datePrev).startOf('day').toDate() : null;
    const closed = dateClosed
      ? dayjs(dateClosed).startOf('day').toDate()
      : null;
    if (
      ((prev || request) < currentDate && statusClosed === 'N') ||
      ((prev || request) < closed && statusClosed !== 'C')
    ) {
      flag = 'S';
      if ((prev || request) === currentDate) {
        flag = 'H';
      }
    }
    return flag;
  }

  serviceOrderOpenTimeDisplay(
    dateRequest: Date,
    statusClosed: string,
    dateClosed?: Date,
    datePrev?: Date,
  ): string {
    const flag = this.serviceOrderOpenTimeCheck(
      dateRequest,
      statusClosed,
      dateClosed,
      datePrev,
    );
    let display = '';
    const currentDate = dayjs();

    if (['S', 'H'].includes(flag)) {
      const diffHours =
        dayjs(datePrev || currentDate).diff(dateRequest, 'hour') % 24;
      const diffMinute =
        dayjs(datePrev || currentDate).diff(dateRequest, 'minute') % 60;
      const hours = diffHours.toString().padStart(2, '0');
      const minute = diffMinute.toString().padStart(2, '0');

      if (flag === 'H') {
        display = `${hours}:${minute}`;
        return display;
      }
      const diffDays = dayjs(datePrev || currentDate).diff(dateRequest, 'day');

      display = `${diffDays} Dia(s) ${hours}:${minute}`;
    } else {
      display = `0 Dias`;
    }

    return display;
  }

  /**
   * Converts a string representation of a date into a JavaScript Date object.
   *
   * @param dateString - The string representation of the date. It can be in the format 'DD/MM/YYYY' or 'DD/MM/YYYY HH:mm:ss'.
   * @returns A JavaScript Date object representing the parsed date.
   *
   * @example
   * ```typescript
   * const date1 = convertStringToDate('25/12/2022'); // Returns: new Date(2022, 11, 25, 0, 0, 0)
   * const date2 = convertStringToDate('25/12/2022 15:30:45'); // Returns: new Date(2022, 11, 25, 15, 30, 45)
   * ```
   */
  convertStringToDate(dateString: string): Date {
    // Dividir a string nos componentes de data e hora
    const dateSplit = dateString.split(' ');
    if (dateSplit.length > 1) {
      const [datePart, timePart] = dateSplit;
      const [day, month, year] = datePart.split('/').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);

      return new Date(year, month - 1, day, hour, minute, second);
    }
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  formatTimeDifference(startDate: Date, endDate: Date) {
    // Cria as instâncias de Day.js para as datas de início e fim
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Calcula a diferença total em unidades de tempo
    const years = end.diff(start, 'year');
    const months = end.diff(start.add(years, 'year'), 'month');
    const days = end.diff(start.add(years, 'year').add(months, 'month'), 'day');
    const hours = end.diff(
      start.add(years, 'year').add(months, 'month').add(days, 'day'),
      'hour',
    );
    const minutes = end.diff(
      start
        .add(years, 'year')
        .add(months, 'month')
        .add(days, 'day')
        .add(hours, 'hour'),
      'minute',
    );

    // Constrói a string de resultado de forma inteligente
    let result = '';

    if (years > 0) result += `${years} ano${years > 1 ? 's' : ''}, `;
    if (months > 0) result += `${months} mês${months > 1 ? 'es' : ''}, `;
    if (days > 0) result += `${days} dia${days > 1 ? 's' : ''}, `;
    if (hours > 0) result += `${hours} hora${hours > 1 ? 's' : ''}, `;
    if (minutes > 0 || result === '')
      result += `${minutes} minuto${minutes > 1 ? 's' : ''}`;

    // Remove a última vírgula e espaço, caso exista
    return result.replace(/,\s*$/, '');
  }

  formatTimeDifferenceForRegisterHours(registerHour) {
    return registerHour.reduce(
      (totalTime, current) => {
        // Cria as instâncias de Day.js para as datas de início e fim
        const start = dayjs(current.inicio);
        const end = dayjs(current.fim);

        // Calcula a diferença total em unidades de tempo
        const years = end.diff(start, 'year');
        const months = end.diff(start.add(years, 'year'), 'month');
        const days = end.diff(
          start.add(years, 'year').add(months, 'month'),
          'day',
        );
        const hours = end.diff(
          start.add(years, 'year').add(months, 'month').add(days, 'day'),
          'hour',
        );
        const minutes = end.diff(
          start
            .add(years, 'year')
            .add(months, 'month')
            .add(days, 'day')
            .add(hours, 'hour'),
          'minute',
        );

        // Soma a diferença do item atual no total
        totalTime.years += years;
        totalTime.months += months;
        totalTime.days += days;
        totalTime.hours += hours;
        totalTime.minutes += minutes;

        return totalTime;
      },
      { years: 0, months: 0, days: 0, hours: 0, minutes: 0 },
    );
  }

  formatTotalTime(totalTime) {
    let result = '';

    if (totalTime.years > 0)
      result += `${totalTime.years} ano${totalTime.years > 1 ? 's' : ''}, `;
    if (totalTime.months > 0)
      result += `${totalTime.months} mês${totalTime.months > 1 ? 'es' : ''}, `;
    if (totalTime.days > 0)
      result += `${totalTime.days} dia${totalTime.days > 1 ? 's' : ''}, `;
    if (totalTime.hours > 0)
      result += `${totalTime.hours} hora${totalTime.hours > 1 ? 's' : ''}, `;
    if (totalTime.minutes > 0 || result === '')
      result += `${totalTime.minutes} minuto${
        totalTime.minutes > 1 ? 's' : ''
      }`;

    // Remove a última vírgula e espaço, caso exista
    return result.replace(/,\s*$/, '');
  }

  calculeDiffTimeInHour(startDate: Date, endDate: Date): number {
    const totalDiff = dayjs(endDate).diff(startDate, 'hour');

    return totalDiff || 0;
  }

  formatDateDefault(dateStr): dayjs.Dayjs {
    return dayjs(dateStr, 'DD-MM-YYYY');
  }
}
