import { Injectable, PipeTransform, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedPipe implements PipeTransform<any, any> {
  public transform = (value: any) => {
    return value;
  };
}
