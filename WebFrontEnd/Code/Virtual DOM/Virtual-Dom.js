//参数分别为标签名，属性对象，子DOM列表
var VElement=function (tagName,props,children) {
    //保证通过 new操作符调用
    if(!(this instanceof VElement)){
        return new VElement(tagName,props,children)
    }

    //可以通过只传递tagName和children参数
    if(util.isArray(props)){
        children=props
        props={}
    }

    //设置虚拟DOM的相关属性
    this.tagName=tagName
    this.props=props||{}
    this.children=children||[]
    this.key=props?props.key:void 0
    var count=0
    this.children.forEach(function (child,index) {
        if(child instanceof VElement){
            conut+=child.count
        }else{
            children[i]=''+child
        }
        count++
    })
    this.count=count
}

VElement.prototype.render=function () {
    //创建标签
    let el=document.creatElement(this.tagName)
    //设置标签属性
    let props=this.props
    for(let propName in props){
        let propValue=props[propName]
        el.setAttribute(propName,propValue)
    }
    //依次创建子节点的标签
    this.children.forEach(function (child) {
        //如果子节点仍然为velement，则递归的创建子节点，否则直接创建文本类型节点
        let childEl=(child instanceof VElement)?child.render():document.createTextNode(child)
        el.appendChild(childEl)
    })
    return el
}

function DFSWalk(oldNode,newNode,index,patches){
    var currentPatch=[]
    //新节点为空，直接跳过
    if(newNode===null){

    }else if(util.isString(oldNode)&&util.isString(newNode)){
        //文本节点
        if(oldNode!==newNode){
            currentPatch.push({
                type: patch.TEXT,
                content: newNode
            });
        }
    }else if(oldNode.tagName===newNode.tagName&&oldNode.key === newNode.key){
        //tagName与key都相等
        //比较两节点属性
        var propsPatches=diffProps(oldNode,newNode)
        if(propsPatches){
            currentPatch.push({
                type:patch.props,
                props:propsPatches
            })
        }
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
    }else{
        //节点类型不同，直接替换
        currentPatch.push({ type: patch.REPLACE, node: newNode });
    }
    if(currentPatch.length){
        patches[index]=currentPatch
    }
}

//将差异应用到真实DOM
function patch(node，currentPatches){
    currentPatches.forEach(function(currentPatch){
        switch (currentPatch.type) {
            case REPLACE:
            var newNode=(typeof currentPatch.node === 'String')
            ? document.createTextNode(currentPatch.node) 
            : currentPatch.node.render();
                node.parentNode.replaceChild(newNode,node)
                break;
        case REORDER:
        reoderChildren(node, currentPatch.moves);
        case PROPS:
        setProps(node,currentPatch.props)
        break;
        case TEXT:
        if(node.textContent){
            node.textConten=currentPatch.content
        }else{
            node.nodeValue=currentPatch.content
        }
        break;
        break;
            default:
            throw new Error('Unknow patch type ' + currentPatch.type);
                break;
        }
    })
}