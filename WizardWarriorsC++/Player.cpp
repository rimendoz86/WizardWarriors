#include <iostream>
#include <string>
#include "Player.h"

using namespace std;

Player::Player() {
    dmg = 20;               //20 +2per lvl
    health = 100;           //100 +5per lvl
    baseHp = 100;           //used to call back to original health
    experience = 0;         //to 0 when killed
    level = 1;
    //regen = 10;           //20 hp per second    //REGEN IN DISCUSSION
    //rgnDlay = 5;          //3 second delay before regeneration
    wlkSped = 2;            //2 feet per second
    atkSped = 2;            //2 hits per second
    cout << "Enter your name: ";
    string pcName;
    cin >> pcName;
    name = pcName;
}

// Whenever PC gets experience, we check for level-up
void Player::addXP(int n) {
    experience += n;
    checkLevel();
}

// XP needed for level-up increases according to player level
void Player::checkLevel() {
    int targetExperience = 400 * level;
    if(experience >= targetExperience) {
        level += 1;
        cout << name << " has leveled up to level " << level << "!" << endl;
        experience = 0;
        int dmgBonus = 2;
        int healthBonus = 5;
        dmg += dmgBonus;
        health = baseHp + healthBonus;
    }
}
