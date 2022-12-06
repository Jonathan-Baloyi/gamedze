import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IBooking } from '../models/IBooking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  bookings: IBooking[] = [];

  constructor(private httpService: HttpClient) { }

  public getBookings(): Observable<IBooking[]> {
    return this.httpService.get('assets/bookings.json') as Observable<IBooking[]>;
  }
}
