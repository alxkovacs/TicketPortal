import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state('void', style({
    opacity: 0
  })),
  transition(':enter', [
    animate('300ms ease-in', style({
      opacity: 1
    }))
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({
      opacity: 0
    }))
  ])
]);

export const slideInOut = trigger('slideInOut', [
  state('void', style({
    transform: 'translateY(-20px)',
    opacity: 0
  })),
  transition(':enter', [
    animate('300ms ease-out', style({
      transform: 'translateY(0)',
      opacity: 1
    }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({
      transform: 'translateY(-20px)',
      opacity: 0
    }))
  ])
]);

export const shake = trigger('shake', [
  state('false', style({
    transform: 'translateX(0)'
  })),
  state('true', style({
    transform: 'translateX(0)'
  })),
  transition('false => true', [
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(0)' }))
  ])
]);

export const expandCollapse = trigger('expandCollapse', [
  state('void', style({
    height: '0',
    opacity: 0
  })),
  state('*', style({
    height: '*',
    opacity: 1
  })),
  transition('void <=> *', [
    animate('300ms ease-in-out')
  ])
]);

export const rotateInOut = trigger('rotateInOut', [
  state('void', style({
    transform: 'rotate(-180deg)',
    opacity: 0
  })),
  transition(':enter', [
    animate('300ms ease-out', style({
      transform: 'rotate(0)',
      opacity: 1
    }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({
      transform: 'rotate(-180deg)',
      opacity: 0
    }))
  ])
]); 