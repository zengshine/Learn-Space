function depthFirstTraverse(node){
    if(node){
        console.log(node.value)
    }
    depthFirstTraverse(node.left)
    depthFirstTraverse(node.right)
}

function depthFirstPre(node){
    if(node){
        let stack=[]
        stack.push(node)
        while(stack.length>0){
            let node=stack.pop()
            console.log(node.value)
            if(node.right){
                stack.push(node.right)
            }
            if(node.left){
                stack.push(node.left)
            }
        }
    }  
}

function depthFirstMid(node){
    let stack=[]
    while(stack.length>0||node){
        if(node){
          stack.push(node)
          node=node.left
        }else{             
            node=stack.pop(node)
            console.log(node.value)
            node=node.right
        }          
    }
}

function depthFirstAfter(node){
    let stack1=[]
    let stack2=[]
    stack1.push(node)
    while(stack1.length){
        let node=stack1.pop()
        stack2.push(node)
        if(node.right){
            node.push(node.right)
        }
        if(node.left){
            node.push(node.left)
        }
    }
    while(stack2.length>0){
        let node=stack2.pop()
        console.log(node)
    }
}
