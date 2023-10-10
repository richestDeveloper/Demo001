import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    start() {
        // console.log('Hello World');
        let hp: number = 100;
        let skillName: string = "无敌斩";
        let inCD: boolean = false;
        console.log(hp);
        console.log(skillName);
        console.log(inCD);

        let mp: number = 4;
        if (mp>=5)
        {
            console.log("释放%s","无敌斩");
        }
        else if (mp>3)
        {
            console.log("释放小无敌斩");
        }
        else
        {
            console.log("释放普攻");
        }

        for (let i:number=0;i<5;i++)
        {
            hp = hp - 5;
            console.log(hp);
        }
    }

    update(deltaTime: number) {
        
    }
}


