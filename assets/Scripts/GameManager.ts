import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab,Vec3 } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType{
    BT_NONE,
    BT_BLOCK,
}

enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type:Prefab})
    public boxPrefab:Prefab|null = null

    @property({type:CCInteger})
    public roadLength:number = 50
    private _road: BlockType[] = []

    @property(Node)
    public startMenu:Node|null = null
    @property(PlayerController)
    public playerCtrl:PlayerController|null = null
    @property(Label)
    public stepLabel:Label|null = null

    init() {
        this.startMenu.active = true

        this.generateRoad()

        if (this.playerCtrl)
        {
            this.playerCtrl.setInputActive(false)
            this.playerCtrl.node.setPosition(Vec3.ZERO)
            this.playerCtrl.reset()
        }
    }

    setCurState(value:GameState)
    {
        switch(value)
        {
            case(GameState.GS_INIT):
                this.init()
                break
            case(GameState.GS_PLAYING):
                this.startMenu.active = false
                this.stepLabel.string = "0"
                setTimeout(() => {
                    if (this.playerCtrl)
                        {
                            this.playerCtrl.setInputActive(true)
                        }
                }, 0.1);

                break
            case(GameState.GS_END):
                break
        }
    }

    onPlayButtonClicked() {
        this.setCurState(GameState.GS_PLAYING)
    }

    onPlayerJumpEnd(moveIndex:number) {
        this.stepLabel.string = (moveIndex > this.roadLength ? this.roadLength : moveIndex).toString()
        if (this._road[moveIndex] == BlockType.BT_NONE)
        {
            this.setCurState(GameState.GS_INIT)
        }
    }

    spawnBlockByType(type:BlockType)
    {
        if (!this.boxPrefab)
        {
            return
        }

        let block:Node|null = null
        switch(type)
        {
            case(BlockType.BT_BLOCK):
                block = instantiate(this.boxPrefab)
                break
            default:
                break
        }

        return block
    }

    generateRoad(){
        this.node.removeAllChildren()
        this._road = []
        this._road.push(BlockType.BT_BLOCK)

        // 组装_road
        for (let i=1; i<=this.roadLength;i++)
        {
            if (this._road[i-1] == BlockType.BT_NONE)
            {
                this._road.push(BlockType.BT_BLOCK)
            }
            else
            {
                this._road.push(Math.floor(Math.random()*2))
            }
        }

        // 创建road
        for (let i in this._road)
        {
             let block:Node|null = this.spawnBlockByType(this._road[i])
             if (block)
             {
                this.node.addChild(block)
                block.setPosition(BLOCK_SIZE*Number(i),-25,0)
             }
        }
    }

    start() {
        this.setCurState(GameState.GS_INIT)
        this.playerCtrl?.node.on("jumpEnd",this.onPlayerJumpEnd,this)
    }

    update(deltaTime: number) {
        
    }
}


