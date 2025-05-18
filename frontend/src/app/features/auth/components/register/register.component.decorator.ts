import { RegisterErrorType } from './register.component.enum';

export function HandleError(errorType: RegisterErrorType) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        console.error(`[${errorType}] Error in ${propertyKey}:`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

export function ValidateInput() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const form = this.registerForm;
      if (!form || !form.valid) {
        console.error('Form validation failed');
        return;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export function Debounce(delay: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let timeoutId: NodeJS.Timeout;

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}

export function TrackChanges() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`[${new Date().toISOString()}] Method ${propertyKey} called with args:`, args);
      const result = originalMethod.apply(this, args);
      console.log(`[${new Date().toISOString()}] Method ${propertyKey} returned:`, result);
      return result;
    };

    return descriptor;
  };
}

export function AutoUnsubscribe() {
  return function (constructor: any) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
      for (const prop in this) {
        const property = this[prop];
        if (property && typeof property.unsubscribe === 'function') {
          property.unsubscribe();
        }
      }
      original?.apply(this);
    };
  };
} 