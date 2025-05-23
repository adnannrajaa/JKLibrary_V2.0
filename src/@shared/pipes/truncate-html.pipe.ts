import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtml',
  standalone: true
})
export class TruncateHtmlPipe implements PipeTransform {

  transform(value: string, limit: number = 20): string {
    if (!value) return '';
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent || div.innerText || '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

}
