#ifndef ENEMY_H
#define ENEMY_H
#include "Character.h"

using namespace std;

class Enemy : public Character {
    private:
        int xp;
        int distance;
        int detection;          //the distance an enemy can detect an ally
    public:
        Enemy(string);
        int getXP();
        //int agro();             //attacks closest ally
};

#endif
