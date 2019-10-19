#ifndef PLAYER_H
#define PLAYER_H
#include "Character.h"

using namespace std;

class Player : public Character {
    private:
        int experience;
        void checkLevel();
    public:
        Player();
        void addXP(int n);
};

#endif
