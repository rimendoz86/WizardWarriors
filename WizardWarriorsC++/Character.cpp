#include <iostream>
#include "Character.h"

using namespace std;

Character::Character() 
{
    name = "Dummy";
    dmg = 1;                //Damage per hit
    health = 1;             //Current health
    baseHp = 1;             //Starting health
    level = 1;              
    //regen = 1;            <--IN
    //rgnDlay = 1;          <--DISCUSSION  
    wlkSped = 1;            //distance per second
    atkSped = 1;            //hits per second
}

int Character::getLevel() 
{
    return level;
}

int Character::getHealth() 
{
    return health;
}

string Character::getName() 
{
    return name;
}

int Character::getDmg() 
{
    return dmg;
}

void Character::takeDmg(int d) //d is the damage sent in from main
{
    cout << name << " takes " << d << " damage." << endl;
    health -= d;
    cout << "After the attack, " << health << " HP remains." << endl;
}

int Character::getWSpd()
{
    return wlkSped;
}

int Character::getASpd()
{
    return atkSped;
}