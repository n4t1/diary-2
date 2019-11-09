import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, AsyncSubject } from 'rxjs';
import { TypeEnum } from 'src/app/shared/models/enums';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpTheMovieDBService {
  sessionId = '';
  guestSession = {
    id: '',
    expired: ''
  };

  constructor(private http: HttpClient) {}

  private getParams(param?: {
    name?: string;
    page?: string;
    session?: string;
  }) {
    let httpParams = new HttpParams().set(
      'api_key',
      environment.theMovieDB.apiKey
    );
    if (param && param.name) {
      param.name = param.name.replace(' ', '+');
      httpParams = httpParams.append('query', param.name);
    }
    if (param && param.page) {
      httpParams = httpParams.append('page', param.page);
    }
    if (param && param.session) {
      httpParams = httpParams.append('guest_session_id', param.session);
    }
    return httpParams;
  }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getMATSByQuery(title: string, type: TypeEnum): Observable<any> {
    // https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
    // https://api.themoviedb.org/3/search/tvapi_key={api_key}&query=Jack+Reacher
    // https://api.themoviedb.org/3/search/multi?api_key=<<api_key>>&page=1

    return this.http.get(
      environment.theMovieDB.databaseURL + '/search/' + type,
      {
        params: this.getParams(
          type === TypeEnum.MULTI ? { name: title, page: '1' } : { name: title }
        )
      }
    );
  }

  getMATSById(id: string, type: TypeEnum): Observable<any> {
    return this.http.get(
      environment.theMovieDB.databaseURL + '/' + type + '/' + id,
      {
        params: this.getParams()
      }
    );
  }

  getPosterURL(path: string): string {
    return environment.theMovieDB.imageDatabaseURL + path;
  }

  getComments() {}

  setRatingMATS(id: string, rate: number, type: TypeEnum): Observable<any> {
    return this.http.post(
      environment.theMovieDB.databaseURL + '/' + type + '/' + id + '/rating',
      { value: rate },
      {
        headers: this.getHeaders(),
        params: this.getParams({ session: this.guestSession.id })
      }
    );
  }

  deleteRatingMATS(id: string, type: TypeEnum) {
    return this.http.delete(
      environment.theMovieDB.databaseURL + '/' + type + '/' + id + '/rating',
      {
        headers: this.getHeaders(),
        params: this.getParams({ session: this.guestSession.id })
      }
    );
  }

  setGuestSession(): Observable<void> {
    const sub = new AsyncSubject<void>();

    this.http.get(
      environment.theMovieDB.databaseURL + '/authentication/guest_session/new',
      {
        params: this.getParams()
      }
    ).subscribe(val => {
      this.guestSession.id = val['guest_session_id'];
      this.guestSession.expired = val['expires_at'];
      sub.next(null);
      sub.complete();
    });

    return sub.asObservable();
  }

  setSession(): Observable<void> {
    const sub = new AsyncSubject<void>();

    this.createRequestToken().subscribe(val1 => {
      this.authenticateUser(val1['request_token']).subscribe(val2 => {
        this.createSession(val2['request_token']).subscribe(val3 => {
          console.log('createSession', val3);
          this.sessionId = val3['session_id'];
          sub.next(null);
          sub.complete();
        });
      });
    });
    return sub.asObservable();
  }

  deleteSession(): Observable<any> {
    return this.http.request(
      'DELETE',
      environment.theMovieDB.databaseURL + '/authentication/session',
      {
        headers: this.getHeaders(),
        params: this.getParams(),
        body: { session_id: this.guestSession.id }
      }
    );
  }

  private createRequestToken(): Observable<any> {
    return this.http.get(
      environment.theMovieDB.databaseURL + '/authentication/token/new',
      {
        params: this.getParams()
      }
    );
  }

  private authenticateUser(token: string): Observable<any> {
    return this.http.post(
      environment.theMovieDB.databaseURL +
        '/authentication/token/validate_with_login',
      {
        username: environment.theMovieDB.username,
        password: environment.theMovieDB.password,
        request_token: token
      },
      {
        headers: this.getHeaders(),
        params: this.getParams()
      }
    );
  }

  private createSession(token: string): Observable<any> {
    return this.http.post(
      environment.theMovieDB.databaseURL + '/authentication/session/new',
      { request_token: token },
      {
        headers: this.getHeaders(),
        params: this.getParams()
      }
    );
  }
}

// strzały do bazy: muszą być 3 piewsze litery, zeby był strzał.
// po strzale zapisuję lokalnie wszystkie filmy/seriale ze strzału
// nastpne zapytanie użytkownika będzie najpierw przeszukiwać lokalnią bazę
// a póżniej, jeli nie znajdzie filmu/serialu lokalnie to wykona następny strzał i tak samo w kółko
