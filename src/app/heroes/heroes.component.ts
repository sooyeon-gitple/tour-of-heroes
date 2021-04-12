import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
// import {HEROES} from '../mock-heroes';
import {HeroService} from '../hero.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  // selectedHero:Hero;

  constructor(
    private heroService:HeroService,
    private messageService:MessageService,
    ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes():void{
    // this.heroes = this.heroService.getHeroes(); 
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  // onSelect(hero:Hero):void{
  //   this.selectedHero =  hero;
  //   this.messageService
  //   .add(`Herose Component: Selected hero id =${hero.id}`)
  // }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({name} as Hero) //typescript 오류로 수정
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete (hero:Hero):void{
    this.heroes = this.heroes.filter(h => h !==hero);
    this.heroService.deleteHero(hero).subscribe();
  }


}
