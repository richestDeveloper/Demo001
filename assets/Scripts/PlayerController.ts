import { _decorator, Component, Node, Input, input, EventMouse, Vec3,Animation,sp } from 'cc';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Animation)
    PlayerAnimation:Animation = null

    private _startJump:boolean = false
    private _jumpStep:number = 0
    private _jumpTime:number = 0.1
    private _curJumpTime:number = 0
    private _curJumpSpeed:number = 0
    private _curPos:Vec3 = new Vec3()
    private _deltaPos:Vec3 = new Vec3(0,0,0)
    private _targetPos:Vec3 = new Vec3()
    private _curMoveIndex:number = 0
    private _skeleton:sp.Skeleton|null = null

    jumpByStep(step:number){
        if (this._startJump)
        {
            return
        }

        this._startJump = true      //开始跳跃
        this._jumpStep = step       //跳跃步数      
        this._curJumpTime = 0       //重置跳跃时间
        const clipName = step == 1 ? "oneStep" : "twoStep"
        const state = this.PlayerAnimation.getState(clipName)
        this._jumpTime = state.duration
        this._curJumpSpeed = this._jumpStep*BLOCK_SIZE/this._jumpTime
        this.node.getPosition(this._curPos)
        Vec3.add(this._targetPos,this._curPos,new Vec3(this._jumpStep*BLOCK_SIZE,0,0))

        if (this.PlayerAnimation)
        {
            if (step === 1)
            {
                this.PlayerAnimation.play("oneStep")
            }
            else if (step === 2)
            {
                this.PlayerAnimation.play("twoStep")
            }

            // spine 切换move
            this._skeleton.setAnimation(0,"move",true)
        }

        this._curMoveIndex += step
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

    setInputActive(active:boolean)
    {
        if (active)
        {
            input.on(Input.EventType.MOUSE_UP,this.onMouseUp,this)
        }
        else
        {
            input.off(Input.EventType.MOUSE_UP,this.onMouseUp,this)
        }
    }

    onOnceJumpEnd() {
        this._skeleton.setAnimation(0,"idle",true)
        this.node.emit("jumpEnd",this._curMoveIndex)
    }

    start() {
        //input.on(Input.EventType.MOUSE_UP,this.onMouseUp,this)
        if (this.PlayerAnimation)
        {
            this._skeleton = this.PlayerAnimation.getComponent(sp.Skeleton)
        }
    }

    reset() {
        this._curMoveIndex = 0
    }

    update(deltaTime: number) {
        if (this._startJump)
        {
            this._curJumpTime += deltaTime
            if (this._curJumpTime > this._jumpTime)
            {
                this.node.setPosition(this._targetPos)
                this._startJump = false
                this.onOnceJumpEnd()
            }
            else
            {
                this.node.getPosition(this._curPos)
                this._deltaPos.x = this._curJumpSpeed * deltaTime
                Vec3.add(this._curPos,this._curPos,this._deltaPos)
                this.node.setPosition(this._curPos)
            }
        }
    }
}


