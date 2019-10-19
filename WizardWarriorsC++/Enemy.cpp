#include <iostream>
#include "Enemy.h"

using namespace std;
//enemys___                 
//goblins- dmg-5,hlth-30            ?
//orcs- dmg-15,hlth-80              ?
//dragon- 300 hp, 60 dmg            ?

Enemy::Enemy(string n) {
    this->name = n;
    cout << "I\'m a " << name << endl;
    dmg = 5;                    
    health = 30;  
    baseHp = 30;
    regen = 5;             
    rgnDlay = 5;           
    wlkSped = 1;            
    atkSped = 1;            
    xp = health * dmg;
}
 
int Enemy::getXP()  //Used to give xp to the player
{
    return xp;
}
