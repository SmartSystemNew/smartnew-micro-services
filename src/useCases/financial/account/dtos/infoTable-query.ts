import {
  IsIn,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { MessageService } from 'src/service/message.service';
import { StringToDateTransform } from 'src/service/validation.service';

function IsBooleanFromString(message: string = 'Value must be a boolean') {
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

function IsNumberOrString(
  message: string = 'Value must be a number or string',
) {
  return (target: any, propertyKey: string): void => {
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
            value = parsedValue;
          }
          return message;
        },
      },
      target,
      propertyKey,
    );
  };
}

function IsArrayOfNumbers(
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

          // Tente converter strings em números antes da validação
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'string') {
              const parsedNumber = Number(value[i]);
              if (isNaN(parsedNumber)) {
                return message;
              }
              value[i] = parsedNumber;
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

class DateRange {
  @StringToDateTransform()
  start: Date;

  @StringToDateTransform()
  end: Date;
}

export class InfoTableQuery {
  @IsIn(['pagar', 'receber'], {
    message: MessageService.Finance_type_not_found,
  })
  type: 'pagar' | 'receber';

  @IsNumberOrString()
  perPage: string | number;

  @IsNumberOrString()
  index: string | number;

  @IsOptional()
  @IsBooleanFromString()
  forEmission?: boolean;

  @IsOptional()
  @IsArrayOfNumbers()
  status?: string[];

  @IsOptional()
  @IsArrayOfNumbers()
  typePayment?: number[];

  @IsOptional()
  @IsNumberOrString()
  fiscalNumber?: number;

  @IsOptional()
  @ValidateNested()
  dateEmission?: DateRange;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  issue?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  sender?: string;

  @IsOptional()
  @ValidateNested()
  dueDate?: DateRange;

  @IsOptional()
  @ValidateNested()
  prorogation?: DateRange;

  @IsOptional()
  @ValidateNested()
  expectDate?: DateRange;

  @IsOptional()
  @IsNumberOrString()
  totalItem?: number;

  @IsOptional()
  @IsNumberOrString()
  valueToPay?: number;

  @IsOptional()
  @IsNumberOrString()
  valuePay?: number;
}
