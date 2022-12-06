import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventAction, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { CalendarEvent, EventColor } from 'calendar-utils';
import { addDays, addHours, addMinutes, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { CustomEventTitleFormatter } from 'src/app/utils/custom-event-title-formatter.provider';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: "#b4f0c4",
    secondary: "#b4f0c4",
  }
};

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: [],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  bookingTitle: string = "";

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  modalData: {
    action: string;
    event: CalendarEvent;
  } = {
      action: "",
      event: {
        start: subDays(startOfDay(new Date()), 1),
        end: addMinutes(new Date(), 15),
        title: '',
        color: { ...colors['red'] },
        actions: this.actions,
        allDay: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      },
    };

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: new Date("December 15, 2022 10:00:00"),
      end: new Date("December 15, 2022 10:30:00"),
      title: 'Cynthia Mokasi',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date("December 10, 2022 09:00:00"),
      end: new Date("December 10, 2022 09:30:00"),
      title: 'Patience Test',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date("December 11, 2022 09:00:00"),
      end: new Date("December 11, 2022 09:30:00"),
      title: 'Jabulile Sobuza',
      color: { ...colors['blue'] },
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date("December 15, 2022 11:00:00"),
      end: new Date("December 15, 2022 11:30:00"),
      title: 'Stand Tall',
      color: { ...colors['green'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];


  activeDayIsOpen: boolean = true;

  clickedDate: Date | undefined;

  daysInWeek = 7;

  bookingStartDate: Date = new Date();
  bookingEndDate: Date = new Date();

  private destroy$ = new Subject<void>();
  private refreshInterval: any;


  constructor(
    private modal: NgbModal,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 2,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 5,
      },
    };

    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 7;
        }
        this.cd.markForCheck();
      });

    this.refreshInterval = setInterval(() => {
      this.refresh.next();
    }, 900000)
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
    this.destroy$.next();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("Clicked" + events)
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleDayClicked(event: any) {
    this.bookingStartDate = event.date;
    this.bookingEndDate = addMinutes(this.bookingStartDate, 30);

    this.modal.open(this.modalContent, { size: 'md' });
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes()) + minutes;
    return date;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'md' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: this.bookingTitle,
        start: this.bookingStartDate,
        end: this.bookingEndDate,
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];

    this.bookingTitle = "";
    this.modal.dismissAll();

  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
