import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Players } from 'src/app/players.model';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private firestore: AngularFirestore) { }

  getPolicies() {
    return this.firestore.collection('scores').snapshotChanges();
  }

  createPlayer(name: string){
    let player = new Players;
    player.name = name;
    console.log(player);
    return this.firestore.collection('scores').add({
      name: player.name,
      scores: [],
      totalScore: 0
    });
  }

  updatePlayer(player: Players): boolean{
    let total:number = 0;
    for(let i in player.scores){
      total = +total + +player.scores[i];
      console.log(player.scores[i]);
    }
    if(isNaN(total)){
      console.log("not a number");
      player.scores.pop();
    } else{
      this.firestore.doc('scores/' + player.id).update({
        scores: player.scores,
        totalScore: total
      });
      return true;
    }
    
  }

  removeLast(player: Players): boolean{
    player.scores.pop();
    let total:number = 0;
    for(let i in player.scores){
      total = +total + +player.scores[i];
      console.log(player.scores[i]);
    }
    
    console.log(player)
    this.firestore.doc('scores/' + player.id).update({
      scores: player.scores,
      totalScore: total
    });
    return true;
  }

  deletePlayer(policyId: string){
    this.firestore.doc('scores/' + policyId).delete();
  }

  getAllDocs() {
    const ref = this.firestore.collection('scores');
    return ref.valueChanges({idField: 'name'});
  }

  test(){
    const snapshot = this.firestore.collection('scores').doc('1').get();
    var dataSource;
    const data = snapshot.subscribe(res => dataSource = res);
    return data;
  }

}


