import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';
 

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>
  private searchTesrms = new Subject<string>();

  constructor(private heroService: HeroService) { }

    search(term:string): void{
      this.searchTesrms.next(term) // 검색어를 옵저버블 스트림으로 보냄 ( next(value) 로 보냄)
    }

  ngOnInit(): void {
    this.heroes$ = this.searchTesrms.pipe(
      debounceTime(300), //키입력 대기,
      distinctUntilChanged(), //바뀔때까지 (이전검색어와 같으면 무시)
      switchMap( (term:string)=> this.heroService.searchHeroes(term))
    )
  }

}
