function compile(el,vm){
    this.el=document.querySelector(el)
    this.vm=vm
    this.fragment=null
    this.init()
}

compile.prototype={
    init(){
     if(this.el){
         this.fragment=this.nodeToFragment(this.el)
         this.complieElement(this.fragment)
         this.el.appendChild(this.fragment)
     }else{
         console.log("DOM 元素不存在")
     }
    },
    nodeToFragment(el){
        var fragment=document.createDocumentFragment()
        let child=el.firstChild
        while(child){
            fragment.appendChild(child)
            child=el.firstChild
        }
        return fragment
    },
    complieElement(el){
        var self=this
        var childNodes=el.childNodes
        Array.prototype.forEach.call(childNodes,function(node){
            var reg=/\{\{(.*)\}\}/
            var textContent=node.textContent
            if(self.isElementNode(node)){
                self.compile(node)
            }else if(self.isTextNode(node)&&reg.test(textContent)){
                self.complileText(node,reg.exec(textContent)[1])
            }
            if(node.childNodes&&node.childNodes.length){
                self.complieElement(node)
            }
        })
    },
    compile(node){
        var self=this
        var nodeAttrs=node.attributes
        Array.prototype.forEach.call(nodeAttrs,function(attr){
            var attrName=attr.name
            if(self.isDirective){
                var exp=attr.value
                var dir=attrName.substring(2)
                if(self.isEventDirective(dir)){
                    self.complieEvent(node,self.vm,exp,dir)
                }else{
                    self.complieModel(node,self.vm,exp,dir)
                }
            }
        })
    },
    complileText(node,exp){
        var self=this
        self.updateNodeText(node,self.vm[exp])
        new Watcher(self.vm,exp,function(val){
            self.updateNodeText(node,val)
        })
    },
    complieEvent(node,vm,exp,dir){
        var self=this
        var eventType=dir.split(':')[1]
        var callBack=vm.methods&&vm.methods[exp]
        if(eventType&&callBack){
            node.addEventListener(eventType,callBack.bind(vm))
        }
    },
    complieModel(node,vm,exp,dir){
        var self=this
        var val=vm[exp]
        self.modelUpdator(node,val)
        new Watcher(vm,exp,function(val){
            self.modelUpdator(node,val)
        })
        node.addEventListener('input',function(e){
            var val=e.target.value
            vm[exp]=val
        })
    },
    updateNodeText(node,value){
        node.textContent=typeof value=='undefined'?'':value
    },
    modelUpdator(node,val,oldVal){
        node.value=typeof val=="undefined"?"":val
    },
    isElementNode(node){
        return node.nodeType===1
    },
    isTextNode(node){
        return node.nodeType===3
    },
    isDirective(attr){
        return attr.indexOf('v-')===0
    },
    isEventDirective(attr){
        return attr.indexOf('on:')===0
    }
}