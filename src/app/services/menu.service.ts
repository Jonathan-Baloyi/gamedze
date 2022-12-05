import { IMenu } from '../models/IMenu';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {
  constructor() { }

  public getMenu(): Observable<IMenu[]> {
    const homeMenuItem: IMenu = {
      name: 'Home',
      link: '/home',
      data: [],
      isCurrent: false,
      isDisabled: false
    };

    const menuMenuItem: IMenu = {
      name: 'Menu',
      link: '/menu',
      data: [],
      isCurrent: false,
      isDisabled: false
    };

    const aboutMenuItem: IMenu = {
      name: 'About',
      link: '/about',
      data: [],
      isCurrent: false,
      isDisabled: false
    };

    const contactMenuItem: IMenu = {
      name: 'Contact',
      link: '/contact',
      data: [],
      isCurrent: false,
      isDisabled: false
    };

    /* Incase menu items are required in the future, we'll just uncomment the following code */
    const menuItems: IMenu[] = [];
    menuItems.push(homeMenuItem);
    //menuItems.push(aboutMenuItem);
    //menuItems.push(contactMenuItem);

    const res: Observable<IMenu[]> = of(menuItems);
    return res;
  }
}
