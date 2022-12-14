import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { formatDate } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  override month(event: CalendarEvent): string {
    return `${event.title} <b>${formatDate(event.start, 'h:mm a', this.locale)}</b> - <b>${formatDate((event.end != undefined) ? event.end : "", 'h:mm a', this.locale)}</b>`;
  }

  override week(event: CalendarEvent): string {
    return `${event.title} <b>${formatDate(event.start, 'h:mm a', this.locale)}</b> - <b>${formatDate((event.end != undefined) ? event.end : "", 'h:mm a', this.locale)}</b>`;
  }

  override day(event: CalendarEvent): string {
    return `${event.title} <b>${formatDate(event.start, 'h:mm a', this.locale)}</b> - <b>${formatDate((event.end != undefined) ? event.end : "", 'h:mm a', this.locale)}</b>`;
  }
}
