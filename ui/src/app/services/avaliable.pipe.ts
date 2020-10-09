import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'available',
    pure: false
})
export class AvailablePipe implements PipeTransform {
    transform(items:Map<any,any>):any{
        if(!items) return items;
        let res = new Map<any, any>();
        items.forEach(item => {
            if(item.inServe === false)
            res.set(item.id, item);
        });
        return res;
    }
}