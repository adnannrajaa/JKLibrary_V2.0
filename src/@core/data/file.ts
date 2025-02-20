import { Observable } from 'rxjs';
import { Download, Upload } from '../models';



export abstract class FileData {
  abstract uploadFile(event: any): Observable<Upload> 
  abstract downloadFile(filePath: string, bookId:string, fileName?: string,): Observable<Download>
}
