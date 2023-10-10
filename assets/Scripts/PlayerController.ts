import { _decorator, Component, Node, Input, input, EventMouse, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _startJump:boolean = false
    private _jumpStep:number = 0
    private _jumpTime:number = 0
    private _curJumpTime:number = 0
    private _curJumpSpeed:number = 0
    private _curPos:Vec3 = new Vec3()
    private _deltaPos:Vec3 = new Vec3(0,0,0)
    private _targetPos:Vec3 = new Vec3()

    jumpByStep(step:number){
        if (this._startJump)
        {
            return
        }

        this._startJump = true;
        this._jumpStep = step
        this._curJumpTime = 0
    }

    onMouseUp(event:EventMouse) {
        // 按下左键
        if (event.getButton() === 0)
        {
            this.jumpByStep(1)
        }
        // 按下右键
        else if (event.getButton() === 2)
        {
            this.jumpByStep(2)
        }
    }

    start() {
        input.on(Input.EventType.MOUSE_UP,this.onMouseUp,this)
    }

    update(deltaTime: number) {
        
    }
}


