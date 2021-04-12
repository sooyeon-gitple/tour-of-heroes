import { Injectable } from '@angular/core';
import { from , Observable, of } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Hero} from './hero';
import {HEROES} from './mock-heroes'

import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  constructor(
    private http: HttpClient,
    private mesesageService:MessageService,
    ) {}

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


  private heroesUrl = 'api/heroes';

  private log(message:string){
    this.mesesageService.add(`Hero Service : ${message}`);
  }

  getHeroes(): Observable<Hero[]>{
    this.mesesageService.add('HeroService: Fetched Heroes!');
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
        tap( _=> this.log('fetched heroes') ),
        catchError(this.handleError<Hero[]>('getHeroes',[]) )
    )
  }

  /** GET: id에 해당하는 히어로 데이터를 가져옵니다. 존재하지 않으면 `undefined`를 반환합니다. */
  getHeroNo404<Hero>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // 배열에 있는 항목 중 하나만 반환합니다.
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  getHero(id:number):Observable<Hero>{
    // this.mesesageService.add(`Hero Service: fetched hero id =${id}`);
    // return of(HEROES.find(hero => hero.id ===id))
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap( _=> this.log(`fetched Hero id ${id}`)),
      catchError( this.handleError< Hero>(`getHero id=${id}`))
    );
  }


  private handleError<T>(operation='operation',result?:T){
    return (error:any): Observable<T> =>{
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T); // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환합니다.
    }
  }


  updateHero(hero:Hero):Observable<any>{
    return this.http.put(
      this.heroesUrl, //URL
      hero, //수정할 데이터 (수정된 히어로 데이터)
      this.httpOptions //옵션 
     ).pipe(
      tap( _=> this.log(`Updated Hero id ${hero.id}`)),
      catchError( this.handleError<any>('Update Hero'))
    );
  }


  addHero(hero:Hero):Observable<Hero>{
      console.log(this.heroesUrl, hero, this.httpOptions)


    return this.http.post<Hero>(
      this.heroesUrl,
      hero,
      this.httpOptions
    ).pipe(
      tap( newHero=>this.log(`Added new hero id ${newHero.id}`) ),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero:Hero|number):Observable<Hero>{
    const id = typeof hero === 'number'? hero: hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_=> this.log(`deleted hro id =${id}`)),
      catchError(this.handleError<Hero>('delete Hero'))
    )
  }

  searchHeroes(term: string):Observable<Hero[]>{
    if( !term.trim()){
      //no input
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
    .pipe( tap( _ => _.length? this.log(`found heroes macthing "${term}:`) :
      this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes',[]))
    )
  }
}
