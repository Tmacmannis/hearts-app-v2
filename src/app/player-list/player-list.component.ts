import { Component, OnInit } from '@angular/core';
import { PlayersService } from 'src/app/players.service'
import { Players } from 'src/app/players.model'


@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  closeResult = '';
 

  players: Players[];
  staticPlayers: Players[];
  highestRound: number[] = [1];
  constructor(private playersService: PlayersService) {
    setTimeout(() => {
      this.checkLongest();
      this.sort();
      this.staticPlayers = this.players.slice();
    },500);

    setInterval(()=> { 
      this.sort();
      this.checkLongest();}, 1000);
   }


  playerName: string;

  ngOnInit() {

    this.playersService.getPolicies().subscribe(data => {
      this.players = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Players;
      })
    })

  }
  sort(){
    if(!this.checkNotAlreadySorted()){
      this.players.sort((a, b) => (a.totalScore > b.totalScore) ? 1 : -1);
      
    }
    
  }


  addPoint(player: Players, value: string){
    if(value != ""){
      player.scores.push(+value);
      if(this.playersService.updatePlayer(player)){
        this.checkLongest();
      }
    }
    setTimeout(() => {
      this.sort();
    },1000);
    
    
    
  }

  deleteRound(player: Players){
    if(this.playersService.removeLast(player)){
      this.checkLongest();
    }
    this.sort();
  }

  newPlayer(){
    this.playersService.createPlayer(this.playerName);
    this.sort();
    setTimeout(() => {
      this.staticPlayers = this.players.slice();
    },1000);
  }

  delete(id: string) {
    this.playersService.deletePlayer(id);
    this.sort();
    setTimeout(() => {
      this.staticPlayers = this.players.slice();
    },1000);
  }

  checkLongest(){
    // console.log("players list is: " + this.players.toString());
    // console.log("highest round before is: " + this.highestRound.length);
    let high: number = 0;
    for(let player of this.players){
      if(player.scores.length >= high){
        high = player.scores.length;
      }
    }
    this.highestRound = [];
    this.highestRound = Array(high).fill(4);
    console.log("highest round is: " + this.highestRound.length);
  }

  checkNonZeroScores(){
    for(let player of this.players){
      if(player.totalScore > 0){
        return true;
      }
    }
    return false;
  }

  checkNotAlreadySorted(){
    let prevScore = 0;
    for(let player of this.players){
      if (player.totalScore >= prevScore){
        prevScore = player.totalScore;
      } else{
        console.log("false");
        return false;
      }
    }
    return true;
  }

  updateRoundScore(player: Players, value: string){
    console.log(value);
    if(value){
      console.log("value is real");
      for(let test of this.players){
        if(test.name == player.name){
          test.roundScore = +value;
        }
      }
    } else {
      console.log("value is not real");
    }
    
  }

  addAllPoints(){
    console.log(this.players);
    for(let player of this.players){
      player.scores.push(player.roundScore);
      this.playersService.updatePlayer(player);
      
    }

    for(let player of this.players){
      setTimeout(() => {
        player.roundScore = 0;
      },1000);
    }
    // window.location.reload() 
  }

}
