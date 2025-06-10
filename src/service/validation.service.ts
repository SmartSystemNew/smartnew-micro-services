import { Transform } from 'class-transformer';
import { ValidationError } from 'class-validator';

export function IsBooleanFromString(
  message: string = 'Value must be a boolean',
) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(
      'validate:custom',
      {
        value: (value) => {
          if (typeof value === 'string') {
            if (value.toLowerCase() === 'true') {
              return true;
            } else if (value.toLowerCase() === 'false') {
              return true;
            }
          }
          return message;
        },
      },
      target,
      propertyKey,
    );
  };
}

export function IsNumberOrString(
  message: string = 'Value must be a number or string',
) {
  return (target: any, propertyKey: string): void => {
    if (!target || !propertyKey) {
      Reflect.defineMetadata('validate:isNull', message, target, propertyKey);
    }

    const validator = Reflect.getMetadata('design:type', target, propertyKey);

    if (validator === Number) {
      Reflect.defineMetadata('validate:isInt', { min: 0 }, target, propertyKey);
    }
    Reflect.defineMetadata('validate:isString', {}, target, propertyKey);
    Reflect.defineMetadata(
      'validate:custom',
      {
        value: (value) => {
          if (typeof value === 'string') {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue)) {
              return parsedValue;
            }
          }
          return message;
        },
      },
      target,
      propertyKey,
    );
  };
}
export function ValidateStringArrayAndTransformNumber() {
  return Transform((value: any) => {
    if (Array.isArray(value)) {
      if (
        value.every(
          (item) =>
            typeof item === 'number' ||
            (typeof item === 'string' && Number(item)),
        )
      ) {
        return value.map((item) => parseInt(item, 10));
      } else {
        throw new ValidationError();
      }
    }
  });
}

export function IsArrayOfNumbers(
  message: string = 'Value must be an array of numbers',
) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata('validate:isArray', {}, target, propertyKey);
    Reflect.defineMetadata(
      'validate:custom',
      {
        value: (value) => {
          if (!Array.isArray(value)) {
            return message;
          }
          for (const item of value) {
            if (typeof item !== 'number') {
              return message;
            }
          }
          return true;
        },
      },
      target,
      propertyKey,
    );
  };
}

export function StringToDateTransform() {
  const stringToDate = (valor: string): Date => new Date(valor);

  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      StringToDateTransform,
      stringToDate,
      target,
      propertyKey,
    );
  };
}

export function sanitizeFilename(filename: string) {
  console.log('nome antigo => ', filename);
  return filename.replace(/ç/g, 'c').replace(/Ç/g, 'C');
}
