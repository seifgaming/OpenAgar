"use strict";
/*
    OpenAgar - Open source web game
    Copyright (C) 2016 Andrew S

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var template = require('./template.js');
module.exports = class PlayerCell extends template {
    constructor(position, mass, type, owner) {
        super(position, mass, type, owner);
        this.name = owner.gameData.name;
        this.color = owner.gameData.color;
        if (owner.skinHandler) this.skin = owner.skinHandler.skin;
        this.mergeage = 0;
        this.canMerge = false;
        this.mergeMult = 1;
        this.mergeStatus = 1
        this.type = 0;

        this.moving = true;
        this.nearby = [];
        this.owner.mass += mass
    }

    onCreation(main) {
        this.owner.addCell(this);
    }

    onDeletion(main) {
        this.owner.mass -= this.mass
        this.owner.removeCell(this);
    }

    mergeDone(main) {

    }
    setMerge(main, num, mult) {
        this.mergeage = num
        this.canMerge = false;
        this.mergeMult = mult || 0
        main.getWorld().setFlags(this, 'merge')
    }
    calcMerge(main) { // once every 0.5 sec
        if (this.mergeStatus == 3) return; // 0 = instant merge, 3 = never merge
        if (this.mergeStatus == 0) {
            this.canMerge = true;

            main.getWorld().removeFlags(this, 'merge')

            this.mergeDone(main)
            return;
        }
        if (this.mergeage <= this.mass * -this.mergeMult) {
            this.canMerge = true;
            main.getWorld().removeFlags(this, 'merge')

            this.mergeDone(main)
            return;
        }
        this.mergeage--;

        //console.log(this.mergeage, this.mass * this.mergeMult, this.canMerge)

    }
    updateMass(mass) {

        if (this.mass === mass) return;

        var add = Math.max(mass, 10)
        var dif = add - this.mass
        this.owner.mass += dif
        this.mass = add

        this.getSize()
        this.speed = Math.pow(this.mass, -0.222) * 1.25;
        this.updCode()
    }
    moveToMouse(main, sp) {

        var speed = 0;
        if (sp == 0) {
            speed = this.speed
        } else if (sp == 1) {
            speed = this.speed * 2
        } else if (sp == 2) {
            speed = this.speed * 4
        }
        var mouse = this.owner.mouse,

            distx = mouse.x - this.position.x,
            disty = mouse.y - this.position.y,
            // y^2 = x^2 + b^2 -> y = sq(x^2 + b^2)
            num = Math.min(distx * distx + disty * disty, 625),

            dist = ~~(Sqrt.sqrt(num));

        var angle = Math.atan2(disty, distx)
        if (!dist) return; // dont want 0
        // want cell to slow down as it gets closer to mouse
        var k = Math.min(Math.abs(dist), 25) / 25, // max is 1
            p = speed * k * main.getConfig().playerSpeed,
            x = Math.cos(angle) * p,
            y = Math.sin(angle) * p;
        //  console.log((speed * k * main.getConfig().playerSpeed)/50)
        this.position.x += Math.round(x);
        this.position.y += Math.round(y);

    }
    move(main, sp) {
        this.moveToMouse(main, sp)
        if (this.moveEngine2.useEngine) this.calcMove2(main, sp);
        if (this.moveEngine.useEngine) this.calcMove(main, sp);



    }
};
