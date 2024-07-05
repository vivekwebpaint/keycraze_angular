import { EventEmitter, Injectable, Component, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { 
  HTTP_INTERCEPTORS, 
  HttpClientModule, 
  HttpClient, 
  HttpEvent, 
  HttpInterceptor, 
  HttpHandler, 
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/finalize';
// import 'rxjs/add/observable/throw';
import { finalize } from 'rxjs/operators';
import { LoadingIndicatorService } from './LoadingIndicatorService';


@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {
  
  constructor(private loadingIndicatorService: LoadingIndicatorService) {}
  
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // emit onStarted event before request execution
    this.loadingIndicatorService.onStarted(req);
    
    return next
      .handle(req)
      // emit onFinished event after request execution
      .pipe(finalize(() => {
        setTimeout(() => this.killTime(), 1000);
        this.loadingIndicatorService.onFinished(req);
        }
      ));
      //window.setInterval(() => this.getMessages(id), 5);
  }
  killTime() {

  }
}